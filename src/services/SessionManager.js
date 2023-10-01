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
}

export default SessionManager;