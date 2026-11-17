"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const exception_1 = require("../../common/exception");
const repository_1 = require("../../common/repository");
class AuthenticationService {
    userRepository;
    constructor() {
        this.userRepository = new repository_1.UserRepository();
    }
    async signup({ email, password, phone, username }) {
        const userExist = await this.userRepository.findOne({
            filter: { email },
            projection: { email: 1 },
            options: { lean: true }
        });
        console.log({ userExist });
        if (userExist) {
            throw new exception_1.ConflictException("Email Exists!!");
        }
        const account = await this.userRepository.createOne({
            data: { email, password, phone, username },
            options: { validateBeforeSave: true }
        });
        return account;
    }
}
exports.AuthenticationService = AuthenticationService;
exports.default = new AuthenticationService();
