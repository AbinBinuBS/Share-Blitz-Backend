import mongoose, { Schema, Model } from "mongoose";
import LikesInterface  from "../../../domain/entities/likes";

const LikesSchema:Schema<LikesInterface>=new Schema<LikesInterface>({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostModel',
       
    },
   likes:[{
    userId:{type:String,ref:'UserModel',required:true},
    createdAt:{type:Date,default:Date.now()}
   }]
});

const LikesModel:Model<LikesInterface>=mongoose.model<LikesInterface>('Likes',LikesSchema);
export default LikesModel 