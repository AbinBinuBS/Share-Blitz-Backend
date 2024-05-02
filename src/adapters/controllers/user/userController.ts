// import adminUseCase from "../../useCase/adminUseCase";


import { Request, Response } from "express";
import userUseCase from "../../../application/useCase/user/userUseCase";
import { UserRequestModel } from "../../../domain/entities/user";


class productController {
    private userCase : userUseCase
    constructor(userCase: userUseCase){
        this.userCase = userCase;
    }
    async createUser(req:Request , res: Response) {
        try {
            const userData = await this.userCase.createUser(req?.body as UserRequestModel)
            if(userData.success) {
               return res.status(201).send(userData)
            }
            return res.status(500).send(userData)
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }
    // async addProduct(req: Request , res : Response) {
    //     try {
    //         const {name ,description} = req.body;
    //         console.log("worked controller :",req.body)
    //         const product = await this.productCase.addProduct(name,description)
    //         if(product){
    //         return res.status(201).send(product)
    //         }
    //     } catch(error) {
    //         res.status(500).send('Something went wrong')
    //     }
    // }
    // async getAllProduct( req:Request,res : Response) {
    //     try{
    //         const productData = await this.productCase.getAllProduct()
    //         if(productData) {
    //             return res.status(200).send(productData)
    //         }
    //     } catch(error){
    //         console.log(error)
    //     }
    // }
    // async getSingleProduct (req : Request ,res:Response) {
    //     try {
    //         console.log("get single product worked in controller")
    //         console.log(req.query)
    //         const singleProductData = await this.productCase.getSingleProduct( req?.query?.name as string)
    //         console.log('singleProductData :',singleProductData)
    //         if(singleProductData.success) {
    //             return res.status(200).send(singleProductData)
    //         }
    //         return res.status(500).send(singleProductData)
    //     } catch(error) {
    //         res.status(500).send('Something went wrong')
    //         console.log(error)
    //     }
    // }
}


export default productController;
