import dotenv from 'dotenv';
dotenv.config();
import express from "express";

const app = express();

app.get('/', (req, res) => {
    res.send("hello")
});

// const port = process.env.PORT;
// app.listen(port, () => {
//     console.log(`port $`);
// });

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});