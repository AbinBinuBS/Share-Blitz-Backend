import mongoose from "mongoose"
export default interface LikesInterface {
    postId: mongoose.Schema.Types.ObjectId
    likes:[
        {userId:string,createdAt:Date}
    ]
}