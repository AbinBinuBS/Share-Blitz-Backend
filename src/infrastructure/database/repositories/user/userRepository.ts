
// import IProductRepository from "../../useCase/interface/IProductRepository";

// import { ProductModel } from "../database/productModel";
// import Product from "../../domain/product";

import jwt from 'jsonwebtoken'

import IUserRepository, { toogleStatusInterface } from "../../../../domain/interface/repositories/user/userRepositoryInterface";
import {UserWithoutCredential,GUserData,getAllUsersInterface} from "../../../../domain/interface/repositories/user/userRepositoryInterface"
import { Otp, UserLogin, UserRequestModel } from "../../../../domain/entities/user";
import UserModel from "../../models/userModel";

class UserRepository implements IUserRepository {

    async createUser(user:UserRequestModel):Promise<any> {
        try {
            console.log("create user worked in repo :",user) 
            const {userName,  email,} = user
            const existUser = await UserModel.findOne({userName:userName,email:email})
            if(existUser) {
                 return {duplicate : true , success:true}
            } 
            const newUser = new UserModel(user)
            await newUser.save()
            return {success:true,data:newUser}
           
        } catch (error) {
            console.log(error)
            return {duplicate: false,success:false}
        }
    }  

  

    async verifyOtp(data:Otp):Promise<any> {
        try {
  
            console.log("create user worked in repo :",data) 
            const {otp} = data
            // const existUser = await UserModel.findOne({userName:userName,email:email})
            // if(existUser) {
            //     return {duplicate : true , success:true}
            // } 
            // const newUser = new UserModel(user)
            // await newUser.save()
            return {duplicate : false,success:true}
           
        } catch (error) {
            console.log(error)
            return {duplicate: false,success:false}
        }
    }

    async findByEmail(email: string) {
        try {
          const userExists = await UserModel.findOne({ email: email });
          if (userExists) {
            return userExists;
          } else {
            return null;
          }
        } catch (error) {
          console.log(error);
          return null;
        }
      }
    //   async findByUserId(userId: string) {
    //     try {
    //       const userExists = await UserModel.findOne({ userId: userId });
    //       if (userExists) {
    //         return userExists;
    //       } else {
    //         return null;
    //       }
    //     } catch (error) {
    //       console.log(error);
    //       return null;
    //     }
    //   }
    async Gsignup (user : GUserData) {
      try {
        const newUser = new UserModel(user)
        await newUser.save()
        return {success:true,data:newUser}
      } catch (error) {
        console.log(error)
      }
    }
    async getUserById(userId:string) :Promise<UserWithoutCredential | null> {
    
        
        const userData  = await UserModel.findById(userId).select(
          "-password"
        );
  
        return userData
    
    }

    async getAllUsers(): Promise<getAllUsersInterface> {
      try {
          const userData = await UserModel.find({ role: 'USER', isDeleted: false }).select(
            "-password"
          );;
          return userData ? { success: true, data: userData } : { success: false, message: "Failed to load users" };
      } catch (error) {
          console.log(error);
          return { success: false, message: "Failed to load users" };
      }
  }

  async toogleStatus(userId: string) :Promise<toogleStatusInterface> {
    try {
      
      const userExists = await UserModel.findById(userId);
      if (userExists) {
       userExists.isBlocked = !userExists.isBlocked
       if( await userExists.save()) 
        return {success:true , data:!userExists}
       return {success:true , message:"Failed to change status"}

      } else {
        return {success:false ,message:"User not found"}
      }
    } catch (error) {
      console.log(error);
      return {success:true , message:"Something went wrong"}
    }
  }


}

export default UserRepository