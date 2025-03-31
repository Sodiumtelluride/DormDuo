import './Navbar.css'
import React, { useState, useEffect } from 'react'
import Messages from '../../assets/Messages.png'
import Profile from '../../assets/Profile.png'
import logo from '../../assets/logo.svg'
// import { Context } from '../../App.jsx'
function Navbar(props) {
    const [ PFPUrl, setPFPUrl ] = useState(Profile);
    console.log("PFPUrl:", PFPUrl);
    useEffect(() => {
        fetch('http://localhost:5174/getMe/me', {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            setPFPUrl(data.PFPurl || Profile);
            console.log("Data.PFP", data.PFPurl);
        })
        .catch(error => console.error('Error fetching PFP:', error));
    }, []);
    if(props.inChat){
        return (
            <nav className='nav nav-in-chat'>
                <a href='../../../pages/userPage/userPage.html'>
                    <img src={PFPUrl} alt={Profile} id='profile-icon' />
                </a>
                <a href='../../../pages/cardGridPage/cardGridPage.html'>
                    <img src={logo} alt="logo" className="logo" />
                </a>
                <a href='../../../pages/messages/messages.html'> 
                    <img src={Messages} alt="messages" id='messages-icon'/>
                </a>
            </nav>
        )
    
    }
    return (
    <>
        <nav className='nav'>
                <a href='../../../pages/cardGridPage/cardGridPage.html'>
                    <img src={logo} alt="logo" className="logo" />
                </a>
            <div className='nav-right'>
                <a href='../../../pages/messages/messages.html'> 
                    <img src={Messages} alt="messages" id='messages-icon'/>
                </a>
                <a href='../../../pages/userPage/userPage.html'>
                    <img src={PFPUrl} alt="profile" id='profile-icon' />
                </a>
            </div>
        </nav>
    </>
    )
}

export default Navbar