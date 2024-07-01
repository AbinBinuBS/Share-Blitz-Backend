import mongoose from "mongoose";

export interface NotificationInterface {
    type:string
    message:string
    userId: mongoose.Types.ObjectId;
    senderId?: mongoose.Types.ObjectId;
    isSeen:boolean
    createdAt:Date
    updatedAt:Date
}