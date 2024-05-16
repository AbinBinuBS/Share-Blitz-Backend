import { CreatePostRequestModel } from "../../../domain/entities/post";
import IJwtToken from "../interface/user/jwtInterface";
// import IUserRepository from "../interface/user/userRepositoryInterface";
import PostRepositoryInterface from "../../../domain/interface/repositories/user/postRepositoryInterface";

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

 

}

export default PostUseCase