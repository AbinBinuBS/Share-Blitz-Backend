"use strict";
// import IProductRepository from "../../useCase/interface/IProductRepository";
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
const userModel_1 = __importDefault(require("../../models/userModel"));
class UserRepository {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("create user worked in repo :", user);
                const { userName, name, mobile, email, password } = user;
                const existUser = yield userModel_1.default.findOne({ userName: userName, email: email });
                if (existUser) {
                    return { duplicate: true, success: true };
                }
                const newUser = new userModel_1.default(user);
                yield newUser.save();
                return { duplicate: false, success: true };
            }
            catch (error) {
                console.log(error);
                return { duplicate: false, success: false };
            }
        });
    }
    verifyOtp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("create user worked in repo :", data);
                const { otp } = data;
                // const existUser = await UserModel.findOne({userName:userName,email:email})
                // if(existUser) {
                //     return {duplicate : true , success:true}
                // } 
                // const newUser = new UserModel(user)
                // await newUser.save()
                return { duplicate: false, success: true };
            }
            catch (error) {
                console.log(error);
                return { duplicate: false, success: false };
            }
        });
    }
}
exports.default = UserRepository;
