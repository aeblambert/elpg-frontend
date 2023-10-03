
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
    const { isLoggedIn } = useAuth();
    return (
        <Routes>
            <Route path="/" element={!isLoggedIn ?  <Navigate to="/" /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}
function App() {
    const [activeModal, setActiveModal] = useState(null);
    const [setRegistrationMessage] = useState('');
    const { isLoggedIn, setIsLoggedIn, authEmail, setAuthEmail,
        authNickname, setAuthNickname, landingPageMessage, setLandingPageMessage } = useAuth();
   // const [cachedCredentials, setCachedCredentials] = useAuth();
    const handleLogout = () => {
        setIsLoggedIn(false);
        setAuthEmail(null);
        setAuthNickname(null);
        SessionManager.clearSession();
        setLandingPageMessage(null);
    }
    useEffect(() => {
        const sessionDurationInMinutes = 45;
        SessionManager.setSessionTimeout(sessionDurationInMinutes);
        let lastReset = 0;
        const resetThresholdInMinutes = 5;
        function resetSession() {
            const currentTime = new Date().getTime();
            if (SessionManager.checkSessionValid()) {
                if (currentTime - lastReset > resetThresholdInMinutes * 60 * 1000) {
                    lastReset = currentTime;
                    SessionManager.resetSessionExpiry();
                    setLandingPageMessage(null);
                } else {
                    setLandingPageMessage('Session has expired.  Please log in again!');
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
    }, []);

    useEffect(() => {
        const cachedEmail = localStorage.getItem("cachedEmail");
        const cachedNickname = localStorage.getItem("cachedNickname");
        if (SessionManager.checkSessionValid()) {
            setIsLoggedIn(true);
            setAuthEmail(cachedEmail);
            setAuthNickname(cachedNickname);
        } else {
            setIsLoggedIn(false);
            localStorage.removeItem("userEmail");
            SessionManager.clearSession();
        }
    }, []);

    return (
            <Router>
                <div className="App">
                    <header className="App-header">
                        <div className="logo-container">
                            <img src="/book_image.jpg" alt="Books" className="book-image-style" />
                            <h1 className="h1-style"> Vienna Kids Bookshare</h1>
                        </div>
                        <div className="header-buttons">
                            {isLoggedIn ? (
                                <>
                                    <span>{authNickname}</span>
                                    <button className="header-button" onClick={handleLogout}>
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
                        {!isLoggedIn && (
                            <p>{landingPageMessage || 'To view and share books, please log in or register a new account'}</p>
                        )}
                    </main>

                    <Modal
                        isOpen={activeModal !== null}
                        onRequestClose={() => {
                            console.log("Current activeModal: ", activeModal);
                            setActiveModal(null);
                            }}
                    >
                        <h2>
                            {activeModal === 'newUserForm' ? 'Choose Nickname' :
                                activeModal === 'registrationForm' ? 'Register' : 'Log in'}
                        </h2>
                        {activeModal === 'loginForm' && (
                            <LoginForm
                            //closeModal={() => setActiveModal(null)}
                            setActiveModal={setActiveModal}
                            />
                        )}
                        {activeModal === 'registrationForm' && (
                            <RegistrationForm closeModal={() => setActiveModal(null)} setRegistrationMessage={setRegistrationMessage}/>
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



