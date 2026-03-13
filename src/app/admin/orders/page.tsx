'use client';

import React, { useEffect, useState } from 'react';
import { API } from '@/constants/api';
import { ORDER_STATUS_CLASSES, PAYMENT_STATUS_CLASSES, ORDER_STATUS_FLOW, COLORS } from '@/constants/styles';

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('All');

    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        const token = getToken();
        try {
            const res = await fetch(API.ADMIN_ORDERS, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            } else {
                const err = await res.json().catch(() => ({}));
                setError(`Failed to load orders (${res.status}): ${err.detail || res.statusText}`);
            }
        } catch (e: any) {
            setError('Network error — is the backend running? ' + (e.message || ''));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    // Update order status via admin endpoint
    const updateStatus = async (orderId: string, status: string) => {
        setUpdating(orderId);
        const token = getToken();
        try {
            await fetch(`${API.ADMIN_ORDERS}/${orderId}/status?status=${encodeURIComponent(status)}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
        } catch (e) { console.error(e); } finally { setUpdating(null); }
    };

    // Admin manually confirms COD payment
    const confirmCODPayment = async (orderId: string) => {
        if (!confirm('Mark this COD order as Paid?')) return;
        setUpdating(orderId);
        const token = getToken();
        try {
            const res = await fetch(API.ORDER_PAYMENT_CONFIRM(orderId), {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(prev => prev.map(o =>
                    o._id === orderId
                        ? { ...o, payment_status: 'Paid', status: data.status || o.status }
                        : o
                ));
            } else {
                const err = await res.json().catch(() => ({}));
                alert(err.detail || 'Could not confirm payment');
            }
        } catch (e) { console.error(e); } finally { setUpdating(null); }
    };

    // Statuses that exist in DB but might not be in ORDER_STATUS_FLOW
    const ALL_DB_STATUSES = [...new Set(orders.map(o => o.status).filter(Boolean))];
    const ALL_FILTERS = ['All', ...ORDER_STATUS_FLOW, 'Pending', 'Cancelled'].filter(
        (v, i, arr) => arr.indexOf(v) === i
    );

    const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

    if (loading) return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="bg-white rounded-2xl h-44 animate-pulse border border-gray-100" />)}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-bold text-gray-800">
                    Orders <span className="text-sm font-normal text-gray-400 ml-1">({orders.length} total)</span>
                </h1>
                <button onClick={fetchOrders} className="text-sm font-semibold flex items-center gap-1.5 hover:underline" style={{ color: COLORS.primary }}>
                    <i className="fa-solid fa-rotate-right" /> Refresh
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                    <i className="fa-solid fa-circle-exclamation" />
                    {error}
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {ALL_FILTERS.map(f => {
                    const count = f === 'All' ? orders.length : orders.filter(o => o.status === f).length;
                    return (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${filter === f ? 'text-white border-transparent' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}
                            style={filter === f ? { backgroundColor: COLORS.primary } : {}}
                        >
                            {f} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
                        </button>
                    );
                })}
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <i className="fa-solid fa-box-open text-5xl text-gray-200 mb-4 block" />
                    <p className="text-gray-400 font-medium">No orders {filter !== 'All' ? `with status "${filter}"` : 'yet'}.</p>
                    {filter !== 'All' && orders.length > 0 && (
                        <p className="text-xs text-gray-300 mt-2">
                            DB statuses found: {ALL_DB_STATUSES.join(', ')}
                        </p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filtered.map(order => {
                        const isDelivered = order.status === 'Delivered';
                        const isCancelled = order.status === 'Cancelled';
                        const statusKey = `${order.status}_admin`;
                        const statusColor = ORDER_STATUS_CLASSES[statusKey] || ORDER_STATUS_CLASSES[order.status] || 'bg-gray-100 text-gray-600 border border-gray-200';
                        const customerName = order.customer?.name || order.customer?.full_name || 'Unknown Customer';
                        const customerEmail = order.customer?.email || '—';
                        const customerPhone = order.customer?.phone || '';
                        const paymentMode = order.payment_mode || 'COD';
                        const paymentLabel = paymentMode === 'COD' ? '💵 Cash on Delivery' : '💳 Online (Razorpay)';
                        const date = order.created_at
                            ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : '—';

                        const paymentStatus = order.payment_status || (paymentMode === 'COD' ? 'COD' : 'Pending');
                        const paymentStatusClass = PAYMENT_STATUS_CLASSES[paymentStatus] || PAYMENT_STATUS_CLASSES.Pending;

                        const showCODConfirm = paymentMode === 'COD' && paymentStatus !== 'Paid' && !isCancelled;

                        // Current status index in flow
                        const currentIdx = ORDER_STATUS_FLOW.indexOf(order.status as any);

                        return (
                            <div key={order._id} className={`bg-white rounded-2xl border shadow-sm transition-all hover:shadow-md ${isDelivered ? 'border-green-200' : 'border-gray-100'}`}>
                                {/* Card Header */}
                                <div className="flex items-start justify-between p-5 border-b border-gray-50">
                                    <div>
                                        <p className="font-bold text-gray-900 text-base">{customerName}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{customerEmail}{customerPhone ? ` · ${customerPhone}` : ''}</p>
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColor}`}>
                                        {isDelivered && <i className="fa-solid fa-circle-check mr-1" />}
                                        {order.status || 'Pending'}
                                    </span>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 space-y-4">
                                    <div className="grid grid-cols-4 gap-3">
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Date</p>
                                            <p className="text-sm font-semibold text-gray-700">{date}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Amount</p>
                                            <p className="text-sm font-bold" style={{ color: COLORS.primary }}>
                                                ₹{order.total_amount?.toLocaleString('en-IN') || '—'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Payment</p>
                                            <p className="text-xs font-semibold text-gray-700">{paymentLabel}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Pay Status</p>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${paymentStatusClass}`}>
                                                {paymentStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Items Breakdown */}
                                    {order.items?.length > 0 && (
                                        <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Order Items</p>
                                            {order.items.map((it: any, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-5 h-5 rounded font-bold flex items-center justify-center text-[9px]"
                                                            style={{ backgroundColor: COLORS.primary + '20', color: COLORS.primary }}>
                                                            {idx + 1}
                                                        </span>
                                                        <span className="font-semibold text-gray-700">{it.name || it.product_name || 'Item'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-gray-500">
                                                        <span>₹{it.price} × {it.quantity}</span>
                                                        <span className="font-bold text-gray-800">₹{(it.price * it.quantity).toLocaleString('en-IN')}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Status Stepper */}
                                    {!isCancelled && (
                                        <div className="flex items-center gap-0 overflow-x-auto">
                                            {ORDER_STATUS_FLOW.map((s, idx) => {
                                                const done = idx <= currentIdx;
                                                const isLast = idx === ORDER_STATUS_FLOW.length - 1;
                                                return (
                                                    <React.Fragment key={s}>
                                                        <div className="flex flex-col items-center flex-shrink-0">
                                                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all"
                                                                style={{
                                                                    backgroundColor: done ? COLORS.primary : '#f3f4f6',
                                                                    color: done ? '#fff' : '#9ca3af'
                                                                }}>
                                                                {done ? <i className="fa-solid fa-check" /> : idx + 1}
                                                            </div>
                                                            <p className="text-[9px] mt-0.5 font-medium"
                                                                style={{ color: done ? COLORS.primary : '#d1d5db' }}>
                                                                {s}
                                                            </p>
                                                        </div>
                                                        {!isLast && (
                                                            <div className="flex-1 h-0.5 mx-1 mb-3 rounded-full"
                                                                style={{ backgroundColor: idx < currentIdx ? COLORS.primary : '#f3f4f6' }} />
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Shipping Address */}
                                    {order.customer?.address && (
                                        <div className="text-xs text-gray-400 flex items-start gap-1.5">
                                            <i className="fa-solid fa-location-dot mt-0.5 flex-shrink-0" style={{ color: COLORS.primary }} />
                                            <span>{order.customer.address}</span>
                                        </div>
                                    )}

                                    {/* COD Payment Confirm */}
                                    {showCODConfirm && (
                                        <button
                                            onClick={() => confirmCODPayment(order._id)}
                                            disabled={updating === order._id}
                                            className="w-full text-xs font-bold py-2 rounded-xl border-2 border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                                        >
                                            {updating === order._id
                                                ? <i className="fa-solid fa-spinner animate-spin" />
                                                : <i className="fa-solid fa-hand-holding-dollar" />
                                            }
                                            Confirm COD Payment Received
                                        </button>
                                    )}

                                    {/* Status Update */}
                                    {!isDelivered && !isCancelled && (
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">Update Status:</label>
                                            <select
                                                value={order.status || 'Pending'}
                                                onChange={e => updateStatus(order._id, e.target.value)}
                                                disabled={updating === order._id}
                                                className="flex-1 text-sm border-2 border-gray-200 rounded-xl px-3 py-2 outline-none transition-colors"
                                                style={{ borderColor: updating === order._id ? undefined : undefined }}
                                            >
                                                {['Pending', ...ORDER_STATUS_FLOW, 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            {updating === order._id && <i className="fa-solid fa-spinner animate-spin" style={{ color: COLORS.primary }} />}
                                        </div>
                                    )}

                                    {isDelivered && (
                                        <div className="bg-green-50 rounded-xl px-4 py-2.5 flex items-center gap-2">
                                            <i className="fa-solid fa-circle-check text-green-500" />
                                            <span className="text-xs font-bold text-green-700">Order Delivered Successfully</span>
                                            {order.delivered_at && (
                                                <span className="text-xs text-green-500 ml-auto">
                                                    {new Date(order.delivered_at).toLocaleDateString('en-IN')}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {isCancelled && (
                                        <div className="bg-red-50 rounded-xl px-4 py-2.5 flex items-center gap-2">
                                            <i className="fa-solid fa-circle-xmark text-red-400" />
                                            <span className="text-xs font-bold text-red-600">Order Cancelled</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
