
interface ChatRoomRepositoryInterface {

    findChatRoom(senderId : string,receiverId:string) :Promise<{ success: boolean, room?: any, message?: string }>;
    findChatRoomById(roomId : string,) :Promise<{ success: boolean, room?: any, message?: string }>;
    unReadedMessages(roomId : string,userId:string) :Promise<{ success: boolean, data?: any, message?: string }>;
    createChatRoom(senderId : string,receiverId:string) : Promise<{ success: boolean, room?: any, message?: string }>;
    addNewMessageId(roomId:string,messageId : string) : Promise<any>
    removeMessageId(roomId:string,messageId : string) : Promise<{ success: boolean, room?: any, message?: string }>;
    getAllMessages(senderId : string,receiverId:string) : Promise<{ success: boolean, room?: any, message?: string }>;
    getRecentChats(userId:string):Promise<{ success: boolean, chatRooms?: any, message?: string }>;
    markMessageAsRead(userId:string,selectedUserId:string):Promise<{ success: boolean, data?: any, message?: string }>;
}



export default ChatRoomRepositoryInterface 