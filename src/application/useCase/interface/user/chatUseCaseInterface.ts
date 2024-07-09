export default interface ChatUseCaseInterface {
    sendMessage(roomId:string,userId : string , targetUserId : string,message:any) : any
    sendGroupMessage(roomId:string,userId : string ,message:any) : any
    markMessageAsRead(userId : string , selectedUserId : string): any
    unReadedMessages(roomId : string ,userId:string) : any
    editMessage(senderId : string , receiverId : string,messageId:string,message:string) : any
    deleteMessage(senderId : string , receiverId : string,messageId:string) : any
    getMessage(senderId : string,userToChat :string) : any,
    getMessagesByRoom(roomId :string) : any,
    getRecentChats(userId : string) : any,
    findMessageById(messageId : string) : any,
    createGroupChat(userId:string,groupName : string ,participants : string[]) : any
} 