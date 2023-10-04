
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
            <Route path="/" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}
function App() {
    const [activeModal, setActiveModal] = useState(null);
    const [registrationMessage, setRegistrationMessage] = useState('');
    const [landingPageState, setLandingPageState] = useState('');
    const { isLoggedIn, setIsLoggedIn, authEmail, setAuthEmail,
        authNickname, setAuthNickname } = useAuth();
   // const [cachedCredentials, setCachedCredentials] = useAuth();
    const handleLogout = () => {
        setIsLoggedIn(false);
        setAuthEmail(null);
        setAuthNickname(null);
        SessionManager.handleManualLogout();
        setLandingPageState(SessionManager.getLandingPageState());
        console.log("Manually logging out. landingPageState: ", landingPageState, SessionManager.getLandingPageState())
    }

    useEffect(() => {
        setLandingPageState(SessionManager.getLandingPageState());
        if (landingPageState === 'sessionExpired') {
            console.log("Session expired: ", landingPageState, SessionManager.getLandingPageState())
            setTimeout(() => {
                SessionManager.resetLandingPageState();
                console.log("Timed out: ", landingPageState, SessionManager.getLandingPageState())
            }, 5000); // 5 seconds
        } else {
            SessionManager.resetLandingPageState();
            setLandingPageState(SessionManager.getLandingPageState());
            console.log("Starting up. landingPageState: ", landingPageState, SessionManager.getLandingPageState())
        }
    }, []);

    useEffect(() => {
        console.log("New value of landingPageState", landingPageState, SessionManager.getLandingPageState());
    }, [landingPageState]);

    useEffect(() => {
        const sessionDurationInMinutes = 30;
        SessionManager.setSessionTimeout(sessionDurationInMinutes);
        let lastReset = 0;
        const resetThresholdInMinutes = 5;

        function resetSession() {
            const currentTime = new Date().getTime();
            if (SessionManager.checkSessionValid()) {
                if (currentTime - lastReset > resetThresholdInMinutes * 60 * 1000) {
                    lastReset = currentTime;
                    SessionManager.resetSessionExpiry();
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
            //SessionManager.handleSessionExpiry();
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
                            <p>
                                {landingPageState === 'initialRender' && 'To view and share books, please log in or register a new account'}
                                {landingPageState === 'sessionExpired' && 'Your session has expired. Please log in again!'}
                                {landingPageState === 'manualLogout' && 'You have logged out.  Log in again to share books!'}
                            </p>
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