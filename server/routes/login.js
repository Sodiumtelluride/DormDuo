const express = require('express');

const router = express.Router();
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// Mock authentication function

router.post('/login', async (req, res) => {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const userTable = process.env.USER_TABLE;
    const { email, password } = req.body;
    const paramsForQuery = {
        TableName: userTable,
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :emailValue',
        ExpressionAttributeValues: {
            ':emailValue': email
        }
    };
    const authenticateUser = async () => {
        const doesUserExist = await dynamoDB.query(paramsForQuery).promise();

        if (doesUserExist.Count === 0 || !doesUserExist.Items[0].confirmed) {
            return false;
        } else {
            console.log(doesUserExist.Items[0].password);
            const isMatch = await bcrypt.compare(password, doesUserExist.Items[0].password);
            console.log(isMatch);
            return isMatch;
        }
        
    };
    
    if (await authenticateUser()) {
        const doesUserExist = await dynamoDB.query(paramsForQuery).promise();
        const { password: actualPassword, ...user_to_pass } = doesUserExist.Items[0];
        const token = jwt.sign(user_to_pass, process.env.MY_SECRET, { expiresIn: "1h" });
        res.cookie('token', token, {
            httpOnly: true,
        });
        res.status(201).json({ redirectUrl: '/pages/userPage/userPage.html' });
        return ;        
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

module.exports = router;