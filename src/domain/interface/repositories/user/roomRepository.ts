
interface ChatRoomRepositoryInterface {

    findChatRoom(senderId : string,receiverId:string) :Promise<{ success: boolean, room?: any, message?: string }>;
    createChatRoom(senderId : string,receiverId:string) : Promise<{ success: boolean, room?: any, message?: string }>;
    addNewMessageId(roomId:string,messageId : string) : Promise<any>
    removeMessageId(roomId:string,messageId : string) : Promise<{ success: boolean, room?: any, message?: string }>;
    getAllMessages(senderId : string,receiverId:string) : Promise<{ success: boolean, room?: any, message?: string }>;
    getRecentChats(userId:string):Promise<{ success: boolean, chatRooms?: any, message?: string }>;
}



export default ChatRoomRepositoryInterface 