import mongoose from "mongoose"
export default interface CommentInterface {
    _id:string
    postId: mongoose.Schema.Types.ObjectId
    comments:[
        {userId:string,comment:string,createdAt:Date}
    ]
}