
// import IProductRepository from "../../useCase/interface/IProductRepository";

// import { ProductModel } from "../database/productModel";
// import Product from "../../domain/product";

import IUserRepository from "../../../../application/useCase/interface/user/userRepositoryInterface";
import { UserRequestModel } from "../../../../domain/entities/user";
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
            return {duplicate : false,success:true}
           
        } catch (error) {
            console.log(error)
            return {duplicate: false,success:false}
        }
    }
    


}

export default UserRepository