const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const cors = require('cors');

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Set the specific origin
    credentials: true // Allow credentials
}));

const cookieJWTAuth = (req, res, next) => {
    console.log(req.cookies);
    const token = req.cookies.token;
    if (!token) {
        res.json({ redirectUrl: '/pages/login/login.html' });
        return; 
    }

    try {
        const user = jwt.verify(token, process.env.MY_SECRET);
        console.log(user);
        req.user = user;
        next();
    } catch (err) {
        res.clearCookie("token");
        return res.status(400).json({ error: 'Invalid token.' });
    }
};

module.exports = cookieJWTAuth;