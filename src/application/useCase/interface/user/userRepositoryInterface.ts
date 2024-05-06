

import User from "../../../../domain/interface/repositories/user/userInterface";
import { Otp, UserRequestModel } from "../../../../domain/entities/user";

interface UserRepositoryInterface {
    createUser(user: UserRequestModel) : Promise <any>,
    verifyOtp(otp: Otp) : Promise <any>,
   findByEmail(email:string) : Promise<any>
}

export default UserRepositoryInterface