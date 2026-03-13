'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/constants/api';

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
}

function StarDisplay({ rating = 5 }: { rating?: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <i key={s} className={`text-sm ${s <= rating ? 'fa-solid fa-star text-[#FBB21B]' : 'fa-regular fa-star text-gray-200'}`} />
            ))}
        </div>
    );
}

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

    const fetchTestimonials = async () => {
        try {
            const res = await fetch(API.ADMIN_TESTIMONIALS, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            if (res.ok) setTestimonials(await res.json());
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchTestimonials(); }, []);

    const handleApprove = async (id: string) => {
        const res = await fetch(API.ADMIN_TESTIMONIAL_APPROVE(id), {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (res.ok) setTestimonials(prev => prev.map(t => t._id === id ? { ...t, approved: true } : t));
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this review?')) return;
        const res = await fetch(API.ADMIN_TESTIMONIAL_DELETE(id), {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (res.ok) setTestimonials(prev => prev.filter(t => t._id !== id));
    };

    const filtered = filter === 'all' ? testimonials
        : filter === 'approved' ? testimonials.filter(t => t.approved)
            : testimonials.filter(t => !t.approved);

    const pendingCount = testimonials.filter(t => !t.approved).length;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Customer Reviews</h1>
                    {pendingCount > 0 && (
                        <p className="text-sm text-orange-500 font-medium mt-0.5">
                            <i className="fa-solid fa-clock mr-1" /> {pendingCount} review{pendingCount > 1 ? 's' : ''} waiting for approval
                        </p>
                    )}
                </div>
                <button onClick={fetchTestimonials} className="text-sm text-[#0c5c2b] font-semibold flex items-center gap-1.5 hover:underline">
                    <i className="fa-solid fa-rotate-right" /> Refresh
                </button>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2">
                {(['all', 'pending', 'approved'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize border transition-all ${filter === f ? 'bg-[#0c5c2b] text-white border-[#0c5c2b]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#0c5c2b]'}`}>
                        {f} {f === 'pending' && pendingCount > 0 && <span className="ml-1 bg-orange-100 text-orange-600 rounded-full px-1.5">{pendingCount}</span>}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl h-40 animate-pulse border border-gray-100" />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <i className="fa-regular fa-star text-5xl text-gray-200 mb-4 block" />
                    <p className="text-gray-400 font-medium">No {filter !== 'all' ? filter : ''} reviews yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map(t => (
                        <div key={t._id} className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${t.approved ? 'border-green-100' : 'border-orange-100'}`}>
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#0c5c2b] text-white flex items-center justify-center font-black text-base">
                                        {t.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                                        <p className="text-xs text-gray-400">{t.city}, {t.state}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${t.approved ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                                    {t.approved ? '✓ Approved' : 'Pending'}
                                </span>
                            </div>
                            <StarDisplay rating={t.rating} />
                            <p className="text-gray-600 text-sm mt-2 italic leading-relaxed line-clamp-3">"{t.description}"</p>
                            {t.created_at && (
                                <p className="text-gray-300 text-xs mt-2">{new Date(t.created_at).toLocaleDateString('en-IN')}</p>
                            )}
                            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-50">
                                {!t.approved && (
                                    <button onClick={() => handleApprove(t._id)}
                                        className="flex-1 bg-[#0c5c2b] text-white text-xs font-bold py-2 rounded-xl hover:bg-green-800 transition flex items-center justify-center gap-1.5">
                                        <i className="fa-solid fa-circle-check" /> Approve & Publish
                                    </button>
                                )}
                                <button onClick={() => handleDelete(t._id)}
                                    className={`${t.approved ? 'flex-1' : ''} text-red-500 border border-red-100 text-xs font-bold px-4 py-2 rounded-xl hover:bg-red-50 transition flex items-center justify-center gap-1.5`}>
                                    <i className="fa-solid fa-trash" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
