'use client';

import React, { useState } from 'react';
import { API } from '@/constants/api';

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
}

export default function AdminChangePassword() {
    const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.new_password !== form.confirm_password) {
            setErrorMsg('New passwords do not match.'); return;
        }
        if (form.new_password.length < 6) {
            setErrorMsg('Password must be at least 6 characters.'); return;
        }
        setStatus('loading');
        setErrorMsg('');
        try {
            const res = await fetch(API.ADMIN_CHANGE_PW, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ current_password: form.current_password, new_password: form.new_password })
            });
            if (res.ok) {
                setStatus('success');
                setForm({ current_password: '', new_password: '', confirm_password: '' });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                const err = await res.json().catch(() => ({}));
                setErrorMsg(err.detail || 'Failed to change password.');
                setStatus('error');
            }
        } catch {
            setErrorMsg('Connection error.');
            setStatus('error');
        }
    };

    return (
        <div className="max-w-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Change Password</h1>
            <p className="text-sm text-gray-400 mb-8">Update your admin account password securely.</p>

            {status === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl flex items-center gap-3 mb-6 text-sm font-medium">
                    <i className="fa-solid fa-circle-check text-lg" /> Password changed successfully!
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">Current Password</label>
                    <div className="relative">
                        <input
                            type={showCurrent ? 'text' : 'password'}
                            required
                            value={form.current_password}
                            onChange={e => setForm(f => ({ ...f, current_password: e.target.value }))}
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 px-4 pr-10 focus:border-[#0c5c2b] outline-none text-sm transition-colors"
                            placeholder="Enter current password"
                        />
                        <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <i className={`fa-solid ${showCurrent ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                        </button>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">New Password</label>
                    <div className="relative">
                        <input
                            type={showNew ? 'text' : 'password'}
                            required
                            value={form.new_password}
                            onChange={e => setForm(f => ({ ...f, new_password: e.target.value }))}
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 px-4 pr-10 focus:border-[#0c5c2b] outline-none text-sm transition-colors"
                            placeholder="At least 6 characters"
                        />
                        <button type="button" onClick={() => setShowNew(!showNew)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <i className={`fa-solid ${showNew ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                        </button>
                    </div>
                    {/* Strength indicator */}
                    {form.new_password && (
                        <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${form.new_password.length >= i * 3
                                    ? i <= 2 ? 'bg-red-400' : i === 3 ? 'bg-yellow-400' : 'bg-green-500'
                                    : 'bg-gray-200'
                                    }`} />
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 block">Confirm New Password</label>
                    <input
                        type="password"
                        required
                        value={form.confirm_password}
                        onChange={e => setForm(f => ({ ...f, confirm_password: e.target.value }))}
                        className={`w-full bg-gray-50 border-2 rounded-xl py-3 px-4 focus:outline-none text-sm transition-colors ${form.confirm_password && form.confirm_password !== form.new_password
                            ? 'border-red-300 focus:border-red-400'
                            : 'border-gray-200 focus:border-[#0c5c2b]'
                            }`}
                        placeholder="Re-enter new password"
                    />
                    {form.confirm_password && form.confirm_password !== form.new_password && (
                        <p className="text-xs text-red-500 mt-1"><i className="fa-solid fa-circle-exclamation mr-1" />Passwords do not match</p>
                    )}
                </div>

                {errorMsg && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                        <i className="fa-solid fa-circle-exclamation" /> {errorMsg}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-[#0c5c2b] text-white font-bold py-3.5 rounded-xl hover:bg-green-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                    {status === 'loading'
                        ? <><i className="fa-solid fa-spinner animate-spin" /> Changing...</>
                        : <><i className="fa-solid fa-lock" /> Change Password</>
                    }
                </button>
            </form>
        </div>
    );
}
