'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { API } from '@/constants/api';
import Invoice from '@/components/Invoice';
import { COLORS } from '@/constants/styles';

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handlePrint = () => {
    window.print();
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col items-center justify-center pt-20 pb-10">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-gray-500 font-bold animate-pulse">Confirming your order...</p>
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col items-center justify-center gap-4 px-4 pt-20 pb-10">
      <i className="fa-solid fa-circle-exclamation text-5xl text-gray-300" />
      <p className="text-gray-500 font-semibold">{error || 'Order not found.'}</p>
      <Link href="/profile?tab=orders" className="text-primary font-bold text-sm hover:underline">
        ← Back to My Orders
      </Link>
    </div>
  );

  const paymentStatus = order.payment_status || (order.payment_mode === 'COD' ? 'COD' : 'Pending');
  const date = order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

  return (
    <>
      <div className={`min-h-screen py-16 px-4 print:py-0 print:bg-white text-black ${COLORS.bg}`}>
        {/* CSS specific for printing out the bill */}
        <style dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .print-border-none { border: none !important; box-shadow: none !important; }
        }
      `}} />

        <div className="print:hidden max-w-3xl mx-auto flex flex-col gap-6">

          {/* Success Header Banner */}
          <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center text-4xl mb-6 shadow-sm relative" style={{ backgroundColor: '#F6B000', color: '#000000' }}>
              <span className="absolute inset-0 rounded-full border border-[#F6B000] animate-ping opacity-20"></span>
              <i className="fa-solid fa-check"></i>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-black tracking-tight mb-3">
              Order Confirmed!
            </h1>
            <p className="text-gray-500 font-semibold max-w-lg mx-auto">
              Thank you for shopping with Crunchy Cashews. Your order has been placed successfully and is now being processed.
            </p>

            <div className="mt-8 flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-gray-50 border border-gray-100 mb-6">
              <span className="text-sm font-bold text-gray-400">ORDER ID:</span>
              <span className="text-sm font-black text-gray-800 uppercase tracking-widest">{orderId.slice(-10)}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Order Details */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Payment & Details</p>
              <div className="space-y-5">
                <div className="flex justify-between">
                  <span className="text-sm font-bold text-gray-500">Date</span>
                  <span className="text-sm font-black text-gray-800">{date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-bold text-gray-500">Payment Method</span>
                  <span className="text-sm font-black text-gray-800">{order.payment_mode || 'COD'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-5">
                  <span className="text-sm font-bold text-gray-500">Payment Status</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${paymentStatus === 'Paid' || paymentStatus === 'COD'
                      ? 'bg-black text-white'
                      : 'bg-[#F6B000] text-black'
                    }`}>
                    {paymentStatus}
                  </span>
                </div>

                {order.razorpay_payment_id && (
                  <div className="pt-2 space-y-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Ref</span>
                      <span className="text-xs font-mono font-bold text-gray-800 mt-0.5">{order.razorpay_payment_id}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Details */}
            {order.customer && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Billed & Shipped To</p>
                <div className="space-y-2">
                  <p className="font-black text-lg text-gray-800">{order.customer.name}</p>
                  <p className="text-sm font-semibold text-gray-500">{order.customer.phone}</p>
                  <p className="text-sm font-semibold text-gray-500 leading-relaxed mt-2">{order.customer.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Itemized Receipt */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
              Items Ordered ({order.items?.length || 0})
            </p>

            <div className="flex flex-col gap-4">
              {(order.items || []).map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-bg text-black flex flex-shrink-0 items-center justify-center font-black text-sm border border-gray-100">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-black text-sm text-gray-800">{item.name || item.product_name || 'Item'}</p>
                      <p className="text-xs font-bold text-gray-400 mt-0.5">
                        <span className="text-gray-600">₹{item.price}</span> × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="font-black text-sm text-gray-800 text-right">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Calculation */}
            <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-100">
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="font-bold text-gray-500">Subtotal</span>
                <span className="font-bold text-gray-800">
                  ₹{((order.total_amount || 0) - (order.shipping_fee || 0)).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4 text-sm">
                <span className="font-bold text-gray-500">Shipping Fee</span>
                <span className="font-bold text-gray-800">
                  {order.shipping_fee === 0 ? 'FREE' : `₹${order.shipping_fee}`}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="font-black text-gray-800 uppercase tracking-widest text-sm">Grand Total</span>
                <span className="font-black text-2xl" style={{ color: '#F6B000' }}>
                  ₹{order.total_amount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handlePrint}
              className="flex-1 bg-white border-2 border-black text-black font-black py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-3 shadow-sm hover:bg-gray-50"
            >
              <i className="fa-solid fa-file-pdf"></i> Download Bill (PDF)
            </button>

            <Link
              href="/shop"
              className="flex-1 font-black py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg"
              style={{ backgroundColor: '#000000', color: '#F6B000' }}
            >
              Continue Shopping <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          <div className="text-center mt-3">
            <Link href="/profile?tab=orders" className="text-xs font-bold text-gray-400 hover:text-gray-600 underline underline-offset-4">
              View all my orders
            </Link>
          </div>
        </div>
      </div>

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
    </>
  );
}
