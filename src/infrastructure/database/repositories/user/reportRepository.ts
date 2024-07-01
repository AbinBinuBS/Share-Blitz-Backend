
import ConnectionRepositoryInterface from "../../../../domain/interface/repositories/user/connectionRepositoryInterface";
import IPostRepository from "../../../../domain/interface/repositories/user/postRepositoryInterface";
import mongoose from 'mongoose';

import ConnectionModel from "../../models/connectionsModel";
import ReportRepositoryInterface from "../../../../domain/interface/repositories/user/ReportRepositoryInterface";
import ReportModel from "../../models/reportModel";
class ReportRepository implements ReportRepositoryInterface {

    async getAllReportedPosts():Promise<any> {
        try {
            console.log("getall reports worked in repo :") 
            
            const result = await ReportModel.find()
        
            console.log("result ",result)
            if(result)
                return {success:true,data:result}
            return {success:false,message:"Failed to load  reports"}
           
        } catch (error) {
            console.log(error)
            return {duplicate: false,success:false}
        }
    } 

    async getReportsByPostId(postId:string):Promise<any> {
        try {
            console.log("getall reports worked in repo :") 
            
            const result = await ReportModel.find({postId})
        
            console.log("result ",result)
            if(result)
                return {success:true,data:result}
            return {success:false,message:"Failed to load  reports"}
           
        } catch (error) {
            console.log(error)
            return {duplicate: false,success:false}
        }
    } 
    async changeActionStatus(reportId : string):Promise<any> {
        try {
            console.log("Toggle action status worked in repo :");
        
        const report = await ReportModel.findById(reportId);

        if (!report) {
            return { success: false, message: "Report not found" };
        }
        
        const updatedReport = await ReportModel.findByIdAndUpdate(
            reportId, 
            { actionTaken: !report.actionTaken }, 
            { new: true }
        );

        console.log("result ", updatedReport);
        if (updatedReport) {
            return { success: true, data: updatedReport };
        }
        
        return { success: false, message: "Failed to change action status" };
        } catch (error) {
            console.log(error)
            return {duplicate: false,success:false}
        }
    } 
}

export default ReportRepository