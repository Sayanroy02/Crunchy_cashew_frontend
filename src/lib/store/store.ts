import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/lib/store/features/authSlice';
import cartReducer from '@/lib/store/features/cartSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
