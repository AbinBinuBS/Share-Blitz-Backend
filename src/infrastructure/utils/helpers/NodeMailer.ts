import nodemailer from 'nodemailer'
const  sendEmail = async (email:string,otp:string) =>{
    const transporter = createTransporter()
    const mailOptions = createMailOptions(email,otp)
    const info = await transporter.sendMail(mailOptions);
    console.log('info :',info)
    if(info){
        return true
    }
    return false

}
export default sendEmail

const createTransporter = ()=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass:process.env.NODEMAILER_PASS_KEY,
        },
    });
    return transporter
}

const createMailOptions =(email: string, otp: string) => {
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
  }

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