// import mongoose, { Schema, Model } from "mongoose";
// import FollowersInterface  from "../../../domain/entities/Followers";

// const FollowersSchema:Schema<FollowersInterface>=new Schema<FollowersInterface>({
//     postId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'PostModel',
       
//     },
//    Followers:[{
//     userId:{type:String,ref:'UserModel',required:true},
//     createdAt:{type:Date,default:Date.now()}
//    }]
// });

// const FollowersModel:Model<FollowersInterface>=mongoose.model<FollowersInterface>('Followers',FollowersSchema);
// export default FollowersModel