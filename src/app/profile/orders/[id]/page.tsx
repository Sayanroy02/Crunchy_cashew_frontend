'use client';

/**
 * Order Detail Page — /profile/orders/[id]
 * Shows full order details for the authenticated customer.
 * Fetches GET /api/orders/:id (customer-scoped endpoint).
 */

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { API } from '@/constants/api';
import {
  ORDER_STATUS_CLASSES,
  PAYMENT_STATUS_CLASSES,
  CANCELLABLE_STATUSES,
  COLORS,
} from '@/constants/styles';
import OrderTracking from '@/components/OrderTracking';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (!orderId) return;
    fetchOrder();
  }, [isAuthenticated, orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(API.ORDER_DETAIL(orderId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Order not found');
      setOrder(await res.json());
    } catch (e: any) {
      setError(e.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await fetch(API.ORDER_CANCEL(orderId), {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setOrder((prev: any) => ({ ...prev, status: 'Cancelled' }));
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.detail || 'Could not cancel order.');
      }
    } catch { alert('Network error.'); } finally { setCancelling(false); }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#0c5c2b] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col items-center justify-center gap-4 px-4">
      <i className="fa-solid fa-circle-exclamation text-5xl text-gray-300" />
      <p className="text-gray-500 font-semibold">{error || 'Order not found.'}</p>
      <Link href="/profile?tab=orders" className="text-[#0c5c2b] font-bold text-sm hover:underline">
        ← Back to My Orders
      </Link>
    </div>
  );

  // Derived values
  const isCancelled = order.status === 'Cancelled';
  const canCancel = CANCELLABLE_STATUSES.includes(order.status);
  const statusClass = ORDER_STATUS_CLASSES[order.status] || 'bg-gray-50 text-gray-600 border-gray-200';
  const paymentStatus = order.payment_status || (order.payment_mode === 'COD' ? 'COD' : 'Pending');
  const paymentStatusClass = PAYMENT_STATUS_CLASSES[paymentStatus] || PAYMENT_STATUS_CLASSES.Pending;
  const date = order.created_at
    ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="min-h-screen bg-[#f4f6f9] py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/profile?tab=orders"
            className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-chevron-left text-sm" />
          </Link>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Order Details</p>
            <h1 className="text-xl font-black text-gray-800">
              #{orderId.slice(-10).toUpperCase()}
            </h1>
          </div>
          <span className={`ml-auto text-xs font-bold px-3 py-1.5 rounded-full border ${statusClass}`}>
            {order.status || 'Pending'}
          </span>
        </div>

        <div className="flex flex-col gap-5">

          {/* Order Tracking Stepper */}
          <OrderTracking currentStatus={order.status} isCancelled={isCancelled} />

          {/* Order Meta */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Order Info</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Date</p>
                <p className="text-sm font-semibold text-gray-800">{date}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Payment</p>
                <p className="text-sm font-semibold text-gray-800">{order.payment_mode || 'COD'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Payment Status</p>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${paymentStatusClass}`}>
                  {paymentStatus}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Total</p>
                <p className="text-sm font-black" style={{ color: COLORS.primary }}>
                  ₹{order.total_amount?.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Razorpay IDs  */}
            {order.razorpay_payment_id && (
              <div className="mt-5 pt-5 border-t border-gray-50 space-y-1.5">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Payment Reference</p>
                <p className="text-xs font-mono text-gray-500">
                  <span className="font-bold text-gray-700">Payment ID:</span> {order.razorpay_payment_id}
                </p>
                {order.razorpay_order_id && (
                  <p className="text-xs font-mono text-gray-500">
                    <span className="font-bold text-gray-700">Razorpay Order:</span> {order.razorpay_order_id}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Shipping Details */}
          {order.customer && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Shipping To</p>
              <p className="font-bold text-gray-800">{order.customer.name}</p>
              <p className="text-sm text-gray-500 mt-1">{order.customer.phone}</p>
              <p className="text-sm text-gray-500 mt-1">{order.customer.address}</p>
            </div>
          )}

          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Items ({order.items?.length || 0})
            </p>
            <div className="flex flex-col gap-3">
              {(order.items || []).map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-800">{item.name || item.product_name || 'Item'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-black text-sm text-gray-800">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}

              {/* Total Row */}
              <div className="flex justify-between items-center pt-3 mt-1 border-t-2 border-gray-100">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-black text-lg" style={{ color: COLORS.primary }}>
                  ₹{order.total_amount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pb-8">
            <Link
              href="/profile?tab=orders"
              className="flex-1 text-center border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:border-[#0c5c2b] transition-colors text-sm"
            >
              ← My Orders
            </Link>
            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 bg-red-50 border-2 border-red-200 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition-colors text-sm disabled:opacity-60"
              >
                {cancelling ? <i className="fa-solid fa-spinner fa-spin" /> : '✕ Cancel Order'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
