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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const GenerateOtp_1 = require("../../../infrastructure/utils/helpers/GenerateOtp");
const userConstants_1 = require("../../../infrastructure/constants/userConstants");
const NodeMailer_1 = __importDefault(require("../../../infrastructure/utils/helpers/NodeMailer"));
const TokenGeneration_1 = require("../../../domain/services/TokenGeneration");
const ApiError_1 = __importDefault(require("../../../infrastructure/utils/handlers/ApiError"));
class UserUseCase {
    constructor(userRepository, verificationRepository, jwtToken, hashedPassword) {
        this.userRepository = userRepository;
        this.verificationRepository = verificationRepository;
        this.jwtToken = jwtToken;
        this.hashPassword = hashedPassword;
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
    VerifyOtp(token, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('verify otp worked in repo :', otp);
                let decodedToken = this.jwtToken.verifyJwt(token);
                console.log('verify otp decodedtoken :', decodedToken);
                if (decodedToken) {
                    const { user, otpExpiration } = decodedToken;
                    if (new Date() > new Date(otpExpiration)) {
                        return { success: false, message: '  OTP Expired !' };
                    }
                    if (otp == decodedToken.otp) {
                        console.log('otp match');
                        // const hashedPassword = decodedToken.user.password
                        const hashedPassword = yield this.hashPassword.createHash(decodedToken.user.password);
                        decodedToken.user.password = hashedPassword;
                        const saveUser = yield this.userRepository.createUser(decodedToken.user);
                        if (saveUser.success) {
                            return { success: true, message: 'Registered Sucessfully' };
                        }
                        else
                            return { success: false, message: 'Internal server error!' };
                    }
                    else
                        return { success: false, message: ' Incorrect OTP !' };
                }
                else
                    return { success: false, message: 'No token Try again!' };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    sendOtp(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExists = yield this.userRepository.findByEmail(user.email);
                console.log(userExists);
                if (userExists) {
                    return {
                        success: false, userExists: true
                    };
                }
                let otp = (0, GenerateOtp_1.generateOTP)();
                console.log('generated otp ', otp);
                const sendEmaill = yield (0, NodeMailer_1.default)(user.email, otp);
                const otpExpiration = new Date();
                otpExpiration.setMinutes(otpExpiration.getMinutes() + 1);
                let token = jsonwebtoken_1.default.sign({ user, otp, otpExpiration }, process.env.JWT_KEY, { expiresIn: "5m" });
                console.log('token', token);
                let decodeToken = this.jwtToken.verifyJwt(token);
                console.log('decoded token', decodeToken);
                return { success: true, data: { data: false, token: token }, userExists: false };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    resendOtp(userToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('token data usecase ---- :', userToken);
                const tokenDecodedData = this.jwtToken.verifyJwt(userToken);
                console.log('token decoded data :', tokenDecodedData);
                if (!tokenDecodedData || !(tokenDecodedData === null || tokenDecodedData === void 0 ? void 0 : tokenDecodedData.user))
                    return { success: false, message: "User not found in token" };
                let userData = tokenDecodedData.user;
                let otp = (0, GenerateOtp_1.generateOTP)();
                console.log('generated otp ', otp);
                const sendEmaill = yield (0, NodeMailer_1.default)(userData.email, otp);
                const otpExpiration = new Date();
                otpExpiration.setMinutes(otpExpiration.getMinutes() + 1);
                let token = jsonwebtoken_1.default.sign({ user: userData, otp, otpExpiration }, process.env.JWT_KEY, { expiresIn: "5m" });
                console.log('token', token);
                let decodeToken = this.jwtToken.verifyJwt(token);
                console.log('decoded token', decodeToken);
                return { success: true, data: { data: false, token: token }, userExists: false };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    sendOtpToEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findByEmail(email);
                if (!user)
                    return { success: false, message: "User not found" };
                let otp = (0, GenerateOtp_1.generateOTP)();
                console.log('generated otp ', otp);
                const sendOtpToEmail = yield (0, NodeMailer_1.default)(email, otp);
                const otpExpiration = new Date();
                otpExpiration.setMinutes(otpExpiration.getMinutes() + 1);
                let token = jsonwebtoken_1.default.sign({ otp, otpExpiration }, process.env.JWT_KEY, { expiresIn: "5m" });
                console.log('token', token);
                let decodeToken = this.jwtToken.verifyOtp(token);
                console.log('decoded token', decodeToken);
                if (!token)
                    return { success: false, message: "Failed to genereate otp" };
                return { success: true, token: token };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    verifyForgetPasswordOtp(userOtp, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let decodedToken = this.jwtToken.verifyOtp(token);
                console.log('decoded token', decodedToken);
                if (decodedToken) {
                    const { otp, otpExpiration } = decodedToken;
                    if (new Date() > new Date(otpExpiration)) {
                        return { success: false, message: '  OTP Expired !' };
                    }
                    if (otp == userOtp) {
                        return { success: true, message: 'Otp verified Sucessfully' };
                    }
                    else
                        return { success: false, message: ' Incorrect OTP !' };
                }
                else
                    return { success: false, message: 'No token Try again!' };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    verifyForgetPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield this.hashPassword.createHash(password);
                const changePassword = yield this.userRepository.changePasswordByEmail(email, hashedPassword);
                if (changePassword.success) {
                    return { success: true, message: 'Password changed successfully' };
                }
                return { success: false, message: 'Failed to change password' };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    login(loginData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { email, password } = loginData;
                const findUser = yield this.userRepository.findByEmail(email);
                // console.log(findUser)
                if (findUser) {
                    if (findUser.loginType !== userConstants_1.UserLoginType.EMAIL_PASSWORD) {
                        return { success: false,
                            message: "You have previously registered using " +
                                ((_a = findUser.loginType) === null || _a === void 0 ? void 0 : _a.toLowerCase()) +
                                ". Please use the " +
                                ((_b = findUser.loginType) === null || _b === void 0 ? void 0 : _b.toLowerCase()) +
                                " login option to access your account."
                        };
                    }
                    //  const hashedPassword = await this.hashPassword.createHash(email)
                    let passwordMatch = yield this.hashPassword.compare(password, findUser.password);
                    console.log('password match :', passwordMatch);
                    if (!passwordMatch) { // replace it with passwordMatch later
                        return { success: false, message: ' Incorrect password' };
                    }
                    if (findUser.isBlocked) {
                        return { success: false, message: "User is temporarily Blocked" };
                    }
                    //   let token =  jwt.sign(
                    //         {userId: findUser._id,role:findUser.role},
                    //         process.env.JWT_KEY as string,
                    //         { expiresIn: "60m" } 
                    //       );
                    const { accessToken, refreshToken } = yield (0, TokenGeneration_1.generateAccessAndRefreshTokens)(findUser._id);
                    // const verify = this.jwtToken.verifyJwt(token)
                    // console.log('verigiree usecase dataa',verify)
                    const loggedUserData = yield this.userRepository.getUserById(findUser._id);
                    // console.log('user data to send ;',loggedUserData)
                    return { success: true, user: loggedUserData, accessToken, refreshToken };
                }
                return { success: false, message: "User not found " };
            }
            catch (error) {
                console.log(error);
                throw new ApiError_1.default(500, " Something went wrong");
            }
        });
    }
    Gsignup(name, userName, email, picture) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExists = yield this.userRepository.findByEmail(email);
                if (userExists)
                    return { success: false, message: 'Email already exists' };
                const hashedPassword = yield this.hashPassword.createHash(email);
                console.log("hashed password ;", hashedPassword);
                const newUser = yield this.userRepository.Gsignup({ email, userName, name, password: hashedPassword, profileImageUrl: picture, loginType: userConstants_1.UserLoginType.GOOGLE });
                if (newUser) {
                    const userData = yield this.userRepository.findByEmail(email);
                    let token = this.jwtToken.createJwt(userData._id, "user");
                    if (userData && token) {
                        return { success: true, user: userData, token };
                    }
                }
                return { success: false, message: "Something went wrong try again !!" };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    Glogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const findUser = yield this.userRepository.findByEmail(email);
                if (findUser) {
                    if (findUser.loginType !== userConstants_1.UserLoginType.GOOGLE) {
                        return { success: false,
                            message: "You have previously registered using " +
                                ((_a = findUser.loginType) === null || _a === void 0 ? void 0 : _a.toLowerCase()) +
                                ". Please use the " +
                                ((_b = findUser.loginType) === null || _b === void 0 ? void 0 : _b.toLowerCase()) +
                                " login option to access your account."
                        };
                    }
                    const hashedPassword = yield this.hashPassword.createHash(email.trim());
                    let passwordMatch = yield this.hashPassword.compare(email.trim(), findUser.password);
                    console.log('passsword match', passwordMatch);
                    if (!passwordMatch) {
                        return { success: false, message: ' Incorrect password' };
                    }
                    else if (findUser.isBlocked) {
                        return { success: false, message: "User is temporarily Blocked" };
                    }
                    else {
                        // let token = this.jwtToken.createJwt(findUser._id,"user");
                        let token = jsonwebtoken_1.default.sign({ userId: findUser._id, role: findUser.role }, process.env.JWT_KEY, { expiresIn: "60m" });
                        const loggedUserData = yield this.userRepository.getUserById(findUser._id);
                        // console.log('user data to send ;',loggedUserData)
                        return { success: true, user: loggedUserData, token: token };
                    }
                }
                return { success: false, message: "User not found register first" };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExists = yield this.userRepository.getUserById(userId);
                if (!userExists)
                    return { success: false, message: 'user not exists' };
                return { success: true, user: userExists };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    editUserProfile(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExists = yield this.userRepository.getUserById(userId);
                if (!userExists)
                    return { success: false, message: 'user not exists' };
                const updateUser = yield this.userRepository.updateUserProfile(userId, userData);
                if (updateUser.success) {
                    const userData = yield this.userRepository.getUserById(userId);
                    return { success: true, data: userData };
                }
                return { success: false, messgage: updateUser.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    savePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.getUserById(userId);
                if (user) {
                    if (user.savedPost.some(saved => saved.postId === postId)) {
                        console.log('post already saved');
                        return { success: false, message: "Post already saved" };
                    }
                    else {
                        // Add logic to save the post if it's not already saved
                        // Example:
                        const savePost = yield this.userRepository.savePost(userId, postId);
                        if (savePost.success) {
                            return { success: true };
                        }
                        return { success: true, message: "Post saved successfully" };
                    }
                }
                return { success: false, message: "User not found" };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Something went wrong" };
            }
        });
    }
    changePrivacy(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExists = yield this.userRepository.getUserById(userId);
                if (!userExists)
                    return { success: false, message: 'user not exists' };
                const updateUser = yield this.userRepository.changePrivacy(userId);
                if (updateUser.success) {
                    const userData = yield this.userRepository.getUserById(userId);
                    return { success: true, data: userData };
                }
                return { success: false, messgage: updateUser.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    isRequestedVerification(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExists = yield this.verificationRepository.getVerificationDetailsByUserId(userId);
                if (!userExists.success)
                    return { success: false, verificationStatus: false, message: 'user not exists' };
                return { success: true, verificationStatus: true, data: userExists.data };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    submitVerification(userId, idUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExists = yield this.verificationRepository.submitVerification(userId, idUrl);
                if (!userExists.success)
                    return { success: false, verificationStatus: false, message: 'user not exists' };
                return { success: true, verificationStatus: true, data: userExists.data };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updatePaymentDetails(userId, plan) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requestExists = yield this.verificationRepository.getVerificationDetailsByUserId(userId);
                if (!requestExists.success)
                    return { success: false, message: 'Request not exists' };
                const updatePayment = yield this.verificationRepository.updatePayment(userId, plan);
                if (!requestExists.success)
                    return { success: false, message: updatePayment === null || updatePayment === void 0 ? void 0 : updatePayment.message };
                const changeUserToVerified = yield this.userRepository.toogleIsVerified(userId);
                if (!changeUserToVerified.success)
                    return { success: false, message: "Failed to update user is verified" };
                return { success: true, data: changeUserToVerified.data };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = UserUseCase;
