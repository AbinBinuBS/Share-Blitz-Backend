import { NotificationRepositoryInterface } from "../../../../domain/interface/repositories/user/notificationRepositoryInterface";
import NotificationModel from "../../models/NotificationModel";

interface NotificationDataInteface {
    type:string,
    message:string,
    senderId?:string,
    userId:string
}
class NotificationRepository implements NotificationRepositoryInterface {

   async  createNotification(data:NotificationDataInteface){
        try {
               console.log("received data :",data)
            const newNotification = new NotificationModel(data)
            if(await newNotification.save())
                return {success:true,data:newNotification}
            return {success:false,message:"Failed to create notification"}
        } catch (error) {
               console.log(error)
          return {success:false,message:"Something went wrong"}
        }
    }

    
   async  getAllNotifications(userId:string){
    try {
       const notifications = await NotificationModel.find({userId})
        if(notifications)
            return {success:true,data:notifications}
        return {success:false,message:"Failed to get notification"}
    } catch (error) {
           console.log(error)
      return {success:false,message:"Something went wrong"}
    }
    }

    async  toggleSeen(userId:string){
        try {
        const result = await NotificationModel.updateMany(
            { userId, isSeen: false },
            { $set: { isSeen: true } }
        );

        if (result) {
            const updatedNotifications = await NotificationModel.find({ userId }).sort({ createdAt: -1 });
            return { success: true, data: updatedNotifications };
        }

        return { success: false, message: "No unseen notifications to mark as read" };
   
        } catch (error) {
               console.log(error)
          return {success:false,message:"Something went wrong"}
        }
    }
    
}

export default  NotificationRepository