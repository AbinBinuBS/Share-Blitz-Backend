
import express from "express"
import postController from '../../../adapters/controllers/user/postController'
import adminController from '../../../adapters/controllers/admin/adminController'
import postRepository from '../../database/repositories/user/postRepository'
import userRepository from '../../database/repositories/user/userRepository'
import PostUseCase from '../../../application/useCase/user/postUseCase'
import AdminUseCase from '../../../application/useCase/admin/adminUseCase'
import JWTtoken from "../../utils/helpers/jwtToken"
import hashPassword from "../../utils/helpers/hashPassword"
const repositoryPost = new postRepository()
const repositoryUser = new userRepository()
const jwt = new JWTtoken()
const hashedPassword = new hashPassword()

const adminCase = new AdminUseCase(repositoryPost,repositoryUser,jwt,hashedPassword)
const controller = new adminController(adminCase) 

const router = express.Router()

router.get('/getAllUsers', (req, res) => { controller.getAllUsers(req, res) });
router.patch('/toogleUserStatus', (req, res) => { controller.toogleUserStatus(req, res) });
 


export default router   