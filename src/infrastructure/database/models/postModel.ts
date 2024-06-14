import mongoose, { Schema, Model } from "mongoose";
import PostInterface  from "../../../domain/entities/post";
import LikesModel from "./likesModel";
import CommentsModel from "./commentsModel";
const taggedUserSchema = new Schema({
    userName: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

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
    taggedUsers:{
      type: [taggedUserSchema],
      required: false
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
  try {
    // Using Promise.all to run both async operations concurrently
        await Promise.all([
            LikesModel.findOneAndUpdate(
                { postId: post._id },
                { $setOnInsert: { postId: post._id, likes: [] } },
                { upsert: true, new: true }
            ),
            CommentsModel.findOneAndUpdate(
                { postId: post._id },
                { $setOnInsert: { postId: post._id, comments: [] } },
                { upsert: true, new: true }
            )
        ]);
    } catch (error) {
        return ;
    }
    next();
  });

const PostModel:Model<PostInterface>=mongoose.model<PostInterface>('Post',PostSchema);
export default PostModel