import mongoose from "mongoose"
export default interface PostInterface {
    userId: mongoose.Schema.Types.ObjectId
    imageUrl : string
    caption:string
    hashtags:string[]
    isBlocked:Boolean
    like:number
    isDeleted:Boolean
    creationTime:Date
}
export interface CreatePostRequestModel {
   userId:string
   imageUrl:string
   caption:string
   hashtags:string[]
}