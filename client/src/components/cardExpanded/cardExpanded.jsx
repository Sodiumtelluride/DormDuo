import './CardExpanded.css'
import { useState } from 'react'

export default function CardExpanded(props) {
    const extraversionFillInt = parseInt(props.extraversion, 10);
    const extraversionFillPercentage = (extraversionFillInt / 4) * 100;
    const cleanlinessFillInt = parseInt(props.cleanliness, 10);
    const cleanlinessFillPercentage = (cleanlinessFillInt / 4) * 100;
    const [errorInChat, setError] = useState(null);
    
    const pronouns = props.pronouns === "Prefer Not to Specify" ? '' : props.pronouns;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleBackClick = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? props.img.length - 1 : prevIndex - 1));
    };

    const handleForwardClick = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === props.img.length - 1 ? 0 : prevIndex + 1));
    };
    console.log(props.email);

    const startChat = () => {
        fetch('http://localhost:5174/chat/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ other_user_email: props.email })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Result:', data);
        })
        .catch((error) => {
            console.error('Error creating chat:', error);
            setError(error);
        })
        .then(() => {
            window.location.href = './pages/messages/messages.html';
        });
    };

    const getCleanlinessClass = () => {
        switch (props.cleanliness) {
            case 0:
                return 'fill level-1';
            case 1:
                return 'fill level-2';
            case 2:
                return 'fill level-3';
            case 3:
                return 'fill level-4';
            case 4:
                return 'fill level-5';
            default:
                return 'fill';
        }
    };

    const getExtraversionClass = () => {
        switch (props.extraversion) {
            case 0:
                return 'fill level-1';
            case 1:
                return 'fill level-2';
            case 2:
                return 'fill level-3';
            case 3:
                return 'fill level-4';
            case 4:
                return 'fill level-5';
            default:
                return 'fill';
        }
    };
    console.log(props.cleanliness);
    console.log(getCleanlinessClass());
    return (
        <div className="background">
            <div className="card-expanded">
                <div className="card-banner-expanded">
                    <div className="img-container">
                        <img src={props.img[currentImageIndex]} alt="" className="card-img-expanded" />
                    </div>

                    <div className="button-container">
                        <button className="back-button" onClick={handleBackClick}>Back</button>
                        <button className="forward-button" onClick={handleForwardClick}>Forward</button>
                    </div>
                </div>

                <div className="card-details-expanded">
                    <div className="user-title-expanded">
                        <div>
                            <h1 className="user-name-expanded">{props.name}</h1>
                            <h2 className="pronouns-expanded">{pronouns}</h2>
                        </div>
                        <div>
                            <h4 className="des-txt-expanded">{props.major}</h4>
                            <h4 className="des-txt-expanded">{props.grad}</h4>
                            <h4 className="des-txt-expanded">{props.placeOrigin}</h4>
                        </div>
                    </div>

                    <div className="user-info-expanded">
                        <div className="user-description-expanded">
                            <h3 className="info-heading-expanded">Description</h3>
                            <p className="des-txt-expanded">{props.description}</p>
                        </div>

                        <div className="extraversion-expanded">
                            <h3 className="info-heading-expanded">Extraversion</h3>
                            <div className="fill-bar">
                                <div className={getExtraversionClass()} id="extraversion-fill"></div>
                            </div>
                        </div>

                        <div className="cleanliness-expanded">
                            <h3 className="info-heading-expanded">Cleanliness</h3>
                            <div className="fill-bar">
                                <div className={getCleanlinessClass()} id="cleanliness-fill"></div>
                            </div>
                        </div>

                        <div>
                            <h3 className="info-heading-expanded">Sleep Schedule</h3>
                            <p className="des-txt-expanded">{props.startTime} - {props.endTime}</p>
                        </div>

                        <div>
                            <h3 className="info-heading-expanded">Using My Stuff</h3>
                            <p className="des-txt-expanded">{props.usingMyStuff}</p>
                        </div>

                        <div>
                            <button onClick={startChat} className='start-chat-btn'>Start Chat</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}