import { Request , Response} from 'express'
import { postRequestI } from '../../../application/useCase/interface/user/postUseCase';
import { CustomRequest } from '../../../domain/interface/controllers/userControllerInterface';
import asyncHandlers from '../../../infrastructure/utils/handlers/asyncHandlers';
import ApiError from '../../../infrastructure/utils/handlers/ApiError';
import ChatUseCaseInterface from '../../../application/useCase/interface/user/chatUseCaseInterface';
import ApiResponse from '../../../infrastructure/utils/handlers/ApiResponse';
import mongoose from 'mongoose';
import NotificationUseCaseInterface from '../../../application/useCase/interface/user/notificationUseCaseInterface';
class notificationController {
    private notificationUseCase : NotificationUseCaseInterface 

    constructor(notificationUseCase : NotificationUseCaseInterface, ){
        this.notificationUseCase = notificationUseCase;
       
    } 

  

    getNotifications = asyncHandlers(async (req: CustomRequest, res: Response) => {
        console.log("get all notifications received ")
       
        const userId = req.userId
        
        const getNotifications = await this.notificationUseCase.getNotifications(userId as string)
        if(getNotifications.success){
            res.status(200).json(new ApiResponse(200,{notifications: getNotifications.data}, 'Message fetched successfully'));
        } else {
            throw new ApiError(400, getNotifications.message);
        } 
    });
    
    getNotificationById = asyncHandlers(async (req: CustomRequest, res: Response) => {
        console.log("get all notification by id received ")

    });

    toggleSeen = asyncHandlers(async (req: CustomRequest, res: Response) => {
        console.log("toogle seen received ")
       
        const userId = req.userId
        
        const toogleSeen = await this.notificationUseCase.toggleSeen(userId as string)
        if(toogleSeen.success){
            res.status(200).json(new ApiResponse(200,{notifications: toogleSeen.data}, 'Updated notification as seen successfully'));
        } else {
            throw new ApiError(400, toogleSeen.message);
        } 
    });
  

    
   
}
export default notificationController 