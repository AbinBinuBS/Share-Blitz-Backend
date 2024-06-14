import mongoose from "mongoose"

export interface savedPost {
    _id:string, postId:mongoose.Schema.Types.ObjectId
    ,creationTime:Date
}
export default interface SavedPostInterface {
    _id:string
    userId: mongoose.Schema.Types.ObjectId
  
    savedPosts: savedPost[]
  
    creationTime:Date
}