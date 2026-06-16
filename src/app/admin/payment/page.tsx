'use client';

import React, { useEffect, useState } from 'react';
import { API } from '@/constants/api';
import { COLORS } from '@/constants/styles';

/**
 * Admin Payment View
 * 
 * Provides administrative visibility into all transactions.
 * Columns: Date, Customer, Payment ID, Total Paid, Type, Status.
 */

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
}

export default function AdminPayment() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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
                setOrders(Array.isArray(data) ? data : []);
            } else {
                setError('Failed to load transaction data.');
            }
        } catch (e) {
            setError('Network error during data fetch.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const downloadCSV = () => {
        const headers = ['Order ID', 'Date', 'Customer Name', 'Email', 'Payment ID', 'Total Amount', 'Type', 'Status'];
        
        const filtered = orders.filter(o => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            const name = (o.customer?.name || o.customer?.full_name || '').toLowerCase();
            const pId = (o.razorpay_payment_id || o.razorpay_order_id || '').toLowerCase();
            const amount = (o.total_amount || 0).toString();
            const date = o.created_at ? new Date(o.created_at).toLocaleDateString('en-GB') : '';
            return name.includes(q) || pId.includes(q) || amount.includes(q) || date.includes(q);
        });

        const rows = filtered.map(o => {
            const dateObj = new Date(o.created_at || Date.now());
            const date = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            const isCod = o.payment_mode === 'COD';
            const paymentId = o.razorpay_payment_id || o.razorpay_order_id || (isCod ? `ORD_${o._id.slice(-6).toUpperCase()}` : 'N/A');

            return [
                o._id,
                `${date} ${time}`,
                o.customer?.name || o.customer?.full_name || '',
                o.customer?.email || '',
                paymentId,
                o.total_amount || 0,
                isCod ? 'COD' : 'Online',
                o.payment_status || 'Pending'
            ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `payments_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return (
        <div className="flex flex-col gap-6 animate-pulse p-8">
            <div className="h-10 bg-gray-200 rounded-xl w-64 mb-4"></div>
            <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl w-full"></div>)}
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight font-heading">Payments</h1>
                    <p className="text-gray-500 font-medium text-sm">Track all customer transactions and settlement status.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search Bar */}
                    <div className="relative group min-w-[320px]">
                        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary"></i>
                        <input 
                            type="text" 
                            placeholder="Search by Name, Payment ID, Amount..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
                        />
                    </div>

                    <button onClick={downloadCSV} className="flex items-center gap-2 py-3 px-6 bg-white border-2 border-gray-100 rounded-2xl font-bold text-green-700 hover:border-black hover:text-green-800 transition-all shadow-sm active:scale-95">
                        <i className="fa-solid fa-file-excel"></i> Download Excel
                    </button>
                    <button 
                      onClick={fetchOrders} 
                      className="flex items-center gap-2 py-3 px-6 bg-white border-2 border-gray-100 rounded-2xl font-bold text-gray-600 hover:border-black hover:text-black transition-all shadow-sm active:scale-95"
                    >
                        <i className="fa-solid fa-rotate-right"></i> Refresh
                    </button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl border-2 border-red-100 font-bold text-center">
                    {error}
                </div>
            )}

            {/* Table Container */}
            <div className="bg-white rounded-[32px] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/40 border-b border-gray-50">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">Date</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">Customer</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">Payment ID</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">Total Paid</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">Type</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.1em] text-gray-400 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-30">
                                            <i className="fa-solid fa-receipt text-6xl"></i>
                                            <p className="italic font-bold">No payment records found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.filter(o => {
                                    if (!searchQuery) return true;
                                    const q = searchQuery.toLowerCase();
                                    const name = (o.customer?.name || o.customer?.full_name || '').toLowerCase();
                                    const pId = (o.razorpay_payment_id || o.razorpay_order_id || '').toLowerCase();
                                    const amount = (o.total_amount || 0).toString();
                                    const date = o.created_at ? new Date(o.created_at).toLocaleDateString('en-GB') : '';
                                    
                                    return name.includes(q) || pId.includes(q) || amount.includes(q) || date.includes(q);
                                }).map((order) => {
                                    const dateObj = new Date(order.created_at || Date.now());
                                    const date = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                                    const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                    
                                    const isPaid = order.payment_status === 'Paid';
                                    const isCod = order.payment_mode === 'COD';
                                    const paymentId = order.razorpay_payment_id || order.razorpay_order_id || (isCod ? `ORD_${order._id.slice(-6).toUpperCase()}` : 'N/A');

                                    return (
                                        <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900 leading-none mb-1.5">{date}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter opacity-70">{time}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-black text-gray-900 line-clamp-1 mb-0.5">{order.customer?.name || order.customer?.full_name || 'Guest'}</div>
                                                <div className="text-[10px] text-gray-400 font-medium truncate max-w-[200px]">{order.customer?.email || 'No email linked'}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-black bg-gray-50 px-2.5 py-1.5 rounded-lg text-gray-600 border border-gray-100 font-mono ring-1 ring-inset ring-gray-200/50 shadow-sm">{paymentId}</span>
                                            </td>
                                            <td className="px-8 py-6 font-black text-gray-900 text-base">₹{order.total_amount?.toLocaleString() || '0'}</td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight inline-flex items-center gap-2 border shadow-sm ${isCod ? 'bg-indigo-50/50 text-indigo-600 border-indigo-100' : 'bg-amber-50/50 text-amber-600 border-amber-100'}`}>
                                                    <i className={`fa-solid ${isCod ? 'fa-truck-fast' : 'fa-credit-card'} text-[10px]`}></i>
                                                    {isCod ? 'COD' : 'Online'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] inline-flex items-center gap-2.5 border-2 ${isPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-md shadow-emerald-500/5' : 'bg-amber-50 text-amber-600 border-amber-100 opacity-80'}`}>
                                                    <div className={`w-2 h-2 rounded-full ${isPaid ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`}></div>
                                                    {isPaid ? 'Paid' : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <p className="text-center text-[11px] font-bold text-gray-300 uppercase tracking-widest pt-4">© {new Date().getFullYear()} Crunchy Cashews Administrative Payment Terminal</p>
        </div>
    );
}
