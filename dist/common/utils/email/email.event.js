"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailEvent = void 0;
const node_events_1 = require("node:events");
const index_1 = require("./index");
const index_2 = require("./index");
const enum_1 = require("../../enum");
exports.emailEvent = new node_events_1.EventEmitter();
exports.emailEvent.on("sendEmail", async ({ subject = enum_1.EmailSubjectEnum.CONFIRM_EMAIL, recipients, data }) => {
    try {
        await (0, index_1.sendEmail)({
            ...recipients,
            subject,
            html: (0, index_2.verifyEmailTemplate)({ code: data.code, subject, title: data.title ?? subject, username: data.username })
        });
    }
    catch (error) {
        console.log(error);
    }
});
