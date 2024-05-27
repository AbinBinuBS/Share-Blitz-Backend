import dotenv from 'dotenv';
import {createServer as server} from './infrastructure/config/app';
import getMongoDS from './infrastructure/database/Connection/Mongodb';
dotenv.config(); 



(async () => { 
    const dataSource = await getMongoDS();
    const newServer =  server()
    newServer?.listen(5000, () => console.log('Running on http://localhost:5000'));
})();
 