import mongoose from "mongoose"
export default interface FollowingInterface {
    userId: mongoose.Schema.Types.ObjectId
    followings:[
        {userId:string,createdAt:Date}
    ],
    followers:[
        {userId:string}
    ]
} 