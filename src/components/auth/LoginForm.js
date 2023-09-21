import React, { useState } from 'react';
import '../../styles/Form.css';
const MIN_PASSWORD_LENGTH = 8;


function LoginForm() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: "", password: "" });

    function isTokenValid() {
        const token = localStorage.getItem('sessionToken');
        const expiryTime = localStorage.getItem('sessionExpiry');

        if (!token || !expiryTime) {
            return false;
        }

        const now = new Date();
        if (now.getTime() > expiryTime) {
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('sessionExpiry');
            return false;
        }

        return true;
    }
    const handleLogin = async () => {
        const response = await fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password}),
        });
        if (response.ok) {
            const data = await response.json();

            if (data && data.sessionToken) {
                if (isTokenValid()) {
                    //const token = localStorage.getItem('sessionToken');
                    sessionStorage.setItem('sessionToken', data.sessionToken);
                } else {
                    // Redirect to login or show a message to the user
                }



                window.location.href = '/dashboard';
            }
        } else {
            // Handle errors (bad login, server unavailable, etc.)
            const data = await response.json();
            console.error('Login failed:', data.message);
        }
    }
    const validateForm = () => {
        let isValid = true;
        let newErrors = { email: "", password: "" };
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
            isValid = false;
        }

        if (password.length < MIN_PASSWORD_LENGTH) {
            newErrors.password = 'Password must be at least 8 characters long.';
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (validateForm()) {
                    handleLogin();
                }
            }}
            autoComplete="off" // Disables autocomplete for the whole form, enable only for specific inputs
        >
            <div className="input-container">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email" // Enables autocomplete for email
                />
            </div>
            <div className="input-container">
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    utoComplete="current-password" // Enables autocomplete for password
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <div className="button-container">
                <button type="submit">Log in</button>
            </div>
        </form>
    );
}

export default LoginForm;