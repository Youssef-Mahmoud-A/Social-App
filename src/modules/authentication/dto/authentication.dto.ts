

// export interface ISignupDto {

import { z } from "zod";
import { signup } from "../authentication.validation";

//     username: string;
//     email: string;
//     phone: string;
//     password: string;
//     confirmPassword: string;
// }



export type SignupDto = z.infer<ReturnType<typeof signup>>