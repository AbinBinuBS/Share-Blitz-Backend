

import User from "../../../../domain/interface/repositories/user/userInterface";
import { UserRequestModel } from "../../../../domain/entities/user";

interface UserRepositoryInterface {
    createUser(user: UserRequestModel) : Promise <any>,
   
}

export default UserRepositoryInterface