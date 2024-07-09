
import   mongoose, { Types } from "mongoose";

const { ObjectId } = Types;
import PostRepositoryInterface, { findCommentsByIdResponse, findSavedPostsByIdInterface } from "../../../../domain/interface/repositories/user/postRepositoryInterface";
import LikesModel from "../../models/likesModel";
import PostModel from "../../models/postModel";
import CommentsModel from "../../models/commentsModel";
import CommentInterface from "../../../../domain/entities/comments";
import PostInterface from "../../../../domain/entities/post";
import ReportModel from "../../models/reportModel";
import SavedPostModel from "../../models/savedModel";

class PostRepository implements PostRepositoryInterface {

    async createPost(postData:any):Promise<any> {
        try {
            // console.log("create post worked in repo :",postData) 
          
            const newPost = new PostModel(postData)
            if(await newPost.save())
                return {success:true,data:newPost}
            return {success:false,message:"Something went wrong"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
    } 
    async findPostById(postId:string){
        try {
            console.log("getpostby id worked",postId) 
          
            const postData = await PostModel.findById(postId)
            if(postData)
                return {success:true,data:postData}
            return {success:false,message:"Post not available"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
    } 
    async tooglePostIsBlocked (postId : string) {
      try {
        // Find the user by userId
        const post = await PostModel.findById(postId);
  
        if (!post) {
            return { success: false, message: "Post not found" };
        }
        post.isBlocked = !post.isBlocked;
  
        await post.save();
  
        return { success: true, data: post };
    } catch (error) {
        console.log(error);
        return { success: false, message: "Failed to block post" };
    }
    }
    
    async getAllPosts(skip : number , limit : number) {
        try {
            console.log("get all post worked in repo :", skip,limit) 
          
        //    const postData = await PostModel.find({isBlocked:false,isDeleted:false}).sort({ creationTime: -1 });
       
        const postData = await PostModel.aggregate([
            {
              $match: { isBlocked: false,
                isDeleted: false}
            },
           
            {
              $lookup: {
                from: 'likes', // the name of the Likes collection
                localField: '_id',
                foreignField: 'postId',
                as: 'likesDetails'
              }
            },
            {
              $lookup: {
                from: 'comments', // the name of the Comments collection
                localField: '_id',
                foreignField: 'postId',
                as: 'commentsDetails'
              }
            },
            {
              $unwind: {
                path: '$likesDetails',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $unwind: {
                path: '$commentsDetails',
                preserveNullAndEmptyArrays: true
              }
            },
            {
                $sort: {
                  creationTime: -1 
                }
            },
            {
              $skip: skip
            },
            {
                $limit: limit
            }

          ]);
            if(postData)
                return {success:true,data:postData}
            return {success:false,message:"Something went wrong"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
    } 


    async getAllPostsToAdmin( ) {
      try {
          // console.log("get all post worked in repo :", skip,limit) 
        
      //    const postData = await PostModel.find({isBlocked:false,isDeleted:false}).sort({ creationTime: -1 });
     
      const postData = await PostModel.aggregate([
         
         
          {
            $lookup: {
              from: 'likes', // the name of the Likes collection
              localField: '_id',
              foreignField: 'postId',
              as: 'likesDetails'
            }
          },
          {
            $lookup: {
              from: 'comments', // the name of the Comments collection
              localField: '_id',
              foreignField: 'postId',
              as: 'commentsDetails'
            }
          },
          {
            $unwind: {
              path: '$likesDetails',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $unwind: {
              path: '$commentsDetails',
              preserveNullAndEmptyArrays: true
            }
          },
          {
              $sort: {
                creationTime: -1 
              }
          },
          // {
          //   $skip: skip
          // },
          // {
          //     $limit: limit
          // }

        ]);
          if(postData)
              return {success:true,data:postData}
          return {success:false,message:"Something went wrong"}
         
      } catch (error) {
          console.log(error)
          return {message: 'something went wrong',success:false}
      }
  } 
    
  
  async getPostsByLimitToAdmin(skip:number,limit:number ) {
    try {
       
    const postData = await PostModel.aggregate([
       
       
        {
          $lookup: {
            from: 'likes', // the name of the Likes collection
            localField: '_id',
            foreignField: 'postId',
            as: 'likesDetails'
          }
        },
        {
          $lookup: {
            from: 'comments', // the name of the Comments collection
            localField: '_id',
            foreignField: 'postId',
            as: 'commentsDetails'
          }
        },
        {
          $unwind: {
            path: '$likesDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $unwind: {
            path: '$commentsDetails',
            preserveNullAndEmptyArrays: true
          }
        },
        {
            $sort: {
              creationTime: -1 
            }
        }
        ,
        {
          $skip: skip
        },
        {
            $limit: limit
        }

      ]);
        if(postData)
            return {success:true,data:postData}
        return {success:false,message:"Something went wrong"}
       
    } catch (error) {
        console.log(error)
        return {message: 'something went wrong',success:false}
    }
} 

    async getPostById(postId : string) {
        try {
            console.log("get all post worked in repo :",postId) 
           const postData = await PostModel.aggregate([
            {
              $match: { isBlocked: false,
                isDeleted: false,
                _id:new ObjectId(postId)
                 }
            }, 
            {
              $lookup: {
                from: 'likes', // the name of the Likes collection
                localField: '_id',
                foreignField: 'postId',
                as: 'likesDetails'
              }
            },
            {
              $lookup: {
                from: 'comments', // the name of the Comments collection
                localField: '_id',
                foreignField: 'postId',
                as: 'commentsDetails'
              }
            },
            {
              $unwind: {
                path: '$likesDetails',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $unwind: {
                path: '$commentsDetails',
                preserveNullAndEmptyArrays: true
              }
            },
            {
                $sort: {
                  creationTime: -1 
                }
              }
          ]);
        // console.log('postdata :',postData)
            if(postData.length)
                return {success:true,data:postData[0]}
            return {success:false,message:"Post not found"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
    } 

    async getUserPosts(userId : string):Promise<any> {
        try {
          console.log('user id ;',userId)
        //    const postData = await PostModel.find({userId,isBlocked:false,isDeleted:false})
           const postData = await PostModel.aggregate([
            {
              $match: { 
                userId: new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId
                isBlocked: false,
                isDeleted: false}
            },
           
            {
              $lookup: {
                from: 'likes', // the name of the Likes collection
                localField: '_id',
                foreignField: 'postId',
                as: 'likesDetails'
              }
            },
            {
              $lookup: {
                from: 'comments', // the name of the Comments collection
                localField: '_id',
                foreignField: 'postId',
                as: 'commentsDetails'
              }
            },
            {
              $unwind: {
                path: '$likesDetails',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $unwind: {
                path: '$commentsDetails',
                preserveNullAndEmptyArrays: true
              }
            },
            {
                $sort: {
                  creationTime: -1 
                }
              }
          ]);
          // console.log("postdata  ;",postData)
            if(postData)
                return {success:true,data:postData}
            return {success:false,message:"Something went wrong"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
    } 


    async editPost(postId : string,postData:any):Promise<any> {
      try {
          console.log("edit postss worked in repo :") 
          const updatePostData = await PostModel.findByIdAndUpdate(postId,postData ,{ new: true })
          console.log(updatePostData)
          if (!updatePostData) {
            return { success: false, message: 'Failed to update post details' };
          }

        return { success: true, postData: updatePostData };

         
      } catch (error) {
          console.log(error)
          return {message: 'something went wrong',success:false}
      }
  } 

    async findPostLikesByPostId(postId : string):Promise<any> {
        try {
            console.log("get user postss worked in repo :") 
          
           const likeData = await LikesModel.findOne({postId})
            if(likeData)
                return {success:true,data:likeData}
            return {success:false,message:"Something went wrong"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
    } 

    
    async likePost(postId : string,userId:string):Promise<any> {
        try {
            // console.log("get user postss worked in repo :") 
          
           const likeData = await LikesModel.findOneAndUpdate({postId},{$push:{likes:{userId}}},   { new: true, useFindAndModify: false })
           console.log("like post repo: ",likeData)
            if(likeData)
                return {success:true,data:likeData}
            return {success:false,message:"Something went wrong"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
    } 

     
    async unlikePost(postId : string,userId:string):Promise<any> {
        try {
            // console.log("get user postss worked in repo :") 
          
           const likeData = await LikesModel.findOneAndUpdate({postId},{$pull:{likes:{userId}}},   { new: true, useFindAndModify: false })
           console.log("unlike post repo: ",likeData)
            if(likeData)
                return {success:true,data:likeData}
            return {success:false,message:"Something went wrong"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
    } 

    async findCommentsById(postId : string):Promise<findCommentsByIdResponse> {
        try {
            // console.log("get user postss worked in repo :") 
          
           const commentData:CommentInterface | null= await CommentsModel.findOne({postId})
            if(commentData)
                return {success:true,data:commentData}
            return {success:false,message:"Comments not available"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
    }
    async addComment(postId : string,userId:string,comment:string):Promise<findCommentsByIdResponse> {
        try {
            console.log("add comment worked in repo :") 
          
           const commentData:CommentInterface | null= await CommentsModel.findOneAndUpdate({postId},{$push:{comments:{comment,userId}}},  { new: true, useFindAndModify: false })
           console.log(commentData)
            if(commentData)
                return {success:true,data:commentData}
            return {success:false,message:"Comments not available"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
    }

 async addReply (userId: string, postId:string,commentId: string, reply: string) {
      try {

    const comment = await CommentsModel.findOneAndUpdate(
      {postId:postId, "comments._id": commentId },
      { $push: { "comments.$.replies": { userId, reply } } },
      { new: true }
    );
    // console.log("commentss :",comment)
        if (comment) {
          const newReply = comment.comments
            .find(c => c._id.toString() === commentId)
            ?.replies.slice(-1)[0]; // Get the last reply added
    
          // console.log("result:", comment);
          // console.log("newReply:", newReply);
    
          return { success: true, data: newReply };
        } else {
          return { success: false, message: "Comment not found" };
        }
      } catch (err) {
        console.error("An error occurred:", err);

        let errorMessage = "An unknown error occurred";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
    
        return { success: false, message: errorMessage };
      }
    };


    async getReplies ( postId:string,commentId: string) {
      try {
        const comment = await CommentsModel.findOne(
          { postId: postId, "comments._id": commentId },
          { "comments.$": 1 }  // Project only the matching comment
        );
    
        if (comment) {
          const replies = comment.comments[0].replies; // Get all replies of the matching comment
    
          // console.log("result:", comment);
          // console.log("replies:", replies);
    
          return { success: true, data: replies };
        } else {
          return { success: false, message: "Comment not found" };
        }
      } catch (err) {
        console.error("An error occurred:", err);
    
        let errorMessage = "An unknown error occurred";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
    
        return { success: false, message: errorMessage };
      }
    }
    

    async reportPost(postId : string,userId:string,reason:string):Promise<any> {
        try {
        const newReport = new ReportModel({postId,userId,reason})
        if(await newReport.save())
            return {success:true,data:newReport}
        return {success:false,message:"Something went wrong"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
    }
    async deletePost(postId : string):Promise<any> {
        try {
      
          const post = await PostModel.findById(postId);
        
          if (!post) {
              return { success: false, message: "Post not found" };
          }
          
          const updatedPost = await PostModel.findByIdAndUpdate(
              postId, 
              { isDeleted: !post.isDeleted }, 
              { new: true }
          );
  
          return { success: true, data: updatedPost };
        // return {success:false,message:"Something went wrong"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
    }


      async savePost(userId:string,postId : string):Promise<any> {
        try {
            const savePost = await SavedPostModel.findOneAndUpdate({userId}, { $push:{ savedPosts: {  postId } }},{upsert:true, new: true});
            if (savePost) {

                return { success: true,data: savePost };
            }
        return {success:false,message:"Failed to save post"}
          
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
      }
      async  unSavePost(userId: string, postId: string): Promise<any> {
        try {
            const unSavePost = await SavedPostModel.findOneAndUpdate(
                { userId: new mongoose.Types.ObjectId(userId) },
                { $pull: { savedPosts: { postId: new mongoose.Types.ObjectId(postId) } } },
                { new: true }
            );
    
            if (unSavePost) {
                return { success: true, data: unSavePost };
            }
    
            return { success: false, message: "Failed to un save post" };
            
        } catch (error) {
            console.log(error);
            return { success: false, message: 'Something went wrong' };
        }
    }

      async findSavedPostsById(userId:string):Promise<findSavedPostsByIdInterface> {
        try {
            const savedPosts = await SavedPostModel.findOne({userId :new mongoose.Types.ObjectId(userId)});
            if (savedPosts) {

                return { success: true,data: savedPosts };
            }
        return {success:false,message:"Failed to find posts"}
           
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
      }

      async deleteComment(postId:string,commentId:string):Promise<any> {
        try {
          const postComments = await CommentsModel.findOne({ postId });
          if (!postComments) {
              return { success: false, message: "Post not found" };
          }
  
          const commentIndex = postComments.comments.findIndex(comment => comment._id.toString() === commentId);
          if (commentIndex === -1) {
              return { success: false, message: "Comment not found" };
          }
  
          postComments.comments.splice(commentIndex, 1);
          await postComments.save();
  
          return { success: true, data: postComments };
        } catch (error) {
            console.log(error)
            return {message: 'something went wrong',success:false}
        }
      }

      async getTaggedPosts(userId:string):Promise<any> {
        try {
          const posts = await PostModel.aggregate([
            {
              $match: {
                isBlocked: false,
                isDeleted: false,
                "taggedUsers.userId": new ObjectId(userId)
              }
            },
            {
              $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'postId',
                as: 'likesDetails'
              }
            },
            {
              $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'postId',
                as: 'commentsDetails'
              }
            },
            {
              $unwind: {
                path: '$likesDetails',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $unwind: {
                path: '$commentsDetails',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $sort: {
                creationTime: -1
              }
            }
          ]);
          // console.log("response taggg....",userId,posts)
          if(posts)
          return { success: true, data: posts };
          return { success: false, message: "Failed to fetch posts" };
        } catch (error) {
          console.error(error);
          return { success: false, message: "Failed to fetch posts" };
  
      }
    }
      

}

export default PostRepository