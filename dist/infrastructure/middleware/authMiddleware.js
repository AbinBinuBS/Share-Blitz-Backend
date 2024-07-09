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
exports.adminAuth = exports.adminAuth1 = void 0;
const jwtToken_1 = __importDefault(require("../utils/helpers/jwtToken"));
const userRepository_1 = __importDefault(require("../database/repositories/user/userRepository"));
const userConstants_1 = require("../constants/userConstants");
const asyncHandlers_1 = __importDefault(require("../utils/handlers/asyncHandlers"));
const ApiError_1 = __importDefault(require("../utils/handlers/ApiError"));
const userRepository = new userRepository_1.default();
const jwt = new jwtToken_1.default();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const userAuth1 = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization;
            const decoded = jwt.verifyJwt(token);
            if (decoded && decoded.role !== userConstants_1.UserRolesEnum.USER)
                return res.status(403).json({ success: false, message: "Unauthorized" });
            if (decoded && decoded.userId) {
                let userData = yield userRepository.getUserById(decoded === null || decoded === void 0 ? void 0 : decoded.userId);
                if (userData === null || userData === void 0 ? void 0 : userData.isBlocked) {
                    return res.status(403).send({ success: false, message: 'User is blocked !!' });
                }
                else {
                    req.userId = decoded.userId;
                    next();
                }
            }
            else {
                return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" });
            }
        }
        else {
            return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
// export default userAuth
const adminAuth1 = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("admin auth worked");
        const token = req.headers.authorization;
        if (!token) {
            console.log("Not token");
            return res.status(401).json({ success: false, message: "Unauthorized - Invalid token format" });
        }
        let decoded = null;
        try {
            decoded = jwt.verifyJwt(token);
        }
        catch (err) {
            return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
        }
        console.log('Decoded:', decoded);
        if (decoded && decoded.role !== userConstants_1.UserRolesEnum.ADMIN) {
            return res.status(403).json({ success: false, message: "Unauthorized - Insufficient privileges" });
        }
        const adminData = yield userRepository.getUserById(decoded === null || decoded === void 0 ? void 0 : decoded.userId);
        if (!adminData) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        if (adminData.isBlocked) {
            return res.status(403).json({ success: false, message: "Admin is blocked" });
        }
        // req.userId = decoded?.userId;
        console.log("verified");
        next();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.adminAuth1 = adminAuth1;
const userAuth = (0, asyncHandlers_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // console.log('auth/..................................')
    try {
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) || ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.replace("Bearer", ""));
        // console.log("token :",token)
        if (!token) {
            throw new ApiError_1.default(401, "Unauthorized request");
        }
        const decodedToken = jsonwebtoken_1.default.verify(token.trim(), process.env.ACCESS_TOKEN_SECRET);
        // console.log(decodedToken)       
        if (!mongoose_1.default.Types.ObjectId.isValid(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id)) {
            throw new ApiError_1.default(401, "Invalid user id ");
        }
        const userData = yield userRepository.getUserById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id);
        // console.log("user data ",userData)
        if (!userData) {
            throw new ApiError_1.default(401, "user not found");
        }
        req.userId = userData._id;
        next();
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            throw new ApiError_1.default(401);
        }
        else {
            throw new ApiError_1.default(401);
        }
    }
}));
exports.default = userAuth;
exports.adminAuth = (0, asyncHandlers_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    console.log('admin auth/..................................');
    try {
        const token = ((_c = req.cookies) === null || _c === void 0 ? void 0 : _c.accessToken) || ((_d = req.headers.authorization) === null || _d === void 0 ? void 0 : _d.replace("Bearer", ""));
        // console.log("token from admin :",token)
        if (!token) {
            throw new ApiError_1.default(401, "Unauthorized request");
        }
        const decodedToken = jsonwebtoken_1.default.verify(token.trim(), process.env.ACCESS_TOKEN_SECRET);
        console.log(decodedToken);
        if (decodedToken && decodedToken.role !== userConstants_1.UserRolesEnum.ADMIN) {
            throw new ApiError_1.default(403, "Insufficient privileges");
        }
        const adminData = yield userRepository.getUserById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id);
        // console.log("user data ",adminData)
        if (!adminData) {
            throw new ApiError_1.default(401);
        }
        req.userId = adminData._id;
        next();
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            throw new ApiError_1.default(401);
        }
        else {
            throw new ApiError_1.default(401);
        }
    }
}));
// export default adminAuth
