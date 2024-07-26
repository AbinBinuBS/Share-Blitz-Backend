
// import IProductRepository from "../../useCase/interface/IProductRepository";

// import { ProductModel } from "../database/productModel";
// import Product from "../../domain/product";

import jwt from 'jsonwebtoken'

import IUserRepository, { toogleStatusInterface } from "../../../../domain/interface/repositories/user/userRepositoryInterface";
import {UserWithoutCredential,GUserData,getAllUsersInterface} from "../../../../domain/interface/repositories/user/userRepositoryInterface"
import { Otp, UserLogin, UserRequestModel } from "../../../../domain/entities/user";
import UserModel from "../../models/userModel";
import { EditProfileUserDataInterface } from '../../../../domain/interface/controllers/userControllerInterface';
import ApiResponse from '../../../utils/handlers/ApiResponse';
import ApiError from '../../../utils/handlers/ApiError';

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
          "-password -refreshToken"
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
      return {success:false , message:"Something went wrong"}
    }
  }
  
  async updateUserProfile(userId: string ,userData:EditProfileUserDataInterface) :Promise<any> {
    try {
      console.log('field',userData)
      const userExists = await UserModel.findById(userId);
      if (userExists) {
       userExists.name = userData.name
       userExists.userName = userData.userName
       userExists.email = userData.email
       userExists.mobile = userData.mobile
       userExists.bio = userData.bio 
       userExists.dob = userData.dob
       userExists.profileImageUrl = userData.profileImageUrl
       if( await userExists.save()) 
        return {success:true}
       return {success:false , message:"Failed to update profile"}

      } else {
        return {success:false ,message:"User not found"}
      }
     
    } catch (error) {
      console.log(error);
      return {success:false , message:"Something went wrong"}
    }
  }
  async savePost(userId: string,postId:string) :Promise<any> {
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
      return {success:false , message:"Something went wrong"}
    }
  }
  async searchUser(searchInput : string) :Promise<any> {
    try {
      
      const userExists = await UserModel.find({
        $or: [
            { name: { $regex: searchInput, $options: 'i' } },
            { userName: { $regex: searchInput, $options: 'i' } },
        ]
    });
      if (userExists) {
        return {success:true , data:userExists}
      } else {
        return {success:false ,message:"User not found"}
      }
    } catch (error) {
      console.log(error);
      return {success:false , message:"Something went wrong"}
    }
  }

  async changePrivacy (userId : string) {
    const user = await UserModel.findById(userId);
        
        if (!user) {
            // throw new Error("User not found");
        return { success: false, message:"User not exist" };

        }

        // Toggle the isPrivate field
        user.isPrivate = !user.isPrivate;

        // Save the updated user
        await user.save();

        return { success: true, data: { isPrivate: user.isPrivate } };
  }

  async toogleIsVerified (userId : string) {
    try {
      // Find the user by userId
      const user = await UserModel.findById(userId);

      if (!user) {
          return { success: false, message: "User not found" };
      }
      user.isVerified = !user.isVerified;

      await user.save();

      return { success: true, data: user };
  } catch (error) {
      console.log(error);
      return { success: false, message: "Failed to toggle isVerified" };
  }
  }

  async changePasswordByEmail (email:string,passsword : string) {
    try {
      const user = await UserModel.findOneAndUpdate({email} , {$set:{password:passsword}});

      if (!user) {
          return { success: false, message: "Failed to change password" };
      }
	  return { success: true, message: "Password changed successfully " };

  } catch (error) {
      console.log(error);
     throw new ApiError(400,"Failed to change password")
  }
  }

  async logoutUSer (userId : string) {
    try {
    
       await UserModel.findByIdAndUpdate(userId,
        {
          $set :{
             refreshToken:undefined
          }
        },
        {
          new:true
        }
      );
      const options = {
        httpOnly:true,
        secure:true
    }

      return { success: true, data: "" };
  } catch (error) {
      console.log(error);
      return { success: false, message: "Failed to toggle isVerified" };
  }
  }

  async getUserDetailsFromArray(userIds: string[]): Promise<any> {
    try {
        // Fetch user details from UserModel
        const users = await UserModel.find({ _id: { $in: userIds } }, '-password -refreshToken').exec();
        return {success:true,users};
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching user details');
    }
}

async updateBackgroundImage(userId: string,backgroundImage : string): Promise<any> {
  
  try {
     const updateImage = await UserModel.findByIdAndUpdate(userId,{backgroundImageUrl:backgroundImage})
     if(updateImage)
      return {success:true,updateImage};

     return {success:false,message:"failed to update background image"};

  } catch (error) {
      console.error(error);
      throw new Error('Error fetching user details');

  }
}}


export default UserRepository