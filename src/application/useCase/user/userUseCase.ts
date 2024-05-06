

import { Otp, UserRequestModel } from "../../../domain/entities/user";
import IJwtToken from "../interface/user/jwtInterface";
import IUserRepository from "../interface/user/userRepositoryInterface";
import jwt from "jsonwebtoken";

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

    // async getAllProduct () {
    //     try {
    //         const productData = await this.iProductRepository.getAllProduct()
    //         return productData
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    // async getSingleProduct (name:string) {
    //     try {
    //         const singleProductData = await this.iProductRepository.getSingleProduct(name)
    //         return singleProductData
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }


}

export default UserUseCase