export interface VerificationRepositoryInterface {
    getVerificationDetailsByUserId(userId:string) : Promise <any>,
    submitVerification(userId:string,idUrl:string) : Promise <any>
    updatePayment(userId:string,plan:string) : Promise <any>
    getVerificationData():Promise<any>
    approveVerificationRequest(id:string) :Promise<any>
} 