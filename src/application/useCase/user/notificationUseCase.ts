import { NotificationRepositoryInterface } from "../../../domain/interface/repositories/user/notificationRepositoryInterface";
import NotificationUseCaseInterface from "../interface/user/notificationUseCaseInterface";

class NotificationUseCase implements NotificationUseCaseInterface{

    private notificationRepository: NotificationRepositoryInterface;

    constructor(
        notificationRepository:NotificationRepositoryInterface ,
    )  {
        this.notificationRepository =notificationRepository;
       

    }
    async getNotifications(userId : string)  {
        try {
             console.log("recieved get message usecase") 
             let getNotifications = await this.notificationRepository.getAllNotifications(userId)
             if(getNotifications?.success){
             return {success:true,data:getNotifications.data}
             }
             return {success:false,message:getNotifications?.message}

        } catch (error) {
           console.log(error)         
        }
     }
    
     async toggleSeen(userId : string)  {
        try {
             let toogleSeen = await this.notificationRepository.toggleSeen(userId)
             if(toogleSeen?.success){
             return {success:true,data:toogleSeen.data}
             }
             return {success:false,message:toogleSeen?.message}

        } catch (error) {
           console.log(error)         
        }
     }
}

export default NotificationUseCase