import { useAuth } from '../../components/auth/AuthContext';

function Dashboard() {
    const { authNickname} = useAuth();
    return (
        <div>
            <h1>Welcome, { authNickname }</h1>
            <p>You're now on the dashboard!</p>
        </div>
    );
}

export default Dashboard;
