"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const VerificationSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    verificationStatus: { type: String, enum: ['Pending', 'Approved'], required: true, default: 'Pending' },
    planActive: { type: Boolean, required: true, default: false },
    payment: {
        plan: { type: String, enum: ['10 days', '20 days', '30 days'] },
        paymentStatus: { type: Boolean, required: true, default: false },
        startDate: { type: Date },
        endDate: { type: Date }
    },
    imageUrl: { type: String, required: true },
}, {
    timestamps: true,
});
VerificationSchema.pre('save', function (next) {
    const verification = this;
    // If paymentStatus is false, clear the payment details
    if (!verification.payment.paymentStatus) {
        verification.payment.plan = undefined;
        verification.payment.startDate = undefined;
        verification.payment.endDate = undefined;
    }
    else {
        // If paymentStatus is true, calculate endDate based on the plan
        const currentDate = new Date();
        verification.payment.startDate = currentDate;
        if (verification.payment.plan === '10 days') {
            verification.payment.endDate = new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000);
        }
        else if (verification.payment.plan === '20 days') {
            verification.payment.endDate = new Date(currentDate.getTime() + 20 * 24 * 60 * 60 * 1000);
        }
        else if (verification.payment.plan === '30 days') {
            verification.payment.endDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        }
    }
    next();
});
const VerificationModel = mongoose_1.default.model('Verification', VerificationSchema);
exports.default = VerificationModel;
