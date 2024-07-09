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
class ConnectionUseCase {
    constructor(postRepository, userRepository, connectionRepository, jwtToken, hashedPassword) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.connectionRepository = connectionRepository;
        this.jwtToken = jwtToken;
        this.hashPassword = hashedPassword;
    }
    followUser(userId, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("follow user usecase worked ", userId, targetUserId);
                const userConnection = yield this.connectionRepository.findConnectionsById(userId);
                // console.log("user connection :",userConnection.data)
                if (userConnection && userConnection.data.followings.some((users) => users.userId == targetUserId)) {
                    console.log("User already follows the target user");
                    return { success: false, message: "User already follows the target user" };
                }
                const followUser = yield this.connectionRepository.followUser(userId, targetUserId);
                const addFollowerTargetUser = yield this.connectionRepository.addFollowers(targetUserId, userId);
                if (followUser.success && addFollowerTargetUser.success) {
                    console.log("........sucess");
                    return { success: true, data: followUser.data };
                }
                return { success: false, message: (followUser === null || followUser === void 0 ? void 0 : followUser.message) || (addFollowerTargetUser === null || addFollowerTargetUser === void 0 ? void 0 : addFollowerTargetUser.message) };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    unFollowUser(userId, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("unfollow user usecase worked ", userId, targetUserId);
                const userConnection = yield this.connectionRepository.findConnectionsById(userId);
                //  console.log("user connection :",userConnection.data)
                if (userConnection && userConnection.data.followings.some((users) => users.userId == targetUserId)) {
                    const removeFollowing = yield this.connectionRepository.removeFollowingById(userId, targetUserId);
                    const removeFollower = yield this.connectionRepository.removeFollowerById(targetUserId, userId);
                    if (removeFollower.success && removeFollowing.success) {
                        return { success: true };
                    }
                    return { success: false, message: (removeFollower === null || removeFollower === void 0 ? void 0 : removeFollower.message) || (removeFollowing === null || removeFollowing === void 0 ? void 0 : removeFollowing.message) };
                }
                return { success: false, message: "You are not a friend" };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getConnections(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //  console.log("get connections usecase worked ",userId)
                const userConnection = yield this.connectionRepository.findConnectionsById(userId);
                //  console.log("user connection :",userConnection.data)
                if (userConnection.success) {
                    console.log("........sucess");
                    return { success: true, data: userConnection.data };
                }
                return { success: false, message: userConnection === null || userConnection === void 0 ? void 0 : userConnection.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    checkIsFriend(userId, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                //  console.log("get connections usecase worked ",userId)
                const userConnection = yield this.connectionRepository.findConnectionsById(userId);
                //  console.log("user connection :",userConnection.data)
                if (userConnection.success) {
                    const isFriend = (_a = userConnection === null || userConnection === void 0 ? void 0 : userConnection.data) === null || _a === void 0 ? void 0 : _a.followings.some((user) => user.userId === targetUserId);
                    // console.log('............isFriemd',isFriend)
                    return { success: true, isFriend: isFriend };
                }
                return { success: false, message: userConnection === null || userConnection === void 0 ? void 0 : userConnection.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    searchUser(searchInput) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("search  usecase worked ", searchInput);
                const searchUser = yield this.userRepository.searchUser(searchInput);
                //  console.log("user connection :",searchUser.data)
                if (searchUser.success) {
                    return { success: true, data: searchUser.data };
                }
                return { success: false, message: searchUser === null || searchUser === void 0 ? void 0 : searchUser.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = ConnectionUseCase;
