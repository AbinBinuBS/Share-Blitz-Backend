
import express from "express"
import userController from '../../../adapters/controllers/user/userController'
import userRepository from '../../database/repositories/user/userRepository'
import UserUseCase from '../../../application/useCase/user/userUseCase'
import JWTtoken from "../../utils/helpers/jwtToken"
const repository = new userRepository()
const jwt = new JWTtoken

const userCase = new UserUseCase(repository,jwt)
const controller = new userController(userCase)

const router = express.Router()

// router.post('/createUser', (req, res) => {controller.createUser(req, res) });
router.post('/createUser', (req, res) => { controller.sendOtp(req, res) });
router.post('/verifyOtp', (req, res) => { controller.verifyOtp(req, res) });
// router.get('/getSingleProduct',(req,res)=>{controller.getSingleProduct(req,res)})
// router.get('/p',(req,res)=>{controller.getSingleProduct(req,res)})
// router.get('/getAllProducts',(req,res)=> {controller.getAllProduct(req,res)})  


export default router