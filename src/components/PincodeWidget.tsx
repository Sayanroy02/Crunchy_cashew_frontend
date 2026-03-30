'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/constants/api';

export default function PincodeWidget() {
    const [pincode, setPincode] = useState('');
    const [savedPincode, setSavedPincode] = useState(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('saved_pincode') || '';
        return '';
    });
    const [result, setResult] = useState<null | { available: boolean; message: string }>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (savedPincode) {
            checkPincode(savedPincode, true);
        }
    }, [savedPincode]);

    const checkPincode = async (code: string, isInitial = false) => {
        if (code.length !== 6) {
            if (!isInitial) setResult({ available: false, message: 'Please enter a valid 6-digit pincode.' });
            return;
        }
        if (!isInitial) setLoading(true);
        try {
            const res = await fetch(API.PINCODES_CHECK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pincode: code })
            });

            if (!res.ok) throw new Error('API Error');
            const data = await res.json();
            
            if (!isInitial) {
                setResult({
                    available: data.available,
                    message: data.available
                        ? `✅ Great news! We deliver to ${code}. Expected delivery: 5–7 business days.`
                        : `❌ Sorry, we don't deliver to ${code} yet. We'll notify you when we do!`
                });
            }

            if (data.available) {
                setSavedPincode(code);
                localStorage.setItem('saved_pincode', code);
            } else if (isInitial) {
                setSavedPincode('');
                localStorage.removeItem('saved_pincode');
            }
        } catch (e) {
            if (!isInitial) setResult({ available: false, message: '❌ Error checking delivery. Please try again later.' });
        } finally {
            if (!isInitial) setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
        setPincode(val);
        setResult(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        checkPincode(pincode);
    };

    const changePin = () => {
        setSavedPincode('');
        localStorage.removeItem('saved_pincode');
        setPincode('');
        setResult(null);
    };

    // If already saved, just show the saved status
    if (savedPincode && !result) {
        return (
            <div className={`flex items-center gap-2 text-sm rounded-xl border px-4 py-2.5 border-primary/20 bg-primary/10`}>
                <i className={`fa-solid fa-location-dot text-primary`}></i>
                <span className="font-medium text-gray-700">
                    Delivering to <span className="font-black">{savedPincode}</span>
                </span>
                <button onClick={changePin} className="ml-auto text-xs text-blue-600 underline hover:text-blue-800">Change</button>
            </div>
        );
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                    <i className="fa-solid fa-location-dot absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                        type="text"
                        value={pincode}
                        onChange={handleChange}
                        placeholder="Enter 6-digit pincode"
                        className="w-full pl-8 pr-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-primary transition-colors"
                        maxLength={6}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || pincode.length < 6}
                    className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-black disabled:opacity-50 transition-colors whitespace-nowrap"
                >
                    {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Check'}
                </button>
            </form>

            {result && (
                <div className={`mt-2 text-sm px-3 py-2 rounded-lg ${result.available ? 'bg-primary/10 text-black border border-primary/20' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {result.message}
                </div>
            )}
        </div>
    );
}
