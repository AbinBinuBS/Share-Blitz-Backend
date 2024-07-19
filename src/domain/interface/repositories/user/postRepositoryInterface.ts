
import SavedPostInterface from "../../../entities/SavedPost"
import CommentInterface from "../../../entities/comments"
import PostInterface, { CreatePostRequestModel } from "../../../entities/post"
interface PostRepositoryInterface {
    createPost(post: CreatePostRequestModel) : Promise <any>,
    getAllPosts(skip : number , limit : number) : Promise <any>,
    getPostsByLimitToAdmin(skip:number,limit:number,search:string) : Promise <any>,
    getAllPostsToAdmin() : Promise <any>,
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
    editPost(postId:string,postData:any) : Promise <any>,
    addReply(userId:string,postId:string,commentId:string,reply:any) :Promise <any>
    getReplies(postId:string,commentId:string) :Promise <any>
    savePost(userId:string,postId:string) :Promise <any>
    unSavePost(userId:string,postId:string) :Promise <any>
    findSavedPostsById(userId:string) : Promise <findSavedPostsByIdInterface>
    deleteComment(postId:string,commentId:string) :Promise <any>
    getTaggedPosts(userId:string) : Promise<any>
    tooglePostIsBlocked(postId:string) :Promise<any>
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

export interface findSavedPostsByIdInterface {
    success:Boolean
    message?:string
    data?:SavedPostInterface
}

export default PostRepositoryInterface 
