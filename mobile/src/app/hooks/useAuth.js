import { useSelector, useDispatch } from 'react-redux';
import { setAuthToken, removeAuthToken } from '../../redux/authSlice';

const useAuth = () => {
    const dispatch = useDispatch();
    const authToken = useSelector((state) => state.auth.authToken);

    const updateLoginStatus = (token) => {
        if (token) {
            dispatch(setAuthToken(token));
        } else {
            dispatch(removeAuthToken());
        }
    };

    return {
        authToken,
        isLoggedIn: !!authToken,
        updateLoginStatus
    };
};

export default useAuth;