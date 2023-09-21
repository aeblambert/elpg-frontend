
import React, { useState } from 'react';
<<<<<<< Updated upstream
import './App.css';
import AuthForm from './AuthForm';
import Modal from './Modal';
=======
import './styles/App.css';
import RegistrationForm from './components/auth/RegistrationForm';
import LoginForm from './components/auth/LoginForm';
import Modal from './components/ui/Modal';
>>>>>>> Stashed changes

function App() {
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [registrationMessage, setRegistrationMessage] = useState('');

    const openRegistrationModal = () => {
        setIsRegistrationModalOpen(true);
    };

    const closeRegistrationModal = () => {
        setIsRegistrationModalOpen(false);
    };

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    return (
        <div className="App">
            <header className="App-header">
                <div className="logo-container">
                    <img src="/book_image.jpg" alt="Books" className="book-image-style" />
                    <h1 className="h1-style"> Vienna Kids Bookshare</h1>
                </div>
                <div className="header-buttons">
                    <button className="header-button" onClick={openLoginModal}>
                        Log in</button>
                    <button className="header-button" onClick={openRegistrationModal}>
                        Register
                    </button>
                </div>


            </header>
            <main className="App-main">
                <p>{registrationMessage || "To view and share books, please log in or register a new account"}</p>
            </main>
            <Modal isOpen={isRegistrationModalOpen} onRequestClose={closeRegistrationModal}>
                <h2>Register</h2>
                <AuthForm closeModal={closeRegistrationModal} setRegistrationMessage={setRegistrationMessage}/>
            </Modal>
            <Modal isOpen={isLoginModalOpen} onRequestClose={closeLoginModal}>
                <h2>Log in</h2>
                <AuthForm />
            </Modal>
        </div>
    );
}

export default App;
