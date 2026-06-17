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

  const createdOrderIdRef = React.useRef<string | null>(null);
  const paymentSuccessRef = React.useRef<boolean>(false);
  const hasAutoTriggered = React.useRef<boolean>(false);

  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  React.useEffect(() => {
    if (loading) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleManualCancel(); // Auto cancel on timeout
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setTimeLeft(300);
    }
  }, [loading]);

  const handleManualCancel = async () => {
    setLoading(false);
    if (createdOrderIdRef.current && !paymentSuccessRef.current) {
      try {
        await fetch(API.ORDER_CANCEL(createdOrderIdRef.current), {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) { console.error(e); }
    }
    onError('Payment cancelled');
  };

  React.useEffect(() => {
    const handlePopState = () => {
      if (createdOrderIdRef.current && !paymentSuccessRef.current) {
        fetch(API.ORDER_CANCEL(createdOrderIdRef.current), {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          keepalive: true
        }).catch(() => {});
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (createdOrderIdRef.current && !paymentSuccessRef.current) {
        fetch(API.ORDER_CANCEL(createdOrderIdRef.current), {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          keepalive: true
        }).catch(() => {});
      }
    };
  }, [token]);

  React.useEffect(() => {
    if (!hasAutoTriggered.current && !disabled) {
      hasAutoTriggered.current = true;
      handleCheckout();
    }
  }, [disabled]);

  const handleCheckout = async () => {
    setLoading(true);
    paymentSuccessRef.current = false;
    createdOrderIdRef.current = null;

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
      createdOrderIdRef.current = orderId;

      // ── COD: done — no payment gateway needed ────────────────────────────
      if (orderPayload.payment_mode === 'COD') {
        paymentSuccessRef.current = true;
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
          color: COLORS.heading,
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

            paymentSuccessRef.current = true;
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
          ondismiss: async () => {
            setLoading(false);
            try {
              await fetch(API.ORDER_CANCEL(orderId), {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
              });
            } catch (e) { console.error('Failed to cancel order on dismiss', e); }
            alert('payment failed Order canceled');
            onError('payment failed Order canceled');
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);

      // Handle payment failure inside checkout popup
      razorpay.on('payment.failed', async (response: any) => {
        setLoading(false);
        try {
          await fetch(API.ORDER_CANCEL(orderId), {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (e) { console.error('Failed to cancel order on payment failure', e); }
        alert('payment failed Order canceled');
        onError('payment failed Order canceled');
      });

      razorpay.open();
      // Note: setLoading(false) is handled inside handler / ondismiss / payment.failed
    } catch (err: any) {
      setLoading(false);
      onError(err.message || 'Something went wrong. Please try again.');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={disabled || loading}
        className="w-full text-black p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        style={{ backgroundColor: COLORS.primary, color: '#000000' }}
      >
        {loading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin text-sm md:text-xs" />
            <span>Processing... ({formatTime(timeLeft)})</span>
          </>
        ) : (
          <>
            <i className="fa-solid fa-lock text-sm md:text-xs" />
            <span>Place Order</span>
          </>
        )}
      </button>

      {loading && (
        <button
          type="button"
          onClick={handleManualCancel}
          className="w-full bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs font-bold transition-all hover:bg-red-100 flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-xmark"></i> Cancel Payment
        </button>
      )}
    </div>
  );
}
