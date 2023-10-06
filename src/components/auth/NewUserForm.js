import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import SessionManager from "../../services/SessionManager";
import '../../styles/Form.css';
const NewUserForm = ({setActiveModal}) => {
    const navigate = useNavigate();
    const [enteredNickname, setEnteredNickname] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const { setLastLoginAction, setAuthEmail, setAuthNickname, cachedEmail} = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setNicknameError('');
        try {
            const response = await fetch('http://localhost:8080/api/users/set-nickname', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email: cachedEmail, nickname: enteredNickname }),
            });
            if (response.ok) {
                setLastLoginAction('loggedIn');
                SessionManager.setJwtSessionToken(SessionManager.getTemporaryJwtToken(), enteredNickname);
                SessionManager.clearTemporaryJwtToken();
                setAuthEmail(cachedEmail);
                setAuthNickname(enteredNickname);
                setActiveModal(null);
                navigate('/dashboard');
        } else {
                const data = await response.json();
                setNicknameError(data.message);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="intro-text">
                In order to use your new booksharing account, you need to choose a nickname you will be known by.
            </div>
            <div className="input-container-chooser">
            <label htmlFor="username" className="input-label">Nickname:&nbsp;</label>
            <input
                id="username"
                type="text"
                value={enteredNickname}
                onChange={(e) => setEnteredNickname(e.target.value)}
                maxLength={10}
            />
            </div>
            <div className="error-message">
            {nicknameError && <span>{nicknameError}</span>}
            </div>
            <div className="button-container">
            <button type="submit">Submit</button>
            </div>
        </form>
    );
};

export default NewUserForm;