export default interface NotificationUseCaseInterface {
    getNotifications(userId :string) : any,
    toggleSeen(userId :string) : any,
    createNotification(userId : string,senderId : string , type : string , message : string) : any
}