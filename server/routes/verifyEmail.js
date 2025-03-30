const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const userTable = process.env.USER_TABLE;

router.get('/verify-email', async (req, res) => {
    const token = req.query.token;

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.MY_SECRET);
        console.log('Decoded token:', decoded);
        const user_id = decoded.user_id;

        // Update the user's status in the database
        const params = {
            TableName: userTable,
            Key: {
                user_id: user_id
            },
            UpdateExpression: 'set confirmed = :verified',
            ExpressionAttributeValues: {
                ':verified': true
            },
            ReturnValues: 'ALL_NEW'
        };
        const result = await dynamoDB.update(params).promise();
        res.redirect('http://localhost:5173/pages/login/login.html');
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(400).json({ error: 'Invalid or expired token' });
    }
});

module.exports = router;