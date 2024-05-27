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
   
}
export default connectionController 