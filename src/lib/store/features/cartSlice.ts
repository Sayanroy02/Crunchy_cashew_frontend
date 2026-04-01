import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
    product_id: string;
    variant_size: string;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
}

interface CartState {
    items: CartItem[];
    totalQuantity: number;
    totalAmount: number;
}

const initialState: CartState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const newItem = action.payload;
            const existingItem = state.items.find(
                item => item.product_id === newItem.product_id && item.variant_size === newItem.variant_size
            );

            if (!existingItem) {
                state.items.push(newItem);
                state.totalQuantity += newItem.quantity;
            } else {
                existingItem.quantity += newItem.quantity;
                state.totalQuantity += newItem.quantity;
            }

            state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);

            if (typeof window !== 'undefined') {
                localStorage.setItem('cart', JSON.stringify(state.items));
            }
        },
        removeFromCart: (state, action: PayloadAction<{ id: string, size: string }>) => {
            const { id, size } = action.payload;
            const existingItem = state.items.find(
                item => item.product_id === id && item.variant_size === size
            );
            if (existingItem) {
                state.items = state.items.filter(
                    item => !(item.product_id === id && item.variant_size === size)
                );
                state.totalQuantity -= existingItem.quantity;
                state.totalAmount -= existingItem.price * existingItem.quantity;
            }
            if (typeof window !== 'undefined') {
                localStorage.setItem('cart', JSON.stringify(state.items));
            }
        },
        updateQuantity: (state, action: PayloadAction<{ id: string, size: string, change: number }>) => {
            const { id, size, change } = action.payload;
            const existingItem = state.items.find(
                item => item.product_id === id && item.variant_size === size
            );
            if (existingItem) {
                existingItem.quantity += change;
                state.totalQuantity += change;

                if (existingItem.quantity <= 0) {
                    state.items = state.items.filter(
                        item => !(item.product_id === id && item.variant_size === size)
                    );
                    state.totalQuantity -= existingItem.quantity; // Adjust if it went negative
                }

                state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);

                if (typeof window !== 'undefined') {
                    localStorage.setItem('cart', JSON.stringify(state.items));
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('cart');
            }
        },
        hydrateCart: (state) => {
            if (typeof window !== 'undefined') {
                const localCart = localStorage.getItem('cart');
                if (localCart) {
                    const parsedCart: CartItem[] = JSON.parse(localCart);
                    state.items = parsedCart;
                    state.totalQuantity = parsedCart.reduce((sum, item) => sum + item.quantity, 0);
                    state.totalAmount = parsedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                }
            }
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, hydrateCart } = cartSlice.actions;
export default cartSlice.reducer;
