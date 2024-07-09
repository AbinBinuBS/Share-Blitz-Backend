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
exports.getReceiverSocketId = void 0;
const userSocketMap = {}; // {userId : socketId}
const notificationRepository_1 = __importDefault(require("../database/repositories/user/notificationRepository"));
const NotificationRepo = new notificationRepository_1.default();
const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};
exports.getReceiverSocketId = getReceiverSocketId;
const socketConfiguration = (io) => __awaiter(void 0, void 0, void 0, function* () {
    io.on("connection", (socket) => {
        console.log("connected to :", socket.id);
        // current user details 
        const userId = socket.handshake.query.userId;
        console.log(userId);
        if (userId && userId !== "undefined") {
            userSocketMap[userId] = socket.id;
        }
        console.log('socket ....', userSocketMap);
        const receiverSocketId = (0, exports.getReceiverSocketId)(userId);
        io.to(receiverSocketId).emit('connected', userId);
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        // io.emit("newMessage",Object.keys(userSocketMap))
        console.log("emited users keys", Object.keys(userSocketMap));
        socket.on('message-page', (userId) => {
            console.log('Message page :', userId);
        });
        socket.on('typing', (senderId) => {
            console.log('typing', senderId);
            const receiverSocketId = (0, exports.getReceiverSocketId)(senderId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('typing', userId);
            }
        });
        socket.on('stoppedTyping', (senderId) => {
            console.log('stopped yping', senderId);
            const receiverSocketId = (0, exports.getReceiverSocketId)(senderId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('stoppedTyping', userId);
            }
        });
        socket.on('fetchRecentChats', (senderId) => {
            console.log('fetch recent chats');
            const receiverSocketId = (0, exports.getReceiverSocketId)(senderId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('stoppedTyping', userId);
            }
        });
        socket.on('createNotification', (data) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(' create ntificaions chats', data);
            const res = yield NotificationRepo.createNotification({ type: data.type, senderId: data.senderId, userId, message: "You have a one new message" });
            console.log('res', res);
            if (res.success) {
                const receiverSocketId = (0, exports.getReceiverSocketId)(userId);
                io.to(receiverSocketId).emit('newNotification', res.data);
            }
        }));
        //////////////// VIDEO CALL///////////////////
        socket.on('callUser', ({ userToCall, signalData, from, name }) => {
            console.log(' call user received ', userToCall, from, name);
            const receiverSocketId = (0, exports.getReceiverSocketId)(userToCall);
            io.to(receiverSocketId).emit('callFromUser', { signal: signalData, from, name });
        });
        socket.on('answerCall', (data) => {
            console.log("answered call", data.to);
            const receiverSocketId = (0, exports.getReceiverSocketId)(data.to);
            io.to(receiverSocketId).emit('answeredCall', data.signal);
        });
        socket.on('callEnded', (data) => {
            console.log(" call ended", data);
            const receiverSocketId = (0, exports.getReceiverSocketId)(data.userId);
            io.to(receiverSocketId).emit('callEnded');
        });
        //////////////// END ///////////////////
        socket.join(userId);
        socket.on('disconnect', () => {
            console.log('user disconnected', userId);
            if (userId && userId !== "undefined") {
                delete userSocketMap[userId];
            }
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    });
});
exports.default = socketConfiguration;
