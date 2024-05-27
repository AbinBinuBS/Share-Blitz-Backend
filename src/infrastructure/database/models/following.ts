// import mongoose, { Schema, Model } from "mongoose";
// import FollowingInterface  from "../../../domain/entities/Following";

// const FollowingSchema:Schema<FollowingInterface>=new Schema<FollowingInterface>({
//     postId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'PostModel',
       
//     },
//    Following:[{
//     userId:{type:String,ref:'UserModel',required:true},
//     createdAt:{type:Date,default:Date.now()}
//    }]
// });

// const FollowingModel:Model<FollowingInterface>=mongoose.model<FollowingInterface>('Following',FollowingSchema);
// export default FollowingModel