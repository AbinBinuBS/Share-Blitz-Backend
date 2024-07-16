import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ChatRoomModel } from "../database/models/ChatRoomModel";
import { ChatMessageModel } from "../database/models/ChatMessageModel";

const userSocketMap: { [key: string]: string } = {}; // {userId : socketId}

import NotificationRepository from "../database/repositories/user/notificationRepository";
const NotificationRepo = new NotificationRepository()
export const getReceiverSocketId = (receiverId : string) => {
  return userSocketMap[receiverId]
}
const socketConfiguration =async (io: Server<DefaultEventsMap>) => {

 
  io.on("connection", (socket) => {
    console.log("connected to :" ,socket.id);
    
    // current user details 
    const userId = socket.handshake.query.userId as string;
    console.log(userId)
    if (userId && userId !== "undefined"){
      userSocketMap[userId] = socket.id
    }
    console.log('socket ....',userSocketMap)
    const receiverSocketId = getReceiverSocketId(userId);

    io.to(receiverSocketId).emit('connected',userId)
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
    // io.emit("newMessage",Object.keys(userSocketMap))
    console.log("emited users keys",Object.keys(userSocketMap))

    socket.on('message-page', (userId) => {
      console.log('Message page :' ,userId)
  
    });

    socket.on('typing',(senderId)=>{
      console.log('typing',senderId)
      const receiverSocketId = getReceiverSocketId(senderId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing', userId);
      }
    })
    socket.on('stoppedTyping',(senderId)=>{
      console.log('stopped yping',senderId)
      const receiverSocketId = getReceiverSocketId(senderId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('stoppedTyping', userId);
      }
    })

    socket.on('fetchRecentChats',(senderId)=>{
      console.log('fetch recent chats',)
      const receiverSocketId = getReceiverSocketId(senderId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('stoppedTyping', userId);
      }
    })

    socket.on('createNotification',async(data)=>{
      console.log(' create ntificaions chats',data)
      const res= await NotificationRepo.createNotification({type:data.type,senderId:data.senderId,userId,message:"You have a one new message"})
      console.log('res',res)
      if(res.success) {
      const receiverSocketId = getReceiverSocketId(userId);
        io.to(receiverSocketId).emit('newNotification',res.data)
      }
    
    }) 

    //////////////// VIDEO CALL///////////////////
     
    socket.on('callUser', ({to,roomId}) => {
      console.log(' call user received ',roomId,to)
      const receiverSocketId = getReceiverSocketId(to);

      io.to(receiverSocketId).emit('callFromUser', { roomId: roomId, from : userId })
    });

    socket.on('answerCall', (data) => {
      console.log("answered call",data.to)
      const receiverSocketId = getReceiverSocketId(data.to);

        io.to(receiverSocketId).emit('answeredCall',{ to:data.to});
    });

    // socket.on('callUser', ({ userToCall, signalData, from, name }) => {
    //   console.log(' call user received ',userToCall,from ,name)
    //   const receiverSocketId = getReceiverSocketId(userToCall);

    //   io.to(receiverSocketId).emit('callFromUser', { signal: signalData, from, name })
    // });

    // socket.on('answerCall', (data) => {
    //   console.log("answered call",data.to)
    //   const receiverSocketId = getReceiverSocketId(data.to);

    //     io.to(receiverSocketId).emit('answeredCall', data.signal);
    // });
    socket.on('callEnded', (data) => {
      console.log(" call ended",data)
      const receiverSocketId = getReceiverSocketId(data.userId);

        io.to(receiverSocketId).emit('callEnded');
    });

    //////////////// END ///////////////////



    socket.join(userId)
    socket.on('disconnect', () => {
      console.log('user disconnected',userId); 
      if (userId && userId !== "undefined"){
        delete userSocketMap[userId];
      }
       io.emit("getOnlineUsers",Object.keys(userSocketMap))
   
    });
    
  }); 

};

export default socketConfiguration;


   

