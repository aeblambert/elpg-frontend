import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode'; // Import the jwt-decode library
import { useNavigate } from 'react-router-dom';
import '../../styles/Form.css';
import { useAuth } from "./AuthContext";
import SessionManager from "../../services/SessionManager";
const MIN_PASSWORD_LENGTH = 8;

function LoginForm({closeModal}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: "", password: "" });
    const { isLoggedIn, setIsLoggedIn, setUserEmail } = useAuth();
    const navigate = useNavigate();
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
            console.log("Response is ok");
            const data = await response.json();
            console.log("Token (in LoginForm): ", data.jwtToken);
            if (data.jwtToken) {
                // First validate the JWT
                const decoded = jwt_decode(data.jwtToken);
                console.log("Testing response: decoded: ", decoded);
                if (decoded && decoded.email === email) {
                    setIsLoggedIn(true);
                    setUserEmail(email);
                    SessionManager.setJwtSessionToken(data.jwtToken, email);
                    closeModal();
                    navigate('/dashboard');
                } else {
                    console.error('Invalid JWT token');
                    // TODO: Redirect to login or show error message
                }
            } else {
                console.error('JWT token missing in response');
                // TODO: Redirect to login or show error message
            }
        } else {
            const data = await response.json();
            console.error('Login failed:', data.message);
            // TODO: Redirect to login or show error message
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
