import './LoginForm.css';
import { useState } from 'react';

export default function LoginForm() {
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
            const response = await fetch('http://localhost:5174/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const result= await response.json();
            if(response.ok) {
                window.location.href = result.redirectUrl;
            } else {
                setErrorMsg(result.message);
                console.log(result);
                console.log(errorMsg);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const forgotPassword = async () => {

    };
    return (
        <form onSubmit={handleSubmit} className='login-form'>
            <h1>Login</h1>
            <h3 className='errorMsg'>{errorMsg}</h3>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" onChange={handleChange} required />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" onChange={handleChange} required />
            <div className="forgot-password" onClick={forgotPassword}><a href="../../../pages/forgotPassword/forgotPassword.html">Forgot Password?</a></div>
            <button type="submit" id='submit'>Login</button>
        </form>
    )
}