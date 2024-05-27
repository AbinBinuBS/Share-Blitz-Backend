
import express from "express"
import postController from '../../../adapters/controllers/user/postController'
import postRepository from '../../database/repositories/user/postRepository'
import PostUseCase from '../../../application/useCase/user/postUseCase'
import JWTtoken from "../../utils/helpers/jwtToken"
import hashPassword from "../../utils/helpers/hashPassword"
import userAuth from "../../middleware/authMiddleware"
import { CustomRequest } from "../../../domain/interface/controllers/userControllerInterface"

const repository = new postRepository()
const jwt = new JWTtoken()
const hashedPassword = new hashPassword()

const postCase = new PostUseCase(repository,jwt,hashedPassword)
const controller = new postController(postCase) 

const router = express.Router()

// router.post('/createUser', (req, res) => {controller.createUser(req, res) });
router.post('/createpost', userAuth, (req, res) => {controller.createPost(req, res) });
router.get('/getAllPosts',userAuth, (req , res) => { controller.getAllPosts(req, res) });

router.get('/getUserPosts',userAuth, (req :CustomRequest, res ) => { controller.getUserPosts(req, res) });
// router.patch('/savePost',userAuth, (req :CustomRequest, res ) => { controller.savePost(req, res) });

router.post('/likePost',userAuth, (req, res) => { controller.likePost(req, res) });
router.delete('/unlikePost',userAuth, (req, res) => { controller.unlikePost(req, res) });
router.post('/commentOnPost',userAuth, (req, res) => { controller.commentOnPost(req, res) });



export default router  