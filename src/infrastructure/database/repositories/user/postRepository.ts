
import IPostRepository from "../../../../domain/interface/repositories/user/postRepositoryInterface";
import PostModel from "../../models/postModel";
class PostRepository implements IPostRepository {

    async createPost(postData:any):Promise<any> {
        try {
            console.log("create post worked in repo :",postData) 
          
            const newPost = new PostModel(postData)
            if(await newPost.save())
                return {success:true,data:newPost}
            return {success:false,message:"Something went wrong"}
           
        } catch (error) {
            console.log(error)
            return {duplicate: false,success:false}
        }
    } 
    
    async getAllPosts():Promise<any> {
        try {
            console.log("get all post worked in repo :") 
          
           const postData = await PostModel.find({isBlocked:false,isDeleted:false})
            if(postData)
                return {success:true,data:postData}
            return {success:false,message:"Something went wrong"}
           
        } catch (error) {
            console.log(error)
            return {duplicate: false,success:false}
        }
    } 

  


}

export default PostRepository