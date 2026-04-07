'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/constants/api';

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
}

export default function AdminBulkOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [activeNote, setActiveNote] = useState<{ id: string; notes: string } | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch(API.ADMIN_BULK_ORDERS, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            if (res.ok) setOrders(await res.json());
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchOrders(); }, []);

    const updateStatus = async (id: string, status: string, admin_notes: string = '') => {
        const res = await fetch(API.ADMIN_BULK_STATUS(id), {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, admin_notes })
        });
        if (res.ok) {
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status, admin_notes } : o));
            setActiveNote(null);
        }
    };

    const STATUS_COLORS: Record<string, string> = {
        Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        'In Review': 'bg-blue-50 text-blue-700 border-blue-200',
        Quoted: 'bg-purple-50 text-purple-700 border-purple-200',
        Confirmed: 'bg-green-50 text-green-700 border-green-200',
        Rejected: 'bg-red-50 text-red-700 border-red-200',
    };

    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
    const counts = Object.fromEntries(['Pending', 'In Review', 'Quoted', 'Confirmed', 'Rejected'].map(s => [s, orders.filter(o => o.status === s).length]));

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Bulk / Wholesale Orders</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{orders.length} total inquiries</p>
                </div>
                <button onClick={fetchOrders} className="text-sm text-primary font-semibold flex items-center gap-1.5 hover:underline">
                    <i className="fa-solid fa-rotate-right" /> Refresh
                </button>
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap gap-2">
                {['all', 'Pending', 'In Review', 'Quoted', 'Confirmed', 'Rejected'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize border transition-all ${filter === f ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-primary'}`}>
                        {f === 'all' ? `All (${orders.length})` : `${f} (${counts[f] ?? 0})`}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl h-40 animate-pulse border border-gray-100" />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <i className="fa-solid fa-boxes-stacked text-5xl text-gray-200 mb-4 block" />
                    <p className="text-gray-400 font-medium">No {filter !== 'all' ? filter : ''} bulk inquiries yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map(o => (
                        <div key={o._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="font-bold text-gray-800">{o.name || 'Unknown'}</p>
                                    <p className="text-xs text-gray-400">{o.company || '—'} · {o.email}</p>
                                    <p className="text-xs text-gray-400">{o.phone}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${STATUS_COLORS[o.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                    {o.status}
                                </span>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 text-[11px] text-gray-600 mb-3 grid grid-cols-2 gap-y-2 gap-x-4">
                                <div className="col-span-1">
                                    <span className="block font-black text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Partnership</span>
                                    <span className="text-gray-900 font-bold">{o.partnership_type || '—'}</span>
                                </div>
                                <div className="col-span-1">
                                    <span className="block font-black text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">FSSAI / GSTIN</span>
                                    <span className="text-gray-900 font-bold">{o.fssai_gstin || '—'}</span>
                                </div>
                                <div className="col-span-1">
                                    <span className="block font-black text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Monthly Volume</span>
                                    <span className="text-gray-900 font-bold">{o.volume || '—'}</span>
                                </div>
                                <div className="col-span-1">
                                    <span className="block font-black text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Submitted On</span>
                                    <span className="text-gray-900 font-bold">{o.created_at ? new Date(o.created_at).toLocaleDateString('en-IN') : '—'}</span>
                                </div>
                                {o.requirements && (
                                    <div className="col-span-2 mt-1 pt-2 border-t border-gray-200">
                                        <span className="block font-black text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Grades / Requirements</span>
                                        <span className="text-gray-800 italic leading-relaxed">{o.requirements}</span>
                                    </div>
                                )}
                            </div>

                            {o.admin_notes && (
                                <p className="text-xs italic text-blue-600 bg-blue-50 px-3 py-2 rounded-lg mb-3">
                                    <i className="fa-solid fa-note-sticky mr-1.5" /> {o.admin_notes}
                                </p>
                            )}

                            {/* Status actions */}
                            {activeNote?.id === o._id ? (
                                <div className="space-y-2">
                                    <textarea
                                        value={activeNote!.notes}
                                        onChange={e => setActiveNote({ ...activeNote!, notes: e.target.value })}
                                        placeholder="Add admin note (optional)..."
                                        className="w-full text-xs border rounded-lg px-3 py-2 resize-none h-16 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                    <div className="flex gap-2">
                                        {['In Review', 'Quoted', 'Confirmed', 'Rejected'].map(s => (
                                            <button key={s} onClick={() => updateStatus(o._id, s, activeNote!.notes)}
                                                className="flex-1 text-[10px] font-bold py-1.5 rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-colors">
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => setActiveNote(null)} className="text-xs text-gray-400 hover:underline w-full text-center">Cancel</button>
                                </div>
                            ) : (
                                <button onClick={() => setActiveNote({ id: o._id, notes: o.admin_notes || '' })}
                                    className="w-full text-xs font-bold text-primary border border-primary py-2 rounded-xl hover:bg-primary hover:text-white transition-colors">
                                    <i className="fa-solid fa-pen mr-1" /> Update Status
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
