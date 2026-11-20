"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.UserEmailTrialsKey = exports.UserEmailKey = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../../../config");
const exception_1 = require("../../exception");
const UserEmailKey = ({ email, subject }) => {
    return `User::${email}::${subject}::OTP`;
};
exports.UserEmailKey = UserEmailKey;
const UserEmailTrialsKey = ({ email, subject }) => {
    return `${(0, exports.UserEmailKey)({ email, subject })}::TRIALS`;
};
exports.UserEmailTrialsKey = UserEmailTrialsKey;
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: config_1.APP_EMAIL,
        pass: config_1.APP_PASSWORD,
    },
});
const sendEmail = async ({ to, cc, bcc, subject, text, html, attachments = [] }) => {
    try {
        if (!to?.length && !cc?.length && !bcc?.length) {
            throw new exception_1.BadRequestException("Invalid Recipients!");
        }
        if (!html?.length && !text?.length && !attachments?.length) {
            throw new exception_1.BadRequestException("Invalid Content!");
        }
        const info = await transporter.sendMail({
            from: `"${config_1.APPLICATION_NAME}" <${config_1.APP_EMAIL}>`,
            to,
            cc,
            bcc,
            subject,
            text,
            html,
            attachments
        });
    }
    catch (err) {
        console.error("Error while sending mail:", err);
    }
};
exports.sendEmail = sendEmail;
