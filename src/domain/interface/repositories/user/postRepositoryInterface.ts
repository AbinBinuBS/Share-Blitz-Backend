
import CommentInterface from "../../../entities/comments"
import PostInterface, { CreatePostRequestModel } from "../../../entities/post"
interface PostRepositoryInterface {
    createPost(post: CreatePostRequestModel) : Promise <any>,
    getAllPosts() : Promise <any>,
    getPostById(userId : string) : Promise <any>,
    getUserPosts(userId : string) : Promise <any>,
    findPostLikesByPostId(postId:string) : Promise < any>,
    likePost(postId:string,userId:string) : Promise < any>,
    unlikePost(postId:string,userId:string) : Promise < any>,
    findCommentsById(postId:string) : Promise < findCommentsByIdResponse>,
    addComment(postId:string,userId:string,comment:string) : Promise < CommentOnPostResponse>,
    findPostById(postId:string) : Promise<findPostByIdResponse>,
    reportPost(postId:string,userId:string,reason:string) : Promise <any>,
    deletePost(postId:string) : Promise <any>,
}

export interface findCommentsByIdResponse {
    success:Boolean
    message?:string
    data?:CommentInterface 
}

export interface findPostByIdResponse {
    success:Boolean
    message?:string
    data?:PostInterface
}

export interface CommentOnPostResponse {
    success:Boolean
    message?:string
    data?:CommentInterface
}

export default PostRepositoryInterface 
