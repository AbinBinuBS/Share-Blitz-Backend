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
      // const receiverSocketId = getReceiverSocketId(senderId);
      // if (receiverSocketId) {
      //   io.to(receiverSocketId).emit('stoppedTyping', userId);
      // }
    }) 

    //////////////// VIDEO CALL///////////////////

    // socket.on('offer', (offer) => {
    //   // console.log('offer received :',offer)
    //   socket.emit('offer', offer);
    // });
  
    // socket.on('answer', (answer) => {
    //   console.log('ansere ')
    //   socket.emit('answer', answer);
    // });
  
    // socket.on('candidate', (candidate) => {
    //   socket.broadcast.emit('candidate', candidate);
    // });

    
    socket.on('callUser', ({ userToCall, signalData, from, name }) => {
      console.log(' call user received ',userToCall,from ,name)
      const receiverSocketId = getReceiverSocketId(userToCall);

      io.to(receiverSocketId).emit('callFromUser', { signal: signalData, from, name })
    });

    socket.on('answerCall', (data) => {
      console.log("answered call",data.to)
      const receiverSocketId = getReceiverSocketId(data.to);

        io.to(receiverSocketId).emit('answeredCall', data.signal);
    });
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

//  New message 
    // socket.on('newMessage', async(receiverId) => {
    //   console.log('......;;;;;;;;;;;;;;;;;;;;;;;;New Message  :' ,receiverId)
    //   // const receiverSocketId = getReceiverSocketId(receiverId)
    //   // if(receiverSocketId) {
    //   //     console.log("........................................................re" ,receiverSocketId)
    //       io.emit("retry",'newMessage.message')
    //   // }
    // })
    
  });
     // Event listener for sending message
  //    socket.on("sendMessage", ({ senderId, recieverId, text }) => {
          
  //     const user = getUser(recieverId);
  //     console.log(senderId,'message is sended to',recieverId);
  //     if (user) {
  //         io.to(user.socketId).emit("getMessage", { senderId, text, recieverId });
  //     } else {
  //         console.log("User not found");
  //     }
  // });
  

};

export default socketConfiguration;

 // New message 
    // socket.on('new message', async(data) => {
    //   console.log('New Message  :' ,data)
      
    //   // check room available or not

    //   let chatRoom = await ChatRoomModel.findOne({
    //     "$or":[
    //       {sender : data?.sender,receiver : data?.receiver},
    //       {sender : data?.receiver,receiver : data?.sender}
    //     ]
    //   })
    //   if(!chatRoom) {
    //       const createRoom = new ChatRoomModel({
    //         name:"abhilash",
    //         sender:data.sender,
    //         receiver:data.receiver,
    //         // admin:data.sender
    //       })
    //      chatRoom =await createRoom.save()
    //   } 
    //   // console.log("Room :",chatRoom)
    //   const message = new ChatMessageModel({
    //     text:data.text,
    //     imageUrl:data.imageUrl,
    //     videoUrl:data.videoUrl
    //   })
    //   const saveMessage = await message.save()

    //   const updateChatRoom = await ChatRoomModel.findByIdAndUpdate(chatRoom._id,{$push:{messages:saveMessage?._id}})
    // });




    // socket.on("setup", (userData: UserInterface) => {
    //   if (userData) {
    //     socket.join(userData._id as string);
    //     socket.emit("connected");
    //   }
    // });  
    // socket.on("addUser", (userData: UserInterface) => {
    //   console.log('add users')
    //   if (userData) {
    //     console.log(userData)
    //     // socket.join(userData._id as string);
    //     // socket.emit("connected");
    //   }
    // });  
    
    // socket.off("setup", (userData: UserInterface) => {
    //   socket.leave(userData._id as string);
    // });

    // socket.on("join room", (room: string) => {
    //   socket.join(room);
    //   console.log("user joined the room " + room);
    // });

    // socket.on("typing", (room: string) => {
    //   socket.broadcast.to(room).emit("typing", room);
    // });

    // socket.on("stop typing", (room: string) => {
    //   socket.broadcast.to(room).emit("stop typing");
    // });

    // socket.on("new message", (newMessageRecieved: RecievedMessageInterface) => {
    //   const chat = newMessageRecieved.chat;
    //   if (!chat.users) return console.log("chat.users is not defined");
    //   chat.users.forEach((user:UserDataInterface) => {
    //     if (user._id === newMessageRecieved.sender._id) return;
    //     socket.in(user._id as string).emit("message recieved", newMessageRecieved);
    //   });
    // });



    // socket.on("group updation", (newChat: any) => {
    //   newChat.users.forEach((userId: string) => {
    //     if (userId === newChat.groupAdmin._id) return;
    //     socket.in(userId).emit("group updated");
    //   });
    // });

   

