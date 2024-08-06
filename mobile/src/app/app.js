import React, { useEffect } from 'react';
import NotFCMNotification from './components/NotFCMNotification';
import LoginForm from './components/LoginForm';
import LogoutButton from './components/LogoutButton';
import useAuth from './hooks/useAuth';

const App = () => {
    const { isLoggedIn } = useAuth();
    useEffect(() => {
    }, [isLoggedIn]);
    return (
        <>
            {isLoggedIn && <NotFCMNotification />}
            <LoginForm />
            {isLoggedIn && <LogoutButton />}
        </>
    );
};

export default App;