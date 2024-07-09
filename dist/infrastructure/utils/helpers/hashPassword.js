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
const crypto_1 = __importDefault(require("crypto"));
class hashPassword {
    // async createHash(password: string): Promise<string> {
    //     const hashedPassword=await bcrypt.hash(password,10)
    //     return hashedPassword
    // }
    compare(password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const newHashedPassword = yield this.createHash(password);
            // Compare the newly generated hash with the stored hashed password
            return crypto_1.default.timingSafeEqual(Buffer.from(hashedPassword, 'utf-8'), Buffer.from(newHashedPassword, 'utf-8'));
        });
    }
    createHash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = crypto_1.default.pbkdf2Sync(password, '10', 10000, 64, 'sha512').toString('hex');
            console.log(hashedPassword);
            return hashedPassword;
        });
    }
}
exports.default = hashPassword;
