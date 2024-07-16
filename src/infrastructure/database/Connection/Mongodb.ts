import mongoose from "mongoose";
async function getMongoDS() {
        
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}`);
        console.log('MongoDB database connection established successfully 🚀');
        return
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error; 
    }   
}  
export default  getMongoDS