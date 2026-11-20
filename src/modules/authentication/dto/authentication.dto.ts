

// export interface ISignupDto {

import { z } from "zod";
import { confirmEmail, confirmForgotPassword, forgotPasswordRequest, resendConfirmEmail, resetPassword, signup } from "../authentication.validation";

//     username: string;
//     email: string;
//     phone: string;
//     password: string;
//     confirmPassword: string;
// }



export type SignupDto = z.infer<ReturnType<typeof signup>>
export type ConfirmEmailDto = z.infer<ReturnType<typeof confirmEmail>>['body']
export type ResendConfirmEmailDto = z.infer<ReturnType<typeof resendConfirmEmail>>['body']
export type ResetPasswordDto = z.infer<ReturnType<typeof resetPassword>>['body']
// export type ForgotPasswordRequestDto = z.infer<ReturnType<typeof forgotPasswordRequest>>