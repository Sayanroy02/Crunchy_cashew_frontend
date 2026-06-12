'use client';

import React, { useEffect, useState } from 'react';
import { API } from '@/constants/api';
import { ORDER_STATUS_CLASSES, PAYMENT_STATUS_CLASSES, ORDER_STATUS_FLOW, COLORS } from '@/constants/styles';

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
}

const VIBRANT_STATUS_MAP: Record<string, { bg: string, text: string, border: string, dot: string }> = {
    'Order placed': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-500' },
    'Accepted': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    'Packed': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
    'Shipped': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
    'Delivered': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    'Cancelled': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
    'Pending': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
};

// --- Modal Component ---
function StatusConfirmModal({ isOpen, onConfirm, onCancel, status, loading }: any) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl scale-in-center overflow-hidden border-2" style={{ borderColor: COLORS.primary }}>
                <div className="text-center">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fa-solid fa-circle-question text-4xl" style={{ color: COLORS.primary }}></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Update Status?</h3>
                    <p className="text-gray-500 mb-8">Are you sure you want to change this order status to <span className="font-bold text-gray-900">"{status}"</span>?</p>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 py-3.5 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            No, Cancel
                        </button>
                        <button 
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 py-3.5 rounded-2xl font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            style={{ backgroundColor: COLORS.primary }}
                        >
                            {loading && <i className="fa-solid fa-spinner animate-spin"></i>}
                            Yes, Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ShippingDetailsModal({ isOpen, onConfirm, onCancel, loading }: any) {
    const [trackingId, setTrackingId] = useState('');
    const [trackingLink, setTrackingLink] = useState('');
    const [estimatedDelivery, setEstimatedDelivery] = useState('');
    const [deliveryService, setDeliveryService] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm({
            tracking_id: trackingId,
            tracking_link: trackingLink,
            estimated_delivery_date: estimatedDelivery,
            delivery_service_name: deliveryService
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl scale-in-center overflow-hidden border-2" style={{ borderColor: COLORS.primary }}>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Shipping Details</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Delivery Service Name</label>
                        <input required type="text" value={deliveryService} onChange={e => setDeliveryService(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. BlueDart, Delhivery" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Tracking ID</label>
                        <input required type="text" value={trackingId} onChange={e => setTrackingId(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. 1234567890" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Tracking Link</label>
                        <input required type="url" value={trackingLink} onChange={e => setTrackingLink(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="https://..." />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Estimated Delivery Date</label>
                        <input required type="text" value={estimatedDelivery} onChange={e => setEstimatedDelivery(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. 15 June 2026" />
                    </div>
                    
                    <div className="flex gap-3 mt-8">
                        <button type="button" onClick={onCancel} disabled={loading} className="flex-1 py-3.5 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 py-3.5 rounded-2xl font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2" style={{ backgroundColor: COLORS.primary }}>
                            {loading && <i className="fa-solid fa-spinner animate-spin"></i>}
                            Save & Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('All');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [confirmUpdate, setConfirmUpdate] = useState<{ id: string, status: string } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

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
                const ordersList = Array.isArray(data) ? data : [];
                setOrders(ordersList);
                if (ordersList.length > 0 && !selectedOrderId) {
                    setSelectedOrderId(ordersList[0]._id);
                }
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

    const updateStatus = async (orderId: string, status: string, trackingData: any = null) => {
        setUpdating(orderId);
        const token = getToken();
        try {
            const fetchOptions: any = {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            };

            if (trackingData) {
                fetchOptions.headers['Content-Type'] = 'application/json';
                fetchOptions.body = JSON.stringify(trackingData);
            }

            const res = await fetch(`${API.ADMIN_ORDERS}/${orderId}/status?status=${encodeURIComponent(status)}`, fetchOptions);
            if (res.ok) {
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status, ...trackingData } : o));
                setConfirmUpdate(null);
            } else {
                const err = await res.json().catch(() => ({}));
                alert(err.detail || 'Failed to update status');
            }
        } catch (e) {
            console.error(e);
            alert('An error occurred while updating status');
        } finally {
            setUpdating(null);
        }
    };

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
            }
        } catch (e) { console.error(e); } finally { setUpdating(null); }
    };

    const ALL_FILTERS = ['All', ...ORDER_STATUS_FLOW, 'Pending', 'Cancelled'].filter(
        (v, i, arr) => arr.indexOf(v) === i
    );

    const filtered = orders.filter(o => {
        // Status Filter
        if (filter !== 'All' && o.status !== filter) return false;
        
        // Search Filter
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        
        const orderId = (o._id || '').toLowerCase();
        const shortId = (o._id || '').slice(-6).toLowerCase();
        const customerName = (o.customer?.name || o.customer?.full_name || '').toLowerCase();
        const phone = (o.customer?.phone || '').toLowerCase();
        const paymentMode = (o.payment_mode || '').toLowerCase();
        const amount = (o.total_amount || 0).toString();
        const date = o.created_at ? new Date(o.created_at).toLocaleDateString('en-GB') : '';

        return orderId.includes(q) || 
               shortId.includes(q) || 
               customerName.includes(q) || 
               phone.includes(q) || 
               paymentMode.includes(q) || 
               amount.includes(q) ||
               date.includes(q);
    });

    const selectedOrder = orders.find(o => o._id === selectedOrderId);

    if (loading && orders.length === 0) return (
        <div className="flex flex-col gap-4 animate-pulse h-full">
            <div className="h-8 bg-gray-200 rounded-lg w-40"></div>
            <div className="flex gap-4 flex-1">
                <div className="flex-1 bg-white rounded-lg border"></div>
                <div className="w-80 bg-white rounded-lg border hidden lg:block"></div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-4 h-full min-h-[calc(100vh-120px)] overflow-hidden">
            {/* Compact Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                        Orders <span className="text-xs font-semibold text-gray-400 ml-1">({orders.length})</span>
                    </h1>
                    {/* Search Bar */}
                    <div className="relative group min-w-[280px]">
                        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs transition-colors group-focus-within:text-primary"></i>
                        <input 
                            type="text" 
                            placeholder="Search by ID, Name, Phone, Mode..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>
                <button onClick={fetchOrders} className="py-1.5 px-3 bg-white border border-gray-200 rounded-lg text-xs font-bold flex items-center gap-2 hover:border-gray-900 transition-all shadow-sm active:scale-95">
                    <i className="fa-solid fa-rotate-right" /> Refresh
                </button>
            </div>

            {/* Tight Main Area */}
            <div className="flex flex-col lg:flex-row gap-4 flex-1 overflow-hidden">
                
                {/* Left: Compact List */}
                <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                    {/* Compact Filter */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide shrink-0">
                        {ALL_FILTERS.map(f => {
                            const count = f === 'All' ? orders.length : orders.filter(o => o.status === f).length;
                            const isActive = filter === f;
                            return (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all border-2 ${isActive ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
                                >
                                    {f} {count > 0 && <span className="ml-1 opacity-60 text-[9px]">({count})</span>}
                                </button>
                            );
                        })}
                    </div>

                    {/* Highly Efficient List */}
                    <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                        <div className="flex flex-col gap-2 pb-4">
                            {filtered.length === 0 ? (
                                <div className="text-center py-10 bg-white rounded-lg border border-gray-100 italic">
                                    <p className="text-gray-400 text-xs">No orders listed.</p>
                                </div>
                            ) : (
                                filtered.map(order => {
                                    const isSelected = selectedOrderId === order._id;
                                    const statusObj = VIBRANT_STATUS_MAP[order.status] || VIBRANT_STATUS_MAP.Pending;
                                    const date = order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '--';
                                    
                                    return (
                                        <div 
                                            key={order._id}
                                            onClick={() => setSelectedOrderId(order._id)}
                                            className={`relative flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all border-2 ${isSelected ? 'bg-white border-black shadow-md z-10' : 'bg-white border-transparent hover:border-gray-200'} ${order.status === 'Cancelled' ? 'opacity-60 bg-gray-50' : ''}`}
                                        >
                                            {/* Cancelled Line Strike-through */}
                                            {order.status === 'Cancelled' && (
                                                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-rose-200/30 -rotate-2 pointer-events-none -mx-2"></div>
                                            )}

                                            {/* Identity */}
                                            <div className="flex flex-col min-w-[70px]">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">ID</span>
                                                <span className="text-xs font-black text-gray-900">#{order._id.slice(-6).toUpperCase()}</span>
                                            </div>

                                            {/* Customer */}
                                            <div className="flex flex-col flex-1">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Customer</span>
                                                <span className="text-xs font-bold text-gray-800 line-clamp-1">{order.customer?.name || order.customer?.full_name || 'Guest'}</span>
                                            </div>

                                            {/* Date */}
                                            <div className="hidden sm:flex flex-col min-w-[60px]">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Date</span>
                                                <span className="text-[11px] font-bold text-gray-500">{date}</span>
                                            </div>

                                            {/* Payment details in Row */}
                                            <div className="hidden xl:flex flex-col min-w-[90px]">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Payment</span>
                                                <div className="flex items-center gap-1">
                                                    {order.payment_status === 'Paid' ? (
                                                        <span className="text-[8px] font-black px-1 rounded uppercase bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                            Paid
                                                        </span>
                                                    ) : (
                                                        <span className={`text-[8px] font-black px-1 rounded uppercase ${order.payment_mode === 'COD' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                                                            {order.payment_status === 'COD' ? 'Unpaid' : (order.payment_status || 'Pending')}
                                                        </span>
                                                    )}
                                                    <span className="text-[9px] font-bold text-gray-500">{order.payment_mode || 'COD'}</span>
                                                </div>
                                            </div>

                                            {/* Amount */}
                                            <div className="flex flex-col min-w-[70px]">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Amount</span>
                                                <span className="text-xs font-black tracking-tight text-gray-900">₹{order.total_amount?.toLocaleString() || '0'}</span>
                                            </div>

                                            {/* Action Status */}
                                            <div className="flex flex-col min-w-[130px]" onClick={e => e.stopPropagation()}>
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">Status</span>
                                                <select
                                                    value={order.status || 'Pending'}
                                                    onChange={e => setConfirmUpdate({ id: order._id, status: e.target.value })}
                                                    disabled={updating === order._id || order.status === 'Cancelled'}
                                                    className={`w-full text-[10px] font-bold py-1 px-2 rounded-md border outline-none cursor-pointer transition-all ${statusObj.bg} ${statusObj.text} ${statusObj.border} hover:opacity-80 disabled:cursor-not-allowed`}
                                                >
                                                    {['Pending', ...ORDER_STATUS_FLOW, 'Cancelled'].map(s => <option key={s} value={s} className="bg-white text-gray-900">{s}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Condensed Detail Pane */}
                <div className="w-full lg:w-[320px] bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden shadow-lg">
                    {selectedOrder ? (
                        <>
                            {/* Detail Header */}
                            <div className="p-4 border-b border-gray-50 bg-gray-50/30 shrink-0">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                        <i className="fa-solid fa-box text-sm"></i>
                                    </div>
                                    <div className={`px-2 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-tight flex items-center gap-1.5 ${VIBRANT_STATUS_MAP[selectedOrder.status]?.bg} ${VIBRANT_STATUS_MAP[selectedOrder.status]?.text} ${VIBRANT_STATUS_MAP[selectedOrder.status]?.border}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${VIBRANT_STATUS_MAP[selectedOrder.status]?.dot}`}></div>
                                        {selectedOrder.status || 'Pending'}
                                    </div>
                                </div>
                                <h2 className="text-lg font-bold text-gray-900 leading-none">Order Details</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">ID: {selectedOrder._id.toUpperCase()}</p>
                            </div>

                            {/* Scrollable Details */}
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-5">
                                {/* Customer Info */}
                                <div>
                                    <h3 className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2">Customer Info</h3>
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                                <i className="fa-solid fa-user text-xs"></i>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-bold text-gray-900 leading-tight truncate">{selectedOrder.customer?.name || selectedOrder.customer?.full_name}</p>
                                                <p className="text-[10px] text-gray-400 truncate">{selectedOrder.customer?.email}</p>
                                            </div>
                                        </div>
                                        {selectedOrder.customer?.phone && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <i className="fa-solid fa-phone text-xs"></i>
                                                </div>
                                                <p className="text-[11px] font-bold text-gray-700">{selectedOrder.customer.phone}</p>
                                            </div>
                                        )}
                                        {selectedOrder.customer?.address && (
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                                                    <i className="fa-solid fa-location-dot text-xs"></i>
                                                </div>
                                                <p className="text-[10px] font-medium text-gray-500 leading-relaxed italic">{selectedOrder.customer.address}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Items List */}
                                <div>
                                    <h3 className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2">Ordered Items</h3>
                                    <div className="space-y-2">
                                        {selectedOrder.items?.map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center bg-gray-50/50 p-2.5 rounded-md border border-gray-100">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="text-[10px] font-bold bg-white border px-1.5 py-0.5 rounded text-orange-600 shrink-0">{item.quantity}x</span>
                                                    <p className="text-[11px] font-bold text-gray-700 truncate">{item.name || item.product_name}</p>
                                                </div>
                                                <p className="text-[11px] font-black text-gray-900 shrink-0">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Refund Status for Online Payments */}
                                {selectedOrder.refund_status && selectedOrder.refund_status !== 'none' && (
                                    <div className="px-4 py-3 bg-rose-50 border border-rose-100 rounded-2xl">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest leading-none">Refund Status</span>
                                            <span className="text-[9px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-full leading-none shadow-sm">PAYMENT REFUNDED</span>
                                        </div>
                                        {selectedOrder.razorpay_refund_id && (
                                            <div className="flex items-center gap-1.5 text-rose-300">
                                                <i className="fa-solid fa-receipt text-[10px]"></i>
                                                <p className="text-[10px] font-mono font-bold truncate">REF: {selectedOrder.razorpay_refund_id}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Summary */}
                                <div className="bg-gray-900 rounded-xl p-4 text-white shadow-md">
                                    <div className="flex justify-between text-[10px] mb-3">
                                        <span className="opacity-60 uppercase font-black tracking-widest">Type</span>
                                        <span className="font-bold underline uppercase">{selectedOrder.payment_mode || 'COD'}</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Amount</p>
                                            <p className="text-xl font-black">₹{selectedOrder.total_amount?.toLocaleString()}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${selectedOrder.payment_status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                {selectedOrder.payment_status || 'Unpaid'}
                                            </div>
                                            {selectedOrder.payment_status !== 'Paid' && (
                                                <button 
                                                    onClick={() => confirmCODPayment(selectedOrder._id)}
                                                    disabled={updating === selectedOrder._id}
                                                    className="text-[9px] font-black text-emerald-400 underline hover:text-emerald-300 transition-colors uppercase tracking-tight"
                                                >
                                                    Mark as Paid
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-40">
                            <p className="text-[10px] font-bold text-gray-400 uppercase text-center">Click an order row<br />to view items</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modals - Compact */}
            {confirmUpdate?.status === 'Shipped' ? (
                <ShippingDetailsModal 
                    isOpen={!!confirmUpdate}
                    onConfirm={(data: any) => updateStatus(confirmUpdate!.id, confirmUpdate!.status, data)}
                    onCancel={() => setConfirmUpdate(null)}
                    loading={updating === confirmUpdate?.id}
                />
            ) : (
                <StatusConfirmModal 
                    isOpen={!!confirmUpdate}
                    status={confirmUpdate?.status}
                    onConfirm={() => updateStatus(confirmUpdate!.id, confirmUpdate!.status)}
                    onCancel={() => setConfirmUpdate(null)}
                    loading={updating === confirmUpdate?.id}
                />
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}
