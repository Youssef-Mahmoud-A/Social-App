import { EventEmitter } from 'node:events'
import { sendEmail } from './index';
import { verifyEmailTemplate } from './index';
import { EmailSubjectEnum } from '../../enum';

export const emailEvent = new EventEmitter();

emailEvent.on("sendEmail", async ({

    subject = EmailSubjectEnum.CONFIRM_EMAIL,
    recipients,
    data
}: {
    subject?: EmailSubjectEnum;
    recipients: { to?: string[], cc?: string[], bcc?: string[] };
    data: any
}) => {
    try {
        await sendEmail({
            ...recipients,
            subject,
            html: verifyEmailTemplate({ code: data.code, subject, title: data.title ?? subject, username: data.username })
        })
    } catch (error) {
        console.log(error);
    }
})