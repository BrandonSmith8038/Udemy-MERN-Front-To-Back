const express = require('express');
const mongoose = require('mongoose');

const app = express();

// DB Config
const db = require('./config/keys').MONGO_URI;

// Connect To Mongo DB
mongoose.connect(db).then(() => console.log('Database Connected....'));

app.get('/', (req, res) => res.send('Hello'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server Running On Port ${port}`));
