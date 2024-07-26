
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
import NotificationRepository from "../../database/repositories/user/notificationRepository"
import NotificationUseCase from "../../../application/useCase/user/notificationUseCase"
import notificationController from "../../../adapters/controllers/user/notificationController"
const repositoryNotification = new NotificationRepository()

const jwt = new JWTtoken()
const hashedPassword = new hashPassword()

const io = new Server();
socketConfiguration(io);
 
const notificationUseCase = new NotificationUseCase(repositoryNotification)
const controller = new notificationController(notificationUseCase)

const router = express.Router()

router.get('/',userAuth,(req, res,next:NextFunction) => { controller.getNotifications(req, res,next) });
router.post('/',userAuth,(req, res,next:NextFunction) => { controller.createNotification(req, res,next) });
router.get('/:id',userAuth,(req, res,next:NextFunction) => { controller.getNotificationById(req, res,next) });
router.patch('/toogleSeen',userAuth,(req, res,next:NextFunction) => { controller.toggleSeen(req, res,next) });


export default router   