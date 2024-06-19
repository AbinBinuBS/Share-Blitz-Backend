import JWTtoken from "../utils/helpers/jwtToken"
import UserRepository from "../database/repositories/user/userRepository"
import { NextFunction } from "express"
import { Request, Response, } from "express";
import { UserRolesEnum } from "../constants/userConstants";
import { UserWithoutCredential } from "../../domain/interface/repositories/user/userRepositoryInterface";
import asyncHandlers from "../utils/handlers/asyncHandlers";
import ApiError from "../utils/handlers/ApiError";
const userRepository = new UserRepository()
const jwt = new JWTtoken()
import JWT,{JwtPayload} from 'jsonwebtoken'

// import jwt,{JwtPayload} from 'jsonwebtoken'


interface CustomRequest extends Request {
    userId?: string; 
    user?: UserWithoutCredential; 
}

 const userAuth1 =  async (req: CustomRequest ,res: Response,next: NextFunction) => {
   try {
    if(req.headers.authorization) {
        const token = req.headers.authorization

        const decoded = jwt.verifyJwt(token)

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

// export default userAuth


export const adminAuth1 = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        console.log("admin auth worked")
        const token = req.headers.authorization;

        if (!token) {
            console.log("Not token")
            return res.status(401).json({ success: false, message: "Unauthorized - Invalid token format" });
        }

        let decoded: JwtPayload | null = null;
        try {
            decoded = jwt.verifyJwt(token);
        } catch (err) {
            return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
        }

        console.log('Decoded:', decoded);
        if (decoded && decoded.role !== UserRolesEnum.ADMIN) {
            return res.status(403).json({ success: false, message: "Unauthorized - Insufficient privileges" });
        }

        const adminData: UserWithoutCredential | null = await userRepository.getUserById(decoded?.userId);
        if (!adminData) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        if (adminData.isBlocked) {
            return res.status(403).json({ success: false, message: "Admin is blocked" });
        }

        // req.userId = decoded?.userId;
        console.log("verified")
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



 const userAuth = asyncHandlers(async (req ,res,next) => {
    // console.log('auth/..................................')
   try {
    const token =  req.cookies?.accessToken || req.headers.authorization?.replace("Bearer","")
    // console.log("token :",token)
    if(!token) {
     throw new ApiError(401,"Unauthorized request")
    }
  
    const decodedToken=JWT.verify(token.trim(),process.env.ACCESS_TOKEN_SECRET as string ) as JwtPayload  


    // console.log(decodedToken)       

    const userData: UserWithoutCredential | null = await userRepository.getUserById(decodedToken?.id);
    // console.log("user data ",userData)

    if(!userData) {
     throw new ApiError(401,) 
     }
     req.userId = userData._id
     next()
   }catch (error: unknown) {
    console.log(error)
    if (error instanceof Error) {
      throw new ApiError(401,);
    } else {
      throw new ApiError(401,);
    }
  }

})

export default userAuth
 
export const adminAuth = asyncHandlers(async (req ,res,next) => {
    console.log('admin auth/..................................')
   try {
    const token =  req.cookies?.accessToken || req.headers.authorization?.replace("Bearer","")
    // console.log("token from admin :",token)
    if(!token) {
     throw new ApiError(401,"Unauthorized request")
    }
  
    const decodedToken=JWT.verify(token.trim(),process.env.ACCESS_TOKEN_SECRET as string ) as JwtPayload  


    console.log(decodedToken)      
    if (decodedToken && decodedToken.role !== UserRolesEnum.ADMIN) {
        throw new ApiError(403,"Insufficient privileges")
    } 

    const adminData: UserWithoutCredential | null = await userRepository.getUserById(decodedToken?.id);
    // console.log("user data ",adminData)

    if(!adminData) {
     throw new ApiError(401,)
     }
     req.userId = adminData._id
     next()
   }catch (error: unknown) {
    console.log(error)
    if (error instanceof Error) {
      throw new ApiError(401,);
    } else {
      throw new ApiError(401,);
    }
  }

})
// export default adminAuth
