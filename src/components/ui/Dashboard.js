import React, { useContext } from 'react';
import {AuthContext, useAuth} from '../auth/AuthContext';

function Dashboard() {
    const {userEmail, userNickname} = useAuth();

    return (
        <div>
            <h1>Welcome, {userNickname}</h1>
            <p>You're now on the dashboard!</p>
        </div>
    );
}

export default Dashboard;
