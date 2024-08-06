import React, { useEffect } from 'react';
import NotFCMNotification from './components/NotFCMNotification';
import UpdateUnreadCount from './components/UpdateUnreadCount';
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
            <UpdateUnreadCount />
        </>
    );
};

export default App;