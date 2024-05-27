import { CreatePostRequestModel } from "../../../domain/entities/post";
import IJwtToken from "../interface/user/jwtInterface";
// import IUserRepository from "../interface/user/userRepositoryInterface";
import PostRepositoryInterface from "../../../domain/interface/repositories/user/postRepositoryInterface";

import HashPasswordInterface from "../../../domain/interface/helpers/hashPasswordInterface";
import UserRepositoryInterface from "../../../domain/interface/repositories/user/userRepositoryInterface";
import ConnectionRepositoryInterface from "../../../domain/interface/repositories/user/connectionRepositoryInterface";
class ConnectionUseCase {
    private postRepository: PostRepositoryInterface;
    private userRepository: UserRepositoryInterface;
    private connectionRepository : ConnectionRepositoryInterface;
    private jwtToken : IJwtToken
    private hashPassword :HashPasswordInterface

    constructor(
        postRepository: PostRepositoryInterface,
        userRepository:UserRepositoryInterface ,
        connectionRepository : ConnectionRepositoryInterface,
        jwtToken :IJwtToken,
        hashedPassword:HashPasswordInterface
    )  {
        this.postRepository =postRepository;
        this.userRepository =userRepository;
        this.connectionRepository = connectionRepository;
        this.jwtToken = jwtToken;
        this.hashPassword = hashedPassword;
    }

    async followUser(userId : string,targetUserId : string)  {
       try {
            console.log("follow user usecase worked ",userId,targetUserId)
            const userConnection = await this.connectionRepository.findConnectionsById(userId );
            console.log("user connection :",userConnection.data)
            if (userConnection && userConnection.data.followings.some((users: { userId: string }) => users.userId == targetUserId)) {
                console.log("User already follows the target user")
                return { success: false, message: "User already follows the target user" };
            }
            const followUser = await this.connectionRepository.followUser(userId,targetUserId)
            const addFollowerTargetUser = await this.connectionRepository.addFollowers(targetUserId,userId)
            if(followUser.success && addFollowerTargetUser.success){
                console.log("........sucess")
                return {success:true,data:followUser.data}
            } 
            return {success:false,message:followUser?.message || addFollowerTargetUser?.message}
       } catch (error) {
        console.log(error)         
       }
    }

   

     

 

}

export default ConnectionUseCase