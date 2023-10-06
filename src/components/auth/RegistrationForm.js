import React, { useState } from 'react';
import '../../styles/Form.css';
import config from '../../config/config';
import { useAuth } from "./AuthContext";

const RegistrationForm = ({setActiveModal }) => {
    const { setLastLoginAction } = useAuth();
    const [errors, setErrors] = useState({ email: "", password: "", confirmPassword: "" });
    const [userRegData, setUserRegData] = useState(
        {
            email:'',
            password:'',
            confirmPassword:''
        });

    const handleUserRegDataChange = (key, value) => {
        setUserRegData(prevData => {
            return (
                {
                    ...prevData,
                    [key]: value
                }
            );
        });
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
        if (validateForm()) {
            fetch(`${config.apiUrl}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userRegData)
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Failure in network response.');
                    }
                })
                .then(data => {
                    setLastLoginAction('justRegistered');
                    setActiveModal(null);
                })
                .catch(error => {
                    console.error("An error occurred: ", error);
                });
        }
    };

    const validateForm = () => {
        let isValid = true;
        let newErrors = { email: "", password: "", confirmPassword: "" };

        // Validate email format
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(userRegData.email)) {
            newErrors.email = "Please enter a valid email address.";
            isValid = false;
        }

        // Validate password complexity (e.g., minimum 8 characters, at least one uppercase, one lowercase, and one digit)
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordPattern.test(userRegData.password)) {
            newErrors.password = "Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, and one digit.";
            isValid = false;
        }

        // Validate matching password confirmation
        if (userRegData.password !== userRegData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="input-container">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={userRegData.email}
                    onChange={(e) => handleUserRegDataChange("email", e.target.value)}
                    required
                    autoComplete="email"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="input-container">
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={userRegData.password}
                    onChange={(e) => handleUserRegDataChange("password", e.target.value)}
                    required
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <div className="input-container">
                <label htmlFor="password-confirmation">Confirm Password:</label>
                <input
                    type="password"
                    id="password-confirmation"
                    value={userRegData.confirmPassword}
                    onChange={(e) => handleUserRegDataChange("confirmPassword", e.target.value)}
                    required
                />
                <div className="error-message">
                {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
                </div>
            </div>
            <div className="button-container">
                <button type="submit">Register</button>
            </div>
        </form>
    );
};

export default RegistrationForm;
