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
class userController {
    constructor(connectionUseCase, userUseCase) {
        this.errHandler = (0, asyncHandlers_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { password, email } = req.body;
            if (!req.body.name) {
                throw new ApiError_1.default(400, 'Name is required');
            }
            console.log(req.body.password);
            if ([name, email].some((field) => (field === null || field === void 0 ? void 0 : field.trim()) === "")) {
                throw new ApiError_1.default(400, 'All fields are required');
            }
        }));
        this.connectionUseCase = connectionUseCase;
        this.userUseCase = userUseCase;
    }
    followUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const userId = req.userId
                console.log(req === null || req === void 0 ? void 0 : req.user);
                console.log(req === null || req === void 0 ? void 0 : req.userId);
                console.log(req === null || req === void 0 ? void 0 : req.body);
                const userId = req === null || req === void 0 ? void 0 : req.userId;
                const { targetId } = req.body;
                if (!userId || !targetId)
                    return res.status(409).json({ success: false, message: "UserId is required" });
                const followUser = yield this.connectionUseCase.followUser(userId, targetId);
                if (followUser.success) {
                    return res.status(200).json({ success: true });
                }
                else {
                    return res.status(409).json({ success: false, message: followUser === null || followUser === void 0 ? void 0 : followUser.message });
                }
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    unFollowUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req === null || req === void 0 ? void 0 : req.userId;
                const { targetUserId } = req.body;
                if (!userId || !targetUserId)
                    return res.status(409).json({ success: false, message: "UserId is required" });
                const unFollowUser = yield this.connectionUseCase.unFollowUser(userId, targetUserId);
                if (unFollowUser.success) {
                    return res.status(200).json({ success: true });
                }
                else {
                    return res.status(409).json({ success: false, message: unFollowUser === null || unFollowUser === void 0 ? void 0 : unFollowUser.message });
                }
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    getConnections(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //   console.log('get connections controller worked')
                const { userId } = req.query;
                if (!userId)
                    return res.status(409).json({ success: false, message: "UserId is required" });
                const getConnections = yield this.connectionUseCase.getConnections(userId);
                // console.log(getConnections)
                if (getConnections.success) {
                    return res.status(200).json({ success: true, connections: getConnections.data });
                }
                else {
                    return res.status(409).json({ success: false, message: getConnections === null || getConnections === void 0 ? void 0 : getConnections.message });
                }
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    checkIsFriend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //   console.log('check is friend controller worked')
                const { targetUserId } = req.query;
                const userId = req.userId;
                if (!userId)
                    return res.status(409).json({ success: false, message: "UserId is required" });
                const checkIsFriend = yield this.connectionUseCase.checkIsFriend(userId, targetUserId);
                if (checkIsFriend.success) {
                    return res.status(200).json({ success: true, isFriend: checkIsFriend.isFriend });
                }
                else {
                    return res.status(409).json({ success: false, message: checkIsFriend === null || checkIsFriend === void 0 ? void 0 : checkIsFriend.message });
                }
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    searchUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //   console.log('Search user controller worked')
                const { searchInput } = req.query;
                console.log(searchInput);
                const searchUser = yield this.connectionUseCase.searchUser(searchInput);
                if (searchUser.success) {
                    return res.status(200).json({ success: true, users: searchUser.data });
                }
                else {
                    return res.status(409).json({ success: false, message: searchUser === null || searchUser === void 0 ? void 0 : searchUser.message });
                }
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    changePrivacy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const userId = req.userId
                // console.log("changePrivacy worked")
                const userId = req === null || req === void 0 ? void 0 : req.userId;
                if (!userId)
                    return res.status(409).json({ success: false, message: "UserId is required" });
                const chaneStatus = yield this.userUseCase.changePrivacy(userId);
                if (chaneStatus.success) {
                    return res.status(200).json({ success: true, userData: chaneStatus.data });
                }
                else {
                    return res.status(409).json({ success: false, message: chaneStatus === null || chaneStatus === void 0 ? void 0 : chaneStatus.message });
                }
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    isRequestedVerification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const userId = req.userId
                // console.log("is requested verification worked")
                const userId = req === null || req === void 0 ? void 0 : req.userId;
                if (!userId)
                    return res.status(409).json({ success: false, message: "UserId is required" });
                const isRequested = yield this.userUseCase.isRequestedVerification(userId);
                if (isRequested.success) {
                    return res.status(200).json({ success: true, verificationStatus: isRequested.verificationStatus, verificationData: isRequested.data });
                }
                else {
                    return res.status(200).json({ success: false, verificationStatus: isRequested.verificationStatus, message: isRequested === null || isRequested === void 0 ? void 0 : isRequested.message });
                }
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    submitVerification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const userId = req.userId
                // console.log("submit verification worked")
                // console.log(req.body)
                const { idUrl } = req.body;
                const userId = req === null || req === void 0 ? void 0 : req.userId;
                if (!userId)
                    return res.status(409).json({ success: false, message: "UserId is required" });
                const chaneStatus = yield this.userUseCase.submitVerification(userId, idUrl);
                if (chaneStatus.success) {
                    return res.status(200).json({ success: true, userData: chaneStatus.data });
                }
                else {
                    return res.status(409).json({ success: false, message: chaneStatus === null || chaneStatus === void 0 ? void 0 : chaneStatus.message });
                }
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    updatePaymentDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const userId = req.userId
                // console.log("update payment details worked")
                // console.log(req.body)
                const { plan, paymentId } = req.body;
                const userId = req === null || req === void 0 ? void 0 : req.userId;
                if (!userId)
                    return res.status(409).json({ success: false, message: "UserId is required" });
                if (!plan || !paymentId)
                    return res.status(409).json({ success: false, message: "plan && payment id is required" });
                const updatePayment = yield this.userUseCase.updatePaymentDetails(userId, plan);
                if (updatePayment.success) {
                    return res.status(200).json({ success: true, userData: updatePayment.data });
                }
                else {
                    return res.status(409).json({ success: false, message: updatePayment === null || updatePayment === void 0 ? void 0 : updatePayment.message });
                }
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
}
exports.default = userController;
