
import ConnectionRepositoryInterface from "../../../../domain/interface/repositories/user/connectionRepositoryInterface";
import IPostRepository from "../../../../domain/interface/repositories/user/postRepositoryInterface";
import mongoose from 'mongoose';

import ConnectionModel from "../../models/connectionsModel";
class ConnectionRepository implements ConnectionRepositoryInterface {

    async followUser(userId:string,targetId:string):Promise<any> {
        try {
            console.log("create post worked in repo :",userId,targetId) 
            
            const result = await ConnectionModel.findOneAndUpdate(
                {userId},
                { $push: { followings: { userId:targetId }} },
                { new: true, useFindAndModify: false }
            );
        
            console.log("result ",result)
            if(result)
                return {success:true}
            return {success:false,message:"Failed to follow the user"}
           
        } catch (error) {
            console.log(error)
            return {duplicate: false,success:false}
        }
    } 
 
    async addFollowers(userId:string,targetId:string):Promise<any> {
        try {
            console.log("add followers worked in repo :",userId,targetId) 
          
            const result = await ConnectionModel.findOneAndUpdate(
            {userId},
                { $push: { followers: { userId:targetId }} },
                { new: true, useFindAndModify: false }
            );
       
            console.log("result ",result)
            if(result)
                return {success:true}
            return {success:false,message:"Something went wrong"}
           
        } catch (error) {
            console.log(error)
            return {duplicate: false,success:false}
        }
    } 

    async findConnectionsById(userId:string):Promise<any> {
        try {
            console.log("find connectionsbyid in repo :",userId) 
          
            const result = await ConnectionModel.findOne(
             {userId}
            );
          
            console.log("result ",result)
            if(result)
            return {success:true,data : result}
            return {success:false,message:"Connection not found"}
           
        } catch (error) {
            console.log(error)
            return {duplicate: false,success:false}
        }
    } 

    async removeFollowerById(userId:string,targetId:string):Promise<any> {
        try {
            
            const result = await ConnectionModel.findOneAndUpdate(
                {userId},
                { $pull: { followers: { userId:targetId }} },
                { new: true, useFindAndModify: false }
            );
        
            console.log("result ",result)
            if(result)
                return {success:true}
            return {success:false,message:"Failed to follow the user"}
           
        } catch (error) {
            console.log(error)
            return {duplicate: false,success:false}
        }
    } 

    async removeFollowingById(userId:string,targetId:string):Promise<any> {
        try {
            
            const result = await ConnectionModel.findOneAndUpdate(
                {userId},
                { $pull: { followings: { userId:targetId }} },
                { new: true, useFindAndModify: false }
            );
        
            console.log("result ",result)
            if(result)
                return {success:true}
            return {success:false,message:"Failed to follow the user"}
           
        } catch (error) {
            console.log(error)
            return {duplicate: false,success:false}
        }
    } 
    

  


}

export default ConnectionRepository