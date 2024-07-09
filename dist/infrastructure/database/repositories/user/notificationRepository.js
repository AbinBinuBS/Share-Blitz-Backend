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
const NotificationModel_1 = __importDefault(require("../../models/NotificationModel"));
class NotificationRepository {
    createNotification(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("received data :", data);
                const newNotification = new NotificationModel_1.default(data);
                if (yield newNotification.save())
                    return { success: true, data: newNotification };
                return { success: false, message: "Failed to create notification" };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Something went wrong" };
            }
        });
    }
    getAllNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield NotificationModel_1.default.find({ userId });
                if (notifications)
                    return { success: true, data: notifications };
                return { success: false, message: "Failed to get notification" };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Something went wrong" };
            }
        });
    }
    toggleSeen(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield NotificationModel_1.default.updateMany({ userId, isSeen: false }, { $set: { isSeen: true } });
                if (result) {
                    const updatedNotifications = yield NotificationModel_1.default.find({ userId }).sort({ createdAt: -1 });
                    return { success: true, data: updatedNotifications };
                }
                return { success: false, message: "No unseen notifications to mark as read" };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Something went wrong" };
            }
        });
    }
}
exports.default = NotificationRepository;
