"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_service_1 = __importDefault(require("./authentication.service"));
const index_1 = require("../../middleware/index");
const validators = __importStar(require("./authentication.validation"));
const router = (0, express_1.Router)({ strict: true, caseSensitive: true });
router.post("/signup", (0, index_1.validation)(validators.signup), (0, index_1.responseFormatter)(async (req, res, next) => {
    const data = await authentication_service_1.default.signup(req.validate.body);
    return { status: 201, data };
}));
router.post("/forgot-password-request", (0, index_1.validation)(validators.forgotPasswordRequest), (0, index_1.responseFormatter)(async (req, res, next) => {
    await authentication_service_1.default.forgotPasswordRequest(req.body);
}));
router.post("/confirm-forgot-password", (0, index_1.validation)(validators.confirmForgotPassword), (0, index_1.responseFormatter)(async (req, res, next) => {
    await authentication_service_1.default.confirmForgotPassword(req.body);
}));
router.patch("/reset-password", (0, index_1.validation)(validators.resetPassword), (0, index_1.responseFormatter)(async (req, res, next) => {
    await authentication_service_1.default.resetPassword(req.body);
}));
router.patch("/confirm-email", (0, index_1.validation)(validators.confirmEmail), (0, index_1.responseFormatter)(async (req, res, next) => {
    await authentication_service_1.default.confirmEmail(req.body);
}));
router.patch("/resend-confirm-email", (0, index_1.validation)(validators.resendConfirmEmail), (0, index_1.responseFormatter)(async (req, res, next) => {
    await authentication_service_1.default.resendConfirmEmail(req.body);
}));
exports.default = router;
