'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '@/lib/store/features/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            // 1. Hit Registration API
            const regRes = await fetch('http://localhost:8000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            if (!regRes.ok) {
                const errData = await regRes.json();
                throw new Error(errData.detail || 'Registration failed');
            }

            // 2. Auto-Login Flow (as done in previous logic)
            const fd = new FormData();
            fd.append('username', formData.email); // FastAPI OAuth2 uses 'username' field for email
            fd.append('password', formData.password);

            const loginRes = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                body: fd
            });

            if (!loginRes.ok) throw new Error('Auto-login failed after registration');

            const data = await loginRes.json();

            // Dispatch globally to Redux and LocalStorage
            dispatch(login(data.access_token));

            // Redirect to Shop directly
            router.push('/shop');

        } catch (err: any) {
            setError(err.message || 'Failed to register account');
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
            if (!res.ok) throw new Error('Google Registration Failed');
            const data = await res.json();
            dispatch(login(data.access_token));
            router.push('/shop');
        } catch (e: any) {
            setError(e.message || 'Google Registration Failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-bg-cream px-6 py-12">
            <div className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden">
                <div className="bg-primary text-center py-10 px-8">
                    <h1 className="text-3xl font-heading font-black text-white">Join Crunchy Cashews</h1>
                    <p className="text-green-100 mt-2">Create an account for faster checkouts and order tracking.</p>
                </div>

                <div className="p-8 md:p-12">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm font-medium flex items-center gap-3">
                            <i className="fa-solid fa-circle-exclamation w-8 flex-shrink-0"></i> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 ml-2" htmlFor="username">Full Name</label>
                            <div className="relative">
                                <i className="fa-solid fa-user absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input type="text" id="username" name="username" required value={formData.username} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-full py-4 pl-12 pr-6 focus:border-primary focus:ring-2 outline-none" placeholder="John Doe" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 ml-2" htmlFor="email">Email Address</label>
                            <div className="relative">
                                <i className="fa-solid fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-full py-4 pl-12 pr-6 focus:border-primary focus:ring-2 outline-none" placeholder="name@example.com" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-700 ml-2" htmlFor="password">Password</label>
                                <div className="relative">
                                    <i className="fa-solid fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                    <input type="password" id="password" name="password" required value={formData.password} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-full py-4 pl-12 pr-6 focus:border-primary focus:ring-2 outline-none" placeholder="••••••••" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-700 ml-2" htmlFor="confirm_password">Confirm</label>
                                <div className="relative">
                                    <i className="fa-solid fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                    <input type="password" id="confirm_password" name="confirm_password" required value={formData.confirm_password} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-full py-4 pl-12 pr-6 focus:border-primary focus:ring-2 outline-none" placeholder="••••••••" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className="mt-8 w-full bg-primary text-white font-bold text-lg py-4 rounded-full shadow-lg hover:-translate-y-1 hover:shadow-green-900/40 hover:bg-green-800 transition-all disabled:opacity-70 disabled:hover:translate-y-0">
                            {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div> : "Create Account"}
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
                        <span className="mt-4">Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign in here</Link></span>
                    </p>
                </div>
            </div>
        </div>
    );
}
