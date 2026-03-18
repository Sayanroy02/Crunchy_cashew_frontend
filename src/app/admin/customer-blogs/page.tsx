'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/constants/api';

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
}

export default function AdminCustomerBlogs() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

    const fetchBlogs = async () => {
        try {
            const res = await fetch(API.ADMIN_BLOGS, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            if (res.ok) {
                // Filter only blogs that have an author_id (customer blogs)
                // Or simply show all and allow filtering by status
                const all = await res.json();
                setBlogs(all.filter((b: any) => b.author_id));
            }
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const updateStatus = async (id: string, status: string) => {
        setStatusUpdating(id);
        try {
            const res = await fetch(API.ADMIN_BLOG_STATUS(id), {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                fetchBlogs();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setStatusUpdating(null);
        }
    };

    const toggleFeatured = async (id: string, current: boolean) => {
        setStatusUpdating(id);
        try {
            const res = await fetch(API.ADMIN_BLOG_STATUS(id), {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ featured: !current })
            });
            if (res.ok) {
                fetchBlogs();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setStatusUpdating(null);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight">Customer Submissions</h1>
                    <p className="text-sm text-gray-500 font-medium">Review and verify blogs uploaded by customers</p>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map(i => <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />)}
                </div>
            ) : blogs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-users-viewfinder text-4xl text-gray-200" />
                    </div>
                    <p className="font-bold text-gray-400">No customer blogs found for review.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {blogs.map((b) => (
                        <div key={b._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative group">
                            {/* Featured Tag */}
                            <div className="absolute top-4 left-4 z-10 flex gap-2">
                                {b.featured && (
                                    <span className="bg-amber text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                                        <i className="fa-solid fa-star"></i> Featured
                                    </span>
                                )}
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm ${
                                    b.status === 'published' ? 'bg-green-500 text-white border-green-600' :
                                    b.status === 'rejected' ? 'bg-red-500 text-white border-red-600' :
                                    'bg-yellow-400 text-white border-yellow-500'
                                }`}>
                                    {b.status || 'pending'}
                                </span>
                            </div>

                            {b.image_url ? (
                                <img src={b.image_url} alt={b.title} className="w-full h-56 object-cover" />
                            ) : (
                                <div className="w-full h-56 bg-gray-50 flex items-center justify-center text-6xl opacity-20">📝</div>
                            )}

                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-green-50 text-primary text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">{b.category}</span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(b.created_at).toLocaleDateString()}</span>
                                </div>
                                
                                <h3 className="font-black text-xl mb-3 text-gray-800 line-clamp-2 leading-tight">{b.title}</h3>
                                
                                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-black text-primary">
                                        {b.author?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Author</p>
                                        <p className="text-sm font-bold text-gray-700 truncate">{b.author}</p>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-500 line-clamp-4 leading-relaxed mb-6 italic">
                                    "{b.content.substring(0, 300)}..."
                                </div>

                                <div className="mt-auto pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                                    {b.status !== 'published' && (
                                        <button 
                                            disabled={statusUpdating === b._id}
                                            onClick={() => updateStatus(b._id, 'published')}
                                            className="flex-1 bg-green-600 text-white font-black py-3 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-200 flex items-center justify-center gap-2 text-sm uppercase tracking-widest disabled:opacity-50"
                                        >
                                            <i className="fa-solid fa-check"></i> Approve
                                        </button>
                                    )}
                                    {b.status !== 'rejected' && (
                                        <button 
                                            disabled={statusUpdating === b._id}
                                            onClick={() => updateStatus(b._id, 'rejected')}
                                            className="flex-1 bg-red-50 text-red-600 border border-red-100 font-black py-3 rounded-xl hover:bg-red-100 transition flex items-center justify-center gap-2 text-sm uppercase tracking-widest disabled:opacity-50"
                                        >
                                            <i className="fa-solid fa-xmark"></i> Reject
                                        </button>
                                    )}
                                    <button 
                                        disabled={statusUpdating === b._id}
                                        onClick={() => toggleFeatured(b._id, b.featured || false)}
                                        className={`w-full font-black py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm uppercase tracking-widest disabled:opacity-50 ${
                                            b.featured 
                                            ? 'bg-amber text-white shadow-lg shadow-amber/20' 
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        <i className={`fa-solid fa-star ${b.featured ? 'text-white' : 'text-gray-400'}`}></i> 
                                        {b.featured ? 'Remove Featured' : 'Mark as Featured'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
