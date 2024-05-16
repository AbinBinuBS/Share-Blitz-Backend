import { CreatePostRequestModel } from "../../../domain/entities/post";
import IJwtToken from "../interface/user/jwtInterface";
// import IUserRepository from "../interface/user/userRepositoryInterface";
import PostRepositoryInterface from "../../../domain/interface/repositories/user/postRepositoryInterface";
import UserRepositoryInterface, { getAllUsersInterface, toogleStatusInterface } from "../../../domain/interface/repositories/user/userRepositoryInterface";
import HashPasswordInterface from "../../../domain/interface/helpers/hashPasswordInterface";
import { GUserData } from "../../../domain/interface/repositories/user/userRepositoryInterface";
class AdminUseCase {
    private postRepository: PostRepositoryInterface;
    private userRepository: UserRepositoryInterface;
    private jwtToken : IJwtToken
    private hashPassword :HashPasswordInterface

    constructor(
        postRepository: PostRepositoryInterface,
        userRepository: UserRepositoryInterface,
        jwtToken :IJwtToken,
        hashedPassword:HashPasswordInterface
    )  {
        this.postRepository =postRepository;
        this.userRepository = userRepository;
        this.jwtToken = jwtToken;
        this.hashPassword = hashedPassword;
    }


    async getAllUsers()  {
        try {
            console.log("worked get all users usecase")
             const post : getAllUsersInterface = await this.userRepository.getAllUsers()
             if(post.success){
                 return {success:true,userData:post.data}
             } 
             return {success:false,message:post?.message}
        } catch (error) {
         console.log(error) 
        }
     }

    
     async toogleUserStatus(userId:string)  {
        try {
            console.log("worked toogle user status usecase")
             const changeStatus : toogleStatusInterface = await this.userRepository.toogleStatus(userId)
             if(changeStatus.success){
                 return {success:true,updatedStatus:changeStatus.data}
             } 
             return {success:false,message:changeStatus?.message}
        } catch (error) {
         console.log(error) 
        }
     }

 

}

export default AdminUseCase