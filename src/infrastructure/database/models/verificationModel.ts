import mongoose, { Model, Schema } from 'mongoose';
import VerificationInterface from '../../../domain/entities/verification';

const VerificationSchema: Schema<VerificationInterface> = new Schema(
    {
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
    },
    {
        timestamps: true,
    }
);

VerificationSchema.pre('save', function (next) {
    const verification = this as VerificationInterface;

    // If paymentStatus is false, clear the payment details
    if (!verification.payment.paymentStatus) {
        verification.payment.plan = undefined;
        verification.payment.startDate = undefined;
        verification.payment.endDate = undefined;
    } else {
        // If paymentStatus is true, calculate endDate based on the plan
        const currentDate = new Date();
        verification.payment.startDate = currentDate;
        if (verification.payment.plan === '10 days') {
            verification.payment.endDate = new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000);
        } else if (verification.payment.plan === '20 days') {
            verification.payment.endDate = new Date(currentDate.getTime() + 20 * 24 * 60 * 60 * 1000);
        } else if (verification.payment.plan === '30 days') {
            verification.payment.endDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        }
    }

    next();
});

const VerificationModel: Model<VerificationInterface> = mongoose.model<VerificationInterface>('Verification', VerificationSchema);
export default VerificationModel;
