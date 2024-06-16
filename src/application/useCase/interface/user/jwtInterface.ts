import { JwtPayload } from "jsonwebtoken"
interface IJwtToken{
    createJwt(userId:string,role:string):string,
    createJwtToken(userId:string,role:string,key:string,expiry:string):string,
    verifyJwt(token:string):JwtPayload|null,
    verifyOtp(token:string):JwtPayload|null
}

export default IJwtToken