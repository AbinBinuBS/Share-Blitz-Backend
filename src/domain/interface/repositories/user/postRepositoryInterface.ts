
import { CreatePostRequestModel } from "../../../entities/post"
interface UserRepositoryInterface {
    createPost(post: CreatePostRequestModel) : Promise <any>,
    getAllPosts() : Promise <any>,
    
}

// interface createPostInterface {
//     name:
// }

export default UserRepositoryInterface 
