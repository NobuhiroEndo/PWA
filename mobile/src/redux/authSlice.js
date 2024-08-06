import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    authToken: localStorage.getItem('authToken') || null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthToken(state, action) {
            state.authToken = action.payload;
            localStorage.setItem('authToken', action.payload);
        },
        removeAuthToken(state) {
            state.authToken = null;
            localStorage.removeItem('authToken');
        }
    }
});

export const { setAuthToken, removeAuthToken } = authSlice.actions;
export default authSlice.reducer;