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
const ChatRoomModel_1 = require("../../models/ChatRoomModel");
const ChatMessageModel_1 = require("../../models/ChatMessageModel");
class ChatRoomRepository {
    findChatRoom(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let chatRoom = yield ChatRoomModel_1.ChatRoomModel.findOne({
                    participants: { $all: [senderId, receiverId] }
                });
                if (chatRoom) {
                    return { success: true, room: chatRoom };
                }
                return { success: false, message: "Room not exist" };
            }
            catch (error) {
                console.error("Error finding chat room:", error);
                return { success: false, message: "Failed to find chat room" };
            }
        });
    }
    findChatRoomById(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let chatRoom = yield ChatRoomModel_1.ChatRoomModel.findById(roomId);
                if (chatRoom) {
                    return { success: true, room: chatRoom };
                }
                return { success: false, message: "Room not exist" };
            }
            catch (error) {
                console.error("Error finding chat room:", error);
                return { success: false, message: "Failed to find chat room" };
            }
        });
    }
    unReadedMessages(roomId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatRoom = yield ChatRoomModel_1.ChatRoomModel.findById(roomId);
                if (!chatRoom) {
                    return { success: false, message: "Room not exist" };
                }
                const unseenMessages = yield ChatMessageModel_1.ChatMessageModel.find({
                    _id: { $in: chatRoom.messages },
                    //   receiverId:userId,
                    senderId: { $ne: userId },
                    seen: false,
                }).exec();
                return { success: true, data: unseenMessages };
            }
            catch (error) {
                console.error("Error finding chat room:", error);
                return { success: false, message: "Failed to find chat room" };
            }
        });
    }
    createChatRoom(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createRoom = new ChatRoomModel_1.ChatRoomModel({
                    // name:"abhilash",
                    participants: [senderId, receiverId]
                    // admin:data.sender
                });
                const Room = yield createRoom.save();
                if (Room) {
                    return { success: true, room: Room };
                }
                return { success: false, message: "Failed to create Room" };
            }
            catch (error) {
                console.error("Error creating chat room:", error);
                return { success: false, message: "Failed to create room" };
            }
        });
    }
    addNewMessageId(roomId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatRoom = yield ChatRoomModel_1.ChatRoomModel.findById(roomId);
                if (!chatRoom)
                    return { success: false, message: " Room not exist" };
                chatRoom.messages.push(new mongoose_1.default.Types.ObjectId(messageId));
                chatRoom.lastMessage = new mongoose_1.default.Types.ObjectId(messageId);
                const updatedRoom = yield chatRoom.save();
                return { success: true, room: updatedRoom };
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
    removeMessageId(roomId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatRoom = yield ChatRoomModel_1.ChatRoomModel.findById(roomId);
                console.log(chatRoom);
                if (!chatRoom)
                    return { success: false, message: " Room not exist" };
                const updatedMessages = chatRoom.messages.filter((msgId) => msgId.toString() != messageId);
                chatRoom.messages = updatedMessages;
                const updatedRoom = yield chatRoom.save();
                console.log(chatRoom);
                return { success: true, room: updatedRoom };
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
    getAllMessages(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatRoom = yield ChatRoomModel_1.ChatRoomModel.findOne({
                    participants: { $all: [senderId, receiverId] }
                }).populate("messages");
                if (chatRoom)
                    return { success: true, room: chatRoom };
                return { success: true, room: [] };
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
    getMessagesByRoom(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatRoom = yield ChatRoomModel_1.ChatRoomModel.findById(roomId).populate("messages");
                if (chatRoom)
                    return { success: true, room: chatRoom };
                return { success: true, room: [] };
                return { success: false, message: "No room found" };
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
    getRecentChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatRooms = yield ChatRoomModel_1.ChatRoomModel.find({
                    participants: userId
                }).sort({ updatedAt: -1 }).exec();
                if (!chatRooms || chatRooms.length === 0) {
                    return { success: false, message: 'No recent chats found' };
                }
                return { success: true, chatRooms: chatRooms };
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
    markMessageAsRead(userId, selectedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield ChatMessageModel_1.ChatMessageModel.updateMany({ senderId: selectedUserId, receiverId: userId, seen: false }, { $set: { seen: true } });
                return { success: true, data: {} };
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
    createGroupChat(userId, groupName, participants) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createRoom = new ChatRoomModel_1.ChatRoomModel({
                    name: groupName,
                    isGroupChat: true,
                    participants: participants,
                    admin: userId
                });
                const Room = yield createRoom.save();
                if (Room) {
                    return { success: true, data: Room };
                }
                return { success: false, message: "Failed to create Room" };
            }
            catch (error) {
                console.error("Error creating chat room:", error);
                return { success: false, message: "Failed to create room" };
            }
        });
    }
}
exports.default = ChatRoomRepository;
