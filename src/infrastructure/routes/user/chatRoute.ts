
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

router.get('/messages/getAllMessages/:id',userAuth,(req, res,next:NextFunction) => { controller.getMessage(req, res,next) });
router.post('/messages/send/:id',userAuth,(req, res,next:NextFunction) => { controller.sendMessage(req, res,next) });
router.get('/recentChats',userAuth,(req, res,next:NextFunction) => { controller.getRecentChatedUsers(req, res,next) });
router.delete('/messages/deleteMessage',userAuth,(req, res,next:NextFunction) => { controller.deleteMessage(req, res,next) });
router.patch('/messages/editMessage',userAuth,(req, res,next:NextFunction) => { controller.editMessage(req, res,next) });


// router.get('/getAllPosts', adminAuth,(req, res) => { controller.getAllPosts(req, res) });
// router.get('/getUserById', (req, res) => { controller.getUser(req, res) });
// router.get('/getAllReportedPosts', adminAuth, (req, res) => { controller.getAllReportedPosts(req, res) });
// router.get('/getReportsByPostId', adminAuth, (req, res) => { controller.getReportsByPostId(req, res) });
// router.get('/getPostById',adminAuth, (req, res) => { controller.getPostById(req, res) });
// router.patch('/toogleUserStatus',adminAuth, (req, res) => { controller.toogleUserStatus(req, res) });
// router.patch('/tooglePostIsBlocked',adminAuth, (req, res) => { controller.tooglePostIsBlocked(req, res) });
// router.patch('/changeActionStatus',adminAuth, (req, res) => { controller.changeActionStatus(req, res) });
// router.patch('/approveVerificationRequest',adminAuth, (req, res) => { controller.approveVerificationRequest(req, res) });
// router.delete('/deletePost',adminAuth, (req, res) => { controller.deletePost(req, res) });
// router.get('/getVerificationData', adminAuth, (req, res) => { controller.getVerificationData(req, res) });



export default router   