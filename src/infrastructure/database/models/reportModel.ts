import mongoose, { Schema, Model } from "mongoose";
import { ReportSchemaInterface } from "../../../domain/entities/Report";

const ReportSchema:Schema<ReportSchemaInterface>=new Schema<ReportSchemaInterface>({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostModel',
       required:true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required:true
    },
    reason :{
        type:String, required:true
    } ,
    actionTaken: {
        type: Boolean,
        default: false
    },
    createdAt :{
        type : Date,default:Date.now()
    }
});

const ReportModel:Model<ReportSchemaInterface>=mongoose.model<ReportSchemaInterface>('Reports',ReportSchema);
export default ReportModel