
import express from "express"
import postController from '../../../adapters/controllers/user/postController'
import postRepository from '../../database/repositories/user/postRepository'
import PostUseCase from '../../../application/useCase/user/postUseCase'
import JWTtoken from "../../utils/helpers/jwtToken"
import hashPassword from "../../utils/helpers/hashPassword"
import userAuth from "../../middleware/authMiddleware"

const repository = new postRepository()
const jwt = new JWTtoken()
const hashedPassword = new hashPassword()

const postCase = new PostUseCase(repository,jwt,hashedPassword)
const controller = new postController(postCase) 

const router = express.Router()

// router.post('/createUser', (req, res) => {controller.createUser(req, res) });
router.post('/createpost', userAuth, (req, res) => {controller.createPost(req, res) });
router.get('/getAllPosts',userAuth, (req, res) => { controller.getAllPosts(req, res) });



export default router  