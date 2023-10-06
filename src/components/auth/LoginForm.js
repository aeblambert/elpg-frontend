import React, {useState } from 'react';
import jwt_decode from 'jwt-decode'; // Import the jwt-decode library
import { useNavigate } from 'react-router-dom';
import '../../styles/Form.css';
import { useAuth } from "./AuthContext";
import SessionManager from "../../services/SessionManager";
const MIN_PASSWORD_LENGTH = 8;

const LoginForm
      = ({setActiveModal}) =>  {
    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [loginErrorMessage, setLoginErrorMessage] = useState('');
    const navigate = useNavigate();
    const { setLastLoginAction, setAuthEmail, setAuthNickname, setCachedEmail} = useAuth();

    const handleLogin = async () => {
        const response = await fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email: enteredEmail, password: enteredPassword }),
        });
        if (response.ok) {
            const data = await response.json();
            setLoginErrorMessage(data.message);
            if (data.jwtToken) {
                const decoded = jwt_decode(data.jwtToken);
                if (decoded && decoded.email === enteredEmail) {
                    if (data.isFirstLogin === "true") {
                        setCachedEmail(enteredEmail);
                        SessionManager.setTemporaryJwtToken(data.jwtToken);
                        setActiveModal('newUserForm');
                    } else {
                        setLastLoginAction('loggedIn');
                        SessionManager.setJwtSessionToken(data.jwtToken, data.nickname);
                        setAuthEmail(enteredEmail);
                        setAuthNickname(data.nickname);
                        setActiveModal(null);
                        navigate('/dashboard');
                    }
                } else {
                    console.error('Invalid JWT token');
                    // TODO: Redirect to login or show error message
                }
            } else {
                console.error('JWT token missing in response');
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
            newErrors.email = 'Not a valid email';
            isValid = false;
        }

        if (enteredPassword.length < MIN_PASSWORD_LENGTH) {
            newErrors.password = 'Min password length is 8';
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
                <div className="error-message">
                    {errors.password ? (
                        <span>{errors.password}</span>
                    ) : (
                        loginErrorMessage && <span>{loginErrorMessage}</span>
                    )}
                </div>
            </div>
            <div className="button-container">
                <button type="submit">Log in</button>
            </div>
                <div className="error-message">

                </div>
        </form>
            }
        </>
    );
};

export default LoginForm;
