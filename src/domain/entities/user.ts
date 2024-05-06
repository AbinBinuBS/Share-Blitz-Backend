import { UserRoles } from "../../infrastructure/constants/userConstants"

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

export default interface UserI {
    _id:string
    name: string
    userName:string
    email :string
    mobile:string
    password:string,
    bio :string
    profileImageUrl:string
    backgroundImageUrl:string
    role:UserRoles
    location:string
    isVerified:Boolean
    isBlocked:Boolean
    isDeleted:Boolean
    creationTime:Date
}
export interface Otp {
    otp:number
}