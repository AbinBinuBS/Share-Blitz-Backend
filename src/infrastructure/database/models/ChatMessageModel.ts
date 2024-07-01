import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript Interface for ChatMessage
interface IChatMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  text?: string;
  videoUrl?: string;
  imageUrl?: string;
  seen:boolean
  isDeleted:boolean
  isEdited:boolean
  isDeletedFromMe:boolean
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema for ChatMessage
const chatMessageSchema = new Schema<IChatMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
  
    text: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    seen :{
      type:Boolean,
      default:false
    },
    isEdited :{
      type:Boolean,
      default:false
    },
    isDeletedFromMe :{
      type:Boolean,
      default:false
    },
    isDeleted :{
      type:Boolean,
      default:false
    },
  },
  { timestamps: true }
);

// Model for ChatMessage
export const ChatMessageModel: Model<IChatMessage> = mongoose.model<IChatMessage>("ChatMessage", chatMessageSchema);
