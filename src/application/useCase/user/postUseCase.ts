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

    async getAllPosts()  {
        try {
             const post = await this.postRepository.getAllPosts()
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
             console.log('Like :',post)
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
             if(!post.success){
                 return {success:false,message: "Like collection not found"}
             }
             if (!post?.data?.likes.some((like: { userId: string }) => like.userId === userId)) {
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
            //  if (post && post.data.likes.length && post.data.likes.some((users: { userId: string }) => users.userId == userId)) {
            //     console.log("User already follows the target user")
            //     return { success: false, message: "Post already liked " };
            // }
            const commentPost :CommentOnPostResponse =  await this.postRepository.addComment(postId,userId,comment)
            if(!commentPost.success){
                return {success:false,message:commentPost.message}
            }

            return {success:true,data:commentPost.data}
        } catch (error) {
         console.log(error)
        } 
     }

     

 

}

export default PostUseCase