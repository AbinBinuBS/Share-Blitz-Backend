import { UserRoles,UserLoginT } from "../../infrastructure/constants/userConstants"

export interface UserRequestModel {
    name: string,
    email :string
    mobile: number
    userName:string
    password:string
}
export interface UserResponseModel {
    _id:string
    name: string,
    email :string
}
interface IFollow {
    id: string;
  }
export default interface UserI {
    _id:string
    name: string
    userName:string
    email :string
    mobile:string
    password:string,
    bio :string
    dob:string
    profileImageUrl:string
    backgroundImageUrl:string
    role:UserRoles
    location:string
    loginType:UserLoginT
    isVerified:Boolean
    isBlocked:Boolean
    isDeleted:Boolean
    creationTime:Date
    followings:IFollow[]
    followers:IFollow[]
    savedPost:savedPost[]
}
export interface UserLogin {
    email:string
    password:string
}
export interface Otp {
    otp:number
}

export interface savedPost {
    postId:string
}