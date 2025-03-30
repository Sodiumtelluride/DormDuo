import './Message.css';

export default function Message(props) {
    function formatTime(time) {
        const [hours, minutes] = time.split(':');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes} ${ampm}`;
    }

    const formattedTime = formatTime(props.timeDelivered);

    const acceptRequest = () => {
        fetch('http://localhost:5174/roommate/add', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
            user1: props.chat.users[0].email,
            user2: props.chat.users[1].email
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Request accepted:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
    if (props.isRequest === true) {
        return(
            <div className={props.sentByUser ? "message-container sent-by-user" : "message-container not-sent-by-user"}>
                <div className={props.sentByUser ? "message-content-SBU": "message-content-NSBU"}>
                    <h1>{props.user}</h1>
                    <p>Let's become roomates!</p>
                    {!props.sentByUser && <button className="accept-btn" onClick={acceptRequest}>Accept</button>}
                </div>
                {/* <div className="message-info"> */}
                    <div className={props.sentByUser ? "time-SBU" : "time-NSBU"}>{formatTime(props.timeDelivered)}</div>
                    <img className={props.sentByUser ? "pfp-SBU" : "pfp-NSBU"} src={props.pfp}></img>
                {/* </div> */}
            </div>
        )
    }
    return(
        <div className={props.sentByUser ? "message-container sent-by-user" : "message-container not-sent-by-user"}>
            <div className={props.sentByUser ? "message-content-SBU": "message-content-NSBU"}>
                <h1>{props.user}</h1>
                <p className='message'>{props.message}</p>
            </div>
            {/* <div className="message-info"> */}
                <div className={props.sentByUser ? "time-SBU" : "time-NSBU"}>{formatTime(props.timeDelivered)}</div>
                <img className={props.sentByUser ? "pfp-SBU" : "pfp-NSBU"} src={props.pfp}></img>
            {/* </div> */}
        </div>
    )
}