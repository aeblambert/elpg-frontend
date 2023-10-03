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

    static setJwtSessionToken(jwtToken, userEmail) {
        const now = new Date().getTime();
        const expiry = now + this.sessionTimeout;
        localStorage.setItem('jwtToken', jwtToken);
        //localStorage.setItem('sessionToken', token);
        localStorage.setItem('sessionExpiry', expiry.toString());
        localStorage.setItem('userEmail', userEmail);
    }

    static getJwtToken() {
        return localStorage.getItem('jwtToken');
    }

    static clearSession() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('sessionExpiry');
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