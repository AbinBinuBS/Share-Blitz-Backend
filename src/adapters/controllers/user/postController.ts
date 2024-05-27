import { Request , Response} from 'express'
// import postUseCase from '../../../application/useCase/user/postUseCase'
import { postRequestI } from '../../../application/useCase/interface/user/postUseCase';
import { CustomRequest } from '../../../domain/interface/controllers/userControllerInterface';

class postController {
    private postUseCase : any 
    constructor(postUseCase : any){
        this.postUseCase = postUseCase;
    }

    async createPost (req: Request ,res : Response) {
        try {
            console.log('Create Post worked')
            console.log(req.body)
            const {postData} = req.body 
            const savePost = await this.postUseCase.createPost(postData as postRequestI)
            if(savePost.success){
                return res.status(200).json({success:true,postData:savePost.postData})
            }
            return res.status(200).json({success:false ,message:"Failed to create the post !!"})
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }
    async getAllPosts (req: Request ,res : Response) {
        try {
            console.log('get all Post worked')
            console.log(req.query)
            const getAllPosts = await this.postUseCase.getAllPosts()
            if(getAllPosts.success){
                return res.status(200).json({success:true,postData:getAllPosts.postData})
            }
            return res.status(200).json({success:false ,message:"Failed to create the post !!"})
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async getUserPosts (req : CustomRequest ,res:Response) {
        try {
            console.log("Edit profile worked in controller")
            console.log(req?.userId)
            console.log(req.query)

            const userId = req.userId
            const getUserPosts = await this.postUseCase.getUserPosts(userId as string)
            console.log('response get all posts profile :',getUserPosts)
            if(getUserPosts?.success){
            return res.status(200).json({success:true,userPosts:getUserPosts.data})
            }
            return res.status(200).json({success:false,message:getUserPosts?.message})
          
       
        } catch(error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async likePost (req : CustomRequest ,res:Response) {
        try {
            console.log("Like post worked in controller")
            console.log(req?.userId)
            console.log(req.body) 
            const{postId} = req.body
            const userId = req.userId
            if(!postId || !userId){
                return res.status(400).json({ success: false, message: "Missing postId or userId" });
            }
            const likePost = await this.postUseCase.likePost(postId as string , userId as string)
            console.log('response like post contoller :',likePost)
            if(likePost?.success){
            return res.status(200).json({success:true,postData:likePost.data})
            }
            return res.status(200).json({success:false,message:likePost?.message})
          
    
        } catch(error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async unlikePost (req : CustomRequest ,res:Response) {
        try {
            console.log("unLike post worked in controller")
            console.log(req?.userId)
            console.log(req.body) 
            const{postId} = req.body
            const userId = req.userId
            if(!postId || !userId){
                return res.status(400).json({ success: false, message: "Missing postId or userId" });
            }
            const unlikePost = await this.postUseCase.unlikePost(postId as string , userId as string)
            console.log('response like post contoller :',unlikePost)
            if(unlikePost?.success){
            return res.status(200).json({success:true,postData:unlikePost.data})
            }
            return res.status(200).json({success:false,message:unlikePost?.message})
          
    
        } catch(error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }
    async commentOnPost (req : CustomRequest ,res:Response) {
        try {
            console.log("comment on  post worked in controller")
            console.log(req?.userId)
            console.log(req.body) 
            const{postId ,comment} = req.body
            const userId = req.userId
            if(!postId || !userId){
                return res.status(400).json({ success: false, message: "Missing postId or userId" });
            }
            const commentPost = await this.postUseCase.addComment(postId as string , userId as string,comment as string)
            console.log('response comment post contoller :',commentPost)
            if(commentPost?.success){
               return res.status(200).json({success:true,commentData:commentPost.data})
            }
            return res.status(200).json({success:false,message:commentPost?.message})
            
    
        } catch(error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }
   
}
export default postController 