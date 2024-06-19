
import jwt from "jsonwebtoken";

import { generateOTP } from "../../../infrastructure/utils/helpers/GenerateOtp";
import { Otp, UserLogin, UserRequestModel } from "../../../domain/entities/user";
import IJwtToken from "../interface/user/jwtInterface";
// import IUserRepository from "../interface/user/userRepositoryInterface";
import UserRepositoryInterface from "../../../domain/interface/repositories/user/userRepositoryInterface";
import UserI from "../../../domain/entities/user";
import User from "../../../domain/interface/repositories/user/userInterface";
import { UserLoginType } from "../../../infrastructure/constants/userConstants";
import HashPasswordInterface from "../../../domain/interface/helpers/hashPasswordInterface";
import { GUserData } from "../../../domain/interface/repositories/user/userRepositoryInterface";
import { EditProfileUserDataInterface } from "../../../domain/interface/controllers/userControllerInterface";
import sendEmail from "../../../infrastructure/utils/helpers/NodeMailer";
import { VerificationRepositoryInterface } from "../../../domain/interface/repositories/user/verificationRepositoryInterface";
import { generateAccessAndRefreshTokens } from "../../../domain/services/TokenGeneration";
import ApiError from "../../../infrastructure/utils/handlers/ApiError";
class UserUseCase {
    private userRepository: UserRepositoryInterface;
    private verificationRepository :VerificationRepositoryInterface
    private jwtToken : IJwtToken
    private hashPassword :HashPasswordInterface

    constructor(
        userRepository: UserRepositoryInterface,
        verificationRepository: VerificationRepositoryInterface,
        jwtToken :IJwtToken,
        hashedPassword:HashPasswordInterface
    )  {
        this.userRepository = userRepository;
        this.verificationRepository = verificationRepository;
        this.jwtToken = jwtToken;
        this.hashPassword = hashedPassword;
    }

    async createUser(user:UserRequestModel)  {
       try {
            const product = await this.userRepository.createUser(user)
            return product
       } catch (error) {
        console.log(error)
       }
    }

    async VerifyOtp(token : string,otp:Otp)  {
        try {
             console.log('verify otp worked in repo :',otp)
             let decodedToken = this.jwtToken.verifyJwt(token)
             console.log('verify otp decodedtoken :',decodedToken)
             if(decodedToken){
                const { user, otpExpiration } = decodedToken;
                if (new Date() > new Date(otpExpiration)) {
                    return {success :false,message:'  OTP Expired !'}
                }
                if( otp == decodedToken.otp) {
                    console.log('otp match')
                    // const hashedPassword = decodedToken.user.password
                    const hashedPassword = await this.hashPassword.createHash(decodedToken.user.password)
                    decodedToken.user.password = hashedPassword;
                    
                    const saveUser = await this.userRepository.createUser(decodedToken.user)
                    if(saveUser.success) {
                        return {success:true,message : 'Registered Sucessfully'}
                        
                    } else 
                    return {success :false,message:'Internal server error!'}
                } else 
                return {success :false,message:' Incorrect OTP !'}
                 
             } else 
             return {success :false,message:'No token Try again!'}
            
            
        } catch (error) { 
         console.log(error)
        }
     }
     async sendOtp(user:any ): Promise<any> {
        try {
          
            const userExists = await this.userRepository.findByEmail(user.email)
            console.log(userExists)
             
            if(userExists){
                return {
                    success:false ,userExists:true
                }
            }
            let otp =generateOTP()
            console.log('generated otp ',otp)
            const sendEmaill = await sendEmail(user.email,otp)

            const otpExpiration = new Date();
                otpExpiration.setMinutes(otpExpiration.getMinutes() + 1);
            let token = jwt.sign(
                { user, otp ,otpExpiration},
                process.env.JWT_KEY as string,
                { expiresIn: "5m" }
              );
              console.log('token',token)
              let decodeToken = this.jwtToken.verifyJwt(token)
              console.log('decoded token',decodeToken)

            return {success:true,data:{data:false,token:token},userExists:false}
        } catch (error) {
            console.log(error)
        }
    }



    async resendOtp(userToken :string ): Promise<any> {
        try {
          
          

          console.log('token data usecase ---- :',userToken)
          const tokenDecodedData = this.jwtToken.verifyJwt(userToken)
          console.log('token decoded data :',tokenDecodedData)
          if(!tokenDecodedData || !tokenDecodedData?.user) 
            return {success:false , message:"User not found in token"}
          let userData = tokenDecodedData.user
         
         
            let otp =generateOTP()
            console.log('generated otp ',otp)
            const sendEmaill = await sendEmail(userData.email,otp)

            const otpExpiration = new Date();
                otpExpiration.setMinutes(otpExpiration.getMinutes() + 1);
            let token = jwt.sign(
                {user: userData, otp ,otpExpiration},
                process.env.JWT_KEY as string,
                { expiresIn: "5m" }
              );
              console.log('token',token)
              let decodeToken = this.jwtToken.verifyJwt(token)
              console.log('decoded token',decodeToken) 

            return {success:true,data:{data:false,token:token},userExists:false}
        } catch (error) {
            console.log(error)
        }
    }

    async sendOtpToEmail(email:string ): Promise<any> {
        try {  
               const user = await this.userRepository.findByEmail(email)
               if(!user)
                return {success:false,message:"User not found"}
            let otp =generateOTP()
            console.log('generated otp ',otp)
            const sendOtpToEmail = await sendEmail(email,otp)

            const otpExpiration = new Date();
                otpExpiration.setMinutes(otpExpiration.getMinutes() + 1);
            let token = jwt.sign(
                { otp ,otpExpiration},
                process.env.JWT_KEY as string,
                { expiresIn: "5m" }
              );
              console.log('token',token)
              let decodeToken = this.jwtToken.verifyOtp(token)
              console.log('decoded token',decodeToken)

            if(!token)
            return {success:false,message:"Failed to genereate otp"}
            return {success:true,token:token}
        } catch (error) {
            console.log(error)
        }
    } 
    
    async verifyForgetPasswordOtp(userOtp:string,token:string ): Promise<any> {
        try {     
    
              let decodedToken = this.jwtToken.verifyOtp(token)
              console.log('decoded token',decodedToken)
              if(decodedToken){
                const { otp, otpExpiration } = decodedToken;
                if (new Date() > new Date(otpExpiration)) {
                    return {success :false,message:'  OTP Expired !'}
                }
                if( otp ==userOtp) {
                    return {success:true,message : 'Otp verified Sucessfully'}
                } else 
                return {success :false,message:' Incorrect OTP !'}
                 
             } else 
             return {success :false,message:'No token Try again!'}
            
        } catch (error) {
            console.log(error)
        }
    }
    async verifyForgetPassword(email:string,password:string ): Promise<any> {
        try {     
            const hashedPassword = await this.hashPassword.createHash(password)
            const changePassword = await this.userRepository.changePasswordByEmail(email,hashedPassword)
            if(changePassword.success) {
                return {success:true,message:'Password changed successfully'}
            }
            return {success:false,message:'Failed to change password'}
  
        } catch (error) {
            console.log(error)
        }
    }
    

     async login (loginData:UserLogin) {
        try {
            const { email,password} = loginData
            const findUser : UserI = await this.userRepository.findByEmail(email)
            // console.log(findUser)
            if(findUser){
                if (findUser.loginType !== UserLoginType.EMAIL_PASSWORD) {
                   return { success:false,
                      message:
                      "You have previously registered using " +
                        findUser.loginType?.toLowerCase() +
                        ". Please use the " +
                        findUser.loginType?.toLowerCase() +
                        " login option to access your account." 

                   };
                  }
            //  const hashedPassword = await this.hashPassword.createHash(email)
                let passwordMatch = await this.hashPassword.compare(password,findUser.password)
                console.log('password match :',passwordMatch)
                if(!passwordMatch) { // replace it with passwordMatch later
                    return {success:false,message:' Incorrect password'}
                } 
                 if (findUser.isBlocked){
                    return {success:false,message:"User is temporarily Blocked"}
                } 
                //   let token =  jwt.sign(
                //         {userId: findUser._id,role:findUser.role},
                //         process.env.JWT_KEY as string,
                //         { expiresIn: "60m" } 
                //       );
                 const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(findUser._id)
                
                    // const verify = this.jwtToken.verifyJwt(token)
                    // console.log('verigiree usecase dataa',verify)
                    const loggedUserData = await this.userRepository.getUserById(findUser._id as string)
                    // console.log('user data to send ;',loggedUserData)
                    return {success:true,user:loggedUserData,accessToken,refreshToken}
                
            }
            return {success:false,message:"User not found "}
        } catch (error) {
            console.log(error)
            throw new ApiError(500," Something went wrong")

        }
    }

    async Gsignup(name:string,userName:string,email:string,picture:string)  {
        try {
            const userExists = await this.userRepository.findByEmail(email as string)
            if(userExists)
                return {success : false,message:'Email already exists'}
             const hashedPassword = await this.hashPassword.createHash(email)
             console.log("hashed password ;",hashedPassword)
             const newUser = await this.userRepository.Gsignup({email,userName,name,password:hashedPassword,profileImageUrl:picture,loginType:UserLoginType.GOOGLE})
             if(newUser){
                const userData = await this.userRepository.findByEmail(email)
                let token = this.jwtToken.createJwt(userData._id,"user");
                if(userData && token){
                    return {success:true,user:userData,token}
                }
             }
             return {success:false ,message:"Something went wrong try again !!"}
        } catch (error) {
         console.log(error)
        }
     }
     

     async Glogin(email:string)  {
        try {
            const findUser : UserI = await this.userRepository.findByEmail(email)
            if(findUser){
                if (findUser.loginType !== UserLoginType.GOOGLE) {
                 return { success:false,
                      message:
                      "You have previously registered using " +
                        findUser.loginType?.toLowerCase() +
                        ". Please use the " +
                        findUser.loginType?.toLowerCase() +
                        " login option to access your account." 

                   };
                  }
                  const hashedPassword = await this.hashPassword.createHash(email.trim())
// console.log("......................................",findUser.password,email,hashedPassword)
                let passwordMatch = await this.hashPassword.compare(email.trim(),findUser.password)
                console.log('passsword match',passwordMatch)
                if(!passwordMatch) { 
                    return {success:false,message:' Incorrect password'}
                } else if (findUser.isBlocked){
                    return {success:false,message:"User is temporarily Blocked"}
                } else {
                    // let token = this.jwtToken.createJwt(findUser._id,"user");
                    let token =  jwt.sign(
                        {userId: findUser._id,role:findUser.role},
                        process.env.JWT_KEY as string,
                        { expiresIn: "60m" } 
                      );
                    const loggedUserData = await this.userRepository.getUserById(findUser._id as string)
                    // console.log('user data to send ;',loggedUserData)
                    return {success:true,user:loggedUserData,token:token}
                }
            }
            return {success:false,message:"User not found register first"}
        } catch (error) {
         console.log(error)  
        }
     }

     async getUser(userId:string)  {
        try {

            const userExists = await this.userRepository.getUserById(userId)
            if(!userExists)
                return {success : false,message:'user not exists'}
         
             return {success:true ,user:userExists}
        } catch (error) {
         console.log(error)
        } 
     }

     async editUserProfile(userId:string , userData :EditProfileUserDataInterface )  {
        try {

        
            const userExists = await this.userRepository.getUserById(userId) 
            if(!userExists)
                return {success : false,message:'user not exists'}
            const updateUser = await this.userRepository.updateUserProfile(userId,userData) 
            if(updateUser.success){
            const userData = await this.userRepository.getUserById(userId) 
                return {success:true,data:userData}
            }
             return {success:false ,messgage:updateUser.message}
            
        } catch (error) {
         console.log(error)
        } 
     }

     async savePost(userId : string,postId : string)  {
        try {
             const user = await this.userRepository.getUserById(userId)
             if (user) {
                if (user.savedPost.some(saved => saved.postId === postId)) {
                  console.log('post already saved');
                  return { success: false, message: "Post already saved" };
                } else {
                  // Add logic to save the post if it's not already saved
                  // Example:
                  const savePost = await this.userRepository.savePost(userId,postId)
                  if(savePost.success){
                    return {success:true}
                  }
        
                  return { success: true, message: "Post saved successfully" };
                }
              }
              return { success: false, message: "User not found" };
        } catch (error) {
         console.log(error)
         return {success:false,message:"Something went wrong"}

        }
     }
     async changePrivacy(userId:string )  {
        try {

        
            const userExists = await this.userRepository.getUserById(userId) 
            if(!userExists)
                return {success : false,message:'user not exists'}
            const updateUser = await this.userRepository.changePrivacy(userId) 
            if(updateUser.success){
            const userData = await this.userRepository.getUserById(userId) 
                return {success:true,data:userData}
            }
             return {success:false ,messgage:updateUser.message}
            
        } catch (error) {
         console.log(error)
        } 
     }

     async isRequestedVerification(userId:string )  {
        try {

        
            const userExists = await this.verificationRepository.getVerificationDetailsByUserId(userId) 
            if(!userExists.success)
                return {success : false,verificationStatus:false,message:'user not exists'}
      
            return {success:true,verificationStatus:true,data:userExists.data}

        } catch (error) {
         console.log(error)
        } 
     }

     async submitVerification(userId:string,idUrl:string )  {
        try {

        
            const userExists = await this.verificationRepository.submitVerification(userId,idUrl) 
            if(!userExists.success)
                return {success : false,verificationStatus:false,message:'user not exists'}
      
            return {success:true,verificationStatus:true,data:userExists.data}

        } catch (error) {
         console.log(error)
        } 
     }

     async updatePaymentDetails(userId:string,plan:string )  {
        try {

        
            const requestExists = await this.verificationRepository.getVerificationDetailsByUserId(userId) 
            if(!requestExists.success)
                return {success : false,message:'Request not exists'}
            const updatePayment = await this.verificationRepository.updatePayment(userId ,plan) 
            if(!requestExists.success)
                return {success : false,message:updatePayment?.message}
            const changeUserToVerified = await this.userRepository.toogleIsVerified(userId)
            if( !changeUserToVerified.success)
                return {success:false,message:"Failed to update user is verified"}
            return {success:true,data:changeUserToVerified.data}

        } catch (error) {
         console.log(error)
        } 
     }
     
}

export default UserUseCase