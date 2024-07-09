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
class AdminUseCase {
    constructor(postRepository, userRepository, reportRepository, verificationRepository, jwtToken, hashedPassword) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.reportRepository = reportRepository;
        this.verificationRepository = verificationRepository;
        this.jwtToken = jwtToken;
        this.hashPassword = hashedPassword;
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("worked get all users usecase");
                const post = yield this.userRepository.getAllUsers();
                if (post.success) {
                    return { success: true, userData: post.data };
                }
                return { success: false, message: post === null || post === void 0 ? void 0 : post.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllPosts(page) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const limit = 5;
                const skip = limit * (parseInt(page) - 1);
                console.log(skip, page);
                console.log("worked get all users usecase");
                const posts = yield this.postRepository.getPostsByLimitToAdmin(skip, limit);
                const allPosts = yield this.postRepository.getAllPostsToAdmin();
                console.log(posts);
                if (posts.success) {
                    return { success: true, data: { posts: posts.data, total: ((_a = allPosts === null || allPosts === void 0 ? void 0 : allPosts.data) === null || _a === void 0 ? void 0 : _a.length) || 0 } };
                }
                return { success: false, message: posts.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllReportedPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("worked get all users usecase");
                const post = yield this.reportRepository.getAllReportedPosts();
                if (post.success) {
                    return { success: true, data: post.data };
                }
                return { success: false, message: post === null || post === void 0 ? void 0 : post.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getReportsByPostId(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("worked get reports by posts usecase");
                const post = yield this.reportRepository.getReportsByPostId(postId);
                if (post.success) {
                    return { success: true, data: post.data };
                }
                return { success: false, message: post === null || post === void 0 ? void 0 : post.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    toogleUserStatus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("worked toogle user status usecase");
                const changeStatus = yield this.userRepository.toogleStatus(userId);
                if (changeStatus.success) {
                    return { success: true, updatedStatus: changeStatus.data };
                }
                return { success: false, message: changeStatus === null || changeStatus === void 0 ? void 0 : changeStatus.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    tooglePostIsBlocked(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("worked toogle post status usecase");
                const changeStatus = yield this.postRepository.tooglePostIsBlocked(postId);
                if (changeStatus.success) {
                    return { success: true, updatedStatus: changeStatus.data };
                }
                return { success: false, message: changeStatus === null || changeStatus === void 0 ? void 0 : changeStatus.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield this.postRepository.getPostById(postId);
                if (post.success) {
                    return { success: true, postData: post.data };
                }
                return { success: false, message: "Something went wrong" };
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
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletePost = yield this.postRepository.deletePost(postId);
                if (!deletePost)
                    return { success: false, message: 'Failed to delete the post' };
                return { success: true, data: deletePost.data };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    changeActionStatus(reportId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("worked chnge action  status usecase");
                const changeStatus = yield this.reportRepository.changeActionStatus(reportId);
                if (changeStatus.success) {
                    return { success: true, updatedStatus: changeStatus.data };
                }
                return { success: false, message: changeStatus === null || changeStatus === void 0 ? void 0 : changeStatus.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getVerificationData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("worked getVerificationData  usecase");
                const changeStatus = yield this.verificationRepository.getVerificationData();
                if (changeStatus.success) {
                    return { success: true, data: changeStatus.data };
                }
                return { success: false, message: changeStatus === null || changeStatus === void 0 ? void 0 : changeStatus.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    approveVerificationRequest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const approve = yield this.verificationRepository.approveVerificationRequest(id);
                if (approve.success) {
                    return { success: true, data: approve.data };
                }
                return { success: false, message: approve === null || approve === void 0 ? void 0 : approve.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    dashboardCardsData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userData;
                let postData;
                const getUserData = yield this.userRepository.getAllUsers();
                const postDataResponse = yield this.postRepository.getAllPostsToAdmin();
                if (postDataResponse.success) {
                    postData = postDataResponse.data;
                }
                if (getUserData.success) {
                    userData = getUserData.data;
                    //  userData = getUserData.data.filter((user)=>u)
                }
                return { success: true, userData, postData };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Failed to load cards data" };
            }
        });
    }
}
exports.default = AdminUseCase;
