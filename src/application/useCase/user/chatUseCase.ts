import { Server } from "socket.io";

import { CreatePostRequestModel } from "../../../domain/entities/post";
import IJwtToken from "../interface/user/jwtInterface";
// import IUserRepository from "../interface/user/userRepositoryInterface";
import PostRepositoryInterface from "../../../domain/interface/repositories/user/postRepositoryInterface";

import HashPasswordInterface from "../../../domain/interface/helpers/hashPasswordInterface";
import UserRepositoryInterface from "../../../domain/interface/repositories/user/userRepositoryInterface";
import ConnectionRepositoryInterface from "../../../domain/interface/repositories/user/connectionRepositoryInterface";
import RoomRepositoryInterface from "../../../domain/interface/repositories/user/roomRepository";
import MessageRepositoryInterface from "../../../domain/interface/repositories/user/messageRepository";
import { getReceiverSocketId } from "../../../infrastructure/Socket/socket";
import { io } from "../../..";
import ChatUseCaseInterface from "../interface/user/chatUseCaseInterface";
import { Console } from "console";
class ChatUseCase implements ChatUseCaseInterface {
    private userRepository: UserRepositoryInterface;
    private roomRepository : RoomRepositoryInterface;
    private messageRepository : MessageRepositoryInterface;
    private jwtToken : IJwtToken
    private hashPassword :HashPasswordInterface
    private io : Server

    constructor(
        userRepository:UserRepositoryInterface ,
        roomRepository:RoomRepositoryInterface,
        messageRepository:MessageRepositoryInterface,
        jwtToken :IJwtToken,
        hashedPassword:HashPasswordInterface,
        io: Server
    )  {
        this.userRepository =userRepository;
        this.roomRepository = roomRepository;
        this.messageRepository = messageRepository;
        this.jwtToken = jwtToken;
        this.hashPassword = hashedPassword;
        this.io = io; // Assign io
    }

    async sendMessage(roomId:string,senderId : string,receiverId : string,message:{text?:string,imageUrl?:string,videoUrl?:string})  {
       try {
            console.log("recieved message usecase") 

            let findChatRoom = await this.roomRepository.findChatRoom(senderId,receiverId)
            if(!findChatRoom?.success){
                const createChatRoom =await this.roomRepository.createChatRoom(senderId,receiverId)
                if(createChatRoom.success)
                    findChatRoom = createChatRoom
            }
            if(!findChatRoom.room)
                return {success:false,message:"Failed to create or find the room"}
            const newMessage = await this.messageRepository.createNewMessage(senderId,receiverId,message)
            console.log(newMessage)
            if(newMessage.success){
                const addNewMessageIdtoRoom = await this.roomRepository.addNewMessageId(findChatRoom?.room?._id,newMessage.message._id)
                if(addNewMessageIdtoRoom){
                    const receiverSocketId = getReceiverSocketId(receiverId)
                    const senderSocketId = getReceiverSocketId(senderId)
                    if(receiverSocketId) {
                        io.to(receiverSocketId).emit("newMessage",newMessage.message)
                    }
                    if(senderSocketId)
                        io.to(senderSocketId).emit("messageSended",{})

                }
                return {success:true,data:newMessage.message}
            }
            return {success:false,message:newMessage.message}
       } catch (error) {
          console.log(error)         
       }
    } 
    async sendGroupMessage(roomId:string,senderId : string,message:{text?:string,imageUrl?:string,videoUrl?:string})  {
        try {
             console.log("recieved message usecase") 
 
            let findChatRoom = await this.roomRepository.findChatRoomById(roomId)
             if(!findChatRoom?.room)
                 return {success:false,message:"Failed to create or find the room"}
             const newMessage = await this.messageRepository.createGroupChatMessage(senderId,message)
             console.log(newMessage)
             if(newMessage.success){
                 const addNewMessageIdtoRoom = await this.roomRepository.addNewMessageId(findChatRoom?.room?._id,newMessage.message._id)
                 if(addNewMessageIdtoRoom){
                    findChatRoom?.room?.participants.forEach((participantId : string) => {

                        const receiverSocketId = getReceiverSocketId(participantId)
                        if(receiverSocketId) {
                            io.to(receiverSocketId).emit("newGroupMessage",{message:newMessage.message,roomId})
                        }
                    })
                     const senderSocketId = getReceiverSocketId(senderId)
                     if(senderSocketId)
                         io.to(senderSocketId).emit("messageSended",{})
 
                 }
                 return {success:true,data:newMessage.message}
             }
             return {success:false,message:newMessage.message}
        } catch (error) {
           console.log(error)         
        }
     }
    
    async getMessage(senderId : string,userToChat :string)  {
        try {
             console.log("recieved get message usecase") 
             let findChatRoom = await this.roomRepository.getAllMessages(senderId,userToChat)
             console.log('messages',findChatRoom)
             if(findChatRoom?.success){
             return {success:true,data:findChatRoom.room}
             }
             return {success:false,message:findChatRoom?.message}
 
        } catch (error) {
           console.log(error)         
        }
     }
     async getMessagesByRoom(roomId :string)  {
        try {
             console.log("recieved get message usecase") 
             let findChatRoom = await this.roomRepository.getMessagesByRoom(roomId)
             if(findChatRoom?.success){
             return {success:true,data:findChatRoom.room}
             }
             return {success:false,message:findChatRoom?.message}

        } catch (error) {
           console.log(error)         
        }
     }
    
     async getRecentChats(userId: string) {
        try {
            let findChatRoom = await this.roomRepository.getRecentChats(userId);
    
            if (findChatRoom?.success) {
                const userIds = new Set<string>();
                findChatRoom.chatRooms.forEach((room: { participants: string[] }) => {
                    room.participants.forEach(participant => {
                        if (participant.toString() !== userId) {
                            userIds.add(participant.toString());
                        }
                    });
                });
    
                const userDetails = await this.userRepository.getUserDetailsFromArray(Array.from(userIds));
                // console.log('userDeails :',userDetails)
                if (userDetails?.success) {
                    // Combine chat rooms with user details
                    const roomsWithUserDetails = findChatRoom.chatRooms.map((room: any) => {
                      const participantsDetails = room.participants
                            .filter((participant: any) => participant.toString() != userId)
                            .map((participant: any) => userDetails.users.find((user: any) => user._id.toString() === participant.toString()))
                            .filter((participant: any) => participant !== undefined); // Filter out undefined values
    
                        return {
                            room,
                            participantsDetails
                        };
                    }); 
                    console.log('roomwith',roomsWithUserDetails)
                    return { success: true, data: roomsWithUserDetails };
                }
    
                return { success: false, message: "Something went wrong" };
            }
    
            return { success: false, message: findChatRoom?.message };
        } catch (error) {
            console.log(error);
            return { success: false, message: 'Something went wrong' };
        }
    }
    
    
       

     async deleteMessage(senderId : string,receiverId : string,messageId:string)  {
        try {
             console.log("recieved delete message usecase") 
 
             let findChatRoom = await this.roomRepository.findChatRoom(senderId,receiverId)
             if(!findChatRoom?.success){
                return {success:false,message:"Chat doesn't exists"}
             }
            
             const deleteMessage = await this.messageRepository.deleteMessage(senderId,receiverId,messageId)
             console.log(deleteMessage)
             if(deleteMessage.success){
                //  const removeMessageIdtoRoom = await this.roomRepository.removeMessageId(findChatRoom?.room?._id,deleteMessage.data._id)
                //  if(removeMessageIdtoRoom){
                     const receiverSocketId = getReceiverSocketId(receiverId)
                     if(receiverSocketId) {
                        console.log('delete',deleteMessage.data)
                         io.to(receiverId).emit("deletedMessage",messageId)
                     }
                //  }
                 return {success:true,data:deleteMessage.data}
             }
             return {success:false,message:deleteMessage.message}
        } catch (error) {
           console.log(error)         
        }
     }

     async editMessage(senderId : string,receiverId : string,messageId:string,message:string)  {
        try {
             console.log("recieved edit message usecase") 
 
 
             let findChatRoom = await this.roomRepository.findChatRoom(senderId,receiverId)
             if(!findChatRoom?.success){
                return {success:false,message:"Chat doesn't exists"}
             }
            
             const editMessage = await this.messageRepository.editMessage(senderId,receiverId,messageId,message)
             console.log(editMessage)
             if(editMessage.success){
                     const receiverSocketId = getReceiverSocketId(receiverId)
                     if(receiverSocketId) {
                        console.log('edited',editMessage.data)
                         io.to(receiverId).emit("editedMessage",editMessage.data)
                     }
                 }
                 return {success:true,data:editMessage.data}
             
        } catch (error) {
           console.log(error)         
        }
     }

     async findMessageById(messageId : string)  {
        try {
            
             const findMessgage = await this.messageRepository.findMessageById(messageId );
             if(findMessgage.success){
                 return {success:true,data:findMessgage.data}
             } 
             return {success:false,message:findMessgage?.message}
        } catch (error) {
         console.log(error)         
        }
     }

     async unReadedMessages(roomId : string,userId:string)  {
        try {
            
             const findMessgage = await this.roomRepository.unReadedMessages(roomId,userId );
             if(findMessgage.success){
                 return {success:true,data:findMessgage.data}
             } 
             return {success:false,message:findMessgage?.message}
        } catch (error) {
         console.log(error)         
        }
     }

     async markMessageAsRead(userId : string,selectedUserId:string)  {
        try {
            
             const markAsRead = await this.roomRepository.markMessageAsRead(userId,selectedUserId );
             if(markAsRead.success){
                const receiverSocketId = getReceiverSocketId(userId)
                io.to(receiverSocketId).emit("messagesMarkedAsRead",{})
                 return {success:true,data:markAsRead.data}
             } 
             return {success:false,message:markAsRead?.message}
        } catch (error) {
         console.log(error)         
        }
     }


     async  createGroupChat(userId:string,groupName : string ,participants : string[])   {
        try {
            
             const createGroupChat = await this.roomRepository.createGroupChat(userId,groupName,participants);
             console.log('crate group chat useCase ',createGroupChat)
             if(createGroupChat.success){
                const receiverSocketId = getReceiverSocketId(userId)
                io.to(receiverSocketId).emit("newGroupChatCreated",{})
                 return {success:true,data:createGroupChat?.data}
             } 
             return {success:false,message:createGroupChat?.message}
        } catch (error) {
         console.log(error)         
        }
     }

   
     
}



 
export default ChatUseCase