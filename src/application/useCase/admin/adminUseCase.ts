import { CreatePostRequestModel } from "../../../domain/entities/post";
import IJwtToken from "../interface/user/jwtInterface";
// import IUserRepository from "../interface/user/userRepositoryInterface";
import PostRepositoryInterface from "../../../domain/interface/repositories/user/postRepositoryInterface";
import UserRepositoryInterface, { getAllUsersInterface, toogleStatusInterface } from "../../../domain/interface/repositories/user/userRepositoryInterface";
import HashPasswordInterface from "../../../domain/interface/helpers/hashPasswordInterface";
import { GUserData } from "../../../domain/interface/repositories/user/userRepositoryInterface";
import { adminUseCaseInterface } from "../interface/admin/adminUseCaseInteface";
import ReportRepositoryInterface from "../../../domain/interface/repositories/user/ReportRepositoryInterface";
import { VerificationRepositoryInterface } from "../../../domain/interface/repositories/user/verificationRepositoryInterface";
class AdminUseCase implements adminUseCaseInterface {
    private postRepository: PostRepositoryInterface;
    private userRepository: UserRepositoryInterface;
    private reportRepository: ReportRepositoryInterface;
    private verificationRepository: VerificationRepositoryInterface;
    private jwtToken : IJwtToken
    private hashPassword :HashPasswordInterface

    constructor(
        postRepository: PostRepositoryInterface,
        userRepository: UserRepositoryInterface,
        reportRepository: ReportRepositoryInterface,
        verificationRepository : VerificationRepositoryInterface,
        jwtToken :IJwtToken,
        hashedPassword:HashPasswordInterface
    )  {
        this.postRepository =postRepository;
        this.userRepository = userRepository;
        this.reportRepository = reportRepository;
        this.verificationRepository = verificationRepository;
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
     async getAllReportedPosts()  {
        try {
            console.log("worked get all users usecase")
             const post : getAllUsersInterface = await this.reportRepository.getAllReportedPosts()
             if(post.success){
                 return {success:true,data:post.data}
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

     async getPostById( postId : string )  {
        try {
             const post = await this.postRepository.getPostById(postId)
             if(post.success){
                 return {success:true,postData:post.data}
             }
             return {success:false,message:"Something went wrong"}
        } catch (error) {
         console.log(error)
        }
     }
     async getUser(userId:string)  {
        try {

            const userExists = await this.userRepository.getUserById(userId)
            if(!userExists)
                return {success : false,message:'user not exists'}
         
             return {success:true ,user:userExists}
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

     async changeActionStatus(reportId:string)  {
        try {
            console.log("worked chnge action  status usecase")
             const changeStatus  = await this.reportRepository.changeActionStatus(reportId)
             if(changeStatus.success){
                 return {success:true,updatedStatus:changeStatus.data}
             } 
             return {success:false,message:changeStatus?.message}
        } catch (error) {
         console.log(error) 
        }
     }

     async getVerificationData()  {
        try {
            console.log("worked getVerificationData  usecase")
             const changeStatus  = await this.verificationRepository.getVerificationData()
             if(changeStatus.success){
                 return {success:true,data:changeStatus.data}
             } 
             return {success:false,message:changeStatus?.message}
        } catch (error) {
         console.log(error) 
        }
     }

     async approveVerificationRequest(id:string)  {
        try {
             const approve  = await this.verificationRepository.approveVerificationRequest(id)
             if(approve.success){
                 return {success:true,data:approve.data}
             } 
             return {success:false,message:approve?.message}
        } catch (error) {
         console.log(error) 
        }
     }
     
     
}

export default AdminUseCase