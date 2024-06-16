// import express from "express";
import express from 'express'
import http from 'http'
import authRoute from '../routes/user/authRoute'
import userRoute from '../routes/user/userRoutes'
import postRoute from '../routes/user/postRoute'
import adminRoute from '../routes/user/adminRoute'
import cors from 'cors';
export const createServer = () => {
    try {
        const app = express()
        app.use(express.json())
        app.use(cors(
           
        ))
        app.use(express.urlencoded({ extended: true }))
        app.use(express.json({limit:"16kb"}))
        // app.use(cookieParser())
       
        app.use('/api/auth',authRoute)
        app.use('/api/post',postRoute)
        app.use('/api/admin',adminRoute)
        app.use('/api/user',userRoute)
        const server = http.createServer(app)

        return server;
    } catch (error) {
        console.log(error);
    }
} 