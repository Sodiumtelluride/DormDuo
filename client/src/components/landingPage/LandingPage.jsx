import './LandingPage.css'
import Card from '../card/Card.jsx'
import PFP from '../../assets/UserPhoto.png'
import { useState, useEffect } from 'react'
import React from 'react';
import CardExpanded from '../cardExpanded/cardExpanded.jsx';
import SampleProfile from '../../assets/sampleProfile.png';
import DownArrow from '../../assets/DownArrow.svg';
import FeedImg from '../../assets/FeedImg.png';
import MessagesImg from '../../assets/MessagesImg.png';
import ProfileImg from '../../assets/ProfileImg.png';
import NavbarLandingPage from '../navbarLandingPage/NavbarLandingPage.jsx';
function LandingPage() {

    const appear = (element) => {
       
        element.style.transition = 'opacity .5s ease-in';
        element.style.opacity = '1';
        element.style.visibility = 'visible';
        element.style.pointerEvents = 'auto';
    }
    const disappear = (element) => {
        //const downArrow = document.querySelector('.down-arrow-container');
        element.style.transition = 'opacity .5s ease-out';
        element.style.opacity = '0';
        element.style.pointerEvents = 'none';
    }
    const disappearInstant = (element) => {
        element.style.opacity = '0';
        element.style.pointerEvents = 'none';
    }

    useEffect(() => {
        const sampleFeed = document.querySelector('.feed.container');
        const sampleMessages = document.querySelector('.message.container');
        const sampleProfile = document.querySelector('.profile.container');
        const downArrow = document.querySelector('.down-arrow-container');
        if (sampleFeed) disappearInstant(sampleFeed);
        if (sampleMessages) disappearInstant(sampleMessages);
        if (sampleProfile) disappearInstant(sampleProfile);
        const handleScroll = () => {
            const windowHeight = window.innerHeight;

            if (window.scrollY <= 100) {
            appear(downArrow);
            } else {
            disappear(downArrow);
            }

            if (sampleFeed.getBoundingClientRect().top <= windowHeight) {
            appear(sampleFeed);
            } 
            if (sampleMessages.getBoundingClientRect().top <= windowHeight) {
            appear(sampleMessages);
            } 
            if (sampleProfile.getBoundingClientRect().top + 200 <= windowHeight) {
            appear(sampleProfile);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <NavbarLandingPage/>
            <div className="landing-page">
                <h1 className="main tagline gradient">Start Your Semester the Right Way.</h1>
                <div className="sample-message-container"> 
                    <img className="sample-profile" src={SampleProfile}/>
                    <h1 className="sample-message-text">Hi! Are you looking for a roommate?</h1>
                </div>
                <div className="down-arrow-container">
                    <img className="down-arrow" src={DownArrow} alt="Down Arrow" />
                </div>
                <div className="feed point"></div>
                <div className="feed container">
                    <h1 className="feed tagline gradient">Find A Perfect Match With a Detailed Roommate Feed</h1>
                    <img className="feed image" src={FeedImg} alt="Feed" />
                </div>
                <div className="message point"></div>
                <div className="message container">
                    <h1 className="message tagline gradient">Message and Connect With Potential Rooommates </h1>
                    <img className="message image" src={MessagesImg} alt="Message" />
                </div>
                <div className="profile point"></div>
                <div className="profile container">
                    <h1 className="profile tagline gradient">Customize Your Profile to Put Yourself Out There </h1>
                    <img className="profile image" src={ProfileImg} alt="Profile" />
                </div>
            </div>
        </>
    )
}
export default LandingPage;