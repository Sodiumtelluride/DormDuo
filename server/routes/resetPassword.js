const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const bcrypt = require('bcrypt');

router.post('/updatePassword', async (req, res) => {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const userTable = process.env.USER_TABLE;
    const userId = req.user.user_id;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    const params = {
        TableName: userTable,
        Key: {
            user_id: userId
        }
    };

    try {
        const result = await dynamoDB.get(params).promise();
        const originalUser = result.Item;

        if (!originalUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        // Update the user's password in DynamoDB
        const updateParams = {
            TableName: userTable,
            Key: {
                user_id: userId
            },
            UpdateExpression: 'set password = :pw',
            ExpressionAttributeValues: {
                ':pw': hashedPassword
            },
            ReturnValues: 'ALL_NEW'
        };

        await dynamoDB.update(updateParams).promise();

        res.redirect('http://localhost:5173/pages/login/login.html');
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
