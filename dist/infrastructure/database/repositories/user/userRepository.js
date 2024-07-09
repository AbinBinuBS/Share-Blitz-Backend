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
const ApiError_1 = __importDefault(require("../../../utils/handlers/ApiError"));
class UserRepository {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("create user worked in repo :", user);
                const { userName, email, } = user;
                const existUser = yield userModel_1.default.findOne({ userName: userName, email: email });
                if (existUser) {
                    return { duplicate: true, success: true };
                }
                const newUser = new userModel_1.default(user);
                yield newUser.save();
                return { success: true, data: newUser };
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
                return { duplicate: false, success: true };
            }
            catch (error) {
                console.log(error);
                return { duplicate: false, success: false };
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExists = yield userModel_1.default.findOne({ email: email });
                if (userExists) {
                    return userExists;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    //   async findByUserId(userId: string) {
    //     try {
    //       const userExists = await UserModel.findOne({ userId: userId });
    //       if (userExists) {
    //         return userExists;
    //       } else {
    //         return null;
    //       }
    //     } catch (error) {
    //       console.log(error);
    //       return null;
    //     }
    //   }
    Gsignup(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = new userModel_1.default(user);
                yield newUser.save();
                return { success: true, data: newUser };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield userModel_1.default.findById(userId).select("-password -refreshToken");
            return userData;
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield userModel_1.default.find({ role: 'USER', isDeleted: false }).select("-password");
                ;
                return userData ? { success: true, data: userData } : { success: false, message: "Failed to load users" };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Failed to load users" };
            }
        });
    }
    toogleStatus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExists = yield userModel_1.default.findById(userId);
                if (userExists) {
                    userExists.isBlocked = !userExists.isBlocked;
                    if (yield userExists.save())
                        return { success: true, data: !userExists };
                    return { success: true, message: "Failed to change status" };
                }
                else {
                    return { success: false, message: "User not found" };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Something went wrong" };
            }
        });
    }
    updateUserProfile(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('field', userData);
                const userExists = yield userModel_1.default.findById(userId);
                if (userExists) {
                    userExists.name = userData.name;
                    userExists.userName = userData.userName;
                    userExists.email = userData.email;
                    userExists.mobile = userData.mobile;
                    userExists.bio = userData.bio;
                    userExists.dob = userData.dob;
                    userExists.profileImageUrl = userData.profileImageUrl;
                    if (yield userExists.save())
                        return { success: true };
                    return { success: false, message: "Failed to update profile" };
                }
                else {
                    return { success: false, message: "User not found" };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Something went wrong" };
            }
        });
    }
    savePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExists = yield userModel_1.default.findById(userId);
                if (userExists) {
                    userExists.isBlocked = !userExists.isBlocked;
                    if (yield userExists.save())
                        return { success: true, data: !userExists };
                    return { success: true, message: "Failed to change status" };
                }
                else {
                    return { success: false, message: "User not found" };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Something went wrong" };
            }
        });
    }
    searchUser(searchInput) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userExists = yield userModel_1.default.find({
                    $or: [
                        { name: { $regex: searchInput, $options: 'i' } },
                        { userName: { $regex: searchInput, $options: 'i' } },
                    ]
                });
                if (userExists) {
                    return { success: true, data: userExists };
                }
                else {
                    return { success: false, message: "User not found" };
                }
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Something went wrong" };
            }
        });
    }
    changePrivacy(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findById(userId);
            if (!user) {
                // throw new Error("User not found");
                return { success: false, message: "User not exist" };
            }
            // Toggle the isPrivate field
            user.isPrivate = !user.isPrivate;
            // Save the updated user
            yield user.save();
            return { success: true, data: { isPrivate: user.isPrivate } };
        });
    }
    toogleIsVerified(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the user by userId
                const user = yield userModel_1.default.findById(userId);
                if (!user) {
                    return { success: false, message: "User not found" };
                }
                user.isVerified = !user.isVerified;
                yield user.save();
                return { success: true, data: user };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Failed to toggle isVerified" };
            }
        });
    }
    changePasswordByEmail(email, passsword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findOneAndUpdate({ email }, { $set: { password: passsword } });
                if (!user) {
                    return { success: false, message: "Failed to change password" };
                }
                return { success: true, message: "Password changed successfully " };
            }
            catch (error) {
                console.log(error);
                throw new ApiError_1.default(400, "Failed to change password");
            }
        });
    }
    logoutUSer(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield userModel_1.default.findByIdAndUpdate(userId, {
                    $set: {
                        refreshToken: undefined
                    }
                }, {
                    new: true
                });
                const options = {
                    httpOnly: true,
                    secure: true
                };
                // return res.status(200)
                // .clearCookie("accessToken",options)
                // .clearCookie("refreshToken",options)
                // .json(new ApiResponse(200,{},"User loggedOut successfully"))
                return { success: true, data: "" };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Failed to toggle isVerified" };
            }
        });
    }
    getUserDetailsFromArray(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch user details from UserModel
                const users = yield userModel_1.default.find({ _id: { $in: userIds } }, '-password -refreshToken').exec();
                return { success: true, users };
            }
            catch (error) {
                console.error(error);
                throw new Error('Error fetching user details');
            }
        });
    }
}
exports.default = UserRepository;
