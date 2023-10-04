class SessionManager {

    static sessionTimeout = 30 * 60 * 1000; // 30 minutes is default
    static setSessionTimeout(durationInMinutes) {
        this.sessionTimeout = durationInMinutes * 60 * 1000; // Convert minutes to milliseconds
    }
    static resetSessionExpiry() {
        const now = new Date().getTime();
        const newExpiry = now + this.sessionTimeout;
        localStorage.setItem('sessionExpiry', newExpiry.toString());
    }

    static checkSessionValid() {
        const jwtToken = localStorage.getItem('jwtToken');
        const expiryTime = localStorage.getItem('sessionExpiry');
        if (!jwtToken || !expiryTime) {
            return false;
        }

        const now = new Date();
        if (now.getTime() > expiryTime) {
            this.clearSession();
            return false;
        }
        return true;
    }

    static setJwtSessionToken(jwtToken, authEmail, authNickname) {
        const now = new Date().getTime();
        const expiry = now + this.sessionTimeout;
        localStorage.setItem('jwtToken', jwtToken);
        localStorage.setItem('sessionExpiry', expiry.toString());
        localStorage.setItem('authEmail', authEmail);
        localStorage.setItem('authNickname', authNickname);
    }

    static getJwtToken() {
        return localStorage.getItem('jwtToken');
    }

    static clearSession() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('sessionExpiry');
        localStorage.removeItem('authEmail');
        localStorage.removeItem('authNickname');
    }

    static setLandingPageState(state) {
        localStorage.setItem('landingPageState', state);
    }

    static getLandingPageState() {
        return localStorage.getItem('landingPageState') || 'initialRender';
    }

    static handleSessionExpiry() {
        this.setLandingPageState('sessionExpired');
        this.clearSession();
    }

    static handleManualLogout() {
        this.setLandingPageState('manualLogout');
        this.clearSession();
    }
    static resetLandingPageState() {
        this.setLandingPageState('initialRender');
    }

    static setTemporaryJwtToken(jwtToken, email) {
        // Store token temporarily (in sessionStorage, for example)
        sessionStorage.setItem('tempJwtToken', jwtToken);
        sessionStorage.setItem('tempUserEmail', email);
    }
    static getTemporaryJwtToken() {
        // Retrieve the temporarily stored token
        return {
            jwtToken: sessionStorage.getItem('tempJwtToken'),
            email: sessionStorage.getItem('tempUserEmail')
        };
    }
    static clearTemporaryJwtToken() {
        // Clear temporary token
        sessionStorage.removeItem('tempJwtToken');
        sessionStorage.removeItem('tempUserEmail');
    }
}

export default SessionManager;