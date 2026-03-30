'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/constants/api';

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
}

export default function AdminPincodes() {
    const [pincodes, setPincodes] = useState<string[]>([]);
    const [deliveryMode, setDeliveryMode] = useState<'all' | 'selected'>('selected');
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState('');
    const [adding, setAdding] = useState(false);
    const [updatingMode, setUpdatingMode] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const [pinRes, setRes] = await Promise.all([
                fetch(API.PINCODES),
                fetch(API.PINCODES_SETTINGS, {
                    headers: { 'Authorization': `Bearer ${getToken()}` }
                })
            ]);

            if (pinRes.ok) {
                const data = await pinRes.json();
                // If API returns {pincodes, deliveryMode}, handle both
                if (data.pincodes) {
                    setPincodes(data.pincodes);
                    setDeliveryMode(data.deliveryMode);
                } else {
                    setPincodes(data);
                }
            }

            if (setRes.ok) {
                const s = await setRes.json();
                if (s.deliveryMode) setDeliveryMode(s.deliveryMode);
            }
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

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
            if (res.ok) { setInput(''); fetchData(); }
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
            fetchData();
        } catch (e) { console.error(e); }
    };

    const handleModeChange = async (mode: 'all' | 'selected') => {
        setUpdatingMode(true);
        const token = getToken();
        try {
            const res = await fetch(API.PINCODES_SETTINGS, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ deliveryMode: mode })
            });
            if (res.ok) setDeliveryMode(mode);
            else alert('Failed to update delivery mode');
        } catch { alert('Connection error'); } finally { setUpdatingMode(false); }
    };

    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Delivery Pincodes</h1>
                <p className="text-sm text-gray-500 mt-1">Manage delivery availability. You can toggle between nationwide delivery or restricting to specific areas.</p>
            </div>

            {/* Delivery Mode Toggle */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-truck-fast text-primary"></i>
                    Delivery Strategy
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={() => handleModeChange('all')}
                        disabled={updatingMode}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                            deliveryMode === 'all' 
                            ? 'border-primary bg-primary/5 shadow-md' 
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            deliveryMode === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                            <i className="fa-solid fa-globe"></i>
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">All Pincodes</p>
                            <p className="text-xs text-gray-500">Deliver to any location in India. No pincode check needed.</p>
                        </div>
                        {deliveryMode === 'all' && <i className="fa-solid fa-circle-check text-primary ml-auto"></i>}
                    </button>

                    <button
                        onClick={() => handleModeChange('selected')}
                        disabled={updatingMode}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                            deliveryMode === 'selected' 
                            ? 'border-primary bg-primary/5 shadow-md' 
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            deliveryMode === 'selected' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                            <i className="fa-solid fa-list-check"></i>
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">Only Selected</p>
                            <p className="text-xs text-gray-500">Restricted delivery to the pincodes listed below.</p>
                        </div>
                        {deliveryMode === 'selected' && <i className="fa-solid fa-circle-check text-primary ml-auto"></i>}
                    </button>
                </div>
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
                        className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary font-mono tracking-widest"
                    />
                    <button
                        onClick={handleAdd}
                        disabled={adding || input.length !== 6}
                        className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-800 transition disabled:opacity-50 flex items-center gap-2"
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
                                <i className="fa-solid fa-location-dot text-primary text-xs"></i>
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
