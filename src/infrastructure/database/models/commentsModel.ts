import mongoose, { Schema, Model } from "mongoose";
import CommentsInterface, { ReplyComment }  from "../../../domain/entities/comments";


const replyCommentSchema = new Schema<ReplyComment>(
    {
      
      userId: {
        type: String,
        required: true,
      },
      reply: {
        type: String,
        required: true,
      },
      isBlock: {
        type: Boolean,
        default: false,
      },
      report: [],
      likes: [
        {
          type: String,
        },
      ],
    },
    {
      timestamps: true,
    }
  );

const CommentsSchema:Schema<CommentsInterface>=new Schema<CommentsInterface>({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostModel',
       
    },
   comments:[{
    userId:{type:String,ref:'UserModel',required:true},
    comment:{type:String,required:true},
   replies: [replyCommentSchema],

    createdAt:{type:Date,default:Date.now}
   }],

});

const CommentsModel:Model<CommentsInterface>=mongoose.model<CommentsInterface>('Comments',CommentsSchema);
export default CommentsModel