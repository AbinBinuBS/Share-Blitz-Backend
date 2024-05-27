import mongoose, { Schema, Model } from "mongoose";
import CommentsInterface  from "../../../domain/entities/comments";
import UserModel from "./userModel";
import PostModel from "./postModel";
const CommentsSchema:Schema<CommentsInterface>=new Schema<CommentsInterface>({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostModel',
       
    },
   comments:[{
    userId:{type:String,ref:'UserModel',required:true},
    comment:{type:String,required:true},
    createdAt:{type:Date,default:Date.now()}
   }]
});

const CommentsModel:Model<CommentsInterface>=mongoose.model<CommentsInterface>('Comments',CommentsSchema);
export default CommentsModel