
import express, { NextFunction } from "express"
import chatController from "../../../adapters/controllers/user/chatController"
import userRepository from '../../database/repositories/user/userRepository'
import ChatRoomRepository from "../../database/repositories/user/chatRoomRepository"
import ChatMessageRepository from "../../database/repositories/user/chatMessageRepository"
import ChatUseCase from "../../../application/useCase/user/chatUseCase"
import JWTtoken from "../../utils/helpers/jwtToken"
import hashPassword from "../../utils/helpers/hashPassword"
import userAuth, { adminAuth } from "../../middleware/authMiddleware"
import { Server } from "socket.io"
import socketConfiguration from "../../Socket/socket"
const repositoryUser = new userRepository()
const repositoryRoom = new ChatRoomRepository()
const repositoryMessage = new ChatMessageRepository()
const jwt = new JWTtoken()
const hashedPassword = new hashPassword()

const io = new Server();
socketConfiguration(io);
 
const chatUseCase = new ChatUseCase(repositoryUser,repositoryRoom,repositoryMessage,jwt,hashedPassword,io)
const controller = new chatController(chatUseCase)

const router = express.Router()

router.get('/recentChats',userAuth,(req, res,next:NextFunction) => { controller.getRecentChatedUsers(req, res,next) });
router.get('/messages/:id',(req, res,next:NextFunction) => { controller.findMessageById(req, res,next) });
router.get('/messages/getAllMessages/:id',userAuth,(req, res,next:NextFunction) => { controller.getMessage(req, res,next) });
router.post('/messages/send/:id',userAuth,(req, res,next:NextFunction) => { controller.sendMessage(req, res,next) });
router.delete('/messages/deleteMessage',userAuth,(req, res,next:NextFunction) => { controller.deleteMessage(req, res,next) });
router.patch('/messages/editMessage',userAuth,(req, res,next:NextFunction) => { controller.editMessage(req, res,next) });
router.patch('/messages/markAsRead/:selectedUserId',userAuth,(req, res,next:NextFunction) => { controller.markMessageAsRead(req, res,next) });
router.get('/messages/unReadedMessages/:roomId',userAuth,(req, res,next:NextFunction) => { controller.unReadedMessages(req, res,next) });

router.post('/groupChat',userAuth,(req, res,next:NextFunction) => { controller.CreateGroupChat(req, res,next) });
router.post('/groupMessage/:roomId',userAuth,(req, res,next:NextFunction) => { controller.SendGroupMessage(req, res,next) });
router.get('/messages/getAllMessagesByRoom/:roomId',userAuth,(req, res,next:NextFunction) => { controller.GetMessagesByRoom(req, res,next) });
router.patch('/groupChat/removeParticipants',userAuth,(req, res,next:NextFunction) => { controller.RemoveParticipantsFromGroupChat(req, res,next) });



export default router   