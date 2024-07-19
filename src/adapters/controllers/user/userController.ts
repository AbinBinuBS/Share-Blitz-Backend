import { Request , Response} from 'express'
import { CustomRequest } from '../../../domain/interface/controllers/userControllerInterface';
import asyncHandlers from '../../../infrastructure/utils/handlers/asyncHandlers';
import ApiError from '../../../infrastructure/utils/handlers/ApiError';
class userController {
    private connectionUseCase : any 
    private userUseCase : any 

    constructor(connectionUseCase : any,userUseCase:any ){
        this.connectionUseCase = connectionUseCase;
        this.userUseCase = userUseCase
       
    } 

    errHandler = asyncHandlers(async (req: Request, res: Response) => {
        const { password, email } = req.body;
        
        if (!req.body.name) {
            throw new ApiError(400, 'Name is required');
        }
        console.log(req.body.password);
        
        if ([name, email].some((field: string) => field?.trim() === "")) {
            throw new ApiError(400, 'All fields are required');
        }
    });

   

    async followUser (req:CustomRequest ,res:Response) {
        try {

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
        //   console.log('get connections controller worked')

            const {userId} = req.query
            if(!userId) 
                return res.status(409).json({success:false,message:"UserId is required"})
            const getConnections = await this.connectionUseCase.getConnections(userId as string)
            // console.log(getConnections)
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
        //   console.log('check is friend controller worked')

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
        //   console.log('Search user controller worked')

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

    async changePrivacy (req:CustomRequest ,res:Response) {
        try {
 
            const userId = req?.userId
            if(!userId ) 
                return res.status(409).json({success:false,message:"UserId is required"})
            const chaneStatus = await this.userUseCase.changePrivacy(userId as string )
            if(chaneStatus.success){
                    return res.status(200).json({success:true,userData:chaneStatus.data})
            } else {
                return res.status(409).json({success:false,message:chaneStatus?.message})
            }
        } catch (error ){
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async isRequestedVerification (req:CustomRequest ,res:Response) {
        try {

            const userId = req?.userId
            if(!userId ) 
                return res.status(409).json({success:false,message:"UserId is required"})
            const isRequested = await this.userUseCase.isRequestedVerification(userId as string )
            if(isRequested.success){
                    return res.status(200).json({success:true,verificationStatus:isRequested.verificationStatus,verificationData:isRequested.data})
            } else {
                return res.status(200).json({success:false,verificationStatus:isRequested.verificationStatus,message:isRequested?.message})
            }
        } catch (error ){
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async submitVerification (req:CustomRequest ,res:Response) {
        try {

            const {idUrl} = req.body
            const userId = req?.userId
            if(!userId ) 
                return res.status(409).json({success:false,message:"UserId is required"})
            const chaneStatus = await this.userUseCase.submitVerification(userId as string ,idUrl)
            if(chaneStatus.success){
                    return res.status(200).json({success:true,userData:chaneStatus.data})
            } else {
                return res.status(409).json({success:false,message:chaneStatus?.message})
            }
        } catch (error ){
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }

    async updatePaymentDetails (req:CustomRequest ,res:Response) {
        try {
        
            const {plan,paymentId} = req.body
            const userId = req?.userId
            if(!userId ) 
                return res.status(409).json({success:false,message:"UserId is required"})
            if(!plan || !paymentId ) 
                return res.status(409).json({success:false,message:"plan && payment id is required"})
          
            const updatePayment = await this.userUseCase.updatePaymentDetails(userId as string ,plan)
            if(updatePayment.success){
                    return res.status(200).json({success:true,userData:updatePayment.data})
            } else {
                return res.status(409).json({success:false,message:updatePayment?.message})
            }
        } catch (error ){
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }
    async suggestedUsers (req:CustomRequest ,res:Response) {
        try {
         
          
            const userId = req?.userId
            if(!userId ) 
                return res.status(409).json({success:false,message:"UserId is required"})
            const suggestedUsers = await this.userUseCase.suggestedUsers(userId as string )
            if(suggestedUsers.success){
                    return res.status(200).json({success:true,users:suggestedUsers.data})
            } else {
                return res.status(409).json({success:false,message:suggestedUsers?.message})
            }
        } catch (error ){
            res.status(500).send('Something went wrong')
            console.log(error)
        }
    }
    
   
}
export default userController 