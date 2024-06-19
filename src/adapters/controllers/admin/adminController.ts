import { Request , Response} from 'express'
// import postUseCase from '../../../application/useCase/user/postUseCase'

import { postRequestI } from '../../../application/useCase/interface/user/postUseCase';
import { adminUseCaseInterface } from '../../../application/useCase/interface/admin/adminUseCaseInteface';
class adminController {
    private adminUseCase : adminUseCaseInterface 
    constructor(adminUseCase : adminUseCaseInterface){
        this.adminUseCase = adminUseCase;
    }

    
    async getAllUsers (req: Request ,res : Response) {
        try {
            console.log('get all users worked')
            // console.log(req.query)
            const usersData = await this.adminUseCase.getAllUsers()
            console.log('user data :',usersData)
            if(usersData.success) {
                return res.status(200).json({success:true,usersData:usersData.userData})
            }
          
            return res.status(200).json({success:false ,message:usersData.message})
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async getAllPosts (req: Request ,res : Response) {
        try {
            console.log('get all posts worked')
            // console.log(req.query)
            const postData = await this.adminUseCase.getAllPosts()
            console.log('user data :',postData)
            if(postData.success) {
                return res.status(200).json({success:true,posts:postData.data})
            }
          
            return res.status(200).json({success:false ,message:postData.message})
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async toogleUserStatus (req: Request ,res : Response) {
        try {
            console.log('toogle user worked')
            console.log(req.body)
            const {userId} = req.body
            if(!userId )
                return res.status(200).json({success:false ,message:"Id should be a string"})

            const changeStatus = await this.adminUseCase.toogleUserStatus(userId)
            console.log('user data :',changeStatus)
            if(changeStatus.success) {
                return res.status(200).json({success:true,updateStatus:changeStatus.updatedStatus})
            }
          
            return res.status(200).json({success:false ,message:changeStatus.message})
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async tooglePostIsBlocked (req: Request ,res : Response) {
        try {
            console.log('toogle post blocked worked')
            console.log(req.body)
            const {postId} = req.body
            if(!postId )
                return res.status(200).json({success:false ,message:"post id is required"})

            const changeStatus = await this.adminUseCase.tooglePostIsBlocked(postId as string)
            console.log('user data :',changeStatus)
            if(changeStatus.success) {
                return res.status(200).json({success:true,updateStatus:changeStatus.updatedStatus})
            }
          
            return res.status(200).json({success:false ,message:changeStatus.message})
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }
    async getAllReportedPosts (req: Request ,res : Response) {
        try {
            console.log('load reported post worked')
            

            const loadReportedPosts = await this.adminUseCase.getAllReportedPosts()
            console.log('reported data :',loadReportedPosts)
            if(loadReportedPosts.success) {
                return res.status(200).json({success:true,reportedPosts:loadReportedPosts.data})
            }
          
            return res.status(200).json({success:false ,message:loadReportedPosts.message})
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async getReportsByPostId (req: Request ,res : Response) {
        try {
            console.log('get reports by post  worked')
            const { postId} = req.query
            console.log(req.query)
            console.log(req.params)
            console.log(req.body)

            const loadReportedPosts = await this.adminUseCase.getReportsByPostId(postId as string)
            console.log('reported data :',loadReportedPosts)
            if(loadReportedPosts.success) {
                return res.status(200).json({success:true,reports:loadReportedPosts.data})
            }
          
            return res.status(200).json({success:false ,message:loadReportedPosts.message})
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }
    async getPostById (req: Request ,res : Response) {
        try {
            console.log('get  Post worked')
            console.log(req.query)
            const {postId} = req.query
            if(!postId)
            return res.status(200).json({success:false ,message:"post id is required"})
            const getPost = await this.adminUseCase.getPostById(postId as string)
            if(getPost.success){
                return res.status(200).json({success:true,postData:getPost.postData})
            }
            return res.status(200).json({success:false ,message:getPost?.message})
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }
    async getUser (req : Request ,res:Response) {
        try {
            console.log("Get user worked in controller")
            console.log(req.query)
            const {userId} = req.query
            const userData = await this.adminUseCase.getUser(userId as string)
            // console.log(userData)
            if(!userData?.success)
                return res.status(200).json({success:false,message:'user not exists'})
                
                return res.status(200).json({success:true,user:userData.user})

       
        } catch(error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async changeActionStatus (req: Request ,res : Response) {
        try {
            console.log('change action status worked')
            console.log(req.body)
            const {reportId} = req.body
            if(!reportId )
                return res.status(200).json({success:false ,message:"Report id is required"})

            const changeStatus = await this.adminUseCase.changeActionStatus(reportId)
            console.log('change status :',changeStatus)
            if(changeStatus.success) {
                return res.status(200).json({success:true,updateStatus:changeStatus.updatedStatus})
            }
          
            return res.status(200).json({success:false ,message:changeStatus.message})
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

            const deletePost = await this.adminUseCase.deletePost(postId as string)
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

    async getVerificationData (req: Request ,res : Response) {
        try {
           
           

            const getData = await this.adminUseCase.getVerificationData()
            console.log('gt data :',getData)
            if(getData.success) {
                return res.status(200).json({success:true,verificationData:getData.data})
            }
          
            return res.status(200).json({success:false ,message:getData.message})
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async approveVerificationRequest (req: Request ,res : Response) {
        try {
           const {id} = req.body
           if(!id )
            return res.status(200).json({success:false ,message:"id is required"})

            const getData = await this.adminUseCase.approveVerificationRequest(id as string)
            console.log('gt data :',getData)
            if(getData.success) {
                return res.status(200).json({success:true,verifacationData:getData.data})
            }
          
            return res.status(200).json({success:false ,message:getData.message})
        } catch (error) {
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }
    

}
export default adminController 