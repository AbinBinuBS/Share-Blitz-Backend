
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
router.get('/getPostById',userAuth, (req , res) => { controller.getPostById(req, res) });
router.delete('/deletePost',userAuth, (req, res) => { controller.deletePost(req, res) });

router.get('/getCommentReplys',userAuth, (req , res) => { controller.getCommentReplys(req, res) });
router.post('/replyToComment',userAuth, (req , res) => { controller.addReply(req, res) });
router.post('/commentOnPost',userAuth, (req, res) => { controller.commentOnPost(req, res) });
router.delete('/deleteComment',userAuth, (req, res) => { controller.deleteComment(req, res) });


router.get('/getUserPosts',userAuth, (req :CustomRequest, res ) => { controller.getUserPosts(req, res) });
router.patch('/editPost',userAuth, (req :CustomRequest, res ) => { controller.editPost(req, res) });

router.post('/likePost',userAuth, (req, res) => { controller.likePost(req, res) });
router.delete('/unlikePost',userAuth, (req, res) => { controller.unlikePost(req, res) });

router.get('/getSavedPosts',userAuth, (req :CustomRequest, res ) => { controller.getSavedPosts(req, res) });
router.get('/getTaggedPosts',userAuth, (req :CustomRequest, res ) => { controller.getTaggedPosts(req, res) });

router.post('/savePost',userAuth, (req, res) => { controller.savePost(req, res) });
router.delete('/unSavePost',userAuth, (req, res) => { controller.unSavePost(req, res) });

router.delete('/unSave',userAuth, (req, res) => { controller.unSavePost(req, res) });
router.post('/reportPost',userAuth, (req, res) => { controller.reportPost(req, res) });
router.patch('/blockPost',userAuth, (req, res) => { controller.blockPost(req, res) });



export default router  