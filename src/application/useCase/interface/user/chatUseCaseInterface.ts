export default interface ChatUseCaseInterface {
    sendMessage(userId : string , targetUserId : string,message:any) : any
    editMessage(senderId : string , receiverId : string,messageId:string,message:string) : any
    deleteMessage(senderId : string , receiverId : string,messageId:string) : any
    getMessage(senderId : string,userToChat :string) : any,
    getRecentChats(userId : string) : any,
}