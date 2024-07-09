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
const verificationModel_1 = __importDefault(require("../../models/verificationModel"));
class VerificationRepository {
    getVerificationDetailsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("get  verification by user id repo:");
                const result = yield verificationModel_1.default.findOne({ userId });
                console.log("result ", result);
                if (result)
                    return { success: true, data: result };
                return { success: false };
            }
            catch (error) {
                console.log(error);
                return { message: "Failed to load  reports", success: false };
            }
        });
    }
    submitVerification(userId, idUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("submit verification  id repo:");
                const newVerification = new verificationModel_1.default({
                    userId,
                    imageUrl: idUrl,
                    payment: {
                        paymentStatus: false,
                    }
                });
                const result = yield newVerification.save();
                console.log("result ", result);
                if (result)
                    return { success: true, data: result };
                return { success: false };
            }
            catch (error) {
                console.log(error);
                return { message: "Failed to create request  ", success: false };
            }
        });
    }
    updatePayment(userId, plan) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("submit verification  id repo:");
                const filter = { userId };
                const update = {
                    $set: {
                        "payment.plan": plan,
                        "payment.paymentStatus": true,
                        "planActive": true
                    }
                };
                const updatedVerification = yield verificationModel_1.default.findOneAndUpdate(filter, update, { new: true });
                if (!updatedVerification) {
                    return { success: false, message: "Verification not found" };
                }
                return { success: true, data: updatedVerification };
            }
            catch (error) {
                console.log(error);
                return { message: "Failed to update  payment", success: false };
            }
        });
    }
    getVerificationData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verificationData = yield verificationModel_1.default.find();
                if (!verificationData) {
                    return { success: false, message: "Verification data not found" };
                }
                return { success: true, data: verificationData };
            }
            catch (error) {
                console.log(error);
                return { message: "Failed to update  payment", success: false };
            }
        });
    }
    approveVerificationRequest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedVerification = yield verificationModel_1.default.findByIdAndUpdate(id, { verificationStatus: 'Approved' }, { new: true });
                if (!updatedVerification) {
                    return { success: false, message: 'Verification not found' };
                }
                return { success: true, data: updatedVerification };
            }
            catch (error) {
                console.log(error);
                return { message: "Failed to update  payment", success: false };
            }
        });
    }
}
exports.default = VerificationRepository;
