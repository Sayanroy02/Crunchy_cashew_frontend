'use client';

/**
 * CheckoutButton — handles the full payment flow.
 *
 * For COD:
 *   1. POST /api/orders → success → onSuccess(orderId)
 *
 * For Razorpay (ONLINE):
 *   1. POST /api/orders → get { order_id, razorpay_order_id }
 *   2. Dynamically load Razorpay script
 *   3. Open Razorpay popup
 *   4. On payment success → POST /api/orders/verify
 *   5. On verify success → onSuccess(orderId)
 *   6. On failure → onError(message)
 *
 * Security: payment is NEVER trusted from the frontend alone.
 * The signature is always verified on the backend via HMAC-SHA256.
 */

import React, { useState } from 'react';
import { API } from '@/constants/api';
import { COLORS } from '@/constants/styles';
import { useSnackbar } from '@/context/SnackbarContext';


interface OrderPayload {
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: { product_id: string; name: string; quantity: number; price: number }[];
  total_amount: number;
  payment_mode: 'COD' | 'Razorpay';
  status: string;
}

interface CheckoutButtonProps {
  orderPayload: OrderPayload;
  token: string;
  disabled?: boolean;
  onSuccess: (orderId: string) => void;
  onError: (message: string) => void;
}

// Helper: dynamically load Razorpay checkout script (idempotent)
async function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true); // already loaded

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

export default function CheckoutButton({
  orderPayload,
  token,
  disabled,
  onSuccess,
  onError,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // ── Step 1: Create the order in our backend ──────────────────────────
      const createRes = await fetch(API.ORDERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to create order');
      }

      const orderData = await createRes.json();
      const orderId: string = orderData.order_id;

      // ── COD: done — no payment gateway needed ────────────────────────────
      if (orderPayload.payment_mode === 'COD') {
        showSnackbar('Order placed successfully!', 'success');
        onSuccess(orderId);
        return;
      }

      // ── ONLINE: Open Razorpay popup ─────────────────────────────────────
      const razorpayOrderId: string = orderData.razorpay_order_id;
      if (!razorpayOrderId) throw new Error('Failed to get Razorpay order ID from server');

      // Load Razorpay SDK dynamically
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Razorpay SDK failed to load. Check your network connection.');

      // Razorpay key must be the PUBLIC key_id (not secret)
      const rzpKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      
      if (!rzpKeyId) {
          throw new Error('Razorpay publicly accessible key not found in environment variables.');
      }

      const options = {
        key: rzpKeyId,
        amount: Math.round(orderPayload.total_amount * 100), // in paise
        currency: 'INR',
        name: 'Crunchy Cashews',
        description: `Order #${orderId.slice(-8).toUpperCase()}`,
        order_id: razorpayOrderId,
        prefill: {
          name: orderPayload.customer.name,
          contact: orderPayload.customer.phone,
        },
        theme: {
          color: COLORS.primary,
        },

        // ── On successful payment ──────────────────────────────────────────
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // CRITICAL: always verify signature on the backend — never trust frontend success alone
            const verifyRes = await fetch(API.ORDER_VERIFY, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                order_id: orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              const errData = await verifyRes.json().catch(() => ({}));
              throw new Error(errData.detail || 'Payment verification failed');
            }

            showSnackbar('Payment verified!', 'success');
            onSuccess(orderId);
          } catch (verifyErr: any) {
            onError(verifyErr.message || 'Payment verification failed');
          } finally {
            setLoading(false);
          }
        },

        modal: {
          // Called when user closes the popup without paying
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);

      // Handle payment failure inside checkout popup
      razorpay.on('payment.failed', (response: any) => {
        setLoading(false);
        onError(response.error?.description || 'Payment failed. Please try again.');
      });

      razorpay.open();
      // Note: setLoading(false) is handled inside handler / ondismiss / payment.failed
    } catch (err: any) {
      setLoading(false);
      onError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={disabled || loading}
      className="w-full bg-yellow text-primary font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow hover:shadow-[0_0_15px_rgba(246,215,15,0.4)] transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <i className="fa-solid fa-spinner fa-spin" />
          Processing...
        </>
      ) : (
        <>
          <i className="fa-solid fa-lock" />
          Place Order
        </>
      )}
    </button>
  );
}
