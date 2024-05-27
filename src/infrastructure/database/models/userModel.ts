import mongoose, { Schema, Model } from "mongoose";
import UserI  from "../../../domain/entities/user";
import LikesModel from "./likesModel";
import {AvailableSocialLogins, AvailableUserRoles,UserLoginType,UserRolesEnum} from "../../constants/userConstants"
import CommentsModel from "./commentsModel";
import ConnectionModel from "./connectionsModel";

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
        required: false,
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
    dob:{
        type:String,
        required:false,
    },
    profileImageUrl:{
        type:String,
        required:false,
        default:`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4eMoz7DH8l_Q-iCzSc1xyu_C2iryWh2O9_FcDBpY04w&s`
    }, 
    backgroundImageUrl:{
        type:String,
        required:false,
        default:  `https://e0.pxfuel.com/wallpapers/105/23/desktop-wallpaper-compromised-character-gaming-profile-dark-cute-cartoon-boys-thumbnail.jpg`,
         
    },
    role: {
        type: String, 
        enum:AvailableUserRoles,
        default: UserRolesEnum.USER  
    },
    loginType:{
        type:String,
        enum:AvailableSocialLogins,
        default:UserLoginType.EMAIL_PASSWORD
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
    },
    savedPost :[{
        postId:{type:String,required:false}
    }],
    followings:[{
        id:{type:String,required:true}

    }],
    followers:[{
        id:{type:String,required:true}

    }]
});




userSchema.post("save", async function (user, next) {

    const connections = await ConnectionModel.findOne({userId:user._id})
 
      if (!connections) {
      await ConnectionModel.create({
        userId: user._id,
        followings:[],
        followers:[]
      });
    }
    next();
  });

  

const UserModel:Model<UserI>=mongoose.model<UserI>('User',userSchema);
export default UserModel