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

    async editPost (req: Request ,res : Response) {
        try {
            console.log('Edit post worked')
            console.log(req.query)
            console.log(req.body)
            console.log(req.body.postData.taggedUsers)
            const {postId ,postData} = req.body
            if(!postId || !postData)
                return res.status(400).json({success:false,message:"Post Id and PostData is required"})
            const editPost = await this.postUseCase.editPost(postId,postData)
            if(editPost.success){
                return res.status(200).json({success:true,postData:editPost.postData})
            }
            return res.status(400).json({success:false ,message:editPost.message})
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async getAllPosts (req: Request ,res : Response) {
        try {
            console.log('get all Post worked')
            console.log(req.query)
            const {limit,page} = req.query
            if(!limit  || !page)
                return res.status(400).json({success:false ,message:"Limit and page is required"})
            const getAllPosts = await this.postUseCase.getAllPosts(page,limit)
            if(getAllPosts.success){
                return res.status(200).json({success:true,postData:getAllPosts.postData})
            }
            return res.status(200).json({success:false ,message:"Failed to get all post !!"})
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async getPostById (req: Request ,res : Response) {
        try {
            console.log('get all Post worked')
            console.log(req.query)
            const {postId} = req.query
            const getPost = await this.postUseCase.getPostById(postId)
            if(getPost.success){
                return res.status(200).json({success:true,postData:getPost.postData})
            }
            return res.status(200).json({success:false ,message:"Failed to create the post !!"})
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async getUserPosts (req : CustomRequest ,res:Response) {
        try {
            console.log("get users posts worked in controller")
           

            const userId = req.query.userId
            const getUserPosts = await this.postUseCase.getUserPosts(userId as string)
            // console.log(getUserPosts)
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

    async reportPost (req : CustomRequest ,res:Response) {
        try {
            console.log("report post worked in controller")
            console.log(req?.userId)
            console.log(req.body) 
            const{postId ,reason} = req.body
            const userId = req.userId
            if(!postId || !userId){
                return res.status(400).json({ success: false, message: "Missing postId or userId" });
            }
            if(!reason || reason.trim().length <= 0 ){
                return res.status(400).json({ success: false, message: "Please provide a reason" });
            }

            const reportPost = await this.postUseCase.reportPost(postId as string , userId as string,reason as string)
            console.log('response report post contoller :',reportPost)
            if(reportPost?.success){
               return res.status(200).json({success:true,reportData:reportPost.data})
            }
            return res.status(200).json({success:false,message:reportPost?.message})
            
    
        } catch(error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async blockPost (req : CustomRequest ,res:Response) {
        try {
            console.log("block post worked in controller")
            console.log(req?.userId)
            console.log(req.body) 
            const{postId } = req.body
            const userId = req.userId
            if(!postId || !userId){
                return res.status(400).json({ success: false, message: "Missing postId or userId" });
            }
           

            const blockPost = await this.postUseCase.blockPost(postId as string , userId as string)
            console.log('response block post controller :',blockPost)
            if(blockPost?.success){
               return res.status(200).json({success:true,blockData:blockPost.data})
            }
            return res.status(200).json({success:false,message:blockPost?.message})
            
    
        } catch(error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }


    async getCommentReplys (req: CustomRequest ,res : Response) {
        try {
            console.log('get comment replys worked')
            console.log(req.query)
            const {postId,commentId} = req.query
            if(!commentId || !postId) 
                return res.status(409).json({success:false,message:"Comment id and reply is required"})
            const addReply = await this.postUseCase.getReplies(postId,commentId)
            console.log("response :",addReply)
            // const getAllPosts = await this.postUseCase.getAllPosts()
            if(addReply.success){
                return res.status(200).json({success:true,reply:addReply.data})
            }
            return res.status(200).json({success:false ,message:addReply.message})
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async addReply (req: CustomRequest ,res : Response) {
        try {
            console.log('get add Reply worked')
            console.log(req.body)
            const userId = req.userId
            const {commentId ,reply,postId} = req.body
            if(!commentId || !reply) 
                return res.status(409).json({success:false,message:"Comment id and reply is required"})
            const addReply = await this.postUseCase.addReply(userId,postId,commentId,reply)
            console.log("response :",addReply)
            // const getAllPosts = await this.postUseCase.getAllPosts()
            if(addReply.success){
                return res.status(200).json({success:true,reply:addReply.data})
            }
            return res.status(200).json({success:false ,message:"Failed to add reply !!"})
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }


    async savePost (req: CustomRequest ,res : Response) {
        try {
            console.log('Save Post worked')
            console.log(req.body)
            const {postId } = req.body
            const userId = req.userId
            if (!postId) {
                return res.status(400).json({ success: false, message: "Post id is required" });
            }
    
            const savePost = await this.postUseCase.savePost(userId,postId);
    
            if (savePost.success) {
                return res.status(200).json({ success: true, postData: savePost.data });
            }
    
            return res.status(200).json({ success: false, message:savePost?.message });
       } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async unSavePost (req: CustomRequest ,res : Response) {
        try {
            console.log('Save Post worked')
            const {postId } = req.body
            const userId = req.userId
            if (!postId) {
                return res.status(400).json({ success: false, message: "Post id is required" });
            }
    
            const unSavePost = await this.postUseCase.unSavePost(userId,postId);
    
            if (unSavePost.success) {
                return res.status(200).json({ success: true, postData: unSavePost.data });
            }
    
            return res.status(200).json({ success: false, message:unSavePost?.message });
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async getSavedPosts (req: CustomRequest ,res : Response) {
        try {
           
            const userId = req.userId 
            const savedPosts = await this.postUseCase.getSavedPostsById(userId)
            // console.log("get saved posts :",savedPosts)
            if(savedPosts.success){
                return res.status(200).json({success:true,savedPosts:savedPosts.data})
            }
            return res.status(200).json({success:false ,message:savedPosts.message})
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }


    async deleteComment (req: CustomRequest ,res : Response) {
        try {
            console.log('Delete comment worked')
            const {commentId,postId } = req.body
            const userId = req.userId
            console.log(commentId)
            
            if (!commentId || !postId) {
                return res.status(400).json({ success: false, message: "Comment id is required" });
            }
    
            const deleteComment = await this.postUseCase.deleteComment(postId,commentId);
            // console.log("respnse",deleteComment)
            if (deleteComment.success) {
                return res.status(200).json({ success: true, postData: deleteComment.data });
            }
    
            return res.status(200).json({ success: false, message:deleteComment?.message });
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async getTaggedPosts (req: CustomRequest ,res : Response) {
        try {
            console.log('Get tagged post in controller')
            const {userId } = req.query
            console.log(userId)
            
            if (!userId) {
                return res.status(400).json({ success: false, message: "User id is required" });
            }
    
            const taggedPosts = await this.postUseCase.getTaggedPosts(userId);
            // console.log("respnse............................................................................",taggedPosts)
            if (taggedPosts.success) {
                return res.status(200).json({ success: true, postData: taggedPosts.data });
            }
    
            return res.status(200).json({ success: false, message:taggedPosts?.message });
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }
    async deletePost (req: Request ,res : Response) {
        try {
            console.log('delete post worked...............')
            console.log(req.body)
            console.log(req.query)
            const {postId} = req.body
            if(!postId )
                return res.status(200).json({success:false ,message:"postid is required"})

            const deletePost = await this.postUseCase.deletePost(postId as string)
            // console.log('delete post :',deletePost)
            if(deletePost.success) {
                return res.status(200).json({success:true,updateStatus:deletePost.data})
            }
          
            return res.status(200).json({success:false ,message:deletePost.message})
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }
   
}
export default postController 