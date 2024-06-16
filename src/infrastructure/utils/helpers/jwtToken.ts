import IJwtToken from "../../../application/useCase/interface/user/jwtInterface";
import jwt,{JwtPayload} from 'jsonwebtoken'

class JWTtoken implements IJwtToken{
    createJwt(userId: string, role: string): string {
        const jwtKey=process.env.JWT_KEY
        if(jwtKey){
            const token:string=jwt.sign({id:userId,role:role},jwtKey)
            return token
        }
        throw new Error('JWT key is not defined')
    }
    createJwtToken(userId: string, role: string,jwtKey:string,expiry:string): string {
        
        console.log('.............')

            const token:string=jwt.sign({id:userId,role:role},jwtKey,{expiresIn:expiry})
            const decode=jwt.verify(token,jwtKey) as JwtPayload  
            console.log('created token :',token)
            console.log("decoded data :",decode)
            console.log('.............')

            return token
    
    }
    verifyJwt(token: string): JwtPayload | null {
        try{
            const jwtKey=process.env.ACCESS_TOKEN_SECRET as string
         
            const decode=jwt.verify(token,jwtKey) as JwtPayload  
            console.log("decoed token in verifyjwt :",decode)
            return decode
        }catch(error){
            console.log(error)
            return null
        }
    }
    verifyOtp(token: string): jwt.JwtPayload | null {
        try {
            const jwtKey=process.env.JWT_KEY as string
            const decode=jwt.verify(token,jwtKey) as JwtPayload
            return decode
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

export default JWTtoken