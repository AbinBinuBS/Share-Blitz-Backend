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
}
export default adminController 