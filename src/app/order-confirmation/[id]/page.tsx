'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { API } from '@/constants/api';

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
    <div className="min-h-screen bg-[#f0f4f4] py-16 px-4 print:py-0 print:bg-white">
      {/* CSS specific for printing out the bill */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .print-border-none { border: none !important; box-shadow: none !important; }
        }
      `}} />

      <div className="print:hidden max-w-3xl mx-auto flex flex-col gap-6">
        
        {/* Success Header Banner */}
        <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-[#99EA78]/20 text-[#0A5246] flex border border-[#99EA78]/30 flex-col items-center justify-center text-4xl mb-6 shadow-sm relative">
            <span className="absolute inset-0 rounded-full border border-[#99EA78] animate-ping opacity-20"></span>
            <i className="fa-solid fa-check"></i>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[#0A5246] tracking-tight mb-3">
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
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                  paymentStatus === 'Paid' || paymentStatus === 'COD' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
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
                  <div className="w-10 h-10 rounded-xl bg-[#f0f4f4] text-[#0A5246] flex flex-shrink-0 items-center justify-center font-black text-sm">
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
              <span className="font-black text-2xl text-[#0A5246]">
                ₹{order.total_amount?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button 
            onClick={handlePrint}
            className="flex-1 bg-white border-2 border-[#0A5246] text-[#0A5246] font-black py-4 rounded-xl hover:bg-[#0A5246]/5 hover:scale-[1.02] transition-all transform active:scale-95 flex items-center justify-center gap-3 shadow-sm"
          >
            <i className="fa-solid fa-file-pdf"></i> Download Bill (PDF)
          </button>
          
          <Link 
            href="/shop" 
            className="flex-1 bg-[#0A5246] text-white font-black py-4 rounded-xl hover:bg-[#084239] hover:shadow-lg hover:-translate-y-1 transition-all transform active:scale-95 flex items-center justify-center gap-3 shadow-md shadow-[#0A5246]/20"
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

      {/* ========================================================= */}
      {/* PRINT ONLY: Formal Tabular Invoice Layout                   */}
      {/* ========================================================= */}
      <div className="hidden print:block w-full max-w-4xl mx-auto bg-white text-black font-sans pb-10">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b-2 border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-[#0A5246] text-white rounded-lg flex items-center justify-center text-3xl font-black shadow-md">
              <i className="fa-solid fa-seedling"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#0A5246]">Crunchy Cashews</h1>
              <p className="text-xs text-slate-500 font-semibold mt-1">Direct from factory</p>
            </div>
          </div>
          <div className="bg-[#3A4D6E] text-white px-8 py-2 text-2xl font-black uppercase tracking-widest tracking-widest shadow-sm border border-slate-800">
            INVOICE
          </div>
        </div>

        <div className="flex justify-between items-start mb-10">
          <div className="text-sm space-y-2 text-slate-700 font-medium">
            <p><span className="font-bold w-32 inline-block">Invoice Number:</span> #{orderId.slice(-8).toUpperCase()}</p>
            <p><span className="font-bold w-32 inline-block">Order Date:</span> {date}</p>
            <p className="flex items-center">
              <span className="font-bold w-32 inline-block">Order Status:</span> 
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                {order.status || 'Processed'}
              </span>
            </p>
          </div>
        </div>

        {/* Billing Info */}
        <div className="flex justify-between gap-10 mb-10 text-sm">
          <div className="flex-1 space-y-1.5">
            <h2 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">Bill From:</h2>
            <p className="font-bold text-slate-700">Crunchy Cashews Mfg.</p>
            <p className="text-slate-600">123 Industrial Area, Phase 1</p>
            <p className="text-slate-600">Siliguri, West Bengal, 734001</p>
            <p className="text-slate-600 pt-1"><span className="font-semibold text-slate-700">GSTIN:</span> 19ABCDE1234F1Z5</p>
            <p className="text-slate-600"><span className="font-semibold text-slate-700">FSSAI Number:</span> 12345678901234</p>
          </div>
          
          <div className="flex-1 space-y-1.5">
            <h2 className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">Bill To:</h2>
            <p className="font-bold text-slate-700">{order.customer?.name}</p>
            <p className="text-slate-600 max-w-[250px] leading-relaxed">{order.customer?.address}</p>
            <p className="text-slate-600 pt-1"><span className="font-semibold text-slate-700">Phone Number:</span> {order.customer?.phone}</p>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-sm text-left mb-8 border-collapse">
          <thead>
            <tr className="border-t-2 border-b-2 border-slate-300 bg-slate-50/50">
              <th className="py-3 px-2 font-bold text-slate-800 w-1/2">Item</th>
              <th className="py-3 px-2 font-bold text-slate-800 text-center">Quantity</th>
              <th className="py-3 px-2 font-bold text-slate-800 text-center">Rate</th>
              <th className="py-3 px-2 font-bold text-slate-800 text-center">Tax</th>
              <th className="py-3 px-2 font-bold text-slate-800 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item: any, idx: number) => (
              <tr key={idx} className="border-b border-slate-200">
                <td className="py-4 px-2 text-slate-800 font-semibold">{item.name || item.product_name || 'Item'}</td>
                <td className="py-4 px-2 text-slate-700 text-center text-xs">
                  <span className="font-bold text-[#f08519] block text-sm">{item.quantity}</span>
                  unit
                </td>
                <td className="py-4 px-2 text-slate-700 text-center text-xs">
                  <span className="font-bold text-[#204060] block text-sm">₹{item.price}</span>
                  per unit
                </td>
                <td className="py-4 px-2 text-slate-700 text-center">0.00</td>
                <td className="py-4 px-2 text-slate-800 font-bold text-right">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals & Footer Info */}
        <div className="flex justify-between items-start mt-8">
          <div className="w-1/2 text-xs text-slate-500 pt-2 space-y-1">
            <p className="font-bold text-slate-700 mb-2">Terms & Conditions:</p>
            <p>1. Returns accepted within 7 days of delivery.</p>
            <p>2. Subject to Siliguri jurisdiction.</p>
            <p>3. This is a computer-generated invoice.</p>
          </div>
          
          <div className="w-[350px]">
            <div className="space-y-3 text-sm border-b border-slate-200 pb-4 pr-2">
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Subtotal:</span>
                <span className="font-bold text-slate-800">₹{((order.total_amount || 0) - (order.shipping_fee || 0)).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Discount:</span>
                <span className="font-bold text-slate-800">₹0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Shipping:</span>
                <span className="font-bold text-slate-800">{order.shipping_fee === 0 ? '₹0.00' : `₹${order.shipping_fee}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-700">Tax:</span>
                <span className="font-bold text-slate-800">₹0.00</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold text-slate-700 flex items-center gap-2">
                  Paid: <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-widest">{paymentStatus}</span>
                </span>
                <span className="font-bold text-slate-800">
                  {paymentStatus === 'Paid' ? `₹${order.total_amount?.toLocaleString('en-IN')}` : '₹0.00'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center bg-[#3A4D6E] text-white px-6 py-4 mt-6 rounded shadow-sm border border-[#27354d]">
              <span className="font-bold text-lg">Total</span>
              <span className="font-black text-xl">₹{order.total_amount?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
