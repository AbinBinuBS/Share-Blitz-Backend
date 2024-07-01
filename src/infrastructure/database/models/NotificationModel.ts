import mongoose, { Schema, Model, Document } from "mongoose";
import { AvailableNotificationTypes, NotificationTypeEnum } from "../../constants/userConstants";
import { NotificationInterface } from "../../../domain/entities/notifications";

const notificationSchema: Schema<NotificationInterface> = new Schema({
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: AvailableNotificationTypes,
        default: NotificationTypeEnum.DEFAULT
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "UserModel"
    },
    isSeen:{
        type:Boolean,
        default:false
    }
}, {
    timestamps: true
});

const NotificationModel: Model<NotificationInterface> = mongoose.model<NotificationInterface>('Notifications', notificationSchema);
export default NotificationModel;
