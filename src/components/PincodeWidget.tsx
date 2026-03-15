'use client';

import React, { useState } from 'react';

const PINCODES_AVAILABLE = [
    '734001', '734002', '734003', '734004', '734005',
    '734006', '734007', '734008', '734009', '734010',
    '700001', '700002', '700003', '700013', '700019',
    '110001', '110002', '110003', '110004', '110005',
    '400001', '400002', '400003', '400050', '400051',
    '560001', '560002', '600001', '600002', '600020',
    '500001', '500002', '500003', '380001', '380006',
    '302001', '302002', '226001', '226010', '208001',
];

export default function PincodeWidget() {
    const [pincode, setPincode] = useState('');
    const [savedPincode, setSavedPincode] = useState(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('saved_pincode') || '';
        return '';
    });
    const [result, setResult] = useState<null | { available: boolean; message: string }>(null);
    const [loading, setLoading] = useState(false);

    const checkPincode = (code: string) => {
        if (code.length !== 6) {
            setResult({ available: false, message: 'Please enter a valid 6-digit pincode.' });
            return;
        }
        setLoading(true);
        // Simulate a slight async check
        setTimeout(() => {
            const available = PINCODES_AVAILABLE.includes(code);
            setResult({
                available,
                message: available
                    ? `✅ Great news! We deliver to ${code}. Expected delivery: 5–7 business days.`
                    : `❌ Sorry, we don't deliver to ${code} yet. We'll notify you when we do!`
            });
            if (available) {
                setSavedPincode(code);
                localStorage.setItem('saved_pincode', code);
            }
            setLoading(false);
        }, 700);
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
        const isSaved = PINCODES_AVAILABLE.includes(savedPincode);
        return (
            <div className={`flex items-center gap-2 text-sm rounded-xl border px-4 py-2.5 ${isSaved ? 'border-green-200 bg-green-50' : 'border-red-100 bg-red-50'}`}>
                <i className={`fa-solid ${isSaved ? 'fa-location-dot text-primary' : 'fa-circle-xmark text-red-500'}`}></i>
                <span className="font-medium text-gray-700">
                    Delivering to <span className="font-black">{savedPincode}</span>
                    {isSaved ? ' ✅' : ' ❌'}
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
                    className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-green-800 disabled:opacity-50 transition-colors whitespace-nowrap"
                >
                    {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Check'}
                </button>
            </form>

            {result && (
                <div className={`mt-2 text-sm px-3 py-2 rounded-lg ${result.available ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {result.message}
                </div>
            )}
        </div>
    );
}
