

// import User from "../../../../domain/interface/repositories/user/userInterface";
import { Otp, UserLogin, UserRequestModel }  from "../../../entities/user";
import { UserRoles,UserLoginT } from "../../../../infrastructure/constants/userConstants";
interface UserRepositoryInterface {
    createUser(user: UserRequestModel) : Promise <any>,
    verifyOtp(otp: Otp) : Promise <any>,
    findByEmail(email:string) : Promise<any>,
    login(userData:UserLogin) : Promise<any>,
    getUserById(userId:string) : Promise< UserWithoutCredential | null>
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