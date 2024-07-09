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
const ChatMessageModel_1 = require("../../models/ChatMessageModel");
class ChatMessageRepository {
    createNewMessage(senderId, receiverId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newMessage = new ChatMessageModel_1.ChatMessageModel({
                    senderId, receiverId, text: message.text, imageUrl: message.imageUrl, videoUrl: message.videoUrl
                });
                yield newMessage.save();
                if (newMessage) {
                    return { success: true, message: newMessage };
                }
                return { success: false, message: "Room not exist" };
            }
            catch (error) {
                console.error("Error creating new message:", error);
                return { success: false, message: "Failed to create new message" };
            }
        });
    }
    createGroupChatMessage(senderId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newMessage = new ChatMessageModel_1.ChatMessageModel({
                    senderId, text: message.text, imageUrl: message.imageUrl, videoUrl: message.videoUrl
                });
                yield newMessage.save();
                if (newMessage) {
                    return { success: true, message: newMessage };
                }
                return { success: false, message: "Room not exist" };
            }
            catch (error) {
                console.error("Error creating new message:", error);
                return { success: false, message: "Failed to create new message" };
            }
        });
    }
    deleteMessage(senderId, receiverId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the message
                const message = yield ChatMessageModel_1.ChatMessageModel.findOne({
                    _id: messageId,
                });
                if (!message) {
                    return { success: false, message: "Message not found or unauthorized" };
                }
                // Delete the message
                const deletedMessage = yield ChatMessageModel_1.ChatMessageModel.findByIdAndUpdate(messageId, { $set: { isDeleted: true } });
                if (!deletedMessage) {
                    return { success: false, message: "Failed to delete message" };
                }
                return { success: true, data: deletedMessage };
            }
            catch (error) {
                console.error("Error deleting message:", error);
                return { success: false, message: "Failed to delete message" };
            }
        });
    }
    deleteMessageFromMe(senderId, receiverId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the message
                const message = yield ChatMessageModel_1.ChatMessageModel.findOne({
                    _id: messageId,
                });
                if (!message) {
                    return { success: false, message: "Message not found or unauthorized" };
                }
                // Delete the message
                const deletedMessage = yield ChatMessageModel_1.ChatMessageModel.findByIdAndUpdate(messageId, { $set: { isDeletedFromMe: true } });
                if (!deletedMessage) {
                    return { success: false, message: "Failed to delete message" };
                }
                return { success: true, data: deletedMessage };
            }
            catch (error) {
                console.error("Error deleting message:", error);
                return { success: false, message: "Failed to delete message" };
            }
        });
    }
    editMessage(senderId, receiverId, messageId, text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("edit repo ", messageId, text);
                // Find the message 
                const message = yield ChatMessageModel_1.ChatMessageModel.findOne({
                    _id: messageId,
                });
                if (!message) {
                    return { success: false, message: "Message not found or unauthorized" };
                }
                // Update the message
                const updated = yield ChatMessageModel_1.ChatMessageModel.findByIdAndUpdate(messageId, { text: text, isEdited: true }, { new: true });
                if (!updated) {
                    return { success: false, message: "Failed to update message" };
                }
                return { success: true, data: updated };
            }
            catch (error) {
                console.error("Error creating new message:", error);
                return { success: false, message: "Failed to create new message" };
            }
        });
    }
    findMessageById(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield ChatMessageModel_1.ChatMessageModel.findById(messageId);
                if (!message) {
                    return { success: false, message: "Message not found or unauthorized" };
                }
                return { success: true, data: message };
            }
            catch (error) {
                console.error("Error creating new message:", error);
                return { success: false, message: "Failed to create new message" };
            }
        });
    }
}
exports.default = ChatMessageRepository;
