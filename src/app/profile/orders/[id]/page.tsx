'use client';

/**
 * Order Detail Page — /profile/orders/[id]
 * Shows full order details for the authenticated customer.
 * Fetches GET /api/orders/:id (customer-scoped endpoint).
 */

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
import Invoice from '@/components/Invoice';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const orderId = params?.id as string;
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');
  
  // UI States
  const [showInvoice, setShowInvoice] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [snackbar, setSnackbar] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (!orderId) return;
    fetchOrder();
  }, [isAuthenticated, orderId]);

  useEffect(() => {
    if (order && (searchParams?.get('view') === 'invoice' || searchParams?.get('download') === 'true')) {
      setShowInvoice(true);
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [order, searchParams]);

  const handleDownload = () => {
    window.print();
  };

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

  const handleCancelClick = () => {
    if (order.status === 'Packed') {
        setSnackbar({ show: true, msg: `Cannot cancel, order is already ${order.status}` });
        setTimeout(() => setSnackbar({ show: false, msg: '' }), 4000);
        return;
    }
    setShowCancelConfirm(true);
  };

  const confirmCancel = async () => {
    setShowCancelConfirm(false);
    setCancelling(true);
    try {
      const res = await fetch(API.ORDER_CANCEL(orderId), {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setOrder((prev: any) => ({ ...prev, status: 'Cancelled' }));
        setSnackbar({ show: true, msg: 'Order cancelled successfully' });
      } else {
        const err = await res.json().catch(() => ({}));
        setSnackbar({ show: true, msg: err.detail || 'Could not cancel order.' });
      }
    } catch { 
        setSnackbar({ show: true, msg: 'Network error.' });
    } finally { 
        setCancelling(false);
        setTimeout(() => setSnackbar({ show: false, msg: '' }), 4000);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col items-center justify-center gap-4 px-4">
      <i className="fa-solid fa-circle-exclamation text-5xl text-gray-300" />
      <p className="text-gray-500 font-semibold">{error || 'Order not found.'}</p>
      <Link href="/profile?tab=orders" className="text-primary font-bold text-sm hover:underline">
        ← Back to My Orders
      </Link>
    </div>
  );

  // Derived values
  const isCancelled = order.status === 'Cancelled';
  const canCancel = CANCELLABLE_STATUSES.includes(order.status) || order.status === 'Packed'; // Check logic inside handleCancelClick
  const statusClass = ORDER_STATUS_CLASSES[order.status] || 'bg-gray-50 text-gray-600 border-gray-200';
  const paymentStatus = order.payment_status || (order.payment_mode === 'COD' ? 'COD' : 'Pending');
  const paymentStatusClass = PAYMENT_STATUS_CLASSES[paymentStatus] || PAYMENT_STATUS_CLASSES.Pending;
  const date = order.created_at
    ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="min-h-screen bg-[#f4f6f9] py-10 px-4">
      <div className="max-w-3xl mx-auto print:hidden">
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

          {/* Tracking Details */}
          {order.tracking_id && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Shipping Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Delivery Service</p>
                  <p className="text-sm font-semibold text-gray-800">{order.delivery_service_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Tracking ID</p>
                  <p className="text-sm font-semibold text-gray-800">{order.tracking_id}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Estimated Delivery</p>
                  <p className="text-sm font-semibold text-gray-800">{order.estimated_delivery_date || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Track Online</p>
                  <a href={order.tracking_link} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline">
                    Track Order &rarr;
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Shipping To */}
          {order.customer && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Shipping To</p>
              <p className="font-bold text-gray-800">{order.customer.name}</p>
              <p className="text-sm text-gray-500 mt-1">{order.customer.phone}</p>
              <p className="text-sm text-gray-500 mt-1">{order.customer.address}</p>
            </div>
          )}

          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-black">
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
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black text-gray-400 flex-shrink-0 bg-gray-50 border border-gray-100 overflow-hidden"
                    >
                      {item.product_image || item.image || item.product?.images?.[0] ? (
                        <img src={item.product_image || item.image || item.product?.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <i className="fa-solid fa-box text-gray-300 text-lg"></i>
                      )}
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
          <div className="flex flex-col sm:flex-row gap-3 pb-20">
            <Link
              href="/profile?tab=orders"
              className="flex-1 text-center border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:border-primary transition-colors text-sm"
            >
              ← My Orders
            </Link>
            
            <button 
              onClick={() => setShowInvoice(true)}
              className="flex-1 bg-white border-2 border-primary text-primary font-bold py-3 rounded-xl hover:bg-primary/5 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-file-invoice"></i> View & Download Bill
            </button>
            
            {canCancel && !isCancelled && order.status !== 'Delivered' && (
              <button
                onClick={handleCancelClick}
                disabled={cancelling}
                className="flex-[1.5] bg-red-50 border-2 border-red-200 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition-colors text-sm disabled:opacity-60"
              >
                {cancelling ? <i className="fa-solid fa-spinner fa-spin" /> : '✕ Cancel Order'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      <AnimatePresence>
        {showInvoice && (
            <div className="fixed inset-0 z-[100] flex items-center justify-start sm:justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto pt-10 pb-10 print:hidden">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-xl bg-white rounded-[24px] shadow-2xl overflow-hidden"
                >
                    <div className="max-h-[70vh] overflow-y-auto">
                        <Invoice order={order} />
                    </div>
                    
                    {/* Modal Footer with Buttons */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                        <button 
                            onClick={() => setShowInvoice(false)}
                            className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                        >
                            Close
                        </button>
                        <button 
                            onClick={handleDownload}
                            className="flex-[2] px-6 py-3 bg-black text-white font-black rounded-xl text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2"
                        >
                            <i className="fa-solid fa-download"></i> Download Bill (PDF)
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Portal for Printing — Mounts to body for perfect isolation */}
      {mounted && order && createPortal(
          <div id="print-portal" className="hidden print:block fixed inset-0 z-[9999] bg-white w-full h-full">
            <Invoice order={order} />
          </div>,
          document.body
      )}

      <style jsx global>{`
        @media print {
            /* Hide EVERYTHING in the body except the specific portal container */
            body > *:not(#print-portal) {
                display: none !important;
            }
            #print-portal {
                display: block !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                height: auto !important;
            }
        }
      `}</style>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelConfirm && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-[28px] p-8 max-w-sm w-full text-center shadow-2xl"
                >
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 text-2xl">
                        <i className="fa-solid fa-circle-question"></i>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Are you sure?</h3>
                    <p className="text-gray-500 text-sm mb-8">Do you really want to cancel this order? This action cannot be undone.</p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowCancelConfirm(false)}
                            className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-2xl hover:bg-gray-200 transition-all"
                        >
                            No, keep it
                        </button>
                        <button 
                            onClick={confirmCancel}
                            className="flex-1 bg-red-600 text-white font-bold py-3.5 rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                        >
                            Yes, cancel
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Snackbar / Toast */}
      <AnimatePresence>
        {snackbar.show && (
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[120] bg-black text-white px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 min-w-[300px]"
            >
                <i className={`fa-solid ${snackbar.msg.includes('Cannot') ? 'fa-circle-exclamation text-amber-400' : 'fa-circle-check text-green-400'}`}></i>
                <span className="text-sm font-bold">{snackbar.msg}</span>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
