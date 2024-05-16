// import express from "express";
import express from 'express'
import http from 'http'
import userRoute from '../routes/user/userRoute'
import postRoute from '../routes/user/postRoute'
import adminRoute from '../routes/user/adminRoute'
import cors from 'cors';
export const createServer = () => {
    try {
        const app = express()
        app.use(express.json())
        app.use(cors())
        app.use(express.urlencoded({ extended: true }))
       
        app.use('/api/user',userRoute)
        app.use('/api/post',postRoute)
        app.use('/api/admin',adminRoute)
        const server = http.createServer(app)

        return server;
    } catch (error) {
        console.log(error);
    }
} 