import { CreatePostRequestModel } from "../../../domain/entities/post";
import IJwtToken from "../interface/user/jwtInterface";
// import IUserRepository from "../interface/user/userRepositoryInterface";
import PostRepositoryInterface, { CommentOnPostResponse } from "../../../domain/interface/repositories/user/postRepositoryInterface";

import HashPasswordInterface from "../../../domain/interface/helpers/hashPasswordInterface";
import { GUserData } from "../../../domain/interface/repositories/user/userRepositoryInterface";
class PostUseCase {
    private postRepository: PostRepositoryInterface;
    private jwtToken : IJwtToken
    private hashPassword :HashPasswordInterface

    constructor(
        postRepository: PostRepositoryInterface,
        jwtToken :IJwtToken,
        hashedPassword:HashPasswordInterface
    )  {
        this.postRepository =postRepository;
        this.jwtToken = jwtToken;
        this.hashPassword = hashedPassword;
    }

    async createPost(postData:CreatePostRequestModel)  {
       try {
            const post = await this.postRepository.createPost(postData)
            if(post.success){
                return {success:true,postData:post.data}
            }
            return {success:false,message:"Something went wrong"}
       } catch (error) {
        console.log(error)
       }
    }

    async editPost(postId:string,postData:any)  {
        try {
           
            if(!postId)
                return {success:false,message:"Post Id is required"}
             const findPost = await this.postRepository.findPostById(postId)
             if(!findPost.success)
                 return {success:false,message:"Post not found"}
             const editPost = await this.postRepository.editPost(postId,postData)
             if(editPost.success) {
                return {success:true,data:editPost.data}
             }
             return {success:false,message:"Failed to update the post"}

        } catch (error) {
         console.log(error)
        }
     }

    async getAllPosts(page:string,limit : string)  {
        try {
            const skip = parseInt(limit) * (parseInt(page) -1)
            const end = parseInt(limit)
             const post = await this.postRepository.getAllPosts(skip,end)
             if(post.success){
                 return {success:true,postData:post.data}
             }
             return {success:false,message:"Something went wrong"}
        } catch (error) {
         console.log(error)
        }
     }

     async getPostById( userId : string )  {
        try {
             const post = await this.postRepository.getPostById( userId)
             if(post.success){
                 return {success:true,postData:post.data}
             }
             return {success:false,message:"Something went wrong"}
        } catch (error) {
         console.log(error)
        }
     }

     async getUserPosts(userId : string)  {
        try {
             const post = await this.postRepository.getUserPosts(userId)
             if(post.success){
                 return {success:true,data:post.data}
             }
             return {success:false,message:"Something went wrong"}
        } catch (error) {
         console.log(error)
        }
     }

     async likePost(postId : string , userId : string)  {
        try {
            console.log("like post in usecase")
             const post = await this.postRepository.findPostLikesByPostId(postId)
            //  console.log('Like :',post)
             if(!post.success){
                 return {success:false,message: "Like collection not found"}
             }
             if (post && post.data.likes.length && post.data.likes.some((users: { userId: string }) => users.userId == userId)) {
                console.log("User already follows the target user")
                return { success: false, message: "Post already liked " };
            }
            const likePost =  await this.postRepository.likePost(postId,userId)
            if(!likePost.success){
                return {success:false,message:likePost.message}
            }

            return {success:true,data:likePost.data}
        } catch (error) {
         console.log(error)
        } 
     }

     async unlikePost(postId : string , userId : string) {
        try {
            console.log("unlike post in usecase")
             const post = await this.postRepository.findPostLikesByPostId(postId)
             console.log('Like :',post)
             console.log('Like :',post.data.likes)
             if(!post.success){
                 return {success:false,message: "Like collection not found"}
             }
             if (!post?.data?.likes.some((like: { userId: string }) => like.userId == userId)) {
                console.log("User has not liked this post");
                return { success: false, message: "Post not liked by the user" };
            }
            const unlikePost =  await this.postRepository.unlikePost(postId,userId)
            if(!unlikePost.success){
                return {success:false,message:unlikePost.message}
            }

            return {success:true,data:unlikePost.data} }
        catch (error) {
         console.log(error)
        }
     }

     async addComment(postId : string ,userId:string, comment : string)  {
        try {
            console.log("comment post in usecase")
            console.log("postID",postId,"comment",comment)
             const post = await this.postRepository.findPostLikesByPostId(postId)
            //  console.log('Like :',post)
             if(!post.success){
                 return {success:false,message: "Comment collection not found"}
             }

            const commentPost :CommentOnPostResponse =  await this.postRepository.addComment(postId,userId,comment)
            if(!commentPost.success){
                return {success:false,message:commentPost.message}
            }

            return {success:true,data:commentPost.data}
        } catch (error) {
         console.log(error)
        } 
     }

     async addReply(userId : string ,postId:string,commentId:string, reply : string)  {
        try {
        
           

            const addReply :CommentOnPostResponse =  await this.postRepository.addReply(userId,postId,commentId,reply)
            if(!addReply.success){
                return {success:false,message:addReply.message}
            }

            return {success:true,data:addReply.data}
        } catch (error) {
         console.log(error)
        } 
     }

     
     async getReplies(postId:string,commentId:string)  {
        try {
        
            const addReply :CommentOnPostResponse =  await this.postRepository.getReplies(postId,commentId)
            if(!addReply.success){
                return {success:false,message:addReply.message}
            }

            return {success:true,data:addReply.data}
        } catch (error) {
         console.log(error)
        } 
     }

     async reportPost(postId : string ,userId:string, reason : string)  {
        try {
            console.log("comment post in usecase")
            console.log("postID",postId,"comment",reason)
             const post = await this.postRepository.findPostById(postId)
             if(!post.success){
                 return {success:false,message: post?.message}
             }

            const reportPost :CommentOnPostResponse =  await this.postRepository.reportPost(postId,userId,reason)
            if(!reportPost.success){
                return {success:false,message:reportPost.message}
            }

            return {success:true,data:reportPost.data}
        } catch (error) {
         console.log(error)
        } 
     }

     async blockPost(postId : string ,userId:string)  {
        try {
            console.log("comment post in usecase")
             const post = await this.postRepository.findPostById(postId)
             if(!post.success){
                 return {success:false,message: post?.message}
             }

            // const reportPost :CommentOnPostResponse =  await this.postRepository.reportPost(postId,userId,reason)
            // if(!reportPost.success){
            //     return {success:false,message:reportPost.message}
            // }

            // return {success:true,data:reportPost.data}
            return {success:true,data:[]}
        } catch (error) {
         console.log(error)
        } 
     }

     async savePost(userId:string,postId : string)  {
        try {
            console.log("save post in usecase")
            const savedPosts = await this.postRepository.findSavedPostsById(userId);
            if (savedPosts && savedPosts.success && savedPosts.data?.savedPosts.some((post: { postId : any }) => post.postId.toString() == postId)) {
              console.log("User already saved the post");
              return { success: false, message: "User already saved the post" };
            }
             const savePost = await this.postRepository.savePost(userId,postId)
             if(!savePost.success){
                 return {success:false,message: savePost?.message}
             }

             return {success:true,data:savePost.data}
          

        } catch (error) {
         console.log(error)
        } 
     }

     async unSavePost(userId:string,postId : string)  {
        try {
            console.log("un save post in usecase");
            
            const savedPosts = await this.postRepository.findSavedPostsById(userId);
            
            if (!savedPosts.success) {
                return { success: false, message: "Failed to retrieve saved posts" };
            }
    
            if (!savedPosts.data?.savedPosts.some((post: { postId: any }) => post.postId.toString() === postId)) {
                console.log("Post is not saved by the user");
                return { success: false, message: "Post is not saved by the user" };
            }
    
            const unSavePost = await this.postRepository.unSavePost(userId, postId);
            
            if (!unSavePost.success) {
                return { success: false, message: unSavePost.message };
            }
    
            return { success: true, data: unSavePost.data };
        } catch (error) {
         console.log(error)
        } 
     }


     async getSavedPostsById(userId:string)  {
        try {
            console.log("save post in usecase")
            const savedPosts = await this.postRepository.findSavedPostsById(userId);
            if (!savedPosts.success ) {
              return { success: false, message: "Failed to load savedPosts" };
            }
           

             return {success:true,data:savedPosts.data}
          

        } catch (error) {
         console.log(error)
        } 
     }

     async deleteComment(postId:string,commentId:string)  {
        try {
            console.log("delete comment in usecase")
            const deleteComment = await this.postRepository.deleteComment(postId,commentId);
            if (!deleteComment.success ) {
              return { success: false, message: "Failed to load deleteComment" };
            }
           

             return {success:true,data:deleteComment.data}
          

        } catch (error) {
         console.log(error)
        } 
     }

     async getTaggedPosts(userId:string,)  {
        try {
            const taggedUsers = await this.postRepository.getTaggedPosts(userId);
            if (!taggedUsers.success ) {
              return { success: false, message: "Failed to load tagged posts" };
            }
             return {success:true,data:taggedUsers.data}
        } catch (error) {
         console.log(error)
        } 
     }

     async deletePost(postId:string)  {
        try {

            const deletePost = await this.postRepository.deletePost(postId)
            if(!deletePost)
                return {success : false,message:'Failed to delete the post'}
         
             return {success:true,data:deletePost.data }
        } catch (error) {
         console.log(error)
        } 
     }
     

 

}

export default PostUseCase