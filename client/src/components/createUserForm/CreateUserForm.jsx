import { useState } from 'react';
import './CreateUserForm.css';


function CreateUserForm() {
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    });
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            id: crypto.randomUUID(),
            ...formData
        }
        try {
            const response = await fetch('http://localhost:5174/createUser/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include credentials to send cookies
                body: JSON.stringify(dataToSend)
            });
            const result = await response.json();
            if (response.ok) {
                console.log('User created successfully');
                window.location.href = result.redirectUrl;
            } else {
                setErrorMsg(result.error);
                console.log(errorMsg);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const getPasswordError = () => {
        const errors = [];
        if (!/(?=.*\d)/.test(formData.password)) errors.push("one number");
        if (!/(?=.*[a-z])/.test(formData.password)) errors.push("one lowercase letter");
        if (!/(?=.*[A-Z])/.test(formData.password)) errors.push("one uppercase letter");
        if (!/(?=.*\W)/.test(formData.password)) errors.push("one special character");
        if (formData.password.length < 8) errors.push("at least 8 characters long");
        return errors.length > 0 ? `Password must contain ${errors.join(', ')}.` : '';
    }

    return(
        <form id='create-user-form' action="POST" onSubmit={handleSubmit}>
            <h1>Sign Up</h1>
            <h3 className='errorMsg'>{errorMsg}</h3>
            <div className="name">
                <div className="first-name">
                    <label htmlFor="first_name" className="form-lable">First Name</label>
                    <input type="text" id="first_name" name="first_name" required value={formData.first_name} onChange={handleChange}/>
                </div>
                <div className="last-name">
                    <label htmlFor="last_name" className="form-lable">Last Name</label>
                    <input type="text" id="last_name" name="last_name" required value={formData.last_name} onChange={handleChange}/>
                </div>
            </div>
            <label className="form-lable" htmlFor="email">Email</label>
            <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                value={formData.email} 
                onChange={handleChange}
            />
            <label className="form-lable" htmlFor="password">Password</label>
            <input 
                type="password" 
                id="password" 
                name="password" 
                required 
                value={formData.password} 
                onChange={handleChange}
            />
            {formData.password && (
                <p className="errorMsg">{getPasswordError()}</p>
            )}
            <button id='submit-button' type='submit'>Create Account</button>
        </form>
    )
}

export default CreateUserForm;