import { useState, useEffect } from 'react';

const useAuth = () => {
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));

    useEffect(() => {
        const handleStorageChange = () => {
            setAuthToken(localStorage.getItem('authToken'));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const updateLoginStatus = (token) => {
        if (token) {
            localStorage.setItem('authToken', token);
            setAuthToken(token);
        } else {
            localStorage.removeItem('authToken');
            setAuthToken(null);
        }
    };

    return { authToken, isLoggedIn: !!authToken, updateLoginStatus };
};

export default useAuth;