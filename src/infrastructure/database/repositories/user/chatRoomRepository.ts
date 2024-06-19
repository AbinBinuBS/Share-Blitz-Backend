

import mongoose from "mongoose";
import ChatRoomRepositoryInterface from "../../../../domain/interface/repositories/user/roomRepository";
import { ChatRoomModel } from "../../models/ChatRoomModel";
import ConnectionModel from "../../models/connectionsModel";
class ChatRoomRepository implements ChatRoomRepositoryInterface {

    async findChatRoom(senderId:string,receiverId:string):Promise<any> {
        try {
            let chatRoom = await ChatRoomModel.findOne({
                participants:{$all:[senderId,receiverId]}
              })
            if(chatRoom){
                return {success:true,room:chatRoom}
            }
            
            return {success:false,message:"Room not exist"}
           
        } catch (error) {
            console.error("Error finding chat room:", error);
            return { success: false, message: "Failed to find chat room" };
        }
    } 

    async createChatRoom(senderId:string,receiverId:string):Promise<any> {
        try {
            const createRoom = new ChatRoomModel({
                name:"abhilash",
                participants:[senderId,receiverId]
                // admin:data.sender
              })
             const Room =await createRoom.save()
            if(Room){
                return {success:true,room:Room}
            }
            
            return {success:false,message:"Failed to create Room"}
           
        } catch (error) {
            console.error("Error creating chat room:", error);
            return { success: false, message: "Failed to create room" };
        }
    }
    async addNewMessageId(roomId:string,messageId:string):Promise<any> {
        try {
           const chatRoom = await ChatRoomModel.findById(roomId)
            if(!chatRoom)
                return {success:false,message: " Room not exist"}
            chatRoom.messages.push(new mongoose.Types.ObjectId(messageId))
           const updatedRoom= await chatRoom.save()
            return {success:true,room:updatedRoom}        
           
        } catch (error) {
            console.log(error)
            return {success: false}
        }
    }
    async removeMessageId(roomId:string,messageId:string):Promise<any> {
        try {
           const chatRoom = await ChatRoomModel.findById(roomId)
           console.log(chatRoom)
            if(!chatRoom)
                return {success:false,message: " Room not exist"}
            const updatedMessages = chatRoom.messages.filter((msgId) => msgId.toString() != messageId);

            chatRoom.messages = updatedMessages as mongoose.Types.ObjectId[];
    
            const updatedRoom = await chatRoom.save();
           console.log(chatRoom)

            return {success:true,room:updatedRoom}        
           
        } catch (error) {
            console.log(error)
            return {success: false}
        }
    }
    async getAllMessages(senderId:string,receiverId:string):Promise<any> {
        try {
           const chatRoom = await ChatRoomModel.findOne({
            participants : {$all:[senderId , receiverId]}
           }).populate("messages")
           
           if(chatRoom)
            return {success:true,room:chatRoom}  

           return {success:false,message:"No room found"}        
           
        } catch (error) {
            console.log(error)
            return {success: false}
        }
    }

    async getRecentChats(userId:string):Promise<any> {
        try {
            const chatRooms = await ChatRoomModel.find({
                participants: userId
            }).exec();
        
            if (!chatRooms || chatRooms.length === 0) {
                return {success: false ,message:'No recent chats found'}
            } 

           return {success:true,chatRooms:chatRooms}        
           
        } catch (error) {
            console.log(error)
            return {success: false}
        }
    }
     
}
export default ChatRoomRepository
