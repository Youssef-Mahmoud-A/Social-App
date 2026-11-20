"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryption = exports.encryption = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const config_js_1 = require("../../config.js");
const encryption = async (plaintext) => {
    const iv = node_crypto_1.default.randomBytes(config_js_1.IV_LENGTH);
    const cipherIv = node_crypto_1.default.createCipheriv("aes-256-cbc", config_js_1.ENC_KEY, iv);
    let cipherText = cipherIv.update(plaintext, "utf-8", "hex");
    cipherText += cipherIv.final("hex");
    return `${iv.toString("hex")}::${cipherText}`;
};
exports.encryption = encryption;
const decryption = async (cipherText) => {
    const [hexIV, encryptedData] = cipherText.split("::");
    const iv = Buffer.from(hexIV, 'hex');
    const decipherIv = node_crypto_1.default.createDecipheriv("aes-256-cbc", config_js_1.ENC_KEY, iv);
    let plainText = decipherIv.update(encryptedData, "hex", "utf-8");
    plainText += decipherIv.final("utf-8");
    return plainText;
};
exports.decryption = decryption;
