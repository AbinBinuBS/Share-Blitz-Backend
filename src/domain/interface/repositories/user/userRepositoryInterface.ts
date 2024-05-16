

// import User from "../../../../domain/interface/repositories/user/userInterface";
import { Otp, UserLogin, UserRequestModel }  from "../../../entities/user";
import { UserRoles,UserLoginT } from "../../../../infrastructure/constants/userConstants";
interface UserRepositoryInterface {
    createUser(user: UserRequestModel) : Promise <any>,
    verifyOtp(otp: Otp) : Promise <any>,
    findByEmail(email:string) : Promise<any>,
    // findByUserId(email:string) : Promise<UserWithoutCredential>,
    // login(userData:UserLogin) : Promise<any>,
    getUserById(userId:string) : Promise< UserWithoutCredential | null>,
    Gsignup(user:GUserData) : Promise<any>
    getAllUsers() : Promise<getAllUsersInterface>
    toogleStatus(userId:string) : Promise<toogleStatusInterface>

} 
export default UserRepositoryInterface 

export interface UserWithoutCredential {
    _id:string
    name: string
    userName:string
    email :string
    mobile:string
    bio :string
    profileImageUrl:string
    backgroundImageUrl:string
    role:UserRoles
    location:string
    loginType:UserLoginT
    isVerified:Boolean
    isBlocked:Boolean
    isDeleted:Boolean
    creationTime:Date

}

export interface GUserData {
    name:string
    userName:string
    email:string
    password:string
    profileImageUrl:string
    loginType:string
}
export interface getAllUsersInterface {success:boolean ;data?:UserWithoutCredential[] | null ;message?:string}
export interface toogleStatusInterface {success:boolean ;data?:boolean ;message?:string}