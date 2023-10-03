import React, { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

function Dashboard() {
    const {userEmail, userNickname} = useContext(AuthContext);

    return (
        <div>
            <h1>Welcome, {userNickname}</h1>
            <p>You're now on the dashboard!</p>
        </div>
    );
}

export default Dashboard;
