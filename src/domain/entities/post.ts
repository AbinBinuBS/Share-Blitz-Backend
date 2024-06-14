import mongoose from "mongoose"
export default interface PostInterface {
    _id:string
    userId: mongoose.Schema.Types.ObjectId
    imageUrl : string
    caption:string
    hashtags:string[]
    taggedUsers: taggedUsersInterface[]
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
export interface taggedUsersInterface {
    userName:string,userId:mongoose.Schema.Types.ObjectId
}