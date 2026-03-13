'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/constants/api';

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
}

export default function AdminPincodes() {
    const [pincodes, setPincodes] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState('');
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState('');

    const fetchPincodes = async () => {
        try {
            const res = await fetch(API.PINCODES);
            if (res.ok) setPincodes(await res.json());
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchPincodes(); }, []);

    const handleAdd = async () => {
        setError('');
        if (!/^\d{6}$/.test(input.trim())) {
            setError('Pincode must be exactly 6 digits');
            return;
        }
        setAdding(true);
        const token = getToken();
        try {
            const res = await fetch(API.PINCODES_ADD, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ pincode: input.trim() })
            });
            if (res.ok) { setInput(''); fetchPincodes(); }
            else { const d = await res.json(); setError(d.detail || 'Failed to add'); }
        } catch { setError('Connection error'); } finally { setAdding(false); }
    };

    const handleRemove = async (p: string) => {
        const token = getToken();
        try {
            await fetch(API.PINCODES_REMOVE(p), {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchPincodes();
        } catch (e) { console.error(e); }
    };

    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Delivery Pincodes</h1>
                <p className="text-sm text-gray-500 mt-1">Manage pincodes where home delivery is available. Customers will check availability from the navbar.</p>
            </div>

            {/* Add pincode */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-semibold text-gray-700 mb-3">Add New Pincode</h2>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-xl mb-3">{error}</div>
                )}
                <div className="flex gap-2">
                    <input
                        type="text"
                        maxLength={6}
                        value={input}
                        onChange={e => setInput(e.target.value.replace(/\D/g, ''))}
                        onKeyDown={e => e.key === 'Enter' && handleAdd()}
                        placeholder="6-digit pincode e.g. 734001"
                        className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0c5c2b] font-mono tracking-widest"
                    />
                    <button
                        onClick={handleAdd}
                        disabled={adding || input.length !== 6}
                        className="bg-[#0c5c2b] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-800 transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {adding ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-plus"></i>}
                        Add
                    </button>
                </div>
            </div>

            {/* Pincode list */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-semibold text-gray-700 mb-4">
                    Active Pincodes <span className="text-sm font-normal text-gray-400 ml-1">({pincodes.length})</span>
                </h2>
                {loading ? (
                    <div className="text-gray-400 text-sm py-4 text-center">Loading...</div>
                ) : pincodes.length === 0 ? (
                    <div className="text-gray-400 text-sm py-8 text-center flex flex-col items-center gap-2">
                        <i className="fa-solid fa-location-dot text-3xl"></i>
                        <p>No pincodes added yet. Add your first deliverable pincode above.</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {pincodes.map(p => (
                            <div key={p} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
                                <i className="fa-solid fa-location-dot text-[#0c5c2b] text-xs"></i>
                                <span className="font-mono font-bold text-gray-800 text-sm">{p}</span>
                                <button
                                    onClick={() => handleRemove(p)}
                                    className="text-red-400 hover:text-red-600 transition-colors ml-1"
                                    title="Remove pincode"
                                >
                                    <i className="fa-solid fa-xmark text-xs"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
