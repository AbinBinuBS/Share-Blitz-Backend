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
const mongoose_1 = __importDefault(require("mongoose"));
class chatController {
    constructor(chatUseCase) {
        // errHandler = asyncHandlers(async (req: Request, res: Response) => {
        //     const { password, email } = req.body;
        //     if (!req.body.name) {
        //         throw new ApiError(400, 'Name is required');
        //     }
        //     console.log(req.body.password);
        //     if ([name, email].some((field: string) => field?.trim() === "")) {
        //         throw new ApiError(400, 'All fields are required');
        //     }
        // });
        this.sendMessage = (0, asyncHandlers_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("send message received ");
            console.log(req.params.id);
            const { id: receiverId } = req.params;
            const senderId = req.userId;
            console.log(req.body.message);
            const message = req.body.message;
            const roomId = req.body.roomId;
            const sendMessage = yield this.chatUseCase.sendMessage(roomId, senderId, receiverId, message);
            if (sendMessage.success) {
                res.status(200).json(new ApiResponse_1.default(200, { message: sendMessage.data }, 'Message send successfully'));
            }
            else {
                throw new ApiError_1.default(400, sendMessage.message);
            }
        }));
        this.SendGroupMessage = (0, asyncHandlers_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("send group message received ");
            const { roomId } = req.params;
            const senderId = req.userId;
            const message = req.body.message;
            const sendMessage = yield this.chatUseCase.sendGroupMessage(roomId, senderId, message);
            // console.log("response ",sendMessage)
            if (sendMessage.success) {
                res.status(200).json(new ApiResponse_1.default(200, { message: sendMessage.data }, 'Message send successfully'));
            }
            else {
                throw new ApiError_1.default(400, sendMessage.message);
            }
        }));
        this.getMessage = (0, asyncHandlers_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("get message received ");
            console.log(req.params.id);
            const { id: userToChat } = req.params;
            const senderId = req.userId;
            // Validate the ObjectId
            if (!mongoose_1.default.Types.ObjectId.isValid(userToChat)) {
                throw new ApiError_1.default(400, 'Invalid user ID format');
            }
            const sendMessage = yield this.chatUseCase.getMessage(senderId, userToChat);
            // console.log("get messages",sendMessage)
            if (sendMessage.success) {
                res.status(200).json(new ApiResponse_1.default(200, { chat: sendMessage.data }, 'Chat fetched successfully'));
            }
            else {
                throw new ApiError_1.default(400, sendMessage.message);
            }
        }));
        this.GetMessagesByRoom = (0, asyncHandlers_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("get message received ");
            console.log(req.params.id);
            const { roomId } = req.params;
            const senderId = req.userId;
            // Validate the ObjectId
            if (!mongoose_1.default.Types.ObjectId.isValid(roomId)) {
                throw new ApiError_1.default(400, 'Invalid room ID format');
            }
            const getMessages = yield this.chatUseCase.getMessagesByRoom(roomId);
            console.log("get messages by room :", getMessages);
            if (getMessages.success) {
                res.status(200).json(new ApiResponse_1.default(200, { chat: getMessages.data }, 'Chat fetched successfully'));
            }
            else {
                throw new ApiError_1.default(400, getMessages.message);
            }
        }));
        this.getRecentChatedUsers = (0, asyncHandlers_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            // console.log("get recent chats received ")
            const userId = req.userId;
            const getUsers = yield this.chatUseCase.getRecentChats(userId);
            console.log('recent chatys', getUsers);
            if (getUsers.success) {
                res.status(200).json(new ApiResponse_1.default(200, { users: getUsers.data }, 'Recent chats fetched sucessfully'));
            }
            else {
                throw new ApiError_1.default(400, getUsers.message);
            }
        }));
        this.editMessage = (0, asyncHandlers_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("edit message received ");
            console.log(req.params);
            console.log(req.query);
            // const {id :receiverId} = req.params;
            const senderId = req.userId;
            console.log(req.body);
            const { messageId, selectedUserId: receiverId, text: message } = req.body;
            const editMessage = yield this.chatUseCase.editMessage(senderId, receiverId, messageId, message);
            if (editMessage.success) {
                res.status(200).json(new ApiResponse_1.default(200, { message: editMessage.data }, 'Message Edited successfully'));
            }
            else {
                throw new ApiError_1.default(400, editMessage.message);
            }
        }));
        this.deleteMessage = (0, asyncHandlers_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("delete message received ");
            console.log(req.params);
            console.log(req.query);
            // const {id :receiverId} = req.params;
            const senderId = req.userId;
            console.log(req.body);
            const { messageId, selectedUserId: receiverId } = req.body;
            const deleteMessage = yield this.chatUseCase.deleteMessage(senderId, receiverId, messageId);
            if (deleteMessage.success) {
                res.status(200).json(new ApiResponse_1.default(200, { message: deleteMessage.data }, 'Message deleted successfully'));
            }
            else {
                throw new ApiError_1.default(400, deleteMessage.message);
            }
        }));
        this.findMessageById = (0, asyncHandlers_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("delete message received ");
            console.log(req.params);
            const { id: messageId } = req.params;
            const senderId = req.userId;
            console.log(req.body);
            const findMessage = yield this.chatUseCase.findMessageById(messageId);
            if (findMessage.success) {
                res.status(200).json(new ApiResponse_1.default(200, { message: findMessage.data }, 'Message fetched successfully'));
            }
            else {
                throw new ApiError_1.default(400, findMessage.message);
            }
        }));
        this.unReadedMessages = (0, asyncHandlers_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("unreaded message received ");
            console.log(req.params);
            const { roomId } = req.params;
            const userId = req.userId;
            const findMessage = yield this.chatUseCase.unReadedMessages(roomId, userId);
            if (findMessage.success) {
                res.status(200).json(new ApiResponse_1.default(200, { messages: findMessage.data }, 'Message fetched successfully'));
            }
            else {
                throw new ApiError_1.default(400, findMessage.message);
            }
        }));
        this.markMessageAsRead = (0, asyncHandlers_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("marka as read message received ");
            console.log(req.params);
            const { selectedUserId } = req.params;
            const userId = req.userId;
            if (!mongoose_1.default.Types.ObjectId.isValid(selectedUserId)) {
                throw new ApiError_1.default(400, "Invalid user ID or selected user ID");
                // return { success: false, message: "Invalid user ID or selected user ID" };
            }
            const updateMessage = yield this.chatUseCase.markMessageAsRead(userId, selectedUserId);
            if (updateMessage.success) {
                res.status(200).json(new ApiResponse_1.default(200, {}, 'Message marked as readed successfully'));
            }
            else {
                throw new ApiError_1.default(400, updateMessage.message);
            }
        }));
        this.CreateGroupChat = (0, asyncHandlers_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("group chat received ");
            console.log(req.body);
            const { groupName, participants } = req.body;
            const userId = req.userId;
            if (!groupName || !participants) {
                throw new ApiError_1.default(200, 'Group name and participants required');
            }
            participants.push(userId);
            participants.forEach((userId) => {
                if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                    throw new ApiError_1.default(400, "Invalid participants ID ");
                }
            });
            const createGroupChat = yield this.chatUseCase.createGroupChat(userId, groupName, participants);
            if (createGroupChat.success) {
                res.status(200).json(new ApiResponse_1.default(200, {}, 'Group chat created successfully'));
            }
            else {
                throw new ApiError_1.default(400, createGroupChat === null || createGroupChat === void 0 ? void 0 : createGroupChat.message);
            }
        }));
        this.RemoveParticipantsFromGroupChat = (0, asyncHandlers_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("remove participants received ");
            console.log(req.body);
            // const {groupName,participants} = req.body;
            // const userId = req.userId
            // if(!groupName || !participants) {
            //     throw new ApiError(200,'Group name and participants required')
            // }
            // participants.push(userId)
            // participants.forEach((userId : string ) => {
            //     if ( !mongoose.Types.ObjectId.isValid(userId)) {
            //         throw new ApiError(400, "Invalid participants ID ");
            //       }
            // }); 
            // const createGroupChat = await this.chatUseCase.createGroupChat(userId as string,groupName as string , participants as string[])
            // console.log('create group chat  :',createGroupChat)
            // if(createGroupChat.success){
            //  res.status(200).json(new ApiResponse(200,{}, 'Group chat created successfully'));
            // } else {
            //     throw new ApiError(400, createGroupChat?.message);
            // }
        }));
        this.chatUseCase = chatUseCase;
    }
}
exports.default = chatController;
