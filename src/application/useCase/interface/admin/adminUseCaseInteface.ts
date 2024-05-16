import User from "../../../../domain/interface/repositories/user/userInterface"
export interface adminUseCaseInterface {
    getAllUsers():any
    toogleUserStatus(userId:string):any
}