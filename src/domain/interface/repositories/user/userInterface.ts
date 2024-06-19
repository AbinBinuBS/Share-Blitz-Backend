import { UserLoginT, UserRoles } from "../../../../infrastructure/constants/userConstants"

export default interface UserInterface {
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
    isPrivate:Boolean
    isBlocked:Boolean
    isDeleted:Boolean
    creationTime:Date
    
} 

