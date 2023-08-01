const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
mongoose.connect(process.env.MONGO_URL)

app.get('/test', (req, res)=>{
    res.json('test ok');
});

app.post('/register', (req, res)=>{
    res.json('register ok');
});

app.listen(4000);