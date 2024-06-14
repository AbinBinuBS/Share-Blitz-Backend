
import express from "express"
import { Response } from "express"
import { CustomRequest } from "../../../domain/interface/controllers/userControllerInterface"
import userController from '../../../adapters/controllers/user/authController'
import userRepository from '../../database/repositories/user/userRepository'
import UserUseCase from '../../../application/useCase/user/userUseCase'
import JWTtoken from "../../utils/helpers/jwtToken"
import hashPassword from "../../utils/helpers/hashPassword"
import { RequestWithUserId } from "../../../domain/interface/controllers/userControllerInterface"
import userAuth from "../../middleware/authMiddleware"
import VerificationRepository from "../../database/repositories/user/verificationRepository"
const userRepo = new userRepository()
const verificationRepo = new VerificationRepository()
const jwt = new JWTtoken
const hashedPassword = new hashPassword()

const userCase = new UserUseCase(userRepo,verificationRepo,jwt,hashedPassword)
const controller = new userController(userCase)

const router = express.Router()

// router.post('/createUser', (req, res) => {controller.createUser(req, res) });
router.post('/createUser', (req, res) => { controller.sendOtp(req, res) });
router.post('/verifyOtp', (req, res) => { controller.verifyOtp(req, res) });
router.post('/login', (req, res) => { controller.login(req, res) });
router.post('/gsignup', (req, res) => { controller.Gsignup(req, res) });
router.post('/glogin', (req, res) => { controller.Glogin(req, res) });
router.get('/getUser', (req, res) => { controller.getUser(req, res) });
router.post('/resendOtp', (req, res) => { controller.resendOtp(req, res) });


router.patch('/editProfile',userAuth, (req :CustomRequest, res :Response) => { controller.editProfile(req, res) });

 


export default router 