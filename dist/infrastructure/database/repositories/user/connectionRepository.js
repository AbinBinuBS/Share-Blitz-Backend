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
const connectionsModel_1 = __importDefault(require("../../models/connectionsModel"));
class ConnectionRepository {
    followUser(userId, targetId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("create post worked in repo :", userId, targetId);
                const result = yield connectionsModel_1.default.findOneAndUpdate({ userId }, { $push: { followings: { userId: targetId } } }, { new: true, useFindAndModify: false });
                // console.log("result ",result)
                if (result)
                    return { success: true };
                return { success: false, message: "Failed to follow the user" };
            }
            catch (error) {
                console.log(error);
                return { duplicate: false, success: false };
            }
        });
    }
    addFollowers(userId, targetId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("add followers worked in repo :", userId, targetId);
                const result = yield connectionsModel_1.default.findOneAndUpdate({ userId }, { $push: { followers: { userId: targetId } } }, { new: true, useFindAndModify: false });
                // console.log("result ",result)
                if (result)
                    return { success: true };
                return { success: false, message: "Something went wrong" };
            }
            catch (error) {
                console.log(error);
                return { duplicate: false, success: false };
            }
        });
    }
    findConnectionsById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("find connectionsbyid in repo :",userId) 
                const result = yield connectionsModel_1.default.findOne({ userId });
                // console.log("result ",result)
                if (result)
                    return { success: true, data: result };
                return { success: false, message: "Connection not found" };
            }
            catch (error) {
                console.log(error);
                return { duplicate: false, success: false };
            }
        });
    }
    removeFollowerById(userId, targetId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connectionsModel_1.default.findOneAndUpdate({ userId }, { $pull: { followers: { userId: targetId } } }, { new: true, useFindAndModify: false });
                // console.log("result ",result)
                if (result)
                    return { success: true };
                return { success: false, message: "Failed to follow the user" };
            }
            catch (error) {
                console.log(error);
                return { duplicate: false, success: false };
            }
        });
    }
    removeFollowingById(userId, targetId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connectionsModel_1.default.findOneAndUpdate({ userId }, { $pull: { followings: { userId: targetId } } }, { new: true, useFindAndModify: false });
                // console.log("result ",result)
                if (result)
                    return { success: true };
                return { success: false, message: "Failed to follow the user" };
            }
            catch (error) {
                console.log(error);
                return { duplicate: false, success: false };
            }
        });
    }
}
exports.default = ConnectionRepository;
