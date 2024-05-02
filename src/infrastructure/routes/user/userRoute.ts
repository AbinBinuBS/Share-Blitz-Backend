
import express from "express"
import userController from '../../../adapters/controllers/user/userController'
import userRepository from '../../database/repositories/user/userRepository'
import UserUseCase from '../../../application/useCase/user/userUseCase'
const repository = new userRepository()


const productCase = new UserUseCase(repository)
const controller = new userController(productCase)

const router = express.Router()

router.post('/createUser', (req, res) => { controller.createUser(req, res) });
// router.get('/getSingleProduct',(req,res)=>{controller.getSingleProduct(req,res)})
// router.get('/p',(req,res)=>{controller.getSingleProduct(req,res)})
// router.get('/getAllProducts',(req,res)=> {controller.getAllProduct(req,res)})  


export default router