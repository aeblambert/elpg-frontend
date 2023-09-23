import React, { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

function Dashboard() {
    const {setIsLoggedIn, userEmail, setUserEmail } = useContext(AuthContext);
    console.log("Dashboard component is rendered");
    const logout = () => {
        // You would usually remove tokens and perform logout logic here
        setIsLoggedIn(false);
        setUserEmail(null);
    };

    return (
        <div>
            <h1>Welcome, {userEmail}</h1>
            <p>You're now on the dashboard!</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default Dashboard;
