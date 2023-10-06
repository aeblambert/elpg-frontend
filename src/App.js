
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './styles/App.css';
import RegistrationForm from './components/auth/RegistrationForm';
import LoginForm from './components/auth/LoginForm';
import NewUserForm from './components/auth/NewUserForm';
import Dashboard from './components/ui/Dashboard';
import Modal from './components/ui/Modal';
import SessionManager from './services/SessionManager';
import { useAuth } from './components/auth/AuthContext';


function AppRoutes() {
    const { lastLoginAction } = useAuth();
    return (
        <Routes>
            <Route path="/" element={lastLoginAction === 'loggedIn' ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/dashboard" element={lastLoginAction === 'loggedIn' ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}
function App() {
    const [activeModal, setActiveModal] = useState(null);
    const { lastLoginAction, setLastLoginAction,
            authNickname} = useAuth();
    const handleLogout = () => {
        setLastLoginAction('manualLogout');
        SessionManager.clearSession();
    }

    const handleSessionExpiry = () => {
        setLastLoginAction('sessionExpired');
        SessionManager.clearSession();
    }

    // Sync login state to local storage
    useEffect(() => {
        if (lastLoginAction) {
            SessionManager.setLastLoginAction(lastLoginAction);
        }
    }, [lastLoginAction]);

    // Timeout for session expiry
    useEffect(() => {
        const sessionDurationInMinutes = 30;
        SessionManager.setSessionTimeout(sessionDurationInMinutes);
        let lastReset = new Date().getTime();
        const resetThresholdInMinutes = 5;
        function resetSession() {
            const currentTime = new Date().getTime();
            if (SessionManager.checkSessionExists()) {
                if (currentTime - lastReset > resetThresholdInMinutes * 60 * 1000) {
                    if (SessionManager.checkSessionExpired()) {
                        handleSessionExpiry();
                    } else {
                        lastReset = currentTime;
                        SessionManager.resetSessionExpiry();
                    }
                }
            }
        }

        window.addEventListener('mousemove', resetSession);
        window.addEventListener('keypress', resetSession);
        window.addEventListener('click', resetSession);

        return () => {
            window.removeEventListener('mousemove', resetSession);
            window.removeEventListener('keypress', resetSession);
            window.removeEventListener('click', resetSession);
        };
    }, );

    return (
            <Router>
                <div className="App">
                    <header className="App-header">
                        <div className="logo-container">
                            <img src="/book_image.jpg" alt="Books" className="book-image-style" />
                            <h1 className="h1-style"> Vienna Kids Bookshare</h1>
                        </div>
                        <div className="header-buttons">
                            {lastLoginAction === 'loggedIn' ? (
                                <>
                                    <span className="nickname-label">{authNickname}</span>
                                    <button className="header-button" onClick={() => handleLogout()}>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="header-button" onClick={() => setActiveModal('loginForm')}>
                                        Log in
                                    </button>
                                    <button className="header-button" onClick={() => setActiveModal('registrationForm')}>
                                        Register
                                    </button>
                                </>
                            )}
                        </div>
                    </header>

                    <main className="App-main">
                        <AppRoutes />
                        {
                            <p>
                                { lastLoginAction === 'notLoggedIn' && 'To view and share books, please log in or register a new account'}
                                { lastLoginAction === 'sessionExpired'  && 'Your session has expired. Please log in again!'}
                                { lastLoginAction === 'manualLogout' && 'You have logged out.  Log in again to share books!'}
                                { lastLoginAction === 'justRegistered' && 'You have successfully registered.  Please log in!' }
                            </p>
                        }
                    </main>

                    <Modal
                        isOpen={activeModal !== null}
                        onRequestClose={() => {
                            setActiveModal(null);
                            }}
                    >
                        <h2 className="modal-title">
                            {activeModal === 'newUserForm' ? 'Choose Nickname' :
                                activeModal === 'registrationForm' ? 'Register' : 'Log in'}
                        </h2>
                        {activeModal === 'loginForm' && (
                            <LoginForm
                            setActiveModal={setActiveModal}
                            />
                        )}
                        {activeModal === 'registrationForm' && (
                            <RegistrationForm closeModal={setActiveModal}/>
                        )}
                        {activeModal === 'newUserForm' && (
                            <NewUserForm
                                setActiveModal={setActiveModal}
                            />
                        )}
                    </Modal>
                </div>
            </Router>
    );
}

export default App;