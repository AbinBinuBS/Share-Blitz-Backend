
import { VerificationRepositoryInterface } from "../../../../domain/interface/repositories/user/verificationRepositoryInterface";
import VerificationModel from "../../models/verificationModel";
class VerificationRepository implements VerificationRepositoryInterface {

    async getVerificationDetailsByUserId(userId:string):Promise<any> {
        try {
            console.log("get  verification by user id repo:") 
            
            const result  = await VerificationModel.findOne({userId})
        
            console.log("result ",result)
            if(result)
                return {success:true,data:result}
            return {success:false }
           
        } catch (error) {
            console.log(error)
            return {message:"Failed to load  reports",success:false}
        }
    } 

    async submitVerification(userId:string,idUrl:string):Promise<any> {
        try {
            console.log("submit verification  id repo:") 
            
            const newVerification = new VerificationModel({
                userId,
                imageUrl: idUrl,
                payment: {
                 
                    paymentStatus: false, 
                }
            });

            const result = await newVerification.save();
        
            console.log("result ",result)
            if(result)
                return {success:true,data:result}
            return {success:false }
           
        } catch (error) {
            console.log(error)
            return {message:"Failed to create request  ",success:false}
        }
    }
    
    
    async updatePayment(userId:string,plan:string):Promise<any> {
        try {
            console.log("submit verification  id repo:") 
            
          
            const filter = { userId };
            const update = {
                $set: {
                    "payment.plan": plan,
                    "payment.paymentStatus": true,
                    "planActive": true
                }
            };
    
            const updatedVerification = await VerificationModel.findOneAndUpdate(filter, update, { new: true });
    
            if (!updatedVerification) {
                return { success: false, message: "Verification not found" };
            }
    
            return { success: true, data: updatedVerification };
           
        } catch (error) {
            console.log(error)
            return {message:"Failed to update  payment",success:false}
        }
    } 
    
    async getVerificationData():Promise<any> {
        try {
           const verificationData = await VerificationModel.find()
            if (!verificationData) {
                return { success: false, message: "Verification data not found" };
            }
    
            return { success: true, data: verificationData };
           
        } catch (error) {
            console.log(error)
            return {message:"Failed to update  payment",success:false}
        }
    } 

    async approveVerificationRequest(id:string):Promise<any> {
        try {
         
            const updatedVerification = await VerificationModel.findByIdAndUpdate(
                id,
                { verificationStatus: 'Approved' },
                { new: true } 
            );
    
            if (!updatedVerification) {
                return { success: false, message: 'Verification not found' };
            }
    
            return { success: true, data: updatedVerification };
           
        } catch (error) {
            console.log(error)
            return {message:"Failed to update  payment",success:false}
        }
    } 
    



}

export default VerificationRepository