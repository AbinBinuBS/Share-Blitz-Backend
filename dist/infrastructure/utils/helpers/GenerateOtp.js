"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateOTP = () => {
    // Generate a random buffer of 2 bytes
    const buffer = crypto_1.default.randomBytes(2);
    // Convert buffer to hexadecimal string
    const otp = buffer.toString('hex');
    // Convert hexadecimal string to decimal and ensure it's a 4-digit number
    return (parseInt(otp, 16) % 10000).toString().padStart(4, '0');
};
exports.generateOTP = generateOTP;
