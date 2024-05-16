import { Request , Response} from 'express'
// import postUseCase from '../../../application/useCase/user/postUseCase'
import { postRequestI } from '../../../application/useCase/interface/user/postUseCase';

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
}
export default postController 