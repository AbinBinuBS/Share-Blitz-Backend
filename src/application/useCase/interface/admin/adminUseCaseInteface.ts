import User from "../../../../domain/interface/repositories/user/userInterface"
export interface adminUseCaseInterface {
    getAllUsers():any
    toogleUserStatus(userId:string):any
    getAllReportedPosts():any,
    getPostById(postId : string) : Promise<any>,
    getUser(userId :  string) : Promise<any>
    deletePost(postId : string) : Promise<any>
    changeActionStatus(reportId : string) : Promise<any>
    getVerificationData(): Promise<any>
    approveVerificationRequest(id:string) :Promise<any>
}