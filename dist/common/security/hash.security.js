"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.hash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../../config");
const hash = async (plaintext, salt_round = config_1.SALT, minor = "b") => {
    const saltSignature = await bcrypt_1.default.genSalt(salt_round, minor);
    return await bcrypt_1.default.hash(plaintext, saltSignature);
};
exports.hash = hash;
const compare = async (plaintext, cipherText) => {
    return await bcrypt_1.default.compare(plaintext, cipherText);
};
exports.compare = compare;
