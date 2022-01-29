const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const AppError = require('')

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
