class SessionManager {

    static sessionTimeout;
    static setSessionTimeout(durationInMinutes) {
        this.sessionTimeout = durationInMinutes * 60 * 1000;
    }
    static resetSessionExpiry() {
        const now = new Date().getTime();
        const newExpiry = now + this.sessionTimeout;
        localStorage.setItem('sessionExpiry', newExpiry.toString());
    }

    static checkSessionExists() {
        const jwtToken = localStorage.getItem('jwtToken');
        return jwtToken && true;
    }

    static checkSessionExpired() {
        const jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken && !this.hasTimeExpired())
            return true;
        return false;
    }

    static hasTimeExpired() {
        const sessionExpiryTime = localStorage.getItem('sessionExpiry');
        const now = new Date();
        if (now.getTime() > parseInt(sessionExpiryTime)) {
            this.clearSession();
            return false;
        }
        return true;
    }
    static setJwtSessionToken(jwtToken, authNickname) {
        const now = new Date().getTime();
        const expiry = now + this.sessionTimeout;
        localStorage.setItem('jwtToken', jwtToken);
        localStorage.setItem('sessionExpiry', expiry.toString());
        localStorage.setItem('authNickname', authNickname);
    }

    static getSessionExpiry() {
        return localStorage.getItem('sessionExpiry');
    }

    static getAuthNickname() {
        return localStorage.getItem('authNickname');
    }

    static getEmailAndNicknameFromToken() {
        const jwtToken = localStorage.getItem('jwtToken');

        if (jwtToken) {
            const parts = jwtToken.split('.');
            const payload = parts[1];
            const decodedPayload = atob(payload);
            const payloadData = JSON.parse(decodedPayload);
            const email = payloadData.email;
            const nickname = payloadData.nickname;
            return { email, nickname };
        } else {
            return null;
        }
    }

    static clearSession() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('sessionExpiry');
        localStorage.removeItem('authNickname')
    }

    static handleSessionExpiry() {
        this.setSessionExpired();
        this.clearSession();
    }

    static sessionExpired() {
        if (localStorage.getItem('loggedInState') === 'sessionExpired') {
            return true;
        }
        else return false;
    }
    static setSessionExpired() {
        localStorage.setItem('loggedInState', 'sessionExpired');
    }
    static setLastLoginAction(lastLoginAction) {
        localStorage.setItem('lastLoginAction', lastLoginAction);
    }

    static getLastLoginAction() {
        const storedLastLoginAction = localStorage.getItem('lastLoginAction');
        if (storedLastLoginAction) {
            return storedLastLoginAction;
        } else {
            return 'notLoggedIn';
        }
    }

    static setTemporaryJwtToken(jwtToken) {
        // Store token temporarily (in sessionStorage, for example)
        sessionStorage.setItem('tempJwtToken', jwtToken);
    }

    static getTemporaryJwtToken() {
        // Retrieve the temporarily stored token
        return {
            jwtToken: sessionStorage.getItem('tempJwtToken'),
        };
    }
    static clearTemporaryJwtToken() {
        // Clear temporary token
        sessionStorage.removeItem('tempJwtToken');
    }
}

export default SessionManager;