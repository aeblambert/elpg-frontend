import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    authEmail: null,
    setAuthEmail: () => {},
    authNickname: null,
    setAuthNickname: () => {},
    cachedCredentials: null,
    setCachedCredentials: () => {},
});

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authEmail, setAuthEmail] = useState(null);
    const [authNickname, setAuthNickname] = useState(null);
    const [cachedCredentials, setCachedCredentials] = useState({ cachedEmail: null, cachedPassword: null });
    const authValues = {
        isLoggedIn, setIsLoggedIn,
        authEmail, setAuthEmail,
        authNickname, setAuthNickname,
        cachedCredentials, setCachedCredentials,
    };

    return (
        <AuthContext.Provider value={authValues}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
