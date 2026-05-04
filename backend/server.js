import dotenv from 'dotenv';
import express from "express";

dotenv.config();

const app = express();


app.get('/api/jokes', (req, res) => {
    const jokes = [
        {
            id: 1,
            title: "First Joke",
            content: "Why did the scarecrow win an award? Because he was outstanding in his field!"
        },
        {
            id: 2,
            title: "Second Joke",
            content: "Why don't scientists trust atoms? Because they make up everything!"
        },
        {
            id: 3,
            title: "Third Joke",
            content: "What do you call a fake noodle? An impasta!"
        },
        {
            id: 4,
            title: "Fourth Joke",
            content: "Why did the bicycle fall over? Because it was two tired!"
        },
        {
            id: 5,
            title: "Fifth Joke",
            content: "What do you call a bear with no teeth? A gummy bear!"
        }
    ];
    res.json(jokes);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});