import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.isAuthenticated = true;
            if (typeof window !== 'undefined') {
                localStorage.setItem('access_token', action.payload);
            }
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
            }
        },
        hydrateAuth: (state) => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('access_token');
                if (token) {
                    state.token = token;
                    state.isAuthenticated = true;
                }
            }
        }
    },
});

export const { login, logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
