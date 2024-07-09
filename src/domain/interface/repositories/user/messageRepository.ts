
interface ChatMessageRepositoryInterface {

    createNewMessage(senderId:string,receiverId:string,message:any):Promise<any>
    createGroupChatMessage(senderId:string,message:any):Promise<any>
    deleteMessage(senderId:string,receiverId:string,messageId:string):Promise<any>
    editMessage(senderId:string,receiverId:string,messageId:string,message:string):Promise<any>
    findMessageById(messageId:string) : Promise<any>

}



export default ChatMessageRepositoryInterface 