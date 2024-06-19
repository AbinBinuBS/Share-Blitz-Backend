import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import UserModel from "../../infrastructure/database/models/userModel";
import ApiError from "../../infrastructure/utils/handlers/ApiError";
import asyncHandlers from "../../infrastructure/utils/handlers/asyncHandlers";
import ApiResponse from "../../infrastructure/utils/handlers/ApiResponse";

export const generateAccessAndRefreshTokens = async (userId: string) => {
  console.log("worked generate access && refresh token ")
    try {
      const user = await UserModel.findById(userId);
      console.log(user)
      if (!user) {
        throw new ApiError(404,"User not found")
      }
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save();
      return { refreshToken, accessToken };
    } catch (error) {
      throw new ApiError(500, 'Something went wrong while generating token');
    }
  }

 export const  refreshAccessTokens = asyncHandlers(async (req: Request, res: Response,next:NextFunction) => {
    try {
      console.log('..............................refresh acces tpokem service worked.....')
      // console.log(" indomng",req.body)

      const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
      }
      
      const decodedToken = jwt.verify(
        incomingRefreshToken.trim(),
        process.env.REFRESH_TOKEN_SECRET as string
      ) as jwt.JwtPayload;
      console.log("decode ",decodedToken)

      const user = await UserModel.findById(decodedToken?.id);
      console.log("user",user)

      if (!user) {
        throw new ApiError(401, "Invalid refresh token");
      }

      if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh token is expired");
      }
      const tokens = await generateAccessAndRefreshTokens(user._id);
      console.log("generated token while loginn",tokens)
      if (!tokens) {
          throw new ApiError(500, 'Could not generate new tokens');
      }
      
      const { accessToken, refreshToken } = tokens;
        const options = {
        httpOnly: true,
        secure: true,
        // sameSite: 'strict' as 'strict', // Assuming you want to enforce strict same-site policy
      };

     res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed"));
        return
    } catch (error) {
      // throw new ApiError(500, 'Something went wrong while refreshing token');
    }
  });

