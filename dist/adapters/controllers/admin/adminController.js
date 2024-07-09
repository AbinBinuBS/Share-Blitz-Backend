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
const ApiResponse_1 = __importDefault(require("../../../infrastructure/utils/handlers/ApiResponse"));
const ApiError_1 = __importDefault(require("../../../infrastructure/utils/handlers/ApiError"));
class adminController {
    constructor(adminUseCase) {
        this.cardsData = (0, asyncHandlers_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("cards data  received ");
            console.log(req.params);
            const { roomId } = req.params;
            // const userId = req.userId
            const cardsData = yield this.adminUseCase.dashboardCardsData();
            // console.log('message recet :',cardsData)
            if (cardsData.success) {
                res.status(200).json(new ApiResponse_1.default(200, { userData: cardsData.userData, postData: cardsData.postData }, 'Data fetched successfully'));
            }
            else {
                throw new ApiError_1.default(400, cardsData.message);
            }
        }));
        this.adminUseCase = adminUseCase;
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('get all users worked');
                // console.log(req.query)
                const usersData = yield this.adminUseCase.getAllUsers();
                console.log('user data :', usersData);
                if (usersData.success) {
                    return res.status(200).json({ success: true, usersData: usersData.userData });
                }
                return res.status(200).json({ success: false, message: usersData.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                console.log('get all posts worked');
                // console.log(req.query)
                const page = req.params.page;
                const postData = yield this.adminUseCase.getAllPosts(page);
                console.log('user data :', postData);
                if (postData.success) {
                    return res.status(200).json({ success: true, posts: (_a = postData === null || postData === void 0 ? void 0 : postData.data) === null || _a === void 0 ? void 0 : _a.posts, total: (_b = postData === null || postData === void 0 ? void 0 : postData.data) === null || _b === void 0 ? void 0 : _b.total });
                }
                return res.status(200).json({ success: false, message: postData.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    toogleUserStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('toogle user worked');
                console.log(req.body);
                const { userId } = req.body;
                if (!userId)
                    return res.status(200).json({ success: false, message: "Id should be a string" });
                const changeStatus = yield this.adminUseCase.toogleUserStatus(userId);
                console.log('user data :', changeStatus);
                if (changeStatus.success) {
                    return res.status(200).json({ success: true, updateStatus: changeStatus.updatedStatus });
                }
                return res.status(200).json({ success: false, message: changeStatus.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    tooglePostIsBlocked(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('toogle post blocked worked');
                console.log(req.body);
                const { postId } = req.body;
                if (!postId)
                    return res.status(200).json({ success: false, message: "post id is required" });
                const changeStatus = yield this.adminUseCase.tooglePostIsBlocked(postId);
                console.log('user data :', changeStatus);
                if (changeStatus.success) {
                    return res.status(200).json({ success: true, updateStatus: changeStatus.updatedStatus });
                }
                return res.status(200).json({ success: false, message: changeStatus.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    getAllReportedPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('load reported post worked');
                const loadReportedPosts = yield this.adminUseCase.getAllReportedPosts();
                console.log('reported data :', loadReportedPosts);
                if (loadReportedPosts.success) {
                    return res.status(200).json({ success: true, reportedPosts: loadReportedPosts.data });
                }
                return res.status(200).json({ success: false, message: loadReportedPosts.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    getReportsByPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('get reports by post  worked');
                const { postId } = req.query;
                console.log(req.query);
                console.log(req.params);
                console.log(req.body);
                const loadReportedPosts = yield this.adminUseCase.getReportsByPostId(postId);
                console.log('reported data :', loadReportedPosts);
                if (loadReportedPosts.success) {
                    return res.status(200).json({ success: true, reports: loadReportedPosts.data });
                }
                return res.status(200).json({ success: false, message: loadReportedPosts.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('get  Post worked');
                console.log(req.query);
                const { postId } = req.query;
                if (!postId)
                    return res.status(200).json({ success: false, message: "post id is required" });
                const getPost = yield this.adminUseCase.getPostById(postId);
                if (getPost.success) {
                    return res.status(200).json({ success: true, postData: getPost.postData });
                }
                return res.status(200).json({ success: false, message: getPost === null || getPost === void 0 ? void 0 : getPost.message });
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
                console.log(req.query);
                const { userId } = req.query;
                const userData = yield this.adminUseCase.getUser(userId);
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
    changeActionStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('change action status worked');
                console.log(req.body);
                const { reportId } = req.body;
                if (!reportId)
                    return res.status(200).json({ success: false, message: "Report id is required" });
                const changeStatus = yield this.adminUseCase.changeActionStatus(reportId);
                console.log('change status :', changeStatus);
                if (changeStatus.success) {
                    return res.status(200).json({ success: true, updateStatus: changeStatus.updatedStatus.actionTaken });
                }
                return res.status(200).json({ success: false, message: changeStatus.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('delete post worked...............');
                console.log(req.body);
                console.log(req.query);
                const { postId } = req.body;
                if (!postId)
                    return res.status(200).json({ success: false, message: "postid is required" });
                const deletePost = yield this.adminUseCase.deletePost(postId);
                // console.log('delete post :',deletePost)
                if (deletePost.success) {
                    return res.status(200).json({ success: true, updateStatus: deletePost.data });
                }
                return res.status(200).json({ success: false, message: deletePost.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    getVerificationData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getData = yield this.adminUseCase.getVerificationData();
                console.log('gt data :', getData);
                if (getData.success) {
                    return res.status(200).json({ success: true, verificationData: getData.data });
                }
                return res.status(200).json({ success: false, message: getData.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    approveVerificationRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.body;
                if (!id)
                    return res.status(200).json({ success: false, message: "id is required" });
                const getData = yield this.adminUseCase.approveVerificationRequest(id);
                console.log('gt data :', getData);
                if (getData.success) {
                    return res.status(200).json({ success: true, verifacationData: getData.data });
                }
                return res.status(200).json({ success: false, message: getData.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
}
exports.default = adminController;
