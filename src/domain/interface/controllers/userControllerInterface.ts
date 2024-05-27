import { Request } from "express"
import { UserWithoutCredential } from "../repositories/user/userRepositoryInterface";
export interface RequestWithUserId extends Request {
    useridd :string
}

export interface CustomRequest extends Request {
    userId?: string; 
    user?: UserWithoutCredential; 
}

export interface EditProfileUserDataInterface {
    name:string
    userName :string
    email:string
    mobile:string
    profileImageUrl:string
    bio:string
    dob:string
}