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
const socket_1 = require("../../../infrastructure/Socket/socket");
const __1 = require("../../..");
class ChatUseCase {
    constructor(userRepository, roomRepository, messageRepository, jwtToken, hashedPassword, io) {
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.messageRepository = messageRepository;
        this.jwtToken = jwtToken;
        this.hashPassword = hashedPassword;
        this.io = io; // Assign io
    }
    sendMessage(roomId, senderId, receiverId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log("recieved message usecase");
                let findChatRoom = yield this.roomRepository.findChatRoom(senderId, receiverId);
                if (!(findChatRoom === null || findChatRoom === void 0 ? void 0 : findChatRoom.success)) {
                    const createChatRoom = yield this.roomRepository.createChatRoom(senderId, receiverId);
                    if (createChatRoom.success)
                        findChatRoom = createChatRoom;
                }
                if (!findChatRoom.room)
                    return { success: false, message: "Failed to create or find the room" };
                const newMessage = yield this.messageRepository.createNewMessage(senderId, receiverId, message);
                console.log(newMessage);
                if (newMessage.success) {
                    const addNewMessageIdtoRoom = yield this.roomRepository.addNewMessageId((_a = findChatRoom === null || findChatRoom === void 0 ? void 0 : findChatRoom.room) === null || _a === void 0 ? void 0 : _a._id, newMessage.message._id);
                    if (addNewMessageIdtoRoom) {
                        const receiverSocketId = (0, socket_1.getReceiverSocketId)(receiverId);
                        const senderSocketId = (0, socket_1.getReceiverSocketId)(senderId);
                        if (receiverSocketId) {
                            __1.io.to(receiverSocketId).emit("newMessage", newMessage.message);
                        }
                        if (senderSocketId)
                            __1.io.to(senderSocketId).emit("messageSended", {});
                    }
                    return { success: true, data: newMessage.message };
                }
                return { success: false, message: newMessage.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    sendGroupMessage(roomId, senderId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                console.log("recieved message usecase");
                let findChatRoom = yield this.roomRepository.findChatRoomById(roomId);
                if (!(findChatRoom === null || findChatRoom === void 0 ? void 0 : findChatRoom.room))
                    return { success: false, message: "Failed to create or find the room" };
                const newMessage = yield this.messageRepository.createGroupChatMessage(senderId, message);
                console.log(newMessage);
                if (newMessage.success) {
                    const addNewMessageIdtoRoom = yield this.roomRepository.addNewMessageId((_a = findChatRoom === null || findChatRoom === void 0 ? void 0 : findChatRoom.room) === null || _a === void 0 ? void 0 : _a._id, newMessage.message._id);
                    if (addNewMessageIdtoRoom) {
                        (_b = findChatRoom === null || findChatRoom === void 0 ? void 0 : findChatRoom.room) === null || _b === void 0 ? void 0 : _b.participants.forEach((participantId) => {
                            const receiverSocketId = (0, socket_1.getReceiverSocketId)(participantId);
                            if (receiverSocketId) {
                                __1.io.to(receiverSocketId).emit("newGroupMessage", { message: newMessage.message, roomId });
                            }
                        });
                        const senderSocketId = (0, socket_1.getReceiverSocketId)(senderId);
                        if (senderSocketId)
                            __1.io.to(senderSocketId).emit("messageSended", {});
                    }
                    return { success: true, data: newMessage.message };
                }
                return { success: false, message: newMessage.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getMessage(senderId, userToChat) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("recieved get message usecase");
                let findChatRoom = yield this.roomRepository.getAllMessages(senderId, userToChat);
                console.log('messages', findChatRoom);
                if (findChatRoom === null || findChatRoom === void 0 ? void 0 : findChatRoom.success) {
                    return { success: true, data: findChatRoom.room };
                }
                return { success: false, message: findChatRoom === null || findChatRoom === void 0 ? void 0 : findChatRoom.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getMessagesByRoom(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("recieved get message usecase");
                let findChatRoom = yield this.roomRepository.getMessagesByRoom(roomId);
                if (findChatRoom === null || findChatRoom === void 0 ? void 0 : findChatRoom.success) {
                    return { success: true, data: findChatRoom.room };
                }
                return { success: false, message: findChatRoom === null || findChatRoom === void 0 ? void 0 : findChatRoom.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getRecentChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let findChatRoom = yield this.roomRepository.getRecentChats(userId);
                if (findChatRoom === null || findChatRoom === void 0 ? void 0 : findChatRoom.success) {
                    const userIds = new Set();
                    findChatRoom.chatRooms.forEach((room) => {
                        room.participants.forEach(participant => {
                            if (participant.toString() !== userId) {
                                userIds.add(participant.toString());
                            }
                        });
                    });
                    const userDetails = yield this.userRepository.getUserDetailsFromArray(Array.from(userIds));
                    // console.log('userDeails :',userDetails)
                    if (userDetails === null || userDetails === void 0 ? void 0 : userDetails.success) {
                        // Combine chat rooms with user details
                        const roomsWithUserDetails = findChatRoom.chatRooms.map((room) => {
                            const participantsDetails = room.participants
                                .filter((participant) => participant.toString() != userId)
                                .map((participant) => userDetails.users.find((user) => user._id.toString() === participant.toString()))
                                .filter((participant) => participant !== undefined); // Filter out undefined values
                            return {
                                room,
                                participantsDetails
                            };
                        });
                        console.log('roomwith', roomsWithUserDetails);
                        return { success: true, data: roomsWithUserDetails };
                    }
                    return { success: false, message: "Something went wrong" };
                }
                return { success: false, message: findChatRoom === null || findChatRoom === void 0 ? void 0 : findChatRoom.message };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: 'Something went wrong' };
            }
        });
    }
    deleteMessage(senderId, receiverId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("recieved delete message usecase");
                let findChatRoom = yield this.roomRepository.findChatRoom(senderId, receiverId);
                if (!(findChatRoom === null || findChatRoom === void 0 ? void 0 : findChatRoom.success)) {
                    return { success: false, message: "Chat doesn't exists" };
                }
                const deleteMessage = yield this.messageRepository.deleteMessage(senderId, receiverId, messageId);
                console.log(deleteMessage);
                if (deleteMessage.success) {
                    //  const removeMessageIdtoRoom = await this.roomRepository.removeMessageId(findChatRoom?.room?._id,deleteMessage.data._id)
                    //  if(removeMessageIdtoRoom){
                    const receiverSocketId = (0, socket_1.getReceiverSocketId)(receiverId);
                    if (receiverSocketId) {
                        console.log('delete', deleteMessage.data);
                        __1.io.to(receiverId).emit("deletedMessage", messageId);
                    }
                    //  }
                    return { success: true, data: deleteMessage.data };
                }
                return { success: false, message: deleteMessage.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    editMessage(senderId, receiverId, messageId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("recieved edit message usecase");
                let findChatRoom = yield this.roomRepository.findChatRoom(senderId, receiverId);
                if (!(findChatRoom === null || findChatRoom === void 0 ? void 0 : findChatRoom.success)) {
                    return { success: false, message: "Chat doesn't exists" };
                }
                const editMessage = yield this.messageRepository.editMessage(senderId, receiverId, messageId, message);
                console.log(editMessage);
                if (editMessage.success) {
                    const receiverSocketId = (0, socket_1.getReceiverSocketId)(receiverId);
                    if (receiverSocketId) {
                        console.log('edited', editMessage.data);
                        __1.io.to(receiverId).emit("editedMessage", editMessage.data);
                    }
                }
                return { success: true, data: editMessage.data };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findMessageById(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findMessgage = yield this.messageRepository.findMessageById(messageId);
                if (findMessgage.success) {
                    return { success: true, data: findMessgage.data };
                }
                return { success: false, message: findMessgage === null || findMessgage === void 0 ? void 0 : findMessgage.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    unReadedMessages(roomId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findMessgage = yield this.roomRepository.unReadedMessages(roomId, userId);
                if (findMessgage.success) {
                    return { success: true, data: findMessgage.data };
                }
                return { success: false, message: findMessgage === null || findMessgage === void 0 ? void 0 : findMessgage.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    markMessageAsRead(userId, selectedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const markAsRead = yield this.roomRepository.markMessageAsRead(userId, selectedUserId);
                if (markAsRead.success) {
                    const receiverSocketId = (0, socket_1.getReceiverSocketId)(userId);
                    __1.io.to(receiverSocketId).emit("messagesMarkedAsRead", {});
                    return { success: true, data: markAsRead.data };
                }
                return { success: false, message: markAsRead === null || markAsRead === void 0 ? void 0 : markAsRead.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    createGroupChat(userId, groupName, participants) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createGroupChat = yield this.roomRepository.createGroupChat(userId, groupName, participants);
                console.log('crate group chat useCase ', createGroupChat);
                if (createGroupChat.success) {
                    const receiverSocketId = (0, socket_1.getReceiverSocketId)(userId);
                    __1.io.to(receiverSocketId).emit("newGroupChatCreated", {});
                    return { success: true, data: createGroupChat === null || createGroupChat === void 0 ? void 0 : createGroupChat.data };
                }
                return { success: false, message: createGroupChat === null || createGroupChat === void 0 ? void 0 : createGroupChat.message };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = ChatUseCase;
