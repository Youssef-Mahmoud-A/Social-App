"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const exception_1 = require("../../common/exception");
const repository_1 = require("../../common/repository");
const service_1 = require("../../common/service");
const security_1 = require("../../common/security");
const enum_1 = require("../../common/enum");
const email_1 = require("../../common/utils/email");
const utils_1 = require("../../common/utils");
const bcrypt_1 = require("bcrypt");
class AuthenticationService {
    userRepository;
    cacheService;
    constructor() {
        this.cacheService = service_1.cacheService;
        this.userRepository = new repository_1.UserRepository();
    }
    async sendEmailOtp({ email, subject, data, expiresIn = 300, maxTrials = 3, blockInSeconds = 600 }) {
        const existOTP_ttl = await this.cacheService.ttl({ key: (0, email_1.UserEmailKey)({ email, subject }) });
        if (existOTP_ttl > 0) {
            throw new exception_1.ConflictException(`OTP is still valid. Please try again in ${existOTP_ttl} seconds!`);
        }
        const oldTrials = await this.cacheService.get({ key: (0, email_1.UserEmailTrialsKey)({ email, subject }) }) ?? 0;
        if (oldTrials >= maxTrials) {
            throw new exception_1.TooManyRequestsException("Max OTP trials has been reached!");
        }
        const otp = (0, utils_1.createOtp)();
        await this.cacheService.set({
            key: (0, email_1.UserEmailKey)({ email, subject }),
            value: await (0, security_1.hash)(otp.toString()),
            ttl: expiresIn
        });
        const currentTrials = await this.cacheService.incrBy({ key: (0, email_1.UserEmailTrialsKey)({ email, subject }), value: 1 });
        if (currentTrials == 3) {
            await this.cacheService.expire({ key: (0, email_1.UserEmailTrialsKey)({ email, subject }), ttl: blockInSeconds });
        }
        email_1.emailEvent.emit("sendEmail", { recipients: { to: email }, subject, data: { code: otp, username: data.username } });
    }
    async signup({ username, email, password, phone }) {
        const duplicatedAccount = await this.userRepository.findOne({
            filter: { email }
        });
        if (duplicatedAccount)
            throw new exception_1.ConflictException("Email exists!");
        const account = await this.userRepository.createOne({
            data: {
                username, email, password: await (0, security_1.hash)(password), phone: await (0, security_1.encryption)(phone)
            }
        });
        await this.sendEmailOtp({ email, subject: enum_1.EmailSubjectEnum.CONFIRM_EMAIL, data: { username } });
        return account;
    }
    async confirmEmail({ otp, email }) {
        const account = await this.userRepository.findOne({
            filter: { email, provider: enum_1.ProviderEnum.SYSTEM, confirmEmail: { $exists: false } }
        });
        if (!account)
            throw new exception_1.NotFoundException("Account doesn't exist! OR Email already confirmed");
        const hashOtp = await this.cacheService.get({ key: (0, email_1.UserEmailKey)({ email, subject: enum_1.EmailSubjectEnum.CONFIRM_EMAIL }) });
        if (!hashOtp || !await (0, bcrypt_1.compare)(otp, hashOtp)) {
            throw new exception_1.ConflictException("Invalid OTP");
        }
        account.confirmEmail = new Date();
        await account.save();
        await this.cacheService.del({ key: await this.cacheService.keys({ prefix: (0, email_1.UserEmailKey)({ email, subject: enum_1.EmailSubjectEnum.CONFIRM_EMAIL }) }) });
    }
    async resendConfirmEmail({ email }) {
        const account = await this.userRepository.findOne({
            filter: { email, provider: enum_1.ProviderEnum.SYSTEM, confirmEmail: { $exists: false } }
        });
        if (!account)
            throw new exception_1.NotFoundException("Account doesn't exist! OR Email already confirmed");
        await this.sendEmailOtp({ email, subject: enum_1.EmailSubjectEnum.CONFIRM_EMAIL, data: { username: account.username } });
        return;
    }
    async forgotPasswordRequest({ email }) {
        const account = await this.userRepository.findOne({
            filter: { email, provider: enum_1.ProviderEnum.SYSTEM, confirmEmail: { $exists: true } }
        });
        if (!account)
            throw new exception_1.NotFoundException("Unable to send forget password request!");
        await this.sendEmailOtp({ email, subject: enum_1.EmailSubjectEnum.FORGOT_PASSWORD, data: { username: account.username } });
        return;
    }
    async confirmForgotPassword({ otp, email }) {
        const account = await this.userRepository.findOne({
            filter: { email, provider: enum_1.ProviderEnum.SYSTEM, confirmEmail: { $exists: true } }
        });
        console.log(typeof (email));
        if (!account)
            throw new exception_1.NotFoundException("Account doesn't exist! OR Email already confirmed");
        const hashOtp = await this.cacheService.get({ key: (0, email_1.UserEmailKey)({ email, subject: enum_1.EmailSubjectEnum.FORGOT_PASSWORD }) });
        if (!hashOtp || !await (0, bcrypt_1.compare)(otp, hashOtp)) {
            throw new exception_1.ConflictException("Invalid OTP for resseting password");
        }
        return account;
    }
    async resetPassword({ otp, email, password }) {
        const account = await this.confirmForgotPassword({ otp, email });
        account.password = await (0, security_1.hash)(password);
        account.changeCredentialsTime = new Date();
        await account.save();
        const result = await Promise.all([
            this.cacheService.keys({ prefix: (0, email_1.UserEmailKey)({ email, subject: enum_1.EmailSubjectEnum.FORGOT_PASSWORD }) })
        ]);
        await this.cacheService.del({ key: [...result[0]] });
    }
}
exports.AuthenticationService = AuthenticationService;
exports.default = new AuthenticationService();
