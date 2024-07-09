"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessTokens = exports.generateAccessAndRefreshTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../../infrastructure/database/models/userModel"));
const ApiError_1 = __importDefault(require("../../infrastructure/utils/handlers/ApiError"));
const asyncHandlers_1 = __importDefault(require("../../infrastructure/utils/handlers/asyncHandlers"));
const ApiResponse_1 = __importDefault(require("../../infrastructure/utils/handlers/ApiResponse"));
const generateAccessAndRefreshTokens = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("worked generate access && refresh token ");
    try {
        const user = yield userModel_1.default.findById(userId);
        console.log(user);
        if (!user) {
            throw new ApiError_1.default(404, "User not found");
        }
        const accessToken = yield user.generateAccessToken();
        const refreshToken = yield user.generateRefreshToken();
        user.refreshToken = refreshToken;
        yield user.save();
        return { refreshToken, accessToken };
    }
    catch (error) {
        throw new ApiError_1.default(500, 'Something went wrong while generating token');
    }
});
exports.generateAccessAndRefreshTokens = generateAccessAndRefreshTokens;
exports.refreshAccessTokens = (0, asyncHandlers_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        console.log('..............................refresh acces tpokem service worked.....');
        // console.log(" indomng",req.body)
        const incomingRefreshToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken) || ((_b = req.body) === null || _b === void 0 ? void 0 : _b.refreshToken);
        if (!incomingRefreshToken) {
            throw new ApiError_1.default(401, "Unauthorized request");
        }
        const decodedToken = jsonwebtoken_1.default.verify(incomingRefreshToken.trim(), process.env.REFRESH_TOKEN_SECRET);
        console.log("decode ", decodedToken);
        const user = yield userModel_1.default.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id);
        console.log("user", user);
        if (!user) {
            throw new ApiError_1.default(401, "Invalid refresh token");
        }
        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError_1.default(401, "Refresh token is expired");
        }
        const tokens = yield (0, exports.generateAccessAndRefreshTokens)(user._id);
        console.log("generated token while loginn", tokens);
        if (!tokens) {
            throw new ApiError_1.default(500, 'Could not generate new tokens');
        }
        const { accessToken, refreshToken } = tokens;
        const options = {
            httpOnly: true,
            secure: true,
            // sameSite: 'strict' as 'strict', // Assuming you want to enforce strict same-site policy
        };
        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse_1.default(200, { accessToken, refreshToken }, "Access token refreshed"));
        return;
    }
    catch (error) {
        // throw new ApiError(500, 'Something went wrong while refreshing token');
    }
}));
