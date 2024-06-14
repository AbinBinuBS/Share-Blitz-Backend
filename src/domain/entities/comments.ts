import mongoose from "mongoose";

// Interface for individual comments
interface Comment {
  _id:string
  userId: string;
  comment: string;
  replies: ReplyComment[];

  createdAt: Date;
}

// Interface for reply comments
export interface ReplyComment {
//   postId: string;
  userId: string;
  reply: string;
  isBlock: boolean;
  report: any[];
  likes: string[];
}

// Main Comments interface including nested comments and replies
export default interface CommentsInterface {
  _id: string;
  postId: mongoose.Schema.Types.ObjectId;
  comments: Comment[];
}
