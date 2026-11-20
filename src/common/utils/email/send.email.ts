import nodemailer from 'nodemailer';
import { APP_EMAIL, APP_PASSWORD, APPLICATION_NAME } from '../../../config';
import { BadRequestException } from '../../exception';
import { EmailSubjectEnum } from '../../enum';

export const UserEmailKey = ({ email, subject }: { email: string, subject: EmailSubjectEnum }): string => {
    return `User::${email}::${subject}::OTP`
}

export const UserEmailTrialsKey = ({ email, subject }: { email: string, subject: EmailSubjectEnum }): string => {
    return `${UserEmailKey({ email, subject })}::TRIALS`
}

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: APP_EMAIL,
        pass: APP_PASSWORD,
    },
});

export const sendEmail = async ({
    to, // list of recipients
    cc,
    bcc,
    subject, // subject line
    text, // plain text body
    html, // HTML body
    attachments = []
}: {
    to?: string[], // list of recipients
    cc?: string[],
    bcc?: string[],
    subject: string, // subject line
    text?: string, // plain text body
    html?: string, // HTML body
    attachments?: any[]
}) => {
    try {
        if (!to?.length && !cc?.length && !bcc?.length) {
            throw new BadRequestException("Invalid Recipients!")
        }
        if (!html?.length && !text?.length && !attachments?.length) {
            throw new BadRequestException("Invalid Content!")
        }
        const info = await transporter.sendMail({
            from: `"${APPLICATION_NAME}" <${APP_EMAIL}>`, // sender address
            to, // list of recipients
            cc,
            bcc,
            subject, // subject line
            text, // plain text body
            html, // HTML body
            attachments
        });
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
}