// import adminUseCase from "../../useCase/adminUseCase";
import { CustomRequest } from "../../../domain/interface/controllers/userControllerInterface";
import IJwtToken from "../../../application/useCase/interface/user/jwtInterface";

import { Request, Response, response } from "express";
import userUseCase from "../../../application/useCase/user/userUseCase";
import { Otp, UserLogin, UserRequestModel } from "../../../domain/entities/user";
import jwt from 'jsonwebtoken'

import { RequestWithUserId } from "../../../domain/interface/controllers/userControllerInterface";
import sendEmail from "../../../infrastructure/utils/helpers/NodeMailer";
import asyncHandlers from "../../../infrastructure/utils/handlers/asyncHandlers";
import ApiError from "../../../infrastructure/utils/handlers/ApiError";
import UserModel from "../../../infrastructure/database/models/userModel";
import ApiResponse from "../../../infrastructure/utils/handlers/ApiResponse";
import { generateAccessAndRefreshTokens } from "../../../domain/services/TokenGeneration";


class userController {
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

    async resendOtp(req:Request,res:Response ): Promise<any> {
        try {
            console.log('re send otp controller worked')

          
            console.log(req.body)
            let token = req.headers.authorization?.split(' ')[1] as string ;
                console.log('token conteoller :---------',token)
            const responseData : any = await this.userCase.resendOtp(token)
            console.log("response data ;",responseData)
            // if(responseData.userExists)
            //   return  res.status(409).send({success:false,message:'User already exists'})
          
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
            console.log(req.body)
            const {email,password} = req.body
            if(!email || !password)
                return res.status(200).json({success:false,message:"Email and Password are required"})

            const responseData : any = await this.userCase.login(req.body as UserLogin)
            console.log("logind response",responseData)
            if(responseData?.success){
                const options = {
                            httpOnly:true,    
                            secure:true
                        }
                return res.status(200)
                .cookie("accessToken",responseData.accessToken,options)
                .cookie("refreshToken",responseData.refreshToken,options)
                .json(new ApiResponse (200,{success:true,user : responseData.user ,accessToken: responseData.accessToken,refreshToken:responseData.refreshToken},"login sucessfully"))
                // res.cookie("userToken", responseData.token, {
                //     expires: new Date(Date.now() + 25892000000),
                //     httpOnly: true,
                //   });
            //    return res.status(200).json({success:true,token:responseData.token,user:responseData.user})
            } else {
                return res.status(200).json({   statusCode: 200,
                    data: {
                        success: false,
                        message: responseData?.message || 'Unknown error'
                    },
                    message: responseData?.message || 'Unknown error',
                    success: false})
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({message:"Internal server error!"})
        }
    }

     

     async Gsignup (req : Request ,res:Response) {
        try {
            console.log("G signup worked in controller")
            console.log(req.body)
            const {name,userName,email,picture} = req.body
            const user = await this.userCase.Gsignup(name,userName, email, picture);
            if(user?.success){
                res.cookie("userToken", user.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                  });
               return res.status(200).json({success:true,token:user.token,user:user.user})
            } else {
                return res.status(200).json({success:false,message:user?.message})
            }
       
        } catch(error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async Glogin (req : Request ,res:Response) {
        try {
            console.log("G login worked in controller")
            console.log(req.body)
            const {email} = req.body
            const user = await this.userCase.Glogin( email);
            console.log('send dat g login;',user)
            if(user?.success){
                res.cookie("userToken", user.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                  });
               return res.status(200).json({success:true,token:user.token,user:user.user})
            } else {
                return res.status(200).json({success:false,message:user?.message})
            }
       
        } catch(error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }
    async getUser (req : Request ,res:Response) {
        try {
            console.log("Get user worked in controller")
            console.log(req.query)
            const {userId} = req.query
            const userData = await this.userCase.getUser(userId as string)
            // console.log(userData)
            if(!userData?.success)
                return res.status(200).json({success:false,message:'user not exists'})
                
                return res.status(200).json({success:true,user:userData.user})

          
       
        } catch(error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }


    async editProfile (req : CustomRequest ,res:Response) {
        try {
            console.log("Edit profile worked in controller")
            console.log(req?.userId)
            console.log(req.body)
            const  { userData } = req.body 
            const userId = req.userId
            const editUserProfile = await this.userCase.editUserProfile(userId as string,userData)
            console.log('response edit user profile :',editUserProfile)
            if(editUserProfile?.success){
            return res.status(200).json({success:true,userData:editUserProfile.data})
            }
            return res.status(200).json({success:false,message:editUserProfile?.message})
           
        } catch(error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async savePost (req : CustomRequest ,res:Response) {
        try {
            console.log("save post in controller")
            console.log(req.body)
            console.log(req.query)
            const {postId } = req.body
            const userId = req.userId
            const savePost = await this.userCase.savePost(userId as string,postId as string)
            // console.log('response get all posts profile :',getUserPosts)
            // if(getUserPosts?.success){
            // return res.status(200).json({success:true,userPosts:getUserPosts.data})
            // }
            // return res.status(200).json({success:false,message:getUserPosts?.message})
          
       
        } catch(error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    
    async sendForgetPasswordOtp (req : CustomRequest ,res:Response) {
        try {
            console.log("send otp in controller")
          
            const {email } = req.query
            const userId = req.userId
            if(! email )
                throw new ApiError(400,'email is required')
            const sendOtp = await this.userCase.sendOtpToEmail(email as string)
         
            if (sendOtp.success) {
                res.status(200).json(new ApiResponse(200,{token: sendOtp.token}, 'OTP sent successfully'));
              } else {
                throw new ApiError(400, sendOtp?.message || 'Failed to send OTP');
              }
        } 
        catch (error) {
           if (error instanceof ApiError) {
             res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
           } else {
             res.status(500).json(new ApiResponse(500, null, 'Something went wrong'));
           }
           console.error(error);
        }
    } 
    
    async verifyForgetPasswordOtp (req : CustomRequest ,res:Response) {
        try {
            console.log("verify otp in controller",req.body)
          
            const {token,otp } = req.body
            const userId = req.userId
            if(!token || !otp )
                throw new ApiError(400,'otp and token is required')
            const verifyOtp = await this.userCase.verifyForgetPasswordOtp(otp as string , token as string)
         
            if (verifyOtp.success) {
                res.status(200).json(new ApiResponse(200,{}, verifyOtp?.message));
              } else {
                  throw new ApiError(400, verifyOtp?.message);
            }
        } 
        catch (error) {
           if (error instanceof ApiError) {
             res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
           } else {
             res.status(500).json(new ApiResponse(500, null, 'Something went wrong'));
           }
           console.error(error);
        }
    }

    verifyForgetPassword = asyncHandlers(async (req: Request, res: Response) => {
        console.log("verify otp in controller",req.body)
          
        const {password,email } = req.body
        if ([password, email].some((field: string) => field?.trim() === "")) {
            throw new ApiError(400, 'All fields are required');
        }
      
        const verifyOtp = await this.userCase.verifyForgetPassword(email as string ,password as string)
     
        if (verifyOtp.success) {
            res.status(200).json(new ApiResponse(200,{}, verifyOtp?.message));
          } else {
              throw new ApiError(400, verifyOtp?.message);
        }
    });

    // async verifyForgetPassword1 (req : CustomRequest ,res:Response) {
    //     try {
    //         console.log("verify otp in controller",req.body)
          
    //         const {password,email } = req.body
    //         if(!password )
    //             throw new ApiError(400,'password is required')
    //         const verifyOtp = await this.userCase.verifyForgetPasswordOtp(email as string ,password as string)
         
    //         if (verifyOtp.success) {
    //             res.status(200).json(new ApiResponse(200,{}, verifyOtp?.message));
    //           } else {
    //               throw new ApiError(400, verifyOtp?.message);
    //         }
    //     } 
    //     catch (error) {
    //        if (error instanceof ApiError) {
    //          res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    //        } else {
    //          res.status(500).json(new ApiResponse(500, null, 'Something went wrong'));
    //        }
    //        console.error(error);
    //     }
    // }
   

}
export default userController;
