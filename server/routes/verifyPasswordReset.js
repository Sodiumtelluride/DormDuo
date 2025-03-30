const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const userTable = process.env.USER_TABLE;

router.get('/verify-user', async (req, res) => {
    const token = req.query.token;

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.MY_SECRET);
        console.log('Decoded token:', decoded);
        const user_id = decoded.user_id;

        // Update the user's status in the database
        res.cookie('token', token, {
            httpOnly: true,
        });
        res.redirect('http://localhost:5173/pages/resetPasswordPage/resetPassword.html');
    } catch (error) {
        console.error('Error verifying link:', error);
        res.status(400).json({ error: 'Invalid or expired token' });
    }
});

module.exports = router;