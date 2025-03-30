import './ForgotPasswordForm.css';
import { useState } from 'react';

export default function ForgotPasswordForm() {
    const [msg, setMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        email: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formData);
            const response = await fetch('http://localhost:5174/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const result= await response.json();
            if(response.ok) {
                setMsg('Email sent! Check your inbox.');
                console.log(result.msg);
            } else {
                setErrorMsg(result.error);
                console.log(errorMsg);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='forgot-password-form'>
        <h1>Forgot Password</h1>
            <h3>No worries. We'll send you a link to reset your password!</h3>
            <div className='msg'>{msg}</div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" onChange={handleChange} required />
            <button type="submit" id='submit'>Reset Password</button>
        </form>
    )
}