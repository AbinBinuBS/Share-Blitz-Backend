
import express from "express"
import userController from '../../../adapters/controllers/user/userController'
import postRepository from '../../database/repositories/user/postRepository'
import UserRepository from "../../database/repositories/user/userRepository"
import PostUseCase from '../../../application/useCase/user/postUseCase'
import UserUseCase from "../../../application/useCase/user/userUseCase"
import ConnectionUseCase from "../../../application/useCase/user/connectionUseCase"
import JWTtoken from "../../utils/helpers/jwtToken"
import hashPassword from "../../utils/helpers/hashPassword"
import userAuth from "../../middleware/authMiddleware"
import ConnectionRepository from "../../database/repositories/user/connectionRepository"
import VerificationRepository from "../../database/repositories/user/verificationRepository"

const postRepo = new postRepository()
const userRepo = new UserRepository()
const verificationRepo = new VerificationRepository()
const connectionRepo = new ConnectionRepository()
const jwt = new JWTtoken()
const hashedPassword = new hashPassword()

const postCase = new PostUseCase(postRepo,jwt,hashedPassword)
const userCase = new UserUseCase(userRepo,verificationRepo,jwt,hashedPassword)
const connectionUseCase = new ConnectionUseCase(postRepo,userRepo,connectionRepo,jwt,hashedPassword)
const controller = new userController(connectionUseCase,userCase) 

const router = express.Router()


router.post('/followUser',userAuth, (req, res) => { controller.followUser(req, res) });
router.delete('/unFollowUser',userAuth, (req, res) => { controller.unFollowUser(req, res) });
router.get('/getConnections',userAuth, (req, res) => { controller.getConnections(req, res) });
router.get('/checkIsFriend',userAuth, (req, res) => { controller.checkIsFriend(req, res) });
router.get('/searchUser',userAuth, (req, res) => { controller.searchUser(req, res) });
router.patch('/changePrivacy',userAuth, (req, res) => { controller.changePrivacy(req, res) });


router.get('/isRequestedVerification',userAuth, (req, res) => { controller.isRequestedVerification(req, res) });
router.post('/submitVerification',userAuth, (req, res) => { controller.submitVerification(req, res) });
router.patch('/submitPaymentDetails',userAuth, (req, res) => { controller.updatePaymentDetails(req, res) });

export default router  