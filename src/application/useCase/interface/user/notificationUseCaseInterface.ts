export default interface NotificationUseCaseInterface {
    getNotifications(userId :string) : any,
    toggleSeen(userId :string) : any,
}