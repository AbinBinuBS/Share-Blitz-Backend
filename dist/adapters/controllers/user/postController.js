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
const mongoose_1 = __importDefault(require("mongoose"));
class postController {
    constructor(postUseCase) {
        this.postUseCase = postUseCase;
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Create Post worked');
                console.log(req.body);
                const { postData } = req.body;
                const userId = req.userId;
                if (!userId || !postData)
                    return res.status(200).json({ success: false, message: "insufficent data!!" });
                postData.userId = userId;
                const savePost = yield this.postUseCase.createPost(postData);
                if (savePost.success) {
                    return res.status(200).json({ success: true, postData: savePost.postData });
                }
                return res.status(200).json({ success: false, message: "Failed to create the post !!" });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    editPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Edit post worked');
                console.log(req.query);
                console.log(req.body);
                console.log(req.body.postData.taggedUsers);
                const { postId, postData } = req.body;
                if (!postId || !postData)
                    return res.status(400).json({ success: false, message: "Post Id and PostData is required" });
                const editPost = yield this.postUseCase.editPost(postId, postData);
                if (editPost.success) {
                    return res.status(200).json({ success: true, postData: editPost.postData });
                }
                return res.status(400).json({ success: false, message: editPost.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('get all Post worked');
                console.log(req.query);
                const { limit, page } = req.query;
                if (!limit || !page)
                    return res.status(400).json({ success: false, message: "Limit and page is required" });
                const getAllPosts = yield this.postUseCase.getAllPosts(page, limit);
                if (getAllPosts.success) {
                    return res.status(200).json({ success: true, postData: getAllPosts.postData });
                }
                return res.status(200).json({ success: false, message: "Failed to get all post !!" });
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
                console.log('get all Post worked');
                console.log(req.query);
                const { postId } = req.query;
                const getPost = yield this.postUseCase.getPostById(postId);
                if (getPost.success) {
                    return res.status(200).json({ success: true, postData: getPost.postData });
                }
                return res.status(200).json({ success: false, message: "Failed to create the post !!" });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    getUserPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("get users posts worked in controller");
                const userId = req.query.userId;
                const getUserPosts = yield this.postUseCase.getUserPosts(userId);
                // console.log(getUserPosts)
                if (getUserPosts === null || getUserPosts === void 0 ? void 0 : getUserPosts.success) {
                    return res.status(200).json({ success: true, userPosts: getUserPosts.data });
                }
                return res.status(200).json({ success: false, message: getUserPosts === null || getUserPosts === void 0 ? void 0 : getUserPosts.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    likePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Like post worked in controller");
                console.log(req === null || req === void 0 ? void 0 : req.userId);
                console.log(req.body);
                const { postId } = req.body;
                const userId = req.userId;
                if (!postId || !userId) {
                    return res.status(400).json({ success: false, message: "Missing postId or userId" });
                }
                if (!mongoose_1.default.Types.ObjectId.isValid(userId) || !mongoose_1.default.Types.ObjectId.isValid(postId)) {
                    return res.status(400).json({ success: false, message: "Invalid postId or userId" });
                }
                const likePost = yield this.postUseCase.likePost(postId, userId);
                console.log('response like post contoller :', likePost);
                if (likePost === null || likePost === void 0 ? void 0 : likePost.success) {
                    return res.status(200).json({ success: true, postData: likePost.data });
                }
                return res.status(200).json({ success: false, message: likePost === null || likePost === void 0 ? void 0 : likePost.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    unlikePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("unLike post worked in controller");
                console.log(req === null || req === void 0 ? void 0 : req.userId);
                console.log(req.body);
                const { postId } = req.body;
                const userId = req.userId;
                if (!postId || !userId) {
                    return res.status(400).json({ success: false, message: "Missing postId or userId" });
                }
                const unlikePost = yield this.postUseCase.unlikePost(postId, userId);
                console.log('response like post contoller :', unlikePost);
                if (unlikePost === null || unlikePost === void 0 ? void 0 : unlikePost.success) {
                    return res.status(200).json({ success: true, postData: unlikePost.data });
                }
                return res.status(200).json({ success: false, message: unlikePost === null || unlikePost === void 0 ? void 0 : unlikePost.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    commentOnPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("comment on  post worked in controller");
                console.log(req === null || req === void 0 ? void 0 : req.userId);
                console.log(req.body);
                const { postId, comment } = req.body;
                const userId = req.userId;
                if (!postId || !userId) {
                    return res.status(400).json({ success: false, message: "Missing postId or userId" });
                }
                const commentPost = yield this.postUseCase.addComment(postId, userId, comment);
                console.log('response comment post contoller :', commentPost);
                if (commentPost === null || commentPost === void 0 ? void 0 : commentPost.success) {
                    return res.status(200).json({ success: true, commentData: commentPost.data });
                }
                return res.status(200).json({ success: false, message: commentPost === null || commentPost === void 0 ? void 0 : commentPost.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    reportPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("report post worked in controller");
                console.log(req === null || req === void 0 ? void 0 : req.userId);
                console.log(req.body);
                const { postId, reason } = req.body;
                const userId = req.userId;
                if (!postId || !userId) {
                    return res.status(400).json({ success: false, message: "Missing postId or userId" });
                }
                if (!reason || reason.trim().length <= 0) {
                    return res.status(400).json({ success: false, message: "Please provide a reason" });
                }
                const reportPost = yield this.postUseCase.reportPost(postId, userId, reason);
                console.log('response report post contoller :', reportPost);
                if (reportPost === null || reportPost === void 0 ? void 0 : reportPost.success) {
                    return res.status(200).json({ success: true, reportData: reportPost.data });
                }
                return res.status(200).json({ success: false, message: reportPost === null || reportPost === void 0 ? void 0 : reportPost.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    blockPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("block post worked in controller");
                console.log(req === null || req === void 0 ? void 0 : req.userId);
                console.log(req.body);
                const { postId } = req.body;
                const userId = req.userId;
                if (!postId || !userId) {
                    return res.status(400).json({ success: false, message: "Missing postId or userId" });
                }
                const blockPost = yield this.postUseCase.blockPost(postId, userId);
                console.log('response block post controller :', blockPost);
                if (blockPost === null || blockPost === void 0 ? void 0 : blockPost.success) {
                    return res.status(200).json({ success: true, blockData: blockPost.data });
                }
                return res.status(200).json({ success: false, message: blockPost === null || blockPost === void 0 ? void 0 : blockPost.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    getCommentReplys(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('get comment replys worked');
                console.log(req.query);
                const { postId, commentId } = req.query;
                if (!commentId || !postId)
                    return res.status(409).json({ success: false, message: "Comment id and reply is required" });
                const addReply = yield this.postUseCase.getReplies(postId, commentId);
                console.log("response :", addReply);
                // const getAllPosts = await this.postUseCase.getAllPosts()
                if (addReply.success) {
                    return res.status(200).json({ success: true, reply: addReply.data });
                }
                return res.status(200).json({ success: false, message: addReply.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    addReply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('get add Reply worked');
                console.log(req.body);
                const userId = req.userId;
                const { commentId, reply, postId } = req.body;
                if (!commentId || !reply)
                    return res.status(409).json({ success: false, message: "Comment id and reply is required" });
                const addReply = yield this.postUseCase.addReply(userId, postId, commentId, reply);
                console.log("response :", addReply);
                // const getAllPosts = await this.postUseCase.getAllPosts()
                if (addReply.success) {
                    return res.status(200).json({ success: true, reply: addReply.data });
                }
                return res.status(200).json({ success: false, message: "Failed to add reply !!" });
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
                console.log('Save Post worked');
                console.log(req.body);
                const { postId } = req.body;
                const userId = req.userId;
                if (!postId) {
                    return res.status(400).json({ success: false, message: "Post id is required" });
                }
                const savePost = yield this.postUseCase.savePost(userId, postId);
                if (savePost.success) {
                    return res.status(200).json({ success: true, postData: savePost.data });
                }
                return res.status(200).json({ success: false, message: savePost === null || savePost === void 0 ? void 0 : savePost.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    unSavePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Save Post worked');
                const { postId } = req.body;
                const userId = req.userId;
                if (!postId) {
                    return res.status(400).json({ success: false, message: "Post id is required" });
                }
                const unSavePost = yield this.postUseCase.unSavePost(userId, postId);
                if (unSavePost.success) {
                    return res.status(200).json({ success: true, postData: unSavePost.data });
                }
                return res.status(200).json({ success: false, message: unSavePost === null || unSavePost === void 0 ? void 0 : unSavePost.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    getSavedPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                    return res.status(400).json({ success: false, message: "Invalid userId" });
                }
                const savedPosts = yield this.postUseCase.getSavedPostsById(userId);
                // console.log("get saved posts :",savedPosts)
                if (savedPosts.success) {
                    return res.status(200).json({ success: true, savedPosts: savedPosts.data });
                }
                return res.status(200).json({ success: false, message: savedPosts.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Delete comment worked');
                const { commentId, postId } = req.body;
                const userId = req.userId;
                console.log(commentId);
                if (!commentId || !postId) {
                    return res.status(400).json({ success: false, message: "Comment id is required" });
                }
                const deleteComment = yield this.postUseCase.deleteComment(postId, commentId);
                // console.log("respnse",deleteComment)
                if (deleteComment.success) {
                    return res.status(200).json({ success: true, postData: deleteComment.data });
                }
                return res.status(200).json({ success: false, message: deleteComment === null || deleteComment === void 0 ? void 0 : deleteComment.message });
            }
            catch (error) {
                res.status(500).send('Something went wrong');
                console.log(error);
            }
        });
    }
    getTaggedPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Get tagged post in controller');
                const { userId } = req.query;
                console.log(userId);
                if (!userId) {
                    return res.status(400).json({ success: false, message: "User id is required" });
                }
                const taggedPosts = yield this.postUseCase.getTaggedPosts(userId);
                // console.log("respnse............................................................................",taggedPosts)
                if (taggedPosts.success) {
                    return res.status(200).json({ success: true, postData: taggedPosts.data });
                }
                return res.status(200).json({ success: false, message: taggedPosts === null || taggedPosts === void 0 ? void 0 : taggedPosts.message });
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
                const deletePost = yield this.postUseCase.deletePost(postId);
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
}
exports.default = postController;
