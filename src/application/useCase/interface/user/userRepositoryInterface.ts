

import User from "../../../../domain/interface/repositories/user/userInterface";
import { Otp, UserLogin, UserRequestModel } from "../../../../domain/entities/user";
import { GUserData } from "../../../../domain/interface/repositories/user/userRepositoryInterface";

interface UserRepositoryInterface {
    // Gsignup(arg0: GUserData): unknown;
    createUser(user: UserRequestModel) : Promise <any>,
    verifyOtp(otp: Otp) : Promise <any>,
    findByEmail(email:string) : Promise<any>,
    login(userData:UserLogin) : Promise<any>,
    getUserById(userId:string) : Promise<any>,
    getAllUsers(userId:string) : Promise<any>
}

// export default UserRepositoryInterface 