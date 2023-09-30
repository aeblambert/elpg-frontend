// services/SessionManager.js

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

    static isTokenValid() {
        const token = localStorage.getItem('sessionToken');
        const expiryTime = localStorage.getItem('sessionExpiry');

        if (!token || !expiryTime) {
            return false;
        }

        const now = new Date();
        if (now.getTime() > expiryTime) {
            this.clearSession();
            return false;
        }

        return true;
    }

    static setSessionToken(token, userEmail) {
        const now = new Date().getTime();
        const expiry = now + this.sessionTimeout;
        localStorage.setItem('sessionToken', token);
        localStorage.setItem('sessionExpiry', expiry.toString());
        localStorage.setItem('userEmail', userEmail); // Store the email
    }

    static getSessionToken() {
        return localStorage.getItem('sessionToken');
    }

    static clearSession() {
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('sessionExpiry');
    }
}

export default SessionManager;