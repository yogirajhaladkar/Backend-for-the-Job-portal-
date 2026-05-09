import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './db/index.js';

dotenv.config(
    {
        path: "./env"
})


console.log(process.env.MONGO_URI);
connectDB();

// import express from 'express';
// const appp =express();
// dotenv.config();
// const URI = process.env.MONGO_URI;
// ;(async () => {
//     try {
//         await mongoose.connect(`${URI}
//              /${DB_NMARE}`);
//              appp.on('errror', (error)=>{
//                 console.log('Error connecting to MongoDB' , error);
//                 throw error;
//              })

//              appp.listen(process.env.PORT, () => {
//                 console.log(`Server is running on port ${process.env.PORT}`);
//              });
//     } catch (error) {
//         console.error('Error connecting to MongoDB:', error);
//         throw error;
//     }
// })