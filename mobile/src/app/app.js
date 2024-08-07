import React from 'react';
import NotFCMNotification from './components/NotFCMNotification';
import UpdateUnreadCount from './components/UpdateUnreadCount';
import LoginForm from './components/LoginForm';
import LogoutButton from './components/LogoutButton';
import useAuth from './hooks/useAuth';

const App = () => {
    const { isLoggedIn } = useAuth();

    return (
        <>
            {isLoggedIn && <NotFCMNotification />}
            {!isLoggedIn && <LoginForm />}
            {isLoggedIn && <LogoutButton />}
            {isLoggedIn && <UpdateUnreadCount />}
        </>
    );
};

export default App;