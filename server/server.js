const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const getUserRouter = require('./routes/getUsers');
const createUserRouter = require('./routes/createUser');
const getMeRouter = require('./routes/getMe');
const updateMeRouter = require('./routes/updateMe');
const updatePFPRouter = require('./routes/updatePFP');
const deleteImageRouter = require('./routes/deleteImage'); // Import deleteImage route
const loginRouter = require('./routes/login');
const getCardsRouter = require('./routes/getCards');
const createRoomRequestRouter = require('./routes/createRoomRequest');
const deleteRoomRequestRouter = require('./routes/deleteRoomRequest');
const getChatRouter = require('./routes/getChat');
const addRoommateRouter = require('./routes/addRoommate');
const deleteRoommatRequestRouter = require('./routes/deleteRoommate');
const createChatRouter = require('./routes/createChat');
const verifyEmailRouter = require('./routes/verifyEmail');
const verifyPasswordResetRouter = require('./routes/verifyPasswordReset');
const resetPasswordRouter = require('./routes/resetPassword');
const forgotPasswordRouter = require('./routes/forgotPassword');
const cookieJWTAuth = require('./middleware/cookieJWTAuth');
const path = require('path');
require('dotenv').config();


const app = express();
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:5173', // Update with your client URL
    credentials: true // Allow credentials
}));
const PORT = process.env.PORT || 5174;
const server = http.createServer(app);

// Initialize multer
const storage = multer.memoryStorage();
const uploadImages = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB file size limit
        files: 10, // Limit to 10 files
        fieldSize: 25 * 1024 * 1024, // 25 MB field size limit (increase as needed)
    },
}).array('images', 10);
const uploadPFP = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB file size limit
        files: 10, // Limit to 10 files
        fieldSize: 25 * 1024 * 1024, // 25 MB field size limit (increase as needed)
    },
}).single('profile_picture');

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Update with your client URL
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Middleware
app.use(bodyParser.json());
app.use(cookieParser()); // Add cookie-parser middleware

// Logging middleware to debug route handling
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// API Routes
app.use('/', loginRouter); // Login route should not require authentication
app.use('/', verifyEmailRouter);
app.use('/', forgotPasswordRouter);
app.use('/', verifyPasswordResetRouter);
app.use('/getMe', cookieJWTAuth, getMeRouter); // Use the middleware and route
app.use('/user', cookieJWTAuth, getUserRouter); // Use the middleware and route
app.use('/createUser', createUserRouter);
app.use('/userGet', uploadImages, cookieJWTAuth, updateMeRouter);
app.use('/userGetPFP', uploadPFP, cookieJWTAuth, updatePFPRouter);
app.use('/', cookieJWTAuth, deleteImageRouter); // Use deleteImage route
app.use('/cards', cookieJWTAuth, getCardsRouter); // add middleware when working
app.use('/chat', cookieJWTAuth, getChatRouter);
app.use('/roomRequest', cookieJWTAuth, createRoomRequestRouter);
app.use('/roomRequest', cookieJWTAuth, deleteRoomRequestRouter);
app.use('/roommateRequest', cookieJWTAuth, deleteRoommatRequestRouter);
app.use('/roommate', cookieJWTAuth, addRoommateRouter);
app.use('/chat', cookieJWTAuth, createChatRouter);
app.use('/', cookieJWTAuth, resetPasswordRouter);



//messaging 


io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join_chat', (data) => {
        console.log('room: ' + data);
        socket.join(data);
    });

    const dynamoDB = new AWS.DynamoDB.DocumentClient();

    const saveMessageToDynamoDB = (data) => {
        const params = {
            TableName: 'chats',
            Key: {
            chat_id: data.chatId
            },
            UpdateExpression: 'SET messages = list_append(if_not_exists(messages, :empty_list), :message)',
            ExpressionAttributeValues: {
            ':message': [{
                user: data.user,
                message: data.message,
                time: data.time,
                isRequest: data.isRequest
            }],
            ':empty_list': []
            },
            ReturnValues: 'UPDATED_NEW'
        };

        dynamoDB.update(params, (err, result) => {
            if (err) {
                console.error('Unable to add message to DynamoDB', err);
            } else {
                console.log('Message added to DynamoDB', result);
            }
        });
    };
    socket.on('send_message', (data) => {
        console.log('Message received:', data);
        socket.to(data.chatId).emit('receive_message', data);
        saveMessageToDynamoDB(data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});