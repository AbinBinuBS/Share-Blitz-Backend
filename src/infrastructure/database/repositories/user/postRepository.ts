
import mongoose from "mongoose";
import PostRepositoryInterface, { findCommentsByIdResponse } from "../../../../domain/interface/repositories/user/postRepositoryInterface";
import LikesModel from "../../models/likesModel";
import PostModel from "../../models/postModel";
import CommentsModel from "../../models/commentsModel";
import CommentInterface from "../../../../domain/entities/comments";
class PostRepository implements PostRepositoryInterface {

    async createPost(postData:any):Promise<any> {
        try {
            console.log("create post worked in repo :",postData) 
          
            const newPost = new PostModel(postData)
            if(await newPost.save())
                return {success:true,data:newPost}
            return {success:false,message:"Something went wrong"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
    } 
    
    async getAllPosts():Promise<any> {
        try {
            console.log("get all post worked in repo :") 
          
        //    const postData = await PostModel.find({isBlocked:false,isDeleted:false}).sort({ creationTime: -1 });
       
        const postData = await PostModel.aggregate([
            {
              $match: { isBlocked: false,
                isDeleted: false}
            },
           
            {
              $lookup: {
                from: 'likes', // the name of the Likes collection
                localField: '_id',
                foreignField: 'postId',
                as: 'likesDetails'
              }
            },
            {
              $lookup: {
                from: 'comments', // the name of the Comments collection
                localField: '_id',
                foreignField: 'postId',
                as: 'commentsDetails'
              }
            },
            {
              $unwind: {
                path: '$likesDetails',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $unwind: {
                path: '$commentsDetails',
                preserveNullAndEmptyArrays: true
              }
            },
         
          ]);
            if(postData)
                return {success:true,data:postData}
            return {success:false,message:"Something went wrong"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
    } 

    async getUserPosts(userId : string):Promise<any> {
        try {
            console.log("get user postss worked in repo :") 
          
           const postData = await PostModel.find({userId,isBlocked:false,isDeleted:false})
            if(postData)
                return {success:true,data:postData}
            return {success:false,message:"Something went wrong"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
    } 

    async findPostLikesByPostId(postId : string):Promise<any> {
        try {
            console.log("get user postss worked in repo :") 
          
           const likeData = await LikesModel.findOne({postId})
            if(likeData)
                return {success:true,data:likeData}
            return {success:false,message:"Something went wrong"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
    } 

    
    async likePost(postId : string,userId:string):Promise<any> {
        try {
            // console.log("get user postss worked in repo :") 
          
           const likeData = await LikesModel.findOneAndUpdate({postId},{$push:{likes:{userId}}},   { new: true, useFindAndModify: false })
           console.log("like post repo: ",likeData)
            if(likeData)
                return {success:true,data:likeData}
            return {success:false,message:"Something went wrong"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
    } 

     
    async unlikePost(postId : string,userId:string):Promise<any> {
        try {
            // console.log("get user postss worked in repo :") 
          
           const likeData = await LikesModel.findOneAndUpdate({postId},{$pull:{likes:{userId}}},   { new: true, useFindAndModify: false })
           console.log("unlike post repo: ",likeData)
            if(likeData)
                return {success:true,data:likeData}
            return {success:false,message:"Something went wrong"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
    } 

    async findCommentsById(postId : string):Promise<findCommentsByIdResponse> {
        try {
            // console.log("get user postss worked in repo :") 
          
           const commentData:CommentInterface | null= await CommentsModel.findOne({postId})
            if(commentData)
                return {success:true,data:commentData}
            return {success:false,message:"Comments not available"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
    }
    async addComment(postId : string,userId:string,comment:string):Promise<findCommentsByIdResponse> {
        try {
            // console.log("get user postss worked in repo :") 
          
           const commentData:CommentInterface | null= await CommentsModel.findOneAndUpdate({postId},{$push:{comments:{comment,userId}}},  { new: true, useFindAndModify: false })
            if(commentData)
                return {success:true,data:commentData}
            return {success:false,message:"Comments not available"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
    }

  


}

export default PostRepository