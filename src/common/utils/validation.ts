import { z } from 'zod';
import mongoose from 'mongoose';
import { GenderEnum, LanguageEnum } from '../enum';

const validationMessage = {
    username: {
        ar: "عفوا لا يمكن قبول اسم مستخدم اقل من حرفين",
        en: "MINIMUM USERNAME LENGTH IS 2 CHAR"
    }
}

// const getValidationMessage = (lang, code) => {
//     return lang == LanguageEnum.EN ? validationMessage[code].en : validationMessage[code].ar
// }

const matchFields = ({ original, copy, data, ctx, lang }: { original: string, copy: string, data: any, ctx: z.RefinementCtx, lang?: LanguageEnum }) => {
    if (data[original] != data[copy]) {
        ctx.addIssue({
            code: "custom",
            path: [copy],
            message: lang == LanguageEnum.EN ? `${original} doesn't match ${copy}` : `${original} لا يتطابق مع ${copy}`
        })
    }
}

export const generalValidationFields = {
    email: (lang: LanguageEnum) => z.email({ message: "INVALID EMAIL FORMAT" }),
    otp: (lang: LanguageEnum) => z.string().regex(/^\d{6}$/),
    password: (lang: LanguageEnum) => z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_]).{8,16}$/).min(8).max(16),
    username: (lang: LanguageEnum) => z.string().min(2, { message: lang == LanguageEnum.EN ? validationMessage.username.en : validationMessage.username.ar }).max(51),
    phone: (lang: LanguageEnum) => z.e164(),
    gender: (lang: LanguageEnum) => z.enum(GenderEnum),
    id: (lang: LanguageEnum) => z.string().refine((data) => { return mongoose.Types.ObjectId.isValid(data) }, { message: "invalid ID format!!" }),
    file: (lang: LanguageEnum) => z.strictObject({
        fieldname: z.string(),
        originalname: z.string(),
        encoding: z.string(),
        mimetype: z.string(),
        buffer: z.instanceof(Buffer),
        size: z.number(),
        path: z.string(),
    }),
    matchFields
}