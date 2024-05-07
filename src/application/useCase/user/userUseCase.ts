
import jwt from "jsonwebtoken";


import { Otp, UserLogin, UserRequestModel } from "../../../domain/entities/user";
import IJwtToken from "../interface/user/jwtInterface";
import IUserRepository from "../interface/user/userRepositoryInterface";
import UserI from "../../../domain/entities/user";
import User from "../../../domain/interface/repositories/user/userInterface";
import { UserLoginType } from "../../../infrastructure/constants/userConstants";
class UserUseCase {
    private userRepository: IUserRepository;
    private jwtToken : IJwtToken

    constructor(
        userRepository: IUserRepository,
        jwtToken :IJwtToken
    )  {
        this.userRepository = userRepository;
        this.jwtToken = jwtToken
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
                if( otp == decodedToken.otp) {
                    const hashedPassword = decodedToken.user.password
                    decodedToken.user.password = hashedPassword;
                    
                    const saveUser = await this.userRepository.createUser(decodedToken.user)
                    if(saveUser.success) {
                        let createdToken = this.jwtToken.createJwt(saveUser?.data?._id as string,'user');
                        if(createdToken) 
                            return {success:true,token:createdToken}
                        else
                            return {success:false,token:createdToken}
                    } else 
                    return {success :false,message:'Internal server error!'}
                } else 
                return {success :false,message:' Incorrect OTP !'}
                 
             } else 
             return {success :false,message:'No token Try again!'}
            
            //  const product = await this.userRepository.verifyOtp(otp)
            //  return product
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

          
            let otp =1234
            let token = jwt.sign(
                { user, otp },
                process.env.JWT_KEY as string,
                { expiresIn: "5m" }
              );
              console.log('token',token)
              let decodeToken = this.jwtToken.verifyJwt(token)
              console.log('decoded token',decodeToken)

            return {success:true,data:{data:false,token:token}}
        } catch (error) {
            console.log(error)
        }
    }

     async login (loginData:UserLogin) {
        try {
            const { email ,password} = loginData
            const findUser : UserI = await this.userRepository.findByEmail(email)
            if(findUser){
                if (findUser.loginType !== UserLoginType.EMAIL_PASSWORD) {
                    // If user is registered with some other method, we will ask him/her to use the same method as registered.
                    // This shows that if user is registered with methods other than email password, he/she will not be able to login with password. 
                   return { success:false,
                      message:
                      "You have previously registered using " +
                        findUser.loginType?.toLowerCase() +
                        ". Please use the " +
                        findUser.loginType?.toLowerCase() +
                        " login option to access your account." 

                   };
                  }
                // let passwordMatch = await this.hashedPassword.compare(password,findUser.password)
                if(findUser.password !== password) { // replace it with passwordMatch later
                    return {success:false,message:' Incorrect password'}
                } else if (findUser.isBlocked){
                    return {success:false,message:"User is temporarily Blocked"}
                } else {
                    let token = this.jwtToken.createJwt(findUser._id,"user");
                    const loggedUserData = await this.userRepository.getUserById(findUser._id as string)
                    console.log('user data to send ;',loggedUserData)
                    return {success:true,user:loggedUserData,token:token}
                }
            }
            return {success:false,message:"User not found "}
        } catch (error) {
            console.log(error)
        }
    }




}

export default UserUseCase