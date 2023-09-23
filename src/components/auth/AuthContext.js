import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    userEmail: null,
    setUserEmail: () => {},
});

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState(null);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userEmail, setUserEmail }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
