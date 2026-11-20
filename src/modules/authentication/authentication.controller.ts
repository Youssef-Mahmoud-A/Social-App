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

router.post("/forgot-password-request", validation(validators.forgotPasswordRequest),
    responseFormatter(
        async (req: Request, res: Response, next: NextFunction) => {
            await authService.forgotPasswordRequest(req.body);
        }
    )
)


router.post("/confirm-forgot-password", validation(validators.confirmForgotPassword),
    responseFormatter(
        async (req: Request, res: Response, next: NextFunction) => {
            await authService.confirmForgotPassword(req.body);
        }
    )
)

router.patch("/reset-password", validation(validators.resetPassword),
    responseFormatter(
        async (req: Request, res: Response, next: NextFunction) => {
            await authService.resetPassword(req.body);
        }
    )
)

router.patch("/confirm-email", validation(validators.confirmEmail),
    responseFormatter(
        async (req: Request, res: Response, next: NextFunction) => {
            await authService.confirmEmail(req.body);
        }
    )
)

router.patch("/resend-confirm-email", validation(validators.resendConfirmEmail),
    responseFormatter(
        async (req: Request, res: Response, next: NextFunction) => {
            await authService.resendConfirmEmail(req.body);
        }
    )
)

export default router
