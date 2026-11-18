import { SignupDto } from "./dto/authentication.dto";
import { ConflictException } from "../../common/exception";
import { UserRepository } from "../../common/repository";
import { cacheService, CacheServie } from "../../common/service";
import { encryption, hash } from "../../common/security";




export class AuthenticationService {
    private userRepository: UserRepository
    private cacheService: CacheServie
    constructor() {
        this.cacheService = cacheService
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
            data: {
                email,
                password: await hash(password),
                phone: await encryption(phone),
                username
            },
            options: { validateBeforeSave: true }


        })
        return account
    }
}

export default new AuthenticationService()