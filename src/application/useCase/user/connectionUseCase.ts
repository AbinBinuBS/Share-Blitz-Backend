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
            // console.log("user connection :",userConnection.data)
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

    async unFollowUser(userId : string,targetUserId : string)  {
        try {
             console.log("unfollow user usecase worked ",userId,targetUserId)
             const userConnection = await this.connectionRepository.findConnectionsById(userId );
            //  console.log("user connection :",userConnection.data)
             if (userConnection && userConnection.data.followings.some((users: { userId: string }) => users.userId == targetUserId)) {
                const removeFollowing = await this.connectionRepository.removeFollowingById(userId,targetUserId)
                const removeFollower = await this.connectionRepository.removeFollowerById(targetUserId,userId)
                if(removeFollower.success && removeFollowing.success){
                    return {success:true}
                }
                return { success: false, message: removeFollower?.message || removeFollowing?.message};
             }
            
             return {success:false,message:"You are not a friend"}
        } catch (error) {
         console.log(error)         
        }
     }
    async getConnections(userId : string)  {
        try {
             console.log("get connections usecase worked ",userId)
             const userConnection = await this.connectionRepository.findConnectionsById(userId );
            //  console.log("user connection :",userConnection.data)

             if(userConnection.success){
                 console.log("........sucess")
                 return {success:true,data:userConnection.data}
             } 
             return {success:false,message:userConnection?.message}
        } catch (error) {
         console.log(error)         
        }
     }

     async checkIsFriend(userId : string,targetUserId:string)  {
        try {
             console.log("get connections usecase worked ",userId)
             const userConnection = await this.connectionRepository.findConnectionsById(userId );
            //  console.log("user connection :",userConnection.data)
             if(userConnection.success){
             const isFriend = userConnection?.data?.followings.some((user: {userId : string})=>user.userId === targetUserId)
                console.log('............isFriemd',isFriend)
   
                 return {success:true,isFriend:isFriend}
             } 
             return {success:false,message:userConnection?.message}
        } catch (error) {
         console.log(error)         
        }
     }

     async searchUser(searchInput : string)  {
        try {
             console.log("search  usecase worked ",searchInput)
             const searchUser = await this.userRepository.searchUser(searchInput );
            //  console.log("user connection :",searchUser.data)
             if(searchUser.success){
                 return {success:true,data:searchUser.data}
             } 
             return {success:false,message:searchUser?.message}
        } catch (error) {
         console.log(error)         
        }
     }

   

     

 

}

export default ConnectionUseCase