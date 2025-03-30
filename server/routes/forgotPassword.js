const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

router.post('/forgot-password', async (req, res) => {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const userTable = process.env.USER_TABLE;
    const { email } = req.body;
    const paramsForQuery = {
        TableName: userTable,
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :emailValue',
        ExpressionAttributeValues: {
            ':emailValue': email
        }
    };

    const doesUserExist = await dynamoDB.query(paramsForQuery).promise();
    if (doesUserExist.Count === 0) {
        res.status(409).json({ error: 'User with that email doesn\'t exists' });
        return;
    }

    const{ password, ...user_to_pass }= doesUserExist.Items[0];
    const token = jwt.sign(user_to_pass, process.env.MY_SECRET, { expiresIn: "1h" });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Password',
        text: `Click this link to reset your password: ${process.env.BASE_URL}/verify-user?token=${token}`
    };
    res.status(200).json({ msg: 'Email sent! Check your inbox.' });
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
});

module.exports = router;