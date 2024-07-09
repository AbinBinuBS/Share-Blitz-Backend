import ConnectionRepositoryInterface from "../../../../domain/interface/repositories/user/connectionRepositoryInterface";
import IPostRepository from "../../../../domain/interface/repositories/user/postRepositoryInterface";
import mongoose from 'mongoose';

import ConnectionModel from "../../models/connectionsModel";
import asyncHandlers from "../../../utils/handlers/asyncHandlers";
import { ChatMessageModel } from "../../models/ChatMessageModel";
import ChatMessageRepositoryInterface from "../../../../domain/interface/repositories/user/messageRepository";
class ChatMessageRepository implements ChatMessageRepositoryInterface {

    async createNewMessage(senderId:string,receiverId:string,message:{text?:string,imageUrl?:string,videoUrl?:string}):Promise<any> {
        try {
            let newMessage = new ChatMessageModel({
                senderId,receiverId,text:message.text,imageUrl:message.imageUrl,videoUrl:message.videoUrl
              })
             await newMessage.save()
            if(newMessage){
                return {success:true,message:newMessage}
            }
            
            return {success:false,message:"Room not exist"}
           
        } catch (error) {
            console.error("Error creating new message:", error);
            return { success: false, message: "Failed to create new message" };
        }
    } 

    async createGroupChatMessage(senderId:string,message:{text?:string,imageUrl?:string,videoUrl?:string}):Promise<any> {
        try {
            let newMessage = new ChatMessageModel({
                senderId,text:message.text,imageUrl:message.imageUrl,videoUrl:message.videoUrl
              })
             await newMessage.save()
            if(newMessage){
                return {success:true,message:newMessage}
            }
            
            return {success:false,message:"Room not exist"}
           
        } catch (error) {
            console.error("Error creating new message:", error);
            return { success: false, message: "Failed to create new message" };
        }
    } 

    async  deleteMessage(senderId:string,receiverId:string,messageId:string):Promise<any> {
        try {
            // Find the message
            const message = await ChatMessageModel.findOne({
                _id: messageId,
            });
    
            if (!message) {
                return { success: false, message: "Message not found or unauthorized" };
            }
            // Delete the message
            const deletedMessage = await ChatMessageModel.findByIdAndUpdate(messageId,{$set:{isDeleted:true}});
    
            if (!deletedMessage) {
                return { success: false, message: "Failed to delete message" };
            }
    
            return { success: true, data: deletedMessage };
        } catch (error) {
            console.error("Error deleting message:", error);
            return { success: false, message: "Failed to delete message" };
        }
    } 
    async  deleteMessageFromMe(senderId:string,receiverId:string,messageId:string):Promise<any> {
        try {
            // Find the message
            const message = await ChatMessageModel.findOne({
                _id: messageId,
            });
    
            if (!message) {
                return { success: false, message: "Message not found or unauthorized" };
            }
            // Delete the message
            const deletedMessage = await ChatMessageModel.findByIdAndUpdate(messageId,{$set:{isDeletedFromMe:true}});
    
            if (!deletedMessage) {
                return { success: false, message: "Failed to delete message" };
            }
    
            return { success: true, data: deletedMessage };
        } catch (error) {
            console.error("Error deleting message:", error);
            return { success: false, message: "Failed to delete message" };
        }
    } 
    async  editMessage(senderId:string,receiverId:string,messageId:string,text:string):Promise<any> {
        try {
            console.log("edit repo ",messageId,text)
            // Find the message 
            const message = await ChatMessageModel.findOne({
                _id: messageId,
            });

            if (!message) {
                return { success: false, message: "Message not found or unauthorized" };
            }

            // Update the message
            const updated = await ChatMessageModel.findByIdAndUpdate(messageId, { text: text ,isEdited:true}, { new: true });

            if (!updated) {
                return { success: false, message: "Failed to update message" };
            }

            return { success: true, data: updated };
           
        } catch (error) {
            console.error("Error creating new message:", error);
            return { success: false, message: "Failed to create new message" };
        }
    } 

    async  findMessageById(messageId:string):Promise<any> {
        try {
            const message = await ChatMessageModel.findById(messageId);

            if (!message) {
                return { success: false, message: "Message not found or unauthorized" };
            }
 
            return { success: true, data: message };
           
        } catch (error) {
            console.error("Error creating new message:", error);
            return { success: false, message: "Failed to create new message" };
        }
    } 
   
  
 
}
export default ChatMessageRepository
