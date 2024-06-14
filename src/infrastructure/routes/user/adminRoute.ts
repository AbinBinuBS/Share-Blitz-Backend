
import express from "express"
import postController from '../../../adapters/controllers/user/postController'
import adminController from '../../../adapters/controllers/admin/adminController'
import postRepository from '../../database/repositories/user/postRepository'
import userRepository from '../../database/repositories/user/userRepository'
import ReportRepository from "../../database/repositories/user/reportRepository"
import PostUseCase from '../../../application/useCase/user/postUseCase'
import AdminUseCase from '../../../application/useCase/admin/adminUseCase'
import JWTtoken from "../../utils/helpers/jwtToken"
import hashPassword from "../../utils/helpers/hashPassword"
import { adminAuth } from "../../middleware/authMiddleware"
import VerificationRepository from "../../database/repositories/user/verificationRepository"
const repositoryPost = new postRepository()
const repositoryUser = new userRepository()
const repositoryReports= new ReportRepository()
const repositoryVerification= new VerificationRepository()
const jwt = new JWTtoken()
const hashedPassword = new hashPassword()
 
const adminCase = new AdminUseCase(repositoryPost,repositoryUser,repositoryReports,repositoryVerification,jwt,hashedPassword)
const controller = new adminController(adminCase) 

const router = express.Router()

router.get('/getAllUsers', adminAuth,(req, res) => { controller.getAllUsers(req, res) });
router.get('/getUserById', (req, res) => { controller.getUser(req, res) });
router.get('/getAllReportedPosts', adminAuth, (req, res) => { controller.getAllReportedPosts(req, res) });
router.get('/getPostById',adminAuth, (req, res) => { controller.getPostById(req, res) });
router.patch('/toogleUserStatus',adminAuth, (req, res) => { controller.toogleUserStatus(req, res) });
router.patch('/changeActionStatus',adminAuth, (req, res) => { controller.changeActionStatus(req, res) });
router.patch('/approveVerificationRequest',adminAuth, (req, res) => { controller.approveVerificationRequest(req, res) });
router.delete('/deletePost',adminAuth, (req, res) => { controller.deletePost(req, res) });
router.get('/getVerificationData', adminAuth, (req, res) => { controller.getVerificationData(req, res) });



export default router   