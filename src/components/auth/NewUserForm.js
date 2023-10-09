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
    const minLengthNicknameErrorMessage = "Please use 5-10 letters or numbers"
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
            const data = await response.json();
            if (response.ok) {
                setLastLoginAction('loggedIn');
                SessionManager.setJwtSessionToken(SessionManager.getTemporaryJwtToken(), enteredNickname);
                SessionManager.clearTemporaryJwtToken();
                setAuthEmail(cachedEmail);
                setAuthNickname(enteredNickname);
                setActiveModal(null);
                navigate('/dashboard');
            } else if (response.status === 409) {
                setNicknameError(data.message);
                return;
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="intro-text information-text">
                As a new user, you need to provide additional information to access the booksharing service.
            </div>
            <div className="input-container-chooser nickname-container">
                Enter a nickname you would like to be known by:
                <label htmlFor="nickname" className="input-label"></label>
            <input
                id="nickname"
                type="text" autocomplete="off"
                minLength="5"
                value={enteredNickname}
                onChange={(e) => {
                    const input = e.target.value.toLowerCase();
                    const lowercaseAndDigitsOnly = input.replace(/[^a-z0-9]/g, '');
                    setEnteredNickname(lowercaseAndDigitsOnly);
                    if (enteredNickname.length === 0 || lowercaseAndDigitsOnly.length < 5) {
                        setNicknameError(minLengthNicknameErrorMessage);
                    } else {
                        setNicknameError("");
                    }
                }}
                maxLength={10}
            />
            </div>
            <div className={
                nicknameError === minLengthNicknameErrorMessage
                    ? "info-message"
                    : "error-message"
            }>
            {nicknameError && <span>{nicknameError}</span>}
            </div>

            <div className="input-container-chooser district-container">
                In which district of Vienna do you live?
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

            <p>
            <div className="information-text">
            <p>You need to consent to your information being shared with other users.  Only your email, nickname, and the district where you live will be shared.</p>
            </div>
            </p>
            <div className="checkbox-wrapper">
                <input
                    type="checkbox"
                    id="consent"
                    className="consent-checkbox"
                    checked={hasConsented}
                    onChange={(e) => setHasConsented(e.target.checked)}
                    required
                />
                <label htmlFor="consent" className="consent-label"> <span>I consent to the above information being provided to other users (solely for the purpose of sharing books).</span></label>
            </div>


            <div className="button-container">
            <button type="submit">Submit</button>
            </div>
        </form>
    );
};

export default NewUserForm;