import mongoose, { Schema, Model } from "mongoose";
import PostInterface  from "../../../domain/entities/post";
import LikesModel from "./likesModel";
import CommentsModel from "./commentsModel";

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

PostSchema.post("save", async function (post, next) {

    const likes = await LikesModel.findOne({postId:post._id})
    const comments = await CommentsModel.findOne({postId:post._id})
  
    // Setup necessary ecommerce models for the user
    if (!likes) {
      await LikesModel.create({
        postId: post._id,
        likes:[]
      });
    }
    if (!comments) {
      await CommentsModel.create({
        postId: post._id,
        comments: [],
      });
    }
  
    next();
  });

const PostModel:Model<PostInterface>=mongoose.model<PostInterface>('Post',PostSchema);
export default PostModel