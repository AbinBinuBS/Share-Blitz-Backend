"use strict";
// import dotenv from 'dotenv';
// import {createServer as server} from './infrastructure/config/app';
// import getMongoDS from './infrastructure/database/Connection/Mongodb';
// import socketConfiguration from './infrastructure/Socket/socket';
// import { Server } from 'socket.io';
// dotenv.config(); 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
// (async () => { 
//     const dataSource = await getMongoDS();
//     const newServer =  server()
//        //socket.io
//        const io = new Server(newServer, {
//         pingTimeout: 60000,
//         cors: {
//             origin: true ,// base url,
//             methods: ["GET", "POST", "DELETE"],
//         }
//     })
//     socketConfiguration(io);
//     newServer?.listen(5000, () => console.log('Running on http://localhost:5000'));
// })();
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./infrastructure/config/app");
const Mongodb_1 = __importDefault(require("./infrastructure/database/Connection/Mongodb"));
const socket_1 = __importDefault(require("./infrastructure/Socket/socket"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
let io;
(() => __awaiter(void 0, void 0, void 0, function* () {
    const dataSource = yield (0, Mongodb_1.default)();
    const newServer = (0, app_1.createServer)();
    // socket.io
    exports.io = io = new socket_io_1.Server(newServer, {
        pingTimeout: 60000,
        cors: {
            origin: true, // base url,
            methods: ["GET", "POST", "DELETE"],
        },
    });
    (0, socket_1.default)(io);
    newServer === null || newServer === void 0 ? void 0 : newServer.listen(5000, () => console.log('Running on http://localhost:5000'));
}))();
