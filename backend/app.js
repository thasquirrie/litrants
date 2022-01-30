const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const AppError = require('')

const app = express();
const userRouter = require('./routes/userRoutes');

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/users/', userRouter);

module.exports = app;
