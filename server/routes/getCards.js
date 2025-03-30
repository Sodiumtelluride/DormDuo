const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');


router.get('/get', async (req, res) => {
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const userTable = process.env.USER_TABLE;
    let allItems = [];
    const bucketName = process.env.S3_BUCKET_NAME;
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const params = {
        TableName: userTable,
    };

    const S3 = new S3Client({
        credentials: { 
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey
        },
        region: region
    });

    try {
        const result = await dynamoDB.scan(params).promise();
        let index = 0;
        let itemSurrender = 16;
        while (index < itemSurrender && index < result.Items.length) {
            if (result.Items[index].user_info.major != null && result.Items[index].user_info.grad != null && result.Items[index].user_info.description != null && result.Items[index].user_info.major != "null" && result.Items[index].user_info.grad != "null" && result.Items[index].user_info.description != "null") {
                console.log("major: ", result.Items[index].user_info.major);
                console.log("grad: ", result.Items[index].user_info.grad);
                const urls = [];
                const imageNames = [result.Items[index].images.image_1_name, result.Items[index].images.image_2_name, result.Items[index].images.image_3_name, result.Items[index].images.image_4_name, result.Items[index].images.image_5_name];
               console.log("imageNames: ", imageNames);
                for(const name of imageNames) {
                    // Check if images and image_1_name exist
                    if (name) {
                        const S3_params = {
                            Bucket: bucketName,
                            Key: name
                        };
                        const command = new GetObjectCommand(S3_params);
                        try{
                            if(await S3.send(command)) {
                                console.log("Image exists");
                                const url = await getSignedUrl(S3, command, { expiresIn: 3600 });
                                urls.push(url);
                                console.log("urls: ", urls);
                            }
                        }catch (error) {}
                    }
                }
                const itemToPush = {
                    user: result.Items[index],
                    urls : urls
                };
                allItems.push(itemToPush);   
            }
            else {
                itemSurrender++;
            }
            
            index++;
        }res.status(201).json(allItems);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    
});

module.exports = router;