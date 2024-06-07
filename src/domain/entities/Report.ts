import mongoose, { Schema, Model } from "mongoose";

export interface ReportSchemaInterface {
    postId: mongoose.Schema.Types.ObjectId
    userId: mongoose.Schema.Types.ObjectId
    reason : string
    actionTaken:Boolean
    createdAt : Date
}