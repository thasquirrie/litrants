const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const AppError = require('')

const app = express();

app.use(express.json());
app.use(cookiParser());

module.exports = app;
