const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

router.post('/delete', async (req, res) => {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const userTable = process.env.USER_TABLE;
    const { id } = req.body;
    const getRequestId= (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
    const paramsForQuery = {
        TableName: userTable,
        KeyConditionExpression: 'user_id = :userId',
        ExpressionAttributeValues: {
            ':userId': id
        }
    };
    
    try {
        const data = await dynamoDB.query(paramsForQuery).promise();
        
        
        const updateParams = {
            TableName: userTable,
            Key: {
                user_id: id
            },
            UpdateExpression: 'set #userInfo.#request.#id = :reqId, #userInfo.#request.#requestSentTo = :reqSentTo',
            ExpressionAttributeNames: {
                '#userInfo': 'user_info',
                '#request': 'request',
                '#id': 'id',
                '#requestSentTo': 'request_sent_to'
            },
            ExpressionAttributeValues: {
                ':reqId': '',
                ':reqSentTo': ''
            },
            ReturnValues: 'ALL_NEW'
        };
        await dynamoDB.update(updateParams).promise();
        res.status(201).json({ message: 'Roommate request created successfully.' });
    } catch (error) {
        console.error("Error creating roommate request:", error);
        res.status(500).json({ error: 'Could not create roommate request.' });
    }

});

module.exports = router;