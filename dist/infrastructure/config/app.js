"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
// import express from "express";
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const userRoute_1 = __importDefault(require("../routes/user/userRoute"));
const cors_1 = __importDefault(require("cors"));
const createServer = () => {
    try {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use((0, cors_1.default)());
        app.use(express_1.default.urlencoded({ extended: true }));
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
        app.use('/api/user', userRoute_1.default);
        const server = http_1.default.createServer(app);
        // socketServer(server)
        return server;
    }
    catch (error) {
        console.log(error);
    }
};
exports.createServer = createServer;
