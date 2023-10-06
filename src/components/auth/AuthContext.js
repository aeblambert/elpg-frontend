import React, { createContext, useContext, useState, useEffect } from 'react';
import SessionManager from '../../services/SessionManager';
export const AuthContext = createContext({
    authEmail: null,
    setAuthEmail: () => {},
    authNickname: null,
    setAuthNickname: () => {},
    cachedEmail: null,
    setCachedEmail: () => {},
    lastLoginAction: '',
    setLastLoginAction: () => {},
});

export function AuthProvider({ children }) {
    const [authEmail, setAuthEmail] = useState(null);
    const [authNickname, setAuthNickname] = useState(null);
    const [cachedEmail, setCachedEmail] = useState(null);
    const [lastLoginAction, setLastLoginAction] = useState(SessionManager.getLastLoginAction() === 'manualLogout' ? 'notLoggedIn' : SessionManager.getLastLoginAction());
    const authValues = {
        authEmail, setAuthEmail,
        authNickname, setAuthNickname,
        cachedEmail, setCachedEmail,
        lastLoginAction, setLastLoginAction,
    };
    useEffect(() => {
        const tokenData = SessionManager.getEmailAndNicknameFromToken();
        if (tokenData) {
            const authEmail = tokenData.email;
            setAuthEmail(authEmail);
            setAuthNickname((SessionManager.getAuthNickname()));
        }
    }, []);

    return (
        <AuthContext.Provider value={authValues}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
