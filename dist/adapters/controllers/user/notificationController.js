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
const ApiResponse_1 = __importDefault(require("../../../infrastructure/utils/handlers/ApiResponse"));
class notificationController {
    constructor(notificationUseCase) {
        this.getNotifications = (0, asyncHandlers_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("get all notifications received ");
            const userId = req.userId;
            const getNotifications = yield this.notificationUseCase.getNotifications(userId);
            if (getNotifications.success) {
                res.status(200).json(new ApiResponse_1.default(200, { notifications: getNotifications.data }, 'Message fetched successfully'));
            }
            else {
                throw new ApiError_1.default(400, getNotifications.message);
            }
        }));
        this.getNotificationById = (0, asyncHandlers_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("get all notification by id received ");
        }));
        this.toggleSeen = (0, asyncHandlers_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("toogle seen received ");
            const userId = req.userId;
            const toogleSeen = yield this.notificationUseCase.toggleSeen(userId);
            if (toogleSeen.success) {
                res.status(200).json(new ApiResponse_1.default(200, { notifications: toogleSeen.data }, 'Updated notification as seen successfully'));
            }
            else {
                throw new ApiError_1.default(400, toogleSeen.message);
            }
        }));
        this.notificationUseCase = notificationUseCase;
    }
}
exports.default = notificationController;
