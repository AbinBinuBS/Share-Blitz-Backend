import { Request , Response} from 'express'
import { postRequestI } from '../../../application/useCase/interface/user/postUseCase';
import { CustomRequest } from '../../../domain/interface/controllers/userControllerInterface';

class connectionController {
    private connectionUseCase : any 

    constructor(connectionUseCase : any ){
        this.connectionUseCase = connectionUseCase;
       
    } 


    async followUser (req:CustomRequest ,res:Response) {
        try {
            // const userId = req.userId
            console.log(req?.user)
            console.log(req?.userId)
            console.log(req?.body)
            const userId = req?.userId
            const {targetId} = req.body
            if(!userId || !targetId) 
                return res.status(409).json({success:false,message:"UserId is required"})
            const followUser = await this.connectionUseCase.followUser(userId as string , targetId as string)
            if(followUser.success){
                    return res.status(200).json({success:true})
            } else {
                return res.status(409).json({success:false,message:followUser?.message})
            }
        } catch (error ){
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async unFollowUser (req:CustomRequest ,res:Response) {
        try {
    
            const userId = req?.userId
            const {targetUserId} = req.body
            if(!userId || !targetUserId) 
                return res.status(409).json({success:false,message:"UserId is required"})
            const unFollowUser = await this.connectionUseCase.unFollowUser(userId as string , targetUserId as string)
            if(unFollowUser.success){
                    return res.status(200).json({success:true})
            } else {
                return res.status(409).json({success:false,message:unFollowUser?.message})
            }
        } catch (error ){
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async getConnections (req:CustomRequest ,res:Response) {
        try {
          console.log('get connections controller worked')

            const {userId} = req.query
            if(!userId) 
                return res.status(409).json({success:false,message:"UserId is required"})
            const getConnections = await this.connectionUseCase.getConnections(userId as string)
            console.log(getConnections)
            if(getConnections.success){
                    return res.status(200).json({success:true,connections:getConnections.data})
            } else {
                return res.status(409).json({success:false,message:getConnections?.message})
            }
        } catch (error ){
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async checkIsFriend (req:CustomRequest ,res:Response) {
        try {
          console.log('check is friend controller worked')

            const {targetUserId} = req.query
            const userId = req.userId
            if(!userId) 
                return res.status(409).json({success:false,message:"UserId is required"})
            const checkIsFriend = await this.connectionUseCase.checkIsFriend(userId as string , targetUserId as string)
        
            if(checkIsFriend.success){
                    return res.status(200).json({success:true,isFriend:checkIsFriend.isFriend})
            } else {
                return res.status(409).json({success:false,message:checkIsFriend?.message})
            }
        } catch (error ){
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async searchUser (req:CustomRequest ,res:Response) {
        try {
          console.log('Search user controller worked')

            const {searchInput} = req.query
          console.log(searchInput)
            const searchUser = await this.connectionUseCase.searchUser( searchInput as string)
        
            if(searchUser.success){
                    return res.status(200).json({success:true,users:searchUser.data})
            } else {
                return res.status(409).json({success:false,message:searchUser?.message})
            }
        } catch (error ){
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }
   
}
export default connectionController 