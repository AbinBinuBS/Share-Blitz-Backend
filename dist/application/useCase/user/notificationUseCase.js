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
class NotificationUseCase {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    getNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("recieved get message usecase");
                let getNotifications = yield this.notificationRepository.getAllNotifications(userId);
                if (getNotifications === null || getNotifications === void 0 ? void 0 : getNotifications.success) {
                    return { success: true, data: getNotifications.data };
                }
                return { success: false, message: getNotifications === null || getNotifications === void 0 ? void 0 : getNotifications.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    toggleSeen(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let toogleSeen = yield this.notificationRepository.toggleSeen(userId);
                if (toogleSeen === null || toogleSeen === void 0 ? void 0 : toogleSeen.success) {
                    return { success: true, data: toogleSeen.data };
                }
                return { success: false, message: toogleSeen === null || toogleSeen === void 0 ? void 0 : toogleSeen.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = NotificationUseCase;
