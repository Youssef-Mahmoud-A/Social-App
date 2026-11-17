import { Model } from "mongoose";
import { SignupDto } from "./dto/authentication.dto";
import { IUser } from "../../common/interface";
import { HUser, UserModel } from "../../DB/Model";
import { ConflictException } from "../../common/exception";
import { UserRepository } from "../../common/repository";




export class AuthenticationService {
    private userRepository: UserRepository
    constructor() {
        this.userRepository = new UserRepository()
    }

    async signup({ email, password, phone, username }: SignupDto['body']): Promise<any> {
        const userExist = await this.userRepository.findOne({
            filter: { email },
            projection: { email: 1 },
            options: { lean: true }
        })
        console.log({ userExist });
        if (userExist) {
            throw new ConflictException("Email Exists!!")
        }
        const account = await this.userRepository.createOne({
            data: { email, password, phone, username },
            options: { validateBeforeSave: true }


        })
        return account
    }
}

export default new AuthenticationService()