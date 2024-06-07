import JWTtoken from "../utils/helpers/jwtToken"
import UserRepository from "../database/repositories/user/userRepository"
import { NextFunction } from "express"
import { Request, Response, } from "express";
import { UserRolesEnum } from "../constants/userConstants";
import { UserWithoutCredential } from "../../domain/interface/repositories/user/userRepositoryInterface";
import { JwtPayload } from "jsonwebtoken";
const userRepository = new UserRepository()
const jwt = new JWTtoken()
// import jwt,{JwtPayload} from 'jsonwebtoken'


interface CustomRequest extends Request {
    userId?: string; 
    user?: UserWithoutCredential; 
}

 const userAuth =  async (req: CustomRequest ,res: Response,next: NextFunction) => {
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

export default userAuth


export const adminAuth = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        
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

        req.userId = decoded?.userId;
        console.log("verified")
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



