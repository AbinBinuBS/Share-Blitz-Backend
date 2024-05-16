import mongoose, { Schema, Model } from "mongoose";
import PostInterface  from "../../../domain/entities/post";

const PostSchema:Schema<PostInterface>=new Schema<PostInterface>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
       
    },
    caption:{
        type:String,
        required:true
    },
    hashtags:{
        type:[String],
        required: true
    },
    imageUrl:{
        type:String,
        required:false,
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    like:{
        type:Number,
        default:0
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

const PostModel:Model<PostInterface>=mongoose.model<PostInterface>('Post',PostSchema);
export default PostModel