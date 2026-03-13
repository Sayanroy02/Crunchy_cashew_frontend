'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API } from '@/constants/api';

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // FastAPI uses form data for OAuth2 token endpoint
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const res = await fetch(API.AUTH_LOGIN, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                setError('Invalid username or password. Admin access only.');
                return;
            }

            const data = await res.json();
            const token = data.access_token;

            // Verify this user is actually an admin
            const meRes = await fetch(API.AUTH_ME, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const me = await meRes.json();

            if (me.role !== 'admin') {
                setError('Access denied. This portal is for administrators only.');
                return;
            }

            // Save token to localStorage for admin layout to pick up
            localStorage.setItem('token', token);
            localStorage.setItem('admin_user', JSON.stringify({ username: me.username, role: me.role }));

            router.push('/admin');
        } catch {
            setError('Connection error. Please check if the backend server is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0c5c2b] via-[#0a4f25] to-[#1a1a2e] flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#f6d70f]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img src="/images/cc-Logo-01-1.png" alt="Crunchy Cashews" className="h-16 mx-auto mb-4 drop-shadow-lg" />
                    <h1 className="text-white text-2xl font-black">Admin Portal</h1>
                    <p className="text-white/50 text-sm mt-1">Authorized personnel only</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
                            <i className="fa-solid fa-circle-exclamation flex-shrink-0"></i>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
                            <div className="relative">
                                <i className="fa-solid fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    required
                                    autoFocus
                                    className="w-full pl-9 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#0c5c2b] transition-colors"
                                    placeholder="Admin username"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-9 pr-10 py-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#0c5c2b] transition-colors"
                                    placeholder="Admin password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0c5c2b] text-white font-bold py-3 rounded-xl hover:bg-green-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <><i className="fa-solid fa-spinner animate-spin"></i> Signing in...</>
                            ) : (
                                <><i className="fa-solid fa-right-to-bracket"></i> Sign In to Admin</>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-400 mt-6">
                        <a href="/" className="hover:text-[#0c5c2b] transition-colors">← Back to Store</a>
                    </p>
                </div>

                <p className="text-center text-white/30 text-xs mt-6">
                    🔒 Secured Admin Portal — Crunchy Cashews
                </p>
            </div>
        </div>
    );
}
