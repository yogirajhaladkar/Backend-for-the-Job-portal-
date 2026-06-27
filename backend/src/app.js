import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();

app.use(cors({
    origin: process.env.ORIGIN_URL,
    credentials: true
}
));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ limit: '16kb', extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

//routes    

import userRouter from './routes/user.routes.js';
import recruiterRouter from './routes/recruiter.routes.js';


app.use("/api/v1/user" , userRouter)
app.use("/api/v1/recruiters" , recruiterRouter)
 

export { app }

