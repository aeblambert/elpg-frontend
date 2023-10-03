import React, { useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, useAuth } from './AuthContext';
import SessionManager from "../../services/SessionManager";
import '../../styles/Form.css';
const NewUserForm = ({setActiveModal}) => {
    const { setIsLoggedIn, setAuthEmail, setAuthNickname, cachedCredentials } = useAuth();
    const navigate = useNavigate();
    const [enteredNickname, setEnteredNickname] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setNicknameError('');
        if (!cachedCredentials || !cachedCredentials.email) {
            console.error('Cached credentials are missing');
            return; }
        try {
            const response = await fetch('http://localhost:8080/api/users/set-nickname', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email: cachedCredentials.email, nickname: enteredNickname }),
            });

            if (response.ok) {
                const newJwtToken = SessionManager.getTemporaryJwtToken();
                setIsLoggedIn(true);
                setAuthEmail(cachedCredentials.email);
                setAuthNickname(enteredNickname);
                console.log("Nickname: ", enteredNickname);
                SessionManager.setJwtSessionToken(newJwtToken, cachedCredentials.email);
                SessionManager.clearTemporaryJwtToken();
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
            <p>In order to use your new booksharing account, you need to choose a nickname you will be known by.</p>
            <label htmlFor="username">Nickname:&nbsp;</label>
            <input
                id="username"
                type="text"
                value={enteredNickname}
                onChange={(e) => setEnteredNickname(e.target.value)}
                maxLength={10}
            />
            <div id="error-message">
            {nicknameError && <p>{nicknameError}</p>}
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default NewUserForm;