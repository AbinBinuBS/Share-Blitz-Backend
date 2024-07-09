"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JWTtoken {
    createJwt(userId, role) {
        const jwtKey = process.env.JWT_KEY;
        if (jwtKey) {
            const token = jsonwebtoken_1.default.sign({ id: userId, role: role }, jwtKey);
            return token;
        }
        throw new Error('JWT key is not defined');
    }
    createJwtToken(userId, role, jwtKey, expiry) {
        console.log('.............');
        const token = jsonwebtoken_1.default.sign({ id: userId, role: role }, jwtKey, { expiresIn: expiry });
        const decode = jsonwebtoken_1.default.verify(token, jwtKey);
        console.log('created token :', token);
        console.log("decoded data :", decode);
        console.log('.............');
        return token;
    }
    verifyJwt(token) {
        try {
            const jwtKey = process.env.ACCESS_TOKEN_SECRET;
            const decode = jsonwebtoken_1.default.verify(token, jwtKey);
            console.log("decoed token in verifyjwt :", decode);
            return decode;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    verifyOtp(token) {
        try {
            const jwtKey = process.env.JWT_KEY;
            const decode = jsonwebtoken_1.default.verify(token, jwtKey);
            return decode;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
}
exports.default = JWTtoken;
