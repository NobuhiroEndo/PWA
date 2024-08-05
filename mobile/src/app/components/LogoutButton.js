import React from 'react';
import useAuth from '../hooks/useAuth';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const LogoutButton = () => {
    const { updateLoginStatus } = useAuth();

    const handleLogout = async () => {
        try {
            const response = await fetch(`${baseURL}/user_logout/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include' // This ensures cookies are sent with the request
            });

            if (response.ok) {
                // Handle successful logout
                updateLoginStatus(false);
                console.log('Logout successful');
                // Clear the token from localStorage
                localStorage.removeItem('authToken');
                // Redirect to login page or home page
                window.location.href = '/login'; // Example redirect
            } else {
                const errorData = await response.json();
                console.error('Logout failed:', errorData);
            }
        } catch (err) {
            console.error('An error occurred:', err);
        }
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;