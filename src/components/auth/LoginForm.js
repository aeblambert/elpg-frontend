import React, { useState } from 'react';
import '../../styles/Form.css';
const MIN_PASSWORD_LENGTH = 8;

function LoginForm() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: "", password: "" });

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
                    // TODO: Proceed with the login process
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