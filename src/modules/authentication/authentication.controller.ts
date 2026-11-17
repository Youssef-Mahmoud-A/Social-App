import { Router, type NextFunction, type Request, type Response } from "express";
import authService from "./authentication.service";
import { responseFormatter, validation } from "../../middleware/index";
import * as validators from "./authentication.validation"
import { Iresponse, IUser } from "../../common/interface";

const router = Router({ strict: true, caseSensitive: true })

router.post("/signup",
    validation(validators.signup),
    responseFormatter(
        async (req: Request, res: Response, next: NextFunction): Promise<Iresponse<IUser>> => {
            const data = await authService.signup(req.validate.body)
            return { status: 201, data }
        }
    )
)

export default router
