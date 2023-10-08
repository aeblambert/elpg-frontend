import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import SessionManager from "../../services/SessionManager";
import '../../styles/Form.css';
const NewUserForm = ({setActiveModal}) => {
    const navigate = useNavigate();
    const [enteredNickname, setEnteredNickname] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [hasConsented, setHasConsented] = useState(false);
    const { setLastLoginAction, setAuthEmail, setAuthNickname, cachedEmail} = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setNicknameError('');
        try {
            const response = await fetch('http://localhost:8080/api/users/new-user', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: cachedEmail,
                    nickname: enteredNickname,
                    district: selectedDistrict,
                    consent: hasConsented
                }),
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
                <p>As a new user, you need to provide additional information to access the booksharing service</p>
            </div>
            <div className="input-container-chooser">
                Enter a nickname you will be known by:
                <label htmlFor="username" className="input-label">&nbsp;</label>
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

            <div className="input-container-chooser">
                <p>In which district of Vienna do you live?</p>
                <label htmlFor="district" className="input-label">&nbsp;</label>
                <select
                    id="district"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    required
                >
                    <option value="" disabled>Select District</option>
                    {Array.from({length: 23}, (_, i) => i + 1).map((district) => (
                        <option key={district} value={district}>{district}</option>
                    ))}
                    <option value="outside">I live outside Vienna</option>
                </select>
            </div>

            <p>You need to consent to your information being shared with other users.  Only your email, nickname, and the district where you live will be shared with other users.</p>

            <div className="input-container-chooser">
                <input
                    type="checkbox"
                    id="consent"
                    checked={hasConsented}
                    onChange={(e) => setHasConsented(e.target.checked)}
                    required
                />
                <label htmlFor="consent">&nbsp; I consent to the above information being shared with other users solely  for the purpose of sharing books.</label>
            </div>


            <div className="button-container">
            <button type="submit">Submit</button>
            </div>
        </form>
    );
};

export default NewUserForm;