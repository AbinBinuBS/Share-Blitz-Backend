// import express from "express";
import express from 'express'
import http from 'http'
import userRoute from '../routes/user/userRoute'
import cors from 'cors';
export const createServer = () => {
    try {
        const app = express()
        app.use(express.json())
        app.use(cors())
        app.use(express.urlencoded({ extended: true }))
        // app.use(cookieParser())
        // app.use(
        //     cors({
        //         origin: 'http://localhost:5173',
        //         methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        //         credentials: true
        //     })
        // )ssssss22222222vvSDzz
        // app.use('/api/seller', sellerRoute)
        // app.use('/api/buyer', buyerRoute)
        // app.use('/api/admin', adminRoute)
        // app.use('/api/chat', chatRoute)
        // app.use('/api/book',reservationRoute)
        // 204795v22222222vv
        app.use('/api/user',userRoute)
        const server = http.createServer(app)
        // socketServer(server)

        return server;
    } catch (error) {
        console.log(error);
    }
}