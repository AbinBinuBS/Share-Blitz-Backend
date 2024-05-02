"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../../../adapters/controllers/user/userController"));
const userRepository_1 = __importDefault(require("../../database/repositories/user/userRepository"));
const userUseCase_1 = __importDefault(require("../../../application/useCase/user/userUseCase"));
const repository = new userRepository_1.default();
const productCase = new userUseCase_1.default(repository);
const controller = new userController_1.default(productCase);
const router = express_1.default.Router();
router.post('/createUser', (req, res) => { controller.createUser(req, res); });
// router.get('/getSingleProduct',(req,res)=>{controller.getSingleProduct(req,res)})
// router.get('/p',(req,res)=>{controller.getSingleProduct(req,res)})
// router.get('/getAllProducts',(req,res)=> {controller.getAllProduct(req,res)})  
exports.default = router;
