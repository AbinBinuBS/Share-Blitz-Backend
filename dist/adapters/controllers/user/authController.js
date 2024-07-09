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
const asyncHandlers_1 = __importDefault(require("../../../infrastructure/utils/handlers/asyncHandlers"));
const ApiError_1 = __importDefault(require("../../../infrastructure/utils/handlers/ApiError"));
const ApiResponse_1 = __importDefault(require("../../../infrastructure/utils/handlers/ApiResponse"));
const mongoose_1 = __importDefault(require("mongoose"));
class userController {
    constructor(userCase) {
        this.verifyForgetPassword = (0, asyncHandlers_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("verify otp in controller", req.body);
            const { password, email } = req.body;
            if ([password, email].some((field) => (field === null || field === void 0 ? void 0 : field.trim()) === "")) {
                throw new ApiError_1.default(400, 'All fields are required');
            }
            const verifyOtp = yield this.userCase.verifyForgetPassword(email, password);
            if (verifyOtp.success) {
                res.status(200).json(new ApiResponse_1.default(200, {}, verifyOtp === null || verifyOtp === void 0 ? void 0 : verifyOtp.message));
            }
            else {
                throw new ApiError_1.default(400, verifyOtp === null || verifyOtp === void 0 ? void 0 : verifyOtp.message);
            }
        }));
        this.userCase = userCase;
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('crea te user controller worked');
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
            var _a;
            try {
                // console.log('verify otp controller worked')
                // console.log(req.body)
                // console.log(req.headers)               
                let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                const response = yield this.userCase.VerifyOtp(token, req === null || req === void 0 ? void 0 : req.body.otp);
                // console.log('console response ',response)
                if (response === null || response === void 0 ? void 0 : response.success) {
                    return res.status(201).send(response);
                }
                return res.status(200).send(response);
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
                // console.log('send otp controller worked')
                const { user } = req.body;
                console.log(req.body);
                const responseData = yield this.userCase.sendOtp(req.body);
                if (responseData.userExists)
                    return res.status(409).send({ success: false, message: 'User already exists' });
                if (responseData.success) {
                    const token = responseData === null || responseData === void 0 ? void 0 : responseData.data.token;
                    console.log("sendotp controller token:", token);
                    return res.status(200).json({ success: true, token: token });
                }
                else {
                    return res.status(409).json({ success: false, message: 'something went wrong !' });
                }
                // return res.status(200).send(data)
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // console.log('re send otp controller worked')
                // console.log(req.body)
                let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                console.log('token conteoller :---------', token);
                const responseData = yield this.userCase.resendOtp(token);
                console.log("response data ;", responseData);
                // if(responseData.userExists)
                //   return  res.status(409).send({success:false,message:'User already exists'})
                if (responseData.success) {
                    const token = responseData === null || responseData === void 0 ? void 0 : responseData.data.token;
                    console.log("sendotp controller token:", token);
                    return res.status(200).json({ success: true, token: token });
                }
                else {
                    return res.status(409).json({ success: false, message: 'something went wrong !' });
                }
                // return res.status(200).send(data)
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Login in controller worked");
                // console.log(req.body)
                const { email, password } = req.body;
                if (!email || !password)
                    return res.status(200).json({ success: false, message: "Email and Password are required" });
                const responseData = yield this.userCase.login(req.body);
                // console.log("logind response",responseData)
                if (responseData === null || responseData === void 0 ? void 0 : responseData.success) {
                    const options = {
                        httpOnly: true,
                        secure: true
                    };
                    return res.status(200)
                        .cookie("accessToken", responseData.accessToken, options)
                        .cookie("refreshToken", responseData.refreshToken, options)
                        .json(new ApiResponse_1.default(200, { success: true, user: responseData.user, accessToken: responseData.accessToken, refreshToken: responseData.refreshToken }, "login sucessfully"));
                    // res.cookie("userToken", responseData.token, {
                    //     expires: new Date(Date.now() + 25892000000),
                    //     httpOnly: true,
                    //   });
                    //    return res.status(200).json({success:true,token:responseData.token,user:responseData.user})
                }
                else {
                    return res.status(200).json({ statusCode: 200,
                        data: {
                            success: false,
                            message: (responseData === null || responseData === void 0 ? void 0 : responseData.message) || 'Unknown error'
                        },
                        message: (responseData === null || responseData === void 0 ? void 0 : responseData.message) || 'Unknown error',
                        success: false });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Internal server error!" });
            }
        });
    }
    Gsignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("G signup worked in controller");
                console.log(req.body);
                const { name, userName, email, picture } = req.body;
                const user = yield this.userCase.Gsignup(name, userName, email, picture);
                if (user === null || user === void 0 ? void 0 : user.success) {
                    res.cookie("userToken", user.token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                    });
                    return res.status(200).json({ success: true, token: user.token, user: user.user });
                }
                else {
                    return res.status(200).json({ success: false, message: user === null || user === void 0 ? void 0 : user.message });
                }
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    Glogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("G login worked in controller");
                console.log(req.body);
                const { email } = req.body;
                const user = yield this.userCase.Glogin(email);
                // console.log('send dat g login;',user)
                if (user === null || user === void 0 ? void 0 : user.success) {
                    res.cookie("userToken", user.token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                    });
                    return res.status(200).json({ success: true, token: user.token, user: user.user });
                }
                else {
                    return res.status(200).json({ success: false, message: user === null || user === void 0 ? void 0 : user.message });
                }
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Get user worked in controller");
                // console.log(req.query)
                const { userId } = req.query;
                if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                    return res.status(400).json({ success: false, message: "Invalid user id" });
                }
                const userData = yield this.userCase.getUser(userId);
                // console.log(userData)
                if (!(userData === null || userData === void 0 ? void 0 : userData.success))
                    return res.status(200).json({ success: false, message: 'user not exists' });
                return res.status(200).json({ success: true, user: userData.user });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    editProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Edit profile worked in controller");
                // console.log(req?.userId)
                console.log(req.body);
                const { userData } = req.body;
                const userId = req.userId;
                const editUserProfile = yield this.userCase.editUserProfile(userId, userData);
                // console.log('response edit user profile :',editUserProfile)
                if (editUserProfile === null || editUserProfile === void 0 ? void 0 : editUserProfile.success) {
                    return res.status(200).json({ success: true, userData: editUserProfile.data });
                }
                return res.status(200).json({ success: false, message: editUserProfile === null || editUserProfile === void 0 ? void 0 : editUserProfile.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    savePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("save post in controller")
                // console.log(req.body) 
                // console.log(req.query)
                const { postId } = req.body;
                const userId = req.userId;
                const savePost = yield this.userCase.savePost(userId, postId);
                // console.log('response get all posts profile :',getUserPosts)
                // if(getUserPosts?.success){
                // return res.status(200).json({success:true,userPosts:getUserPosts.data})
                // }
                // return res.status(200).json({success:false,message:getUserPosts?.message})
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    sendForgetPasswordOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("send otp in controller");
                const { email } = req.query;
                const userId = req.userId;
                if (!email)
                    throw new ApiError_1.default(400, 'email is required');
                const sendOtp = yield this.userCase.sendOtpToEmail(email);
                if (sendOtp.success) {
                    res.status(200).json(new ApiResponse_1.default(200, { token: sendOtp.token }, 'OTP sent successfully'));
                }
                else {
                    throw new ApiError_1.default(400, (sendOtp === null || sendOtp === void 0 ? void 0 : sendOtp.message) || 'Failed to send OTP');
                }
            }
            catch (error) {
                if (error instanceof ApiError_1.default) {
                    res.status(error.statusCode).json(new ApiResponse_1.default(error.statusCode, null, error.message));
                }
                else {
                    res.status(500).json(new ApiResponse_1.default(500, null, 'Something went wrong'));
                }
                console.error(error);
            }
        });
    }
    verifyForgetPasswordOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("verify otp in controller", req.body);
                const { token, otp } = req.body;
                const userId = req.userId;
                if (!token || !otp)
                    throw new ApiError_1.default(400, 'otp and token is required');
                const verifyOtp = yield this.userCase.verifyForgetPasswordOtp(otp, token);
                if (verifyOtp.success) {
                    res.status(200).json(new ApiResponse_1.default(200, {}, verifyOtp === null || verifyOtp === void 0 ? void 0 : verifyOtp.message));
                }
                else {
                    throw new ApiError_1.default(400, verifyOtp === null || verifyOtp === void 0 ? void 0 : verifyOtp.message);
                }
            }
            catch (error) {
                if (error instanceof ApiError_1.default) {
                    res.status(error.statusCode).json(new ApiResponse_1.default(error.statusCode, null, error.message));
                }
                else {
                    res.status(500).json(new ApiResponse_1.default(500, null, 'Something went wrong'));
                }
                console.error(error);
            }
        });
    }
}
exports.default = userController;
