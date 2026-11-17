"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalValidationFields = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const validationMessage = {
    username: {
        ar: "عفوا لا يمكن قبول اسم مستخدم اقل من حرفين",
        en: "MINIMUM USERNAME LENGTH IS 2 CHAR"
    }
};
const matchFields = ({ original, copy, data, ctx, lang }) => {
    if (data[original] != data[copy]) {
        ctx.addIssue({
            code: "custom",
            path: [copy],
            message: lang == enum_1.LanguageEnum.EN ? `${original} doesn't match ${copy}` : `${original} لا يتطابق مع ${copy}`
        });
    }
};
exports.generalValidationFields = {
    email: (lang) => zod_1.z.email({ message: "INVALID EMAIL FORMAT" }),
    otp: (lang) => zod_1.z.string().regex(/^\d{6}$/),
    password: (lang) => zod_1.z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_]).{8,16}$/).min(8).max(16),
    username: (lang) => zod_1.z.string().min(2, { message: lang == enum_1.LanguageEnum.EN ? validationMessage.username.en : validationMessage.username.ar }).max(51),
    phone: (lang) => zod_1.z.e164(),
    gender: (lang) => zod_1.z.enum(enum_1.GenderEnum),
    id: (lang) => zod_1.z.string().refine((data) => { return mongoose_1.default.Types.ObjectId.isValid(data); }, { message: "invalid ID format!!" }),
    file: (lang) => zod_1.z.strictObject({
        fieldname: zod_1.z.string(),
        originalname: zod_1.z.string(),
        encoding: zod_1.z.string(),
        mimetype: zod_1.z.string(),
        buffer: zod_1.z.instanceof(Buffer),
        size: zod_1.z.number(),
        path: zod_1.z.string(),
    }),
    matchFields
};
