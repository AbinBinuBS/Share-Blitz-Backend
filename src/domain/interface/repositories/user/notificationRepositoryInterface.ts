export interface NotificationRepositoryInterface {
    createNotification(data:NotificationDataInteface)  : Promise <any>,
    getAllNotifications(userId:string) : Promise <any>,
    toggleSeen(userId:string) : Promise <any>,
}

interface NotificationDataInteface {
    type:string,
    message:string,
    senderId?:string
    userId?:string
}