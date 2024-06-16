import dotenv from 'dotenv';
dotenv.config();

const configKeys = {
PORT: process.env.PORT,

MONGO_URL: process.env.MONGODB_URL as string,
ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
ACCESS_TOKEN_EXPIRY: process.env.AACCESS_TOKEN_EXPIRY as string,
REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
REFRESH_TOKEN_EXPIRY : process.env.REFRESH_TOKEN_EXPIRY  as string,

}

export default configKeys;