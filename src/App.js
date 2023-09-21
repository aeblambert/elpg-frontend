
import React, { useState } from 'react';
import './styles/App.css';
import RegistrationForm from './components/auth/RegistrationForm';
import LoginForm from './components/auth/LoginForm';
import Modal from './components/ui/Modal';
import SessionManager from './services/SessionManager';
import { useEffect } from 'react';

function App() {
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [registrationMessage, setRegistrationMessage] = useState('');

    useEffect(() => {
        const sessionDurationInMinutes = 45;
        SessionManager.setSessionTimeout(sessionDurationInMinutes);
        function resetSession() {
            if (SessionManager.isTokenValid()) {
                SessionManager.resetSessionExpiry();
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

    return (
        <div className="App">
            <header className="App-header">
                <div className="logo-container">
                    <img src="/book_image.jpg" alt="Books" className="book-image-style" />
                    <h1 className="h1-style"> Vienna Kids Bookshare</h1>
                </div>
                <div className="header-buttons">                    
                    <button className="header-button" onClick={() => setIsLoginModalOpen(true)}>
                        Log in</button>
                    <button className="header-button" onClick={() => setIsRegistrationModalOpen(true)}>
                        Register</button>
                </div>
            </header>
            <main className="App-main">
                <p>{registrationMessage || "To view and share books, please log in or register a new account"}</p>
            </main>
            <Modal isOpen={isRegistrationModalOpen} onRequestClose={()=>setIsRegistrationModalOpen(false)}>
                <h2>Register</h2>
                <RegistrationForm closeModal={()=>setIsRegistrationModalOpen(false)} setRegistrationMessage={setRegistrationMessage}/>
            </Modal>
            <Modal isOpen={isLoginModalOpen} onRequestClose={()=>setIsLoginModalOpen(false)}>
                <h2>Log in</h2>
                <LoginForm />
            </Modal>
        </div>
    );
}

export default App;



