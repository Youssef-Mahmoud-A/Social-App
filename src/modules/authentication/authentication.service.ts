import { ConfirmEmailDto, ResendConfirmEmailDto, ResetPasswordDto, SignupDto } from "./dto/authentication.dto";
import { ConflictException, NotFoundException, TooManyRequestsException } from "../../common/exception";
import { UserRepository } from "../../common/repository";
import { cacheService, CacheServie } from "../../common/service";
import { encryption, hash } from "../../common/security";
import { EmailSubjectEnum, ProviderEnum } from "../../common/enum";
import { emailEvent, UserEmailKey, UserEmailTrialsKey } from "../../common/utils/email";
import { createOtp } from "../../common/utils";
import { HUser, UserModel } from "../../DB/Model";
import { compare } from "bcrypt";
import { IUser } from "../../common/interface";



export class AuthenticationService {
    private userRepository: UserRepository
    private cacheService: CacheServie
    constructor() {
        this.cacheService = cacheService
        this.userRepository = new UserRepository()
    }

    async sendEmailOtp({
        email,
        subject,
        data,
        expiresIn = 300,
        maxTrials = 3,
        blockInSeconds = 600
    }: {
        email: string,
        subject: EmailSubjectEnum,
        data: any,
        expiresIn?: number,
        maxTrials?: number,
        blockInSeconds?: number
    }) {
        const existOTP_ttl = await this.cacheService.ttl({ key: UserEmailKey({ email, subject }) })
        if (existOTP_ttl > 0) {
            throw new ConflictException(`OTP is still valid. Please try again in ${existOTP_ttl} seconds!`)
        }
        const oldTrials = await this.cacheService.get({ key: UserEmailTrialsKey({ email, subject }) }) ?? 0
        if (oldTrials >= maxTrials) {
            throw new TooManyRequestsException("Max OTP trials has been reached!")
        }
        const otp = createOtp()
        await this.cacheService.set({
            key: UserEmailKey({ email, subject }),
            value: await hash(otp.toString()),
            ttl: expiresIn
        })
        const currentTrials = await this.cacheService.incrBy({ key: UserEmailTrialsKey({ email, subject }), value: 1 });
        if (currentTrials == 3) {
            await this.cacheService.expire({ key: UserEmailTrialsKey({ email, subject }), ttl: blockInSeconds })
        }
        emailEvent.emit("sendEmail", { recipients: { to: email }, subject, data: { code: otp, username: data.username } })
    }

    async signup({ username, email, password, phone }: SignupDto['body']): Promise<IUser> {
        const duplicatedAccount = await this.userRepository.findOne({
            filter: { email }
        });

        if (duplicatedAccount) throw new ConflictException("Email exists!");

        const account = await this.userRepository.createOne({
            data: {
                username, email, password: await hash(password), phone: await encryption(phone)
            }
        });
        await this.sendEmailOtp({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL, data: { username } })
        return account;
    }

    async confirmEmail({ otp, email }: ConfirmEmailDto): Promise<void> {
        const account = await this.userRepository.findOne({
            filter: { email, provider: ProviderEnum.SYSTEM, confirmEmail: { $exists: false } }
        });

        if (!account) throw new NotFoundException("Account doesn't exist! OR Email already confirmed");
        const hashOtp = await this.cacheService.get({ key: UserEmailKey({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL }) })
        if (!hashOtp || ! await compare(otp, hashOtp)) {
            throw new ConflictException("Invalid OTP")
        }

        account.confirmEmail = new Date() as unknown as string;
        await account.save();
        // await del({ key: UserEmailKey({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL }) })
        await this.cacheService.del({ key: await this.cacheService.keys({ prefix: UserEmailKey({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL }) }) })
    }

    async resendConfirmEmail({ email }: ResendConfirmEmailDto): Promise<void> {
        const account = await this.userRepository.findOne({
            filter: { email, provider: ProviderEnum.SYSTEM, confirmEmail: { $exists: false } }
        });

        if (!account) throw new NotFoundException("Account doesn't exist! OR Email already confirmed");
        await this.sendEmailOtp({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL, data: { username: account.username } })
        return
    }

    async forgotPasswordRequest({ email }: ResetPasswordDto): Promise<void> {
        const account = await this.userRepository.findOne({
            filter: { email, provider: ProviderEnum.SYSTEM, confirmEmail: { $exists: true } }
        });

        if (!account) throw new NotFoundException("Unable to send forget password request!");
        await this.sendEmailOtp({ email, subject: EmailSubjectEnum.FORGOT_PASSWORD, data: { username: account.username } })
        return
    }

    async confirmForgotPassword({ otp, email }: { otp: string, email: string }): Promise<HUser> {
        const account = await this.userRepository.findOne({
            filter: { email, provider: ProviderEnum.SYSTEM, confirmEmail: { $exists: true } }
        });
        console.log(typeof (email));


        if (!account) throw new NotFoundException("Account doesn't exist! OR Email already confirmed");
        const hashOtp = await this.cacheService.get({ key: UserEmailKey({ email, subject: EmailSubjectEnum.FORGOT_PASSWORD }) })
        if (!hashOtp || ! await compare(otp, hashOtp)) {
            throw new ConflictException("Invalid OTP for resseting password")
        }
        return account;
    }

    async resetPassword({ otp, email, password }: { otp: string, email: string, password: string }): Promise<void> {
        const account = await this.confirmForgotPassword({ otp, email })
        account.password = await hash(password);
        account.changeCredentialsTime = new Date() as unknown as string;
        await account.save();

        const result = await Promise.all([
            // this.cacheService.keys({ prefix: userBaseRevokeTokenKey({ userId: account._id }) }),
            this.cacheService.keys({ prefix: UserEmailKey({ email, subject: EmailSubjectEnum.FORGOT_PASSWORD }) })
        ])

        await this.cacheService.del({ key: [...result[0]] })
    }


    // async signup({ email, password, phone, username }: SignupDto['body']): Promise<any> {
    //     const userExist = await this.userRepository.findOne({
    //         filter: { email },
    //         projection: { email: 1 },
    //         options: { lean: true }
    //     })
    //     console.log({ userExist });
    //     if (userExist) {
    //         throw new ConflictException("Email Exists!!")
    //     }
    //     const account = await this.userRepository.createOne({
    //         data: {
    //             email,
    //             password: await hash(password),
    //             phone: await encryption(phone),
    //             username
    //         },
    //         options: { validateBeforeSave: true }


    //     })
    //     return account
    // }
}

export default new AuthenticationService()