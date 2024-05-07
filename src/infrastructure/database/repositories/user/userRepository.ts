
// import IProductRepository from "../../useCase/interface/IProductRepository";

// import { ProductModel } from "../database/productModel";
// import Product from "../../domain/product";

import jwt from 'jsonwebtoken'

import IUserRepository from "../../../../domain/interface/repositories/user/userRepositoryInterface";
import {UserWithoutCredential} from "../../../../domain/interface/repositories/user/userRepositoryInterface"
import { Otp, UserLogin, UserRequestModel } from "../../../../domain/entities/user";
import UserModel from "../../models/userModel";

class UserRepository implements IUserRepository {

    async createUser(user:UserRequestModel):Promise<any> {
        try {
            console.log("create user worked in repo :",user) 
            const {userName,name,mobile,email,password} = user
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
    async login (email:UserLogin) {

    }
    async getUserById(userId:string) :Promise<UserWithoutCredential | null> {
      const userData  = await UserModel.findById(userId).select(
        "-password"
      );
      return userData
    }


}

export default UserRepository