'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/constants/api';
function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
}

interface Banner {
    _id: string;
    image_url: string;
    title: string;
    link?: string;
}

export default function AdminBanners() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchBanners = async () => {
        try {
            const token = getToken();
            const res = await fetch(API.ADMIN_BANNERS, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setBanners(await res.json());
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchBanners(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this banner?')) return;
        try {
            const token = getToken();
            const res = await fetch(API.ADMIN_BANNER_DELETE(id), {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchBanners();
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return alert('Please select an image file');

        setIsSubmitting(true);
        const fd = new FormData();
        fd.append('title', title);
        if (link) fd.append('link', link);
        fd.append('file', file);

        try {
            const token = getToken();
            const res = await fetch(API.ADMIN_BANNERS, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: fd
            });
            if (res.ok) {
                setIsModalOpen(false);
                setTitle(''); setLink(''); setFile(null);
                fetchBanners();
            } else {
                const err = await res.json();
                alert(err.detail || 'Failed to upload banner');
            }
        } catch (e) {
            console.error(e);
            alert('Upload error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="text-gray-400">Loading Banners...</div>;

    const maxSlots = 6;
    const slots = Array.from({ length: maxSlots }, (_, i) => banners[i] || null);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Manage Banners (Max 6 Slots)</h1>
                {banners.length < 6 && (
                    <button onClick={() => setIsModalOpen(true)} className="bg-[#0c5c2b] text-white px-4 py-2 rounded-lg hover:bg-green-800 transition font-medium shadow-sm">
                        + Add Banner
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
                {slots.map((banner, index) => {
                    if (banner) {
                        return (
                            <div key={banner._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group relative">
                                <img src={banner.image_url} alt={banner.title} className="w-full h-48 object-cover" />
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="font-bold text-lg mb-1 truncate" title={banner.title}>{banner.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{banner.link || 'No Link Provided'}</p>
                                    <button onClick={() => handleDelete(banner._id)} className="mt-auto w-full py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition">
                                        <i className="fa-solid fa-trash mr-2"></i>Remove Banner
                                    </button>
                                </div>
                                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur">Slot {index + 1}</div>
                            </div>
                        );
                    } else {
                        return (
                            <div key={`empty-${index}`} onClick={() => setIsModalOpen(true)} className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl h-[310px] flex flex-col items-center justify-center text-gray-400 hover:text-[#0c5c2b] hover:border-[#0c5c2b] hover:bg-green-50/30 transition cursor-pointer group">
                                <i className="fa-solid fa-cloud-arrow-up text-4xl mb-3 group-hover:-translate-y-1 transition-transform"></i>
                                <span className="font-medium text-lg">Upload to Slot {index + 1}</span>
                            </div>
                        );
                    }
                })}
            </div>

            {/* Upload Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold">Upload New Banner</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title</label>
                                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-primary outline-none" placeholder="Summer Sale..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Redirect Link (Optional)</label>
                                <input type="text" value={link} onChange={e => setLink(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-primary outline-none" placeholder="/shop?category=sale" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image Bundle</label>
                                <input type="file" required accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-[#0c5c2b] hover:file:bg-green-100 cursor-pointer" />
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full mt-4 bg-[#0c5c2b] text-white py-3 rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition block text-center disabled:opacity-50">
                                {isSubmitting ? 'Uploading...' : 'Publish Banner'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
