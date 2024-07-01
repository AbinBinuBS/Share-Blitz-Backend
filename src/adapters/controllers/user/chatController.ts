import { Request , Response} from 'express'
import { postRequestI } from '../../../application/useCase/interface/user/postUseCase';
import { CustomRequest } from '../../../domain/interface/controllers/userControllerInterface';
import asyncHandlers from '../../../infrastructure/utils/handlers/asyncHandlers';
import ApiError from '../../../infrastructure/utils/handlers/ApiError';
import ChatUseCaseInterface from '../../../application/useCase/interface/user/chatUseCaseInterface';
import ApiResponse from '../../../infrastructure/utils/handlers/ApiResponse';
import mongoose from 'mongoose';
class chatController {
    private chatUseCase : ChatUseCaseInterface 

    constructor(chatUseCase : ChatUseCaseInterface, ){
        this.chatUseCase = chatUseCase;
       
    } 

    // errHandler = asyncHandlers(async (req: Request, res: Response) => {
    //     const { password, email } = req.body;
        
    //     if (!req.body.name) {
    //         throw new ApiError(400, 'Name is required');
    //     }
    //     console.log(req.body.password);
        
    //     if ([name, email].some((field: string) => field?.trim() === "")) {
    //         throw new ApiError(400, 'All fields are required');
    //     }
    // });

    sendMessage = asyncHandlers(async (req: CustomRequest, res: Response) => {
        console.log("send message received ")
        console.log(req.params.id)
        const {id :receiverId} = req.params;
        const senderId = req.userId
        console.log(req.body.message)
        const message= req.body.message
        
        const sendMessage = await this.chatUseCase.sendMessage(senderId as string,receiverId,message)
        if(sendMessage.success){
        res.status(200).json(new ApiResponse(200,{message: sendMessage.data}, 'Message send successfully'));

        } else {
            throw new ApiError(400, sendMessage.message);

        }

    });

    getMessage = asyncHandlers(async (req: CustomRequest, res: Response) => {
        console.log("get message received ")
        console.log(req.params.id)
        const {id :userToChat} = req.params;
        const senderId = req.userId
           // Validate the ObjectId
           if (!mongoose.Types.ObjectId.isValid(userToChat)) {
            throw new ApiError(400, 'Invalid user ID format');
        }
        const sendMessage = await this.chatUseCase.getMessage(senderId as string,userToChat)
        // console.log("get messages",sendMessage)
        if(sendMessage.success){
        res.status(200).json(new ApiResponse(200,{chat: sendMessage.data}, 'Chat fetched successfully'));

        } else {
            throw new ApiError(400, sendMessage.message);

        }

    });

    getRecentChatedUsers = asyncHandlers(async (req: CustomRequest, res: Response) => {
        // console.log("get recent chats received ")
        const userId = req.userId
         
        const getUsers = await this.chatUseCase.getRecentChats(userId as string)
        // console.log('recent chatys',getUsers)
        if(getUsers.success){
        res.status(200).json(new ApiResponse(200,{users: getUsers.data}, 'Recent chats fetched sucessfully'));

        } else {
            throw new ApiError(400, getUsers.message);

        }

    });

    editMessage = asyncHandlers(async (req: CustomRequest, res: Response) => {
        console.log("edit message received ")
        console.log(req.params)
        console.log(req.query)
        // const {id :receiverId} = req.params;
        const senderId = req.userId
        console.log(req.body)
        const {messageId ,selectedUserId:receiverId,text : message} = req.body
        const editMessage = await this.chatUseCase.editMessage(senderId as string,receiverId,messageId,message as string)
        if(editMessage.success){
         res.status(200).json(new ApiResponse(200,{message: editMessage.data}, 'Message Edited successfully'));
        } else {
            throw new ApiError(400, editMessage.message);
        }


    });

    deleteMessage = asyncHandlers(async (req: CustomRequest, res: Response) => {
        console.log("delete message received ")
        console.log(req.params)
        console.log(req.query)
        // const {id :receiverId} = req.params;
        const senderId = req.userId
        console.log(req.body)

        const {messageId ,selectedUserId:receiverId} = req.body
        
        const deleteMessage = await this.chatUseCase.deleteMessage(senderId as string,receiverId,messageId)
        if(deleteMessage.success){
         res.status(200).json(new ApiResponse(200,{message: deleteMessage.data}, 'Message deleted successfully'));
        } else {
            throw new ApiError(400, deleteMessage.message);
        }

    });

    findMessageById = asyncHandlers(async (req: CustomRequest, res: Response) => {
        console.log("delete message received ")
        console.log(req.params)
        const {id :messageId} = req.params;
        const senderId = req.userId
        console.log(req.body)

        
        const findMessage = await this.chatUseCase.findMessageById(messageId)
        if(findMessage.success){
         res.status(200).json(new ApiResponse(200,{message: findMessage.data}, 'Message fetched successfully'));
        } else {
            throw new ApiError(400, findMessage.message);
        }

    });

    unReadedMessages = asyncHandlers(async (req: CustomRequest, res: Response) => {
        console.log("unreaded message received ")
        console.log(req.params)
        const {roomId} = req.params;
        const userId = req.userId
        const findMessage = await this.chatUseCase.unReadedMessages(roomId,userId as string)
        console.log('message recet :',findMessage)
        if(findMessage.success){
         res.status(200).json(new ApiResponse(200,{messages: findMessage.data}, 'Message fetched successfully'));
        } else {
            throw new ApiError(400, findMessage.message);
        }

    });

    markMessageAsRead = asyncHandlers(async (req: CustomRequest, res: Response) => {
        console.log("marka as read message received ")
        console.log(req.params)
        const {selectedUserId} = req.params;
        const userId = req.userId

        if ( !mongoose.Types.ObjectId.isValid(selectedUserId)) {
            throw new ApiError(400, "Invalid user ID or selected user ID");
            // return { success: false, message: "Invalid user ID or selected user ID" };
          }
        const updateMessage = await this.chatUseCase.markMessageAsRead(userId as string , selectedUserId as string)
        console.log('update message  :',updateMessage)
        if(updateMessage.success){
         res.status(200).json(new ApiResponse(200,{}, 'Message marked as readed successfully'));
        } else {
            throw new ApiError(400, updateMessage.message);
        }

    });
    
}
export default chatController 