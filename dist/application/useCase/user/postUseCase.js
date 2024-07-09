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
class PostUseCase {
    constructor(postRepository, jwtToken, hashedPassword) {
        this.postRepository = postRepository;
        this.jwtToken = jwtToken;
        this.hashPassword = hashedPassword;
    }
    createPost(postData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield this.postRepository.createPost(postData);
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
    editPost(postId, postData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!postId)
                    return { success: false, message: "Post Id is required" };
                const findPost = yield this.postRepository.findPostById(postId);
                if (!findPost.success)
                    return { success: false, message: "Post not found" };
                const editPost = yield this.postRepository.editPost(postId, postData);
                if (editPost.success) {
                    return { success: true, data: editPost.data };
                }
                return { success: false, message: "Failed to update the post" };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllPosts(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = parseInt(limit) * (parseInt(page) - 1);
                const end = parseInt(limit);
                const post = yield this.postRepository.getAllPosts(skip, end);
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
    getPostById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield this.postRepository.getPostById(userId);
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
    getUserPosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield this.postRepository.getUserPosts(userId);
                if (post.success) {
                    return { success: true, data: post.data };
                }
                return { success: false, message: "Something went wrong" };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    likePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("like post in usecase");
                const post = yield this.postRepository.findPostLikesByPostId(postId);
                //  console.log('Like :',post)
                if (!post.success) {
                    return { success: false, message: "Like collection not found" };
                }
                if (post && post.data.likes.length && post.data.likes.some((users) => users.userId == userId)) {
                    console.log("User already follows the target user");
                    return { success: false, message: "Post already liked " };
                }
                const likePost = yield this.postRepository.likePost(postId, userId);
                if (!likePost.success) {
                    return { success: false, message: likePost.message };
                }
                return { success: true, data: likePost.data };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    unlikePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log("unlike post in usecase");
                const post = yield this.postRepository.findPostLikesByPostId(postId);
                if (!post.success) {
                    return { success: false, message: "Like collection not found" };
                }
                if (!((_a = post === null || post === void 0 ? void 0 : post.data) === null || _a === void 0 ? void 0 : _a.likes.some((like) => like.userId == userId))) {
                    console.log("User has not liked this post");
                    return { success: false, message: "Post not liked by the user" };
                }
                const unlikePost = yield this.postRepository.unlikePost(postId, userId);
                if (!unlikePost.success) {
                    return { success: false, message: unlikePost.message };
                }
                return { success: true, data: unlikePost.data };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addComment(postId, userId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("comment post in usecase");
                console.log("postID", postId, "comment", comment);
                const post = yield this.postRepository.findPostLikesByPostId(postId);
                //  console.log('Like :',post)
                if (!post.success) {
                    return { success: false, message: "Comment collection not found" };
                }
                const commentPost = yield this.postRepository.addComment(postId, userId, comment);
                if (!commentPost.success) {
                    return { success: false, message: commentPost.message };
                }
                return { success: true, data: commentPost.data };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addReply(userId, postId, commentId, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addReply = yield this.postRepository.addReply(userId, postId, commentId, reply);
                if (!addReply.success) {
                    return { success: false, message: addReply.message };
                }
                return { success: true, data: addReply.data };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getReplies(postId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addReply = yield this.postRepository.getReplies(postId, commentId);
                if (!addReply.success) {
                    return { success: false, message: addReply.message };
                }
                return { success: true, data: addReply.data };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    reportPost(postId, userId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("comment post in usecase");
                console.log("postID", postId, "comment", reason);
                const post = yield this.postRepository.findPostById(postId);
                if (!post.success) {
                    return { success: false, message: post === null || post === void 0 ? void 0 : post.message };
                }
                const reportPost = yield this.postRepository.reportPost(postId, userId, reason);
                if (!reportPost.success) {
                    return { success: false, message: reportPost.message };
                }
                return { success: true, data: reportPost.data };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    blockPost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("comment post in usecase");
                const post = yield this.postRepository.findPostById(postId);
                if (!post.success) {
                    return { success: false, message: post === null || post === void 0 ? void 0 : post.message };
                }
                // const reportPost :CommentOnPostResponse =  await this.postRepository.reportPost(postId,userId,reason)
                // if(!reportPost.success){
                //     return {success:false,message:reportPost.message}
                // }
                // return {success:true,data:reportPost.data}
                return { success: true, data: [] };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    savePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log("save post in usecase i");
                const savedPosts = yield this.postRepository.findSavedPostsById(userId);
                if (savedPosts && savedPosts.success && ((_a = savedPosts.data) === null || _a === void 0 ? void 0 : _a.savedPosts.some((post) => post.postId.toString() == postId))) {
                    console.log("User already saved the post");
                    return { success: false, message: "User already saved the post" };
                }
                const savePost = yield this.postRepository.savePost(userId, postId);
                if (!savePost.success) {
                    return { success: false, message: savePost === null || savePost === void 0 ? void 0 : savePost.message };
                }
                return { success: true, data: savePost.data };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    unSavePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log("un save post in usecase");
                const savedPosts = yield this.postRepository.findSavedPostsById(userId);
                if (!savedPosts.success) {
                    return { success: false, message: "Failed to retrieve saved posts" };
                }
                if (!((_a = savedPosts.data) === null || _a === void 0 ? void 0 : _a.savedPosts.some((post) => post.postId.toString() === postId))) {
                    return { success: false, message: "Post is not saved by the user" };
                }
                const unSavePost = yield this.postRepository.unSavePost(userId, postId);
                if (!unSavePost.success) {
                    return { success: false, message: unSavePost.message };
                }
                return { success: true, data: unSavePost.data };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getSavedPostsById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedPosts = yield this.postRepository.findSavedPostsById(userId);
                if (!savedPosts.success) {
                    return { success: false, message: "Failed to load savedPosts" };
                }
                return { success: true, data: savedPosts.data };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deleteComment(postId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("delete comment in usecase");
                const deleteComment = yield this.postRepository.deleteComment(postId, commentId);
                if (!deleteComment.success) {
                    return { success: false, message: "Failed to load deleteComment" };
                }
                return { success: true, data: deleteComment.data };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getTaggedPosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const taggedUsers = yield this.postRepository.getTaggedPosts(userId);
                if (!taggedUsers.success) {
                    return { success: false, message: "Failed to load tagged posts" };
                }
                return { success: true, data: taggedUsers.data };
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
}
exports.default = PostUseCase;
