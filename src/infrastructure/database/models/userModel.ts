import mongoose, { Schema, Model } from "mongoose";
import UserI  from "../../../domain/entities/user";
import {AvailableUserRoles,UserRolesEnum} from "../../constants/userConstants"

const userSchema:Schema<UserI>=new Schema({
    name: {
        type: String,
        required:true
    },
    userName: {
        type: String,
        required: true,
        unique:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] 
    },
    mobile: {
        type: String,
        required: true,
        validate: {
            validator: function(v: string) {
                return /\d{10}/.test(v); 
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'] 
    },
    bio:{
        type:String,
        required:false,
    },
    profileImageUrl:{
        type:String,
        required:false,
    }, 
    backgroundImageUrl:{
        type:String,
        required:false,
    },
    role: {
        type: String, 
        enum:AvailableUserRoles,
        default: UserRolesEnum.USER  
    },
    location:{
        type:String,
        required:false,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    creationTime: {
        type: Date,
        default: Date.now
    }
});

const UserModel:Model<UserI>=mongoose.model<UserI>('user',userSchema);
export default UserModel