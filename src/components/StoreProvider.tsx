'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store/store';
import { useEffect } from 'react';
import { hydrateAuth, logout } from '@/lib/store/features/authSlice';
import { hydrateCart } from '@/lib/store/features/cartSlice';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { MotionConfig } from 'framer-motion';
import { API } from '@/constants/api';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        store.dispatch(hydrateAuth());
        store.dispatch(hydrateCart());

        const verifyToken = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const res = await fetch(API.AUTH_ME, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!res.ok) {
                        store.dispatch(logout());
                    }
                } catch (err) {
                    console.error('Failed to verify token:', err);
                }
            }
        };
        verifyToken();
    }, []);

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <Provider store={store}>
                <MotionConfig reducedMotion="user">
                    {children}
                </MotionConfig>
            </Provider>
        </GoogleOAuthProvider>
    );
}
