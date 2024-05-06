"use strict";
// import adminUseCase from "../../useCase/adminUseCase";
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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class productController {
    constructor(userCase) {
        this.userCase = userCase;
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this.userCase.createUser(req === null || req === void 0 ? void 0 : req.body);
                if (userData.success) {
                    return res.status(201).send(userData);
                }
                return res.status(500).send(userData);
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const response = yield this.userCase.VerifyOtp(req === null || req === void 0 ? void 0 : req.body);
                console.log('console response ', response);
                if (response.success) {
                    return res.status(201).send(response);
                }
                return res.status(500).send(response);
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    sendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req.body;
                console.log(user);
                let otp = 1234;
                let token = jsonwebtoken_1.default.sign({ user, otp }, process.env.JWT_KEY, { expiresIn: "5m" });
                console.log('token', token);
                return res.status(400).send('otp worked');
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = productController;
