import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Form.css';
import { useAuth } from "./AuthContext";
import SessionManager from "../../services/SessionManager";
const MIN_PASSWORD_LENGTH = 8;

function LoginForm({closeModal}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: "", password: "" });
    const { isLoggedIn, setIsLoggedIn, setUserEmail } = useAuth(); // Make sure these methods are correctly exported from useAuth.
    const navigate = useNavigate(); // This is part of 'react-router-dom', so it should work.
    useEffect(() => {
        console.log("isLoggedIn changed to: ", isLoggedIn);
    }, [isLoggedIn]);
    const handleLogin = async () => {
        const response = await fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
            const data = await response.json();
            if (data && data.sessionToken) {
                setIsLoggedIn(true);
                setUserEmail(email);
                closeModal();
                SessionManager.setSessionToken(data.sessionToken);
                if (SessionManager.isTokenValid()) {
                    navigate('/dashboard');
                }
            }
        } else {
            const data = await response.json();
            console.error('Login failed:', data.message);
        }
    };

    const validateForm = () => {
        console.log("validateForm called");  // Debug log
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
        console.log("Form validation result:", isValid);  // Debug log
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
                    autoComplete="current-password" // Enables autocomplete for password
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
