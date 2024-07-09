import mongoose, { Schema, Document, Model } from "mongoose";

interface IChat extends Document {
  name: string;
  isGroupChat: boolean;
  lastMessage?: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];


  admin: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChatRoomSchema = new Schema<IChat>(
  {
    name: {
      type: String,
      default:"Chat Room",
      required: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "ChatMessage",
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "ChatMessage",
      },
    ],
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Model for Chat
export const ChatRoomModel: Model<IChat> = mongoose.model<IChat>("ChatRoom", ChatRoomSchema);
