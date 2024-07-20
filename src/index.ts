// import dotenv from 'dotenv';
// import {createServer as server} from './infrastructure/config/app';
// import getMongoDS from './infrastructure/database/Connection/Mongodb';
// import socketConfiguration from './infrastructure/Socket/socket';
// import { Server } from 'socket.io';
// dotenv.config(); 



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
 

import dotenv from 'dotenv';
import { createServer as server } from './infrastructure/config/app';
import getMongoDS from './infrastructure/database/Connection/Mongodb';
import socketConfiguration from './infrastructure/Socket/socket';
import { Server } from 'socket.io';
import type { Server as SocketIOServer } from 'socket.io'; // Import the type

dotenv.config();

let io : SocketIOServer
 
(async () => {
    const dataSource = await getMongoDS();
    const newServer = server();

    // socket.io
    io = new Server(newServer, {
        pingTimeout: 60000,
        cors: {
            origin: true, // base url,
            methods: ["GET", "POST", "DELETE"],
        },
    });

    socketConfiguration(io);

    newServer?.listen(5000, () => console.log('Running on http://localhost:5000'));
})();

export { io };
