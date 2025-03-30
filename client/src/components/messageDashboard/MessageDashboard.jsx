import './MessageDashboard.css';
import Message from '../message/Message.jsx';
import MessagePreview from '../messagePreview/MessagePreview.jsx';
import MessageType from '../messageType/MessageType.jsx';
import PFP from '../../assets/UserPhoto.png';
// import Profile from '../../assets/Profile.png'
import BackArrow from '../../assets/BackArrow.png';
import logo from '../../assets/ROOMME.png';
import Profile from '../../assets/Profile.png';
import Navbar from '../navbar/navbar.jsx';
import messageIcon from '../../assets/Messages.png';
import { useState, useEffect } from 'react';

import { io } from 'socket.io-client';

const socket = io(`http://localhost:5174`, {
    transports: ['websocket'],
    withCredentials: true
});

socket.on('connect_error', (err) => {
    console.error('Connection error:', err);
});
export default function MessageDashboard() {
    const [currentChat, setCurrentChat] = useState({});
    const [displayName, setDisplayName] = useState("");
    const [wantedChats, setWantedChats] = useState([]);
    const [chatData, setChatData] = useState([]);
    const [hasRequested, setHasRequested] = useState(false);
    const [userId, setUserId] = useState("");
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
                setUserId(data.user_id || "");
                setHasRequested(data.user_info.request.id !== '' && data.user_info.request.request_sent_to !== '');
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchUserData();
        if (wantedChats[0]) {
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
                    setChatData(data);
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    }, [wantedChats]);

    const handleChatClick = (chat) => {
        console.log('Chat clicked:', chat);
        setCurrentChat(chat);
    };

    return(
        <>
            <div className="MessageDashboard">
                <div className="Contacts">
                    <div className="contact-cards">
                        {chatData.length > 0 ? chatData.map((chat, index) => (
                            <MessagePreview 
                                key={index}
                                name={chat.users[0].name === displayName ? chat.users[1].name : chat.users[0].name} 
                                lastMessage={chat.messages && chat.messages[chat.messages.length - 1] ? chat.messages[chat.messages.length - 1].message : ''} 
                                lastSent={chat.messages && chat.messages[0] ? chat.messages[0].time : ''} 
                                numUnread={0} 
                                onClick={() => handleChatClick(chat)}
                                isActive={currentChat ? currentChat.chat_id === chat.chat_id : false}
                            />
                        )) : <div className="no-chats">No chats</div>}
                    </div>
                </div>
                <div className="chat-ui">
                    {Object.keys(currentChat).length > 0 ? (
                        <MessageType 
                            socket={socket}
                            chat={currentChat}
                            chatId={currentChat.chat_id}
                            username={displayName}
                            id = {userId}
                            requested={hasRequested}
                        />
                    ) : (
                        <>
                            <Navbar inChat={true}/>
                            <div className="no-chat-selected">
                                <img id='message-icon' src={messageIcon} />
                                Please select a chat
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}