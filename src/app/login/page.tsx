'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '@/lib/store/features/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const fd = new FormData();
            fd.append('username', username);
            fd.append('password', password);

            const res = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                body: fd
            });

            if (!res.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await res.json();

            // Dispatch globally to Redux and LocalStorage
            dispatch(login(data.access_token));

            // Redirect to Profile or Shop
            router.push('/profile');

        } catch (err: any) {
            setError(err.message || 'Failed to login');
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:8000/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credentialResponse.credential })
            });
            if (!res.ok) throw new Error('Google Login Failed');
            const data = await res.json();
            dispatch(login(data.access_token));
            router.push('/profile');
        } catch (e: any) {
            setError(e.message || 'Google Login Failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-bg-cream px-6 py-12">
            <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden">
                <div className="bg-black text-center py-10 px-8">
                    <img src="/images/cc-Logo-01-1.png" alt="Crunchy Cashews" className="h-16 mx-auto mb-4 object-contain" />
                    <h1 className="text-3xl font-heading font-bold text-bg-cream">Welcome Back</h1>
                    <p className="text-gray-400 mt-2">Sign in to manage your orders</p>
                </div>

                <div className="p-8 md:p-12">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm font-medium flex items-center gap-3">
                            <i className="fa-solid fa-circle-exclamation w-8 flex-shrink-0"></i> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 ml-2" htmlFor="username">Email Address</label>
                            <div className="relative">
                                <i className="fa-solid fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="email"
                                    id="username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-full py-4 pl-12 pr-6 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 ml-2" htmlFor="password">Password</label>
                            <div className="relative">
                                <i className="fa-solid fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="password"
                                    id="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-full py-4 pl-12 pr-6 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-6 w-full bg-text-dark text-highlight font-bold text-lg py-4 rounded-full shadow-lg hover:-translate-y-1 hover:shadow-black/20 transition-all disabled:opacity-70 disabled:hover:translate-y-0 relative"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-highlight border-t-transparent rounded-full animate-spin mx-auto"></div>
                            ) : (
                                <>Sign In <i className="fa-solid fa-arrow-right ml-2 opacity-50"></i></>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-gray-500 text-sm flex flex-col gap-4">
                        <div className="w-full flex items-center justify-center">
                            <span className="bg-white px-2 text-gray-400 text-xs mt-2 mb-2 w-full max-w-[200px] border-b border-gray-200 leading-[0.1em] text-center"><span className="bg-white px-2">OR</span></span>
                        </div>
                        <div className="flex justify-center w-full">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google Authentication Failed')}
                                useOneTap
                                theme="filled_black"
                                shape="pill"
                            />
                        </div>
                        <span className="mt-4">Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline">Sign up for free</Link></span>
                    </p>
                </div>
            </div>
        </div>
    );
}
