
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './styles/App.css';
import RegistrationForm from './components/auth/RegistrationForm';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './components/ui/Dashboard';
import Modal from './components/ui/Modal';
import SessionManager from './services/SessionManager';
import { useAuth } from './components/auth/AuthContext';
import sessionManager from "./services/SessionManager";

function AppRoutes() {
    const { userEmail, isLoggedIn } = useAuth();
    return (
        <Routes>
            <Route path="/" element={!isLoggedIn ?  <Navigate to="/" /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}
function App() {
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [registrationMessage, setRegistrationMessage] = useState('');
    const { isLoggedIn, setIsLoggedIn, userEmail, setUserEmail, landingPageMessage, setLandingPageMessage } = useAuth();
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserEmail(null);
        sessionManager.clearSession();
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
        const storedEmail = localStorage.getItem("userEmail");
        if (SessionManager.checkSessionValid()) {
            setIsLoggedIn(true);
            setUserEmail(storedEmail);
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
                                    <span>{userEmail}</span>
                                    <button className="header-button" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="header-button" onClick={() => setIsLoginModalOpen(true)}>
                                        Log in
                                    </button>
                                    <button className="header-button" onClick={() => setIsRegistrationModalOpen(true)}>
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
                    <Modal isOpen={isRegistrationModalOpen} onRequestClose={()=>setIsRegistrationModalOpen(false)}>
                        <h2>Register</h2>
                        <RegistrationForm closeModal={()=>setIsRegistrationModalOpen(false)} setRegistrationMessage={setRegistrationMessage}/>
                    </Modal>
                    <Modal isOpen={isLoginModalOpen} onRequestClose={()=>setIsLoginModalOpen(false)}>
                        <h2>Log in</h2>
                        <LoginForm closeModal={() => setIsLoginModalOpen(false)}/>
                    </Modal>
                </div>
            </Router>
    );
}

export default App;



