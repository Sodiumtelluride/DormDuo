import './MessageDashboard.css';
import Navbar from '../navbar/navbar.jsx';
import Message from '../message/Message.jsx';
import MessagePreview from '../messagePreview/MessagePreview.jsx';
import MessageType from '../messageType/MessageType.jsx';
import PFP from '../../assets/UserPhoto.png';
import BackArrow from '../../assets/BackArrow.png';
import logo from '../../assets/ROOMME.png';
import Profile from '../../assets/Profile.png';
import { useState, useEffect, useContext } from 'react';

import { io } from 'socket.io-client';

const socket = io(`http://localhost:5174`, {
    transports: ['websocket'],
    withCredentials: true
});

socket.on('connect_error', (err) => {
    console.error('Connection error:', err);
});

export default function MessageDashboard() {
    const [currentMessage, setCurrentMessage] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [wantedChats, setWantedChats] = useState([]);
    const [chatData, setChatData] = useState([]);
    console.log(wantedChats);

    useEffect(() => {
        const fetchUserData = async () => {
            console.log("Fetching user data...");
            try {
                const response = await fetch('http://localhost:5174/getMe/me', {
                    method: 'GET',
                    credentials: 'include'
                });

                console.log('Response status:', response.status);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log('Fetched data:', data);
                setDisplayName(data.user_info.display_name);
                setWantedChats(data.chat_ids || []); // Ensure chat_ids is defined
                setChatData(data.chat_data || []); // Ensure chat_data is defined
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchUserData();
        if (wantedChats[0]) {
            // console.log('Joining chat:', wantedChats[0]);
            socket.emit('join_chat', wantedChats[0]);
        }
    }, []);

    useEffect(() => {
        if (wantedChats) {
            // console.log('Wanted chats:', wantedChats);
            // console.log(JSON.stringify(wantedChats));
            fetch('http://localhost:5174/chat/get', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(wantedChats),
            })
                .then(response => response.json())
                .then(data => {
                    // console.log('Fetched data:', data);
                    setChatData(data);
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    }, [wantedChats]);

    return(
        <>
            <div className="MessageDashboard">
                <div className="Contacts">
                    <div className="contact-header">
                        <a href="../../../index.html">
                            <img src={BackArrow} id='contact-back-arrow' />
                        </a>
                        <img src={logo} id='contact-logo' />
                        <a href="../../../pages/userPage/userPage.html">
                            <img src={Profile} id='contact-profile-icon' />
                        </a>
                    </div>
                    <div className="contact-cards">
                        {chatData.map((chat, index) => (
                            <MessagePreview 
                                key={index}
                                name={chat.users[0] === displayName ? chat.users[1] : chat.users[0]} 
                                lastMessage={chat.messages && chat.messages[0] ? chat.messages[0].message : ''} 
                                lastSent={chat.messages && chat.messages[0] ? chat.messages[0].time : ''} 
                                numUnread={0} 
                                // pfp={message.pfp}
                            />
                        ))}
                    </div>
                </div>
                {/* {chatData[0] && <Chat chat={chatData[0]} user={displayName}/>} */}
                <div className="send">
                    {chatData[0] && (
                        <MessageType 
                            socket={socket}
                            chat = {chatData[0]}
                            chatId={chatData[0].chat_id}
                            username={displayName}
                        />
                    )}
                </div>
            </div>
        </>
    )
}