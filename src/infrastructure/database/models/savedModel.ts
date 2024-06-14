import mongoose, { Schema, Model } from "mongoose";

import SavedPostInterface, { savedPost } from "../../../domain/entities/SavedPost";
const SavedPost = new Schema<savedPost>({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    creationTime: {
        type: Date,
        default: Date.now
    }
});

const SavedPostSchema:Schema<SavedPostInterface>=new Schema<SavedPostInterface>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    },
   savedPosts:[SavedPost],
    creationTime: {
        type: Date,
        default: Date.now
    }
});



const SavedPostModel:Model<SavedPostInterface>=mongoose.model<SavedPostInterface>('SavedPost',SavedPostSchema);
export default SavedPostModel