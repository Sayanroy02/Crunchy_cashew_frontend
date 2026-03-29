'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/constants/api';

export default function PincodeSelector() {
    const [saved, setSaved] = useState('');
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');

    useEffect(() => {
        const p = localStorage.getItem('deliveryPincode') || '';
        setSaved(p);
    }, []);

    const check = async () => {
        if (input.length !== 6 || !/^\d+$/.test(input)) return;
        setStatus('checking');
        try {
            const res = await fetch(API.PINCODES_CHECK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pincode: input })
            });
            const data = await res.json();
            if (data.available) {
                setStatus('available');
                setSaved(input);
                localStorage.setItem('deliveryPincode', input);
            } else {
                setStatus('unavailable');
            }
        } catch {
            setStatus('unavailable');
        }
    };

    const clear = () => {
        setSaved('');
        setInput('');
        setStatus('idle');
        localStorage.removeItem('deliveryPincode');
        setOpen(false);
    };

    return (
        <div className="relative flex-shrink-0">
            {/* Trigger chip */}
            <button
                onClick={() => { setOpen(v => !v); setInput(saved); setStatus('idle'); }}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-primary transition-colors group"
            >
                <i className="fa-solid fa-location-dot text-primary text-sm"></i>
                <div className="text-left leading-tight">
                    <div className="text-[10px] text-gray-400 group-hover:text-gray-500">Deliver to</div>
                    <div className="font-bold text-gray-800">{saved || 'Pincode'} <i className="fa-solid fa-chevron-down text-[9px]"></i></div>
                </div>
            </button>

            {/* Popup */}
            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-gray-800 text-sm">Check Delivery</h3>
                            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 mb-3">Enter your 6-digit pincode to check delivery availability</p>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                maxLength={6}
                                value={input}
                                onChange={e => { setInput(e.target.value.replace(/\D/g, '')); setStatus('idle'); }}
                                onKeyDown={e => e.key === 'Enter' && check()}
                                placeholder="e.g. 734001"
                                className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary transition-colors font-mono tracking-widest"
                                autoFocus
                            />
                            <button
                                onClick={check}
                                disabled={input.length !== 6 || status === 'checking'}
                                className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-black transition disabled:opacity-50"
                            >
                                {status === 'checking' ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Check'}
                            </button>
                        </div>

                        {status === 'available' && (
                            <div className="mt-3 bg-primary/10 border border-primary/20 rounded-xl px-3 py-2 flex items-center gap-2 text-sm text-black">
                                <i className="fa-solid fa-circle-check text-primary"></i>
                                <span>✅ Delivery available to <strong>{input}</strong></span>
                            </div>
                        )}
                        {status === 'unavailable' && (
                            <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-center gap-2 text-sm text-red-600">
                                <i className="fa-solid fa-circle-xmark text-red-400"></i>
                                <span>❌ Sorry, we don't deliver to <strong>{input}</strong> yet</span>
                            </div>
                        )}

                        {saved && (
                            <button onClick={clear} className="mt-3 w-full text-xs text-gray-400 hover:text-red-500 transition-colors text-center">
                                Clear saved pincode
                            </button>
                        )}

                        {status === 'available' && (
                            <button onClick={() => setOpen(false)} className="mt-2 w-full bg-amber text-[#2c1a0e] font-bold text-sm py-2 rounded-xl hover:bg-yellow transition">
                                Save & Close
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
