"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const { ObjectId } = mongoose_1.Types;
const likesModel_1 = __importDefault(require("../../models/likesModel"));
const postModel_1 = __importDefault(require("../../models/postModel"));
const commentsModel_1 = __importDefault(require("../../models/commentsModel"));
const reportModel_1 = __importDefault(require("../../models/reportModel"));
const savedModel_1 = __importDefault(require("../../models/savedModel"));
class PostRepository {
    createPost(postData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("create post worked in repo :",postData) 
                const newPost = new postModel_1.default(postData);
                if (yield newPost.save())
                    return { success: true, data: newPost };
                return { success: false, message: "Something went wrong" };
            }
            catch (error) {
                console.log(error);
                return { message: 'something went wrong', success: false };
            }
        });
    }
    findPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("getpostby id worked", postId);
                const postData = yield postModel_1.default.findById(postId);
                if (postData)
                    return { success: true, data: postData };
                return { success: false, message: "Post not available" };
            }
            catch (error) {
                console.log(error);
                return { message: 'something went wrong', success: false };
            }
        });
    }
    tooglePostIsBlocked(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the user by userId
                const post = yield postModel_1.default.findById(postId);
                if (!post) {
                    return { success: false, message: "Post not found" };
                }
                post.isBlocked = !post.isBlocked;
                yield post.save();
                return { success: true, data: post };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Failed to block post" };
            }
        });
    }
    getAllPosts(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("get all post worked in repo :", skip, limit);
                //    const postData = await PostModel.find({isBlocked:false,isDeleted:false}).sort({ creationTime: -1 });
                const postData = yield postModel_1.default.aggregate([
                    {
                        $match: { isBlocked: false,
                            isDeleted: false }
                    },
                    {
                        $lookup: {
                            from: 'likes', // the name of the Likes collection
                            localField: '_id',
                            foreignField: 'postId',
                            as: 'likesDetails'
                        }
                    },
                    {
                        $lookup: {
                            from: 'comments', // the name of the Comments collection
                            localField: '_id',
                            foreignField: 'postId',
                            as: 'commentsDetails'
                        }
                    },
                    {
                        $unwind: {
                            path: '$likesDetails',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $unwind: {
                            path: '$commentsDetails',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $sort: {
                            creationTime: -1
                        }
                    },
                    {
                        $skip: skip
                    },
                    {
                        $limit: limit
                    }
                ]);
                if (postData)
                    return { success: true, data: postData };
                return { success: false, message: "Something went wrong" };
            }
            catch (error) {
                console.log(error);
                return { message: 'something went wrong', success: false };
            }
        });
    }
    getAllPostsToAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("get all post worked in repo :", skip,limit) 
                //    const postData = await PostModel.find({isBlocked:false,isDeleted:false}).sort({ creationTime: -1 });
                const postData = yield postModel_1.default.aggregate([
                    {
                        $lookup: {
                            from: 'likes', // the name of the Likes collection
                            localField: '_id',
                            foreignField: 'postId',
                            as: 'likesDetails'
                        }
                    },
                    {
                        $lookup: {
                            from: 'comments', // the name of the Comments collection
                            localField: '_id',
                            foreignField: 'postId',
                            as: 'commentsDetails'
                        }
                    },
                    {
                        $unwind: {
                            path: '$likesDetails',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $unwind: {
                            path: '$commentsDetails',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $sort: {
                            creationTime: -1
                        }
                    },
                    // {
                    //   $skip: skip
                    // },
                    // {
                    //     $limit: limit
                    // }
                ]);
                if (postData)
                    return { success: true, data: postData };
                return { success: false, message: "Something went wrong" };
            }
            catch (error) {
                console.log(error);
                return { message: 'something went wrong', success: false };
            }
        });
    }
    getPostsByLimitToAdmin(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postData = yield postModel_1.default.aggregate([
                    {
                        $lookup: {
                            from: 'likes', // the name of the Likes collection
                            localField: '_id',
                            foreignField: 'postId',
                            as: 'likesDetails'
                        }
                    },
                    {
                        $lookup: {
                            from: 'comments', // the name of the Comments collection
                            localField: '_id',
                            foreignField: 'postId',
                            as: 'commentsDetails'
                        }
                    },
                    {
                        $unwind: {
                            path: '$likesDetails',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $unwind: {
                            path: '$commentsDetails',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $sort: {
                            creationTime: -1
                        }
                    },
                    {
                        $skip: skip
                    },
                    {
                        $limit: limit
                    }
                ]);
                if (postData)
                    return { success: true, data: postData };
                return { success: false, message: "Something went wrong" };
            }
            catch (error) {
                console.log(error);
                return { message: 'something went wrong', success: false };
            }
        });
    }
    getPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("get all post worked in repo :", postId);
                const postData = yield postModel_1.default.aggregate([
                    {
                        $match: { isBlocked: false,
                            isDeleted: false,
                            _id: new ObjectId(postId)
                        }
                    },
                    {
                        $lookup: {
                            from: 'likes', // the name of the Likes collection
                            localField: '_id',
                            foreignField: 'postId',
                            as: 'likesDetails'
                        }
                    },
                    {
                        $lookup: {
                            from: 'comments', // the name of the Comments collection
                            localField: '_id',
                            foreignField: 'postId',
                            as: 'commentsDetails'
                        }
                    },
                    {
                        $unwind: {
                            path: '$likesDetails',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $unwind: {
                            path: '$commentsDetails',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $sort: {
                            creationTime: -1
                        }
                    }
                ]);
                // console.log('postdata :',postData)
                if (postData.length)
                    return { success: true, data: postData[0] };
                return { success: false, message: "Post not found" };
            }
            catch (error) {
                console.log(error);
                return { message: 'something went wrong', success: false };
            }
        });
    }
    getUserPosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('user id ;', userId);
                //    const postData = await PostModel.find({userId,isBlocked:false,isDeleted:false})
                const postData = yield postModel_1.default.aggregate([
                    {
                        $match: {
                            userId: new mongoose_1.default.Types.ObjectId(userId), // Convert userId to ObjectId
                            isBlocked: false,
                            isDeleted: false
                        }
                    },
                    {
                        $lookup: {
                            from: 'likes', // the name of the Likes collection
                            localField: '_id',
                            foreignField: 'postId',
                            as: 'likesDetails'
                        }
                    },
                    {
                        $lookup: {
                            from: 'comments', // the name of the Comments collection
                            localField: '_id',
                            foreignField: 'postId',
                            as: 'commentsDetails'
                        }
                    },
                    {
                        $unwind: {
                            path: '$likesDetails',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $unwind: {
                            path: '$commentsDetails',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $sort: {
                            creationTime: -1
                        }
                    }
                ]);
                // console.log("postdata  ;",postData)
                if (postData)
                    return { success: true, data: postData };
                return { success: false, message: "Something went wrong" };
            }
            catch (error) {
                console.log(error);
                return { message: 'something went wrong', success: false };
            }
        });
    }
    editPost(postId, postData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("edit postss worked in repo :");
                const updatePostData = yield postModel_1.default.findByIdAndUpdate(postId, postData, { new: true });
                console.log(updatePostData);
                if (!updatePostData) {
                    return { success: false, message: 'Failed to update post details' };
                }
                return { success: true, postData: updatePostData };
            }
            catch (error) {
                console.log(error);
                return { message: 'something went wrong', success: false };
            }
        });
    }
    findPostLikesByPostId(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("get user postss worked in repo :");
                const likeData = yield likesModel_1.default.findOne({ postId });
                if (likeData)
                    return { success: true, data: likeData };
                return { success: false, message: "Something went wrong" };
            }
            catch (error) {
                console.log(error);
                return { message: 'something went wrong', success: false };
            }
        });
    }
    likePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("get user postss worked in repo :") 
                const likeData = yield likesModel_1.default.findOneAndUpdate({ postId }, { $push: { likes: { userId } } }, { new: true, useFindAndModify: false });
                console.log("like post repo: ", likeData);
                if (likeData)
                    return { success: true, data: likeData };
                return { success: false, message: "Something went wrong" };
            }
            catch (error) {
                console.log(error);
                return { message: 'something went wrong', success: false };
            }
        });
    }
    unlikePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("get user postss worked in repo :") 
                const likeData = yield likesModel_1.default.findOneAndUpdate({ postId }, { $pull: { likes: { userId } } }, { new: true, useFindAndModify: false });
                console.log("unlike post repo: ", likeData);
                if (likeData)
                    return { success: true, data: likeData };
                return { success: false, message: "Something went wrong" };
            }
            catch (error) {
                console.log(error);
                return { message: 'something went wrong', success: false };
            }
        });
    }
    findCommentsById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("get user postss worked in repo :") 
                const commentData = yield commentsModel_1.default.findOne({ postId });
                if (commentData)
                    return { success: true, data: commentData };
                return { success: false, message: "Comments not available" };
            }
            catch (error) {
                console.log(error);
                return { message: 'something went wrong', success: false };
            }
        });
    }
    addComment(postId, userId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("add comment worked in repo :");
                const commentData = yield commentsModel_1.default.findOneAndUpdate({ postId }, { $push: { comments: { comment, userId } } }, { new: true, useFindAndModify: false });
                console.log(commentData);
                if (commentData)
                    return { success: true, data: commentData };
                return { success: false, message: "Comments not available" };
            }
            catch (error) {
                console.log(error);
                return { message: 'something went wrong', success: false };
            }
        });
    }
    addReply(userId, postId, commentId, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const comment = yield commentsModel_1.default.findOneAndUpdate({ postId: postId, "comments._id": commentId }, { $push: { "comments.$.replies": { userId, reply } } }, { new: true });
                // console.log("commentss :",comment)
                if (comment) {
                    const newReply = (_a = comment.comments
                        .find(c => c._id.toString() === commentId)) === null || _a === void 0 ? void 0 : _a.replies.slice(-1)[0]; // Get the last reply added
                    // console.log("result:", comment);
                    // console.log("newReply:", newReply);
                    return { success: true, data: newReply };
                }
                else {
                    return { success: false, message: "Comment not found" };
                }
            }
            catch (err) {
                console.error("An error occurred:", err);
                let errorMessage = "An unknown error occurred";
                if (err instanceof Error) {
                    errorMessage = err.message;
                }
                return { success: false, message: errorMessage };
            }
        });
    }
    ;
    getReplies(postId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const comment = yield commentsModel_1.default.findOne({ postId: postId, "comments._id": commentId }, { "comments.$": 1 } // Project only the matching comment
                );
                if (comment) {
                    const replies = comment.comments[0].replies; // Get all replies of the matching comment
                    // console.log("result:", comment);
                    // console.log("replies:", replies);
                    return { success: true, data: replies };
                }
                else {
                    return { success: false, message: "Comment not found" };
                }
            }
            catch (err) {
                console.error("An error occurred:", err);
                let errorMessage = "An unknown error occurred";
                if (err instanceof Error) {
                    errorMessage = err.message;
                }
                return { success: false, message: errorMessage };
            }
        });
    }
    reportPost(postId, userId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newReport = new reportModel_1.default({ postId, userId, reason });
                if (yield newReport.save())
                    return { success: true, data: newReport };
                return { success: false, message: "Something went wrong" };
            }
            catch (error) {
                console.log(error);
                return { message: 'something went wrong', success: false };
            }
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield postModel_1.default.findById(postId);
                if (!post) {
                    return { success: false, message: "Post not found" };
                }
                const updatedPost = yield postModel_1.default.findByIdAndUpdate(postId, { isDeleted: !post.isDeleted }, { new: true });
                return { success: true, data: updatedPost };
                // return {success:false,message:"Something went wrong"}
            }
            catch (error) {
                console.log(error);
                return { message: 'something went wrong', success: false };
            }
        });
    }
    savePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savePost = yield savedModel_1.default.findOneAndUpdate({ userId }, { $push: { savedPosts: { postId } } }, { upsert: true, new: true });
                if (savePost) {
                    return { success: true, data: savePost };
                }
                return { success: false, message: "Failed to save post" };
            }
            catch (error) {
                console.log(error);
                return { message: 'something went wrong', success: false };
            }
        });
    }
    unSavePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unSavePost = yield savedModel_1.default.findOneAndUpdate({ userId: new mongoose_1.default.Types.ObjectId(userId) }, { $pull: { savedPosts: { postId: new mongoose_1.default.Types.ObjectId(postId) } } }, { new: true });
                if (unSavePost) {
                    return { success: true, data: unSavePost };
                }
                return { success: false, message: "Failed to un save post" };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: 'Something went wrong' };
            }
        });
    }
    findSavedPostsById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedPosts = yield savedModel_1.default.findOne({ userId: new mongoose_1.default.Types.ObjectId(userId) });
                if (savedPosts) {
                    return { success: true, data: savedPosts };
                }
                return { success: false, message: "Failed to find posts" };
            }
            catch (error) {
                console.log(error);
                return { message: 'something went wrong', success: false };
            }
        });
    }
    deleteComment(postId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postComments = yield commentsModel_1.default.findOne({ postId });
                if (!postComments) {
                    return { success: false, message: "Post not found" };
                }
                const commentIndex = postComments.comments.findIndex(comment => comment._id.toString() === commentId);
                if (commentIndex === -1) {
                    return { success: false, message: "Comment not found" };
                }
                postComments.comments.splice(commentIndex, 1);
                yield postComments.save();
                return { success: true, data: postComments };
            }
            catch (error) {
                console.log(error);
                return { message: 'something went wrong', success: false };
            }
        });
    }
    getTaggedPosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield postModel_1.default.aggregate([
                    {
                        $match: {
                            isBlocked: false,
                            isDeleted: false,
                            "taggedUsers.userId": new ObjectId(userId)
                        }
                    },
                    {
                        $lookup: {
                            from: 'likes',
                            localField: '_id',
                            foreignField: 'postId',
                            as: 'likesDetails'
                        }
                    },
                    {
                        $lookup: {
                            from: 'comments',
                            localField: '_id',
                            foreignField: 'postId',
                            as: 'commentsDetails'
                        }
                    },
                    {
                        $unwind: {
                            path: '$likesDetails',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $unwind: {
                            path: '$commentsDetails',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $sort: {
                            creationTime: -1
                        }
                    }
                ]);
                // console.log("response taggg....",userId,posts)
                if (posts)
                    return { success: true, data: posts };
                return { success: false, message: "Failed to fetch posts" };
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "Failed to fetch posts" };
            }
        });
    }
}
exports.default = PostRepository;
