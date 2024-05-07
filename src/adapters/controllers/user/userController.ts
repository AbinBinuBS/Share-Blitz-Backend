// import adminUseCase from "../../useCase/adminUseCase";

import IJwtToken from "../../../application/useCase/interface/user/jwtInterface";

import { Request, Response, response } from "express";
import userUseCase from "../../../application/useCase/user/userUseCase";
import { Otp, UserLogin, UserRequestModel } from "../../../domain/entities/user";
import jwt from 'jsonwebtoken'

class productController {
    private userCase : userUseCase
    constructor(userCase: userUseCase){
        this.userCase = userCase;
    }
    async createUser(req:Request , res: Response) {
        try {
            console.log('create user controller worked')

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

    async verifyOtp(req:Request , res: Response) {
        try {
            console.log('verify otp controller worked')
            console.log(req.body)
            console.log(req.headers)
            let token = req.headers.authorization?.split(' ')[1] as string ;
             
            const response = await this.userCase.VerifyOtp(token,req?.body.otp as Otp) 
            console.log('console response ',response)
            if(response?.success) {
               return res.status(201).send(response)
            }
            return res.status(200).send(response)
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async sendOtp(req:Request,res:Response ): Promise<any> {
        try {
            console.log('send otp controller worked')

            const {user} = req.body
            console.log(req.body)
            const responseData : any = await this.userCase.sendOtp(req.body as UserRequestModel)
            if(responseData.userExists)
              return  res.status(409).send({success:false,message:'User already exists'})
          
            if(responseData.success){
                const token = responseData?.data.token;
                console.log("sendotp controller token:",token)
               return res.status(200).json({success: true ,token:token})
            } else {
               return  res.status(409).json({success:false,message:'something went wrong !'})
            }
        
          
            // return res.status(200).send(data)
        } catch (error) {
            console.log(error)
        }
    }

    async login(req:Request,res:Response) : Promise <any> {
        try {
            console.log("Login in controller worked")
            const {email,password} = req.body
            if(!email || !password)
                return res.status(200).json({success:false,message:"Email and Password are required"})

            const responseData : any = await this.userCase.login(req.body as UserLogin)
            if(responseData?.success){
                res.cookie("userToken", responseData.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                  });
               return res.status(200).json({success:true,token:responseData.token,user:responseData.user})
            } else {
                return res.status(200).json({success:false,message:responseData?.message})
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({message:"Internal server error!"})
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
