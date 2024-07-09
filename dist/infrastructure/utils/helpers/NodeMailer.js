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
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = createTransporter();
    const mailOptions = createMailOptions(email, otp);
    const info = yield transporter.sendMail(mailOptions);
    console.log('info :', info);
    if (info) {
        return true;
    }
    return false;
});
exports.default = sendEmail;
const createTransporter = () => {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASS_KEY,
        },
    });
    return transporter;
};
const createMailOptions = (email, otp) => {
    return {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: 'Verification Mail',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007bff;">Verification Code</h2>
          <p>Dear User,</p>
          <p>Your verification code is: <strong style="font-size: 1.2em; color: #28a745;">${otp}</strong></p>
          <p>Please use this code to complete the verification process.</p>
          <p>If you did not request this code, please ignore this email.</p>
          <p>Best regards,<br> Mong Fashion's Team</p>
        </div>
      `,
    };
};
// const otp = OTP.generateOTP();
// req.session.changePassword = otp
// req.session.otp = otp;
// console.log(req.session.otp)
// console.log("sendmail - generatd-otp:",otp)
// const mailOptions = {
//     from: process.env.EMAIL,
//     to: userData.email,
//     subject: 'Verification Mail',
//     html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//             <h2 style="color: #007bff;">Verification Code</h2>
//             <p>Dear User,</p>
//             <p>Your verification code is: <strong style="font-size: 1.2em; color: #28a745;">${otp}</strong></p>
//             <p>Please use this code to complete the verification process.</p>
//             <p>If you did not request this code, please ignore this email.</p>
//             <p>Best regards,<br> Mong Fashion's Team</p>
//         </div>
//     `,
// };
// // Use Promise style for sending mail
// const info = await transporter.sendMail(mailOptions);
