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
Object.defineProperty(exports, "__esModule", { value: true });
class UserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield this.userRepository.createUser(user);
                return product;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    VerifyOtp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('verify otp worked in repo :', data);
                const product = yield this.userRepository.verifyOtp(data);
                return product;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = UserUseCase;
