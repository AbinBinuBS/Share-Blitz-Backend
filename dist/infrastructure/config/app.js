"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
// import express from "express";
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const authRoute_1 = __importDefault(require("../routes/user/authRoute"));
const userRoutes_1 = __importDefault(require("../routes/user/userRoutes"));
const postRoute_1 = __importDefault(require("../routes/user/postRoute"));
const adminRoute_1 = __importDefault(require("../routes/user/adminRoute"));
const chatRoute_1 = __importDefault(require("../routes/user/chatRoute"));
const notificationRoute_1 = __importDefault(require("../routes/user/notificationRoute"));
const cors_1 = __importDefault(require("cors"));
const createServer = () => {
    try {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use((0, cors_1.default)());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(express_1.default.json({ limit: "16kb" }));
        // app.use(cookieParser())
        // const ngrok = require('ngrok');
        app.use('/api/auth', authRoute_1.default);
        app.use('/api/post', postRoute_1.default);
        app.use('/api/admin', adminRoute_1.default);
        app.use('/api/user', userRoutes_1.default);
        app.use('/api/chat', chatRoute_1.default);
        app.use('/api/notifications', notificationRoute_1.default);
        const server = http_1.default.createServer(app);
        return server;
    }
    catch (error) {
        console.log(error);
    }
};
exports.createServer = createServer;
