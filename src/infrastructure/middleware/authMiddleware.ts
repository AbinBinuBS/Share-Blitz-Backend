import JWTtoken from "../utils/helpers/jwtToken"
import UserRepository from "../database/repositories/user/userRepository"
import { NextFunction } from "express"
import { Request, Response, } from "express";
import { UserRolesEnum } from "../constants/userConstants";
import { UserWithoutCredential } from "../../domain/interface/repositories/user/userRepositoryInterface";
const userRepository = new UserRepository()
const jwt = new JWTtoken()
// import jwt,{JwtPayload} from 'jsonwebtoken'


interface CustomRequest extends Request {
    userId?: string; 
    user?: UserWithoutCredential; 
}

 const userAuth =  async (req: CustomRequest ,res: Response,next: NextFunction) => {
   try {
    console.log('................................user auth')
    if(req.headers.authorization) {
        const token = req.headers.authorization
        console.log('Token :',token)

        const decoded = jwt.verifyJwt(token)
        // const decoded=jwt.verify(token,process.env.JWT_KEY as string) 

        console.log('decode --------',decoded)
        if(decoded && decoded.role !== UserRolesEnum.USER)
            return res.status(403).json({success:false,message:"Unauthorized"})
        if(decoded && decoded.userId){
            let userData : UserWithoutCredential | null= await userRepository.getUserById(decoded?.userId)

            if(userData?.isBlocked){
                return res.status(403).send({success:false,message:'User is blocked !!'})
            }else{
                req.userId=decoded.userId
                next()
            }
        }else{
            return res.status(401).send({success:false,message:"Unauthorized - Invalid token"})
        }
    } else {
        return res.status(401).send({success:false,message:"Unauthorized - Invalid token"})
    }
   } catch (error) {
    console.log(error)
   }
}
export default userAuth


// const protect = asyncHandler(async (req,res,next) => {
//     let token
// console.log("Auth jwt")
//     if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         try {
//             // Get token from header
//             token = req.headers.authorization.split(' ')[1]
//             console.log('Token : ',token)

//             //  Verify the token 
//             const decoded = jwt.verify(token, process.env.JWT_SECRET)
//             console.log('Decoded : ',decoded)
//             // Get user from token 
//             req.user = await User.findById(decoded.id).select('-password')
//             console.log('User',req.user)
//             next()
//         } catch (error){
//             console.log(error)
//             res.status(401)
//             throw new Error('Not authorized ')
//         }
//     }
//     if(!token) {
//         res.status(401)
//         throw new Error('Not authorized , no token')
//     }
// })
// module.exports ={ protect}