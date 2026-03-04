'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';

const STATUS_FLOW = ['Pending', 'Accepted', 'Dispatched', 'Shipped', 'Delivered'];

const STATUS_COLORS: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    Accepted: 'bg-blue-100 text-blue-700 border border-blue-300',
    Dispatched: 'bg-purple-100 text-purple-700 border border-purple-300',
    Shipped: 'bg-indigo-100 text-indigo-700 border border-indigo-300',
    Delivered: 'bg-green-100 text-green-700 border border-green-300',
    Cancelled: 'bg-red-100 text-red-700 border border-red-300',
};

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
}

export default function AdminOrders() {
    const { token: reduxToken } = useSelector((state: RootState) => state.auth);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('All');

    const fetchOrders = async () => {
        const token = reduxToken || getToken();
        try {
            const res = await fetch('http://localhost:8000/api/admin/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setOrders(await res.json());
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchOrders(); }, []);

    const updateStatus = async (orderId: string, status: string) => {
        setUpdating(orderId);
        const token = reduxToken || getToken();
        try {
            await fetch(`http://localhost:8000/api/admin/orders/${orderId}/status?status=${encodeURIComponent(status)}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
        } catch (e) { console.error(e); } finally { setUpdating(null); }
    };

    const ALL_FILTERS = ['All', ...STATUS_FLOW, 'Cancelled'];
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
                <button onClick={fetchOrders} className="text-sm text-[#0c5c2b] font-semibold flex items-center gap-1.5 hover:underline">
                    <i className="fa-solid fa-rotate-right" /> Refresh
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {ALL_FILTERS.map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${filter === f ? 'bg-[#0c5c2b] text-white border-[#0c5c2b]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#0c5c2b]'}`}
                    >
                        {f} {f !== 'All' && orders.filter(o => o.status === f).length > 0 && (
                            <span className="ml-1 bg-white/30 rounded-full px-1.5">{orders.filter(o => o.status === f).length}</span>
                        )}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <i className="fa-solid fa-box-open text-5xl text-gray-200 mb-4 block" />
                    <p className="text-gray-400 font-medium">No orders {filter !== 'All' ? `with status "${filter}"` : 'yet'}.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filtered.map(order => {
                        const isDelivered = order.status === 'Delivered';
                        const isCancelled = order.status === 'Cancelled';
                        const statusColor = STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600 border border-gray-200';
                        const customerName = order.customer?.name || order.customer?.full_name || 'Unknown Customer';
                        const customerEmail = order.customer?.email || '—';
                        const paymentMode = order.payment_mode || 'COD';
                        const paymentLabel = paymentMode === 'COD' ? '💵 Cash on Delivery' : '💳 Online';
                        const date = order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

                        return (
                            <div key={order._id} className={`bg-white rounded-2xl border shadow-sm transition-all ${isDelivered ? 'border-green-200' : 'border-gray-100 hover:shadow-md'}`}>
                                {/* Card Header */}
                                <div className="flex items-start justify-between p-5 border-b border-gray-50">
                                    <div>
                                        <p className="font-bold text-gray-900 text-base">{customerName}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{customerEmail}</p>
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor}`}>
                                        {isDelivered && <i className="fa-solid fa-circle-check mr-1" />}
                                        {order.status || 'Pending'}
                                    </span>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 space-y-4">
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Date</p>
                                            <p className="text-sm font-semibold text-gray-700">{date}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Amount</p>
                                            <p className="text-sm font-bold text-[#0c5c2b]">₹{order.total_amount?.toLocaleString('en-IN') || '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Payment</p>
                                            <p className="text-xs font-semibold text-gray-700">{paymentLabel}</p>
                                        </div>
                                    </div>

                                    {/* Items Breakdown */}
                                    {order.items?.length > 0 && (
                                        <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Order Items</p>
                                            {order.items.map((it: any, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-5 h-5 bg-[#0c5c2b]/10 text-[#0c5c2b] rounded font-bold flex items-center justify-center">{idx + 1}</span>
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

                                    {/* Status Stepper (if not cancelled) */}
                                    {!isCancelled && (
                                        <div className="flex items-center gap-0 overflow-x-auto">
                                            {STATUS_FLOW.map((s, idx) => {
                                                const currentIdx = STATUS_FLOW.indexOf(order.status ?? 'Pending');
                                                const done = idx <= currentIdx;
                                                const isLast = idx === STATUS_FLOW.length - 1;
                                                return (
                                                    <React.Fragment key={s}>
                                                        <div className="flex flex-col items-center flex-shrink-0">
                                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${done ? 'bg-[#0c5c2b] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                                {done ? <i className="fa-solid fa-check" /> : idx + 1}
                                                            </div>
                                                            <p className={`text-[9px] mt-0.5 font-medium ${done ? 'text-[#0c5c2b]' : 'text-gray-300'}`}>{s}</p>
                                                        </div>
                                                        {!isLast && <div className={`flex-1 h-0.5 mx-1 mb-3 rounded-full ${idx < currentIdx ? 'bg-[#0c5c2b]' : 'bg-gray-100'}`} />}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Status Update */}
                                    {!isDelivered && !isCancelled && (
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={order.status || 'Pending'}
                                                onChange={e => updateStatus(order._id, e.target.value)}
                                                disabled={updating === order._id}
                                                className="flex-1 text-sm border-2 border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#0c5c2b] transition-colors"
                                            >
                                                {STATUS_FLOW.map(s => <option key={s} value={s}>{s}</option>)}
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                            {updating === order._id && <i className="fa-solid fa-spinner animate-spin text-[#0c5c2b]" />}
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
