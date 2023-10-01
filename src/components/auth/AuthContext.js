import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    userEmail: null,
    setUserEmail: () => {},
    landingPageMessage: '',
    setLandingPageMessage: () => {},
});

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const [landingPageMessage, setLandingPageMessage] = useState(null);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userEmail, setUserEmail, landingPageMessage, setLandingPageMessage }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
