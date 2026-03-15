'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store/store';
import { useEffect } from 'react';
import { hydrateAuth } from '@/lib/store/features/authSlice';
import { hydrateCart } from '@/lib/store/features/cartSlice';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        store.dispatch(hydrateAuth());
        store.dispatch(hydrateCart());
    }, []);

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <Provider store={store}>{children}</Provider>
        </GoogleOAuthProvider>
    );
}
