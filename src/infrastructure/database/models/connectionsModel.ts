import mongoose, { Schema, Model } from "mongoose";
import FollowingInterface from "../../../domain/entities/followings";
const FollowingSchema:Schema<FollowingInterface>=new Schema<FollowingInterface>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
       
    },
   followings:[{
    userId:{type:String,ref:'UserModel',required:true},
    createdAt:{type:Date,default:Date.now()}
   }],
   followers:[{
    userId:{type:String,ref:'UserModel',required:true},
    createdAt:{type:Date,default:Date.now()}
   }]
});

const ConnectionModel:Model<FollowingInterface>=mongoose.model<FollowingInterface>('Following',FollowingSchema);
export default ConnectionModel