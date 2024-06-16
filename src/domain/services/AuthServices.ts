// import bcrypt from "bcryptjs";
// import bcrypt
import jwt from "jsonwebtoken";
import configKeys from "../../infrastructure/constants/Keys";

export const authService = () => {

   

    const generateAccessToken = (payload: {userId: string, role: string}) => {
        const accessToken = jwt.sign( payload, configKeys.ACCESS_TOKEN_SECRET, {
            expiresIn: configKeys.ACCESS_TOKEN_EXPIRY
        })
        return accessToken;
    }
    
    const generateRefreshToken = (payload: { userId: string, role: string}) => {
        const refreshToken = jwt.sign( payload, configKeys.REFRESH_TOKEN_SECRET, {
            expiresIn: configKeys.REFRESH_TOKEN_EXPIRY
        })
        return refreshToken;
    }

    const verifyAccessToken = (token: string) => {
        const payload : { userId: string, role: string }=  jwt.verify(token,configKeys.ACCESS_TOKEN_SECRET) as { userId: string, role: string };
        return payload;
    }

    const verifyRefreshToken = (token: string) => {
        const payload : { userId: string, role: string }=  jwt.verify(token,configKeys.REFRESH_TOKEN_SECRET) as { userId : string, role: string };
        return payload;
    }

    return {
      
        generateAccessToken,
        generateRefreshToken,
        verifyAccessToken,
        verifyRefreshToken
    }
}

export type AuthService = typeof authService;
export type AuthServiceReturn = ReturnType<AuthService>;