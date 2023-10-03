import React, {useState, useEffect, useContext} from 'react';
import jwt_decode from 'jwt-decode'; // Import the jwt-decode library
import { useNavigate } from 'react-router-dom';
import '../../styles/Form.css';
import {AuthContext, useAuth} from "./AuthContext";
import SessionManager from "../../services/SessionManager";
import NewUserForm from './NewUserForm';
const MIN_PASSWORD_LENGTH = 8;

const LoginForm
      = ({setActiveModal}) =>  {
    const [enteredEmail, setEnteredEmail] = useState(null);
    const [enteredPassword, setEnteredPassword] = useState(null);
    const [errors, setErrors] = useState({ email: "", password: "" });
    const { setIsLoggedIn, setAuthEmail, setAuthNickname, setCachedCredentials } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        const response = await fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ enteredEmail, enteredPassword }),
        });
        if (response.ok) {
            const data = await response.json();
            if (data.jwtToken) {
                const decoded = jwt_decode(data.jwtToken);
                if (decoded && decoded.email === enteredEmail) {
                    console.log("is first login: ", data.isFirstLogin);
                    if (data.isFirstLogin === "true") {
                        console.log("Is First Login: ", data.isFirstLogin);
                        console.log("Setting activeModal to newUserForm");
                        setCachedCredentials({ enteredEmail, enteredPassword });
                        SessionManager.setTemporaryJwtToken(data.jwtToken, enteredEmail);
                        setActiveModal('newUserForm');
                    } else {
                        setIsLoggedIn(true);
                        setAuthEmail(enteredEmail);
                        setAuthNickname(decoded.nickname);
                        SessionManager.setJwtSessionToken(data.jwtToken, enteredEmail);
                        //closeModal();
                        setActiveModal(null);
                        navigate('/dashboard');
                    }
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
        let isValid = true;
        let newErrors = { email: "", password: "" };
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

        if (!emailRegex.test(enteredEmail)) {
            newErrors.email = 'Please enter a valid email address.';
            isValid = false;
        }

        if (enteredPassword.length < MIN_PASSWORD_LENGTH) {
            newErrors.password = 'Password must be at least 8 characters long.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    return (
        <>
            {<form
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
                    value={enteredEmail}
                    onChange={(e) => setEnteredEmail(e.target.value)}
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
                    value={enteredPassword}
                    onChange={(e) => setEnteredPassword(e.target.value)}
                    required
                    autoComplete="current-password" // Enables autocomplete for password
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <div className="button-container">
                <button type="submit">Log in</button>
            </div>
        </form>
            }
        </>
    );
};

export default LoginForm;
