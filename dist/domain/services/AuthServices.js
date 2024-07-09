"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
// import bcrypt from "bcryptjs";
// import bcrypt
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Keys_1 = __importDefault(require("../../infrastructure/constants/Keys"));
const authService = () => {
    const generateAccessToken = (payload) => {
        const accessToken = jsonwebtoken_1.default.sign(payload, Keys_1.default.ACCESS_TOKEN_SECRET, {
            expiresIn: Keys_1.default.ACCESS_TOKEN_EXPIRY
        });
        return accessToken;
    };
    const generateRefreshToken = (payload) => {
        const refreshToken = jsonwebtoken_1.default.sign(payload, Keys_1.default.REFRESH_TOKEN_SECRET, {
            expiresIn: Keys_1.default.REFRESH_TOKEN_EXPIRY
        });
        return refreshToken;
    };
    const verifyAccessToken = (token) => {
        const payload = jsonwebtoken_1.default.verify(token, Keys_1.default.ACCESS_TOKEN_SECRET);
        return payload;
    };
    const verifyRefreshToken = (token) => {
        const payload = jsonwebtoken_1.default.verify(token, Keys_1.default.REFRESH_TOKEN_SECRET);
        return payload;
    };
    return {
        generateAccessToken,
        generateRefreshToken,
        verifyAccessToken,
        verifyRefreshToken
    };
};
exports.authService = authService;
