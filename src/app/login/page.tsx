'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '@/lib/store/features/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';
import { API } from '@/constants/api';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
            const res = await fetch(API.AUTH_LOGIN, { method: 'POST', body: fd });
            if (!res.ok) throw new Error('Invalid credentials');
            const data = await res.json();
            dispatch(login(data.access_token));
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
            const res = await fetch(API.AUTH_GOOGLE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credentialResponse.credential }),
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
        /*
         * KEY LAYOUT DECISION
         * ─────────────────────────────────────────────────────────
         * We are rendered inside <main> which already sits BELOW
         * the sticky navbar (announcement bar ~32px + nav ~80px).
         * Using  min-h-[calc(100vh-112px)]  fills the remaining
         * viewport exactly — no `fixed`, no overlap, no scroll fight.
         * On mobile the card stacks vertically and the page can
         * scroll normally if the viewport is too short.
         * ─────────────────────────────────────────────────────────
         */
        <div
            className="w-full bg-[#ede7d9] flex items-center justify-center p-4 sm:p-5 lg:p-8"
            style={{ minHeight: 'calc(100vh - 112px)' }}
        >
            {/* ── Floating card with margin on all sides ── */}
            <div className="w-full max-w-[860px] bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">

                {/* ════════════════════════════════
                    BRAND PANEL
                    top strip on mobile · left col on desktop
                ════════════════════════════════ */}
                <div className="relative flex flex-col items-center justify-center overflow-hidden bg-[#0f1410]
                    w-full py-8 px-5
                    lg:w-[42%] lg:py-12 lg:px-8 lg:min-h-[540px]">

                    {/* Green radial glow */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 72%, rgba(12,92,43,0.38) 0%, transparent 68%)' }} />

                    {/* Warm bottom edge */}
                    <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
                        style={{ background: 'linear-gradient(to top, rgba(200,169,110,0.1), transparent)' }} />

                    {/* Logo — real colours, no filter */}
                    <div className="absolute top-4 left-4 lg:top-5 lg:left-5 z-10">
                        <img
                            src="/images/cc-Logo-01-1.png"
                            alt="Crunchy Cashews"
                            className="h-9 lg:h-10 w-auto object-contain"
                        />
                    </div>

                    {/* Illustration + copy */}
                    <div className="relative z-10 flex flex-col items-center mt-4 lg:mt-0">
                        <img
                            src="/images/iLLUSTARTION-1.png"
                            alt="Crunchy Cashews illustration"
                            className="object-contain w-[130px] sm:w-[170px] lg:w-[250px] xl:w-[270px]"
                            style={{ filter: 'drop-shadow(0 10px 28px rgba(0,0,0,0.6))' }}
                        />

                        <div className="mt-4 lg:mt-6 text-center px-2">
                            <h2 className="text-white font-bold leading-snug tracking-tight text-lg sm:text-xl lg:text-[1.45rem]">
                                Premium Cashews,<br />
                                <span className="text-[#c8a96e]">Delivered Fresh</span>
                            </h2>
                            <p className="hidden sm:block text-gray-400 text-xs lg:text-sm mt-2 max-w-[200px] mx-auto leading-relaxed">
                                Farm-fresh cashews delivered straight to your doorstep.
                            </p>
                        </div>

                        {/* Pill dots */}
                        <div className="flex gap-1.5 mt-4 lg:mt-6">
                            <span className="w-5 h-1.5 rounded-full bg-[#c8a96e]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                        </div>
                    </div>
                </div>

                {/* ════════════════════════════════
                    FORM PANEL
                    bottom on mobile · right col on desktop
                ════════════════════════════════ */}
                <div className="flex-1 flex items-center justify-center bg-white
                    px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">

                    <div className="w-full max-w-[320px]">

                        {/* Heading */}
                        <div className="mb-6">
                            <h1 className="text-[1.6rem] font-bold text-gray-900 tracking-tight">Welcome back</h1>
                            <p className="text-gray-400 mt-1 text-sm leading-relaxed">
                                Sign in to manage your orders &amp; wishlist
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-4 text-sm font-medium flex items-center gap-2">
                                <i className="fa-solid fa-circle-exclamation flex-shrink-0 text-xs" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label htmlFor="username"
                                    className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                    <input
                                        type="email" id="username" required
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400
                                            focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label htmlFor="password"
                                    className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                                    Password
                                </label>
                                <div className="relative">
                                    <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                    <input
                                        type={showPassword ? 'text' : 'password'} id="password" required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-10 pr-11 text-sm text-gray-800 placeholder-gray-400
                                            focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                                    />
                                    <button type="button" tabIndex={-1}
                                        onClick={() => setShowPassword(v => !v)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                        <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                                    </button>
                                </div>
                            </div>

                            {/* Sign In button */}
                            <button type="submit" disabled={isLoading}
                                className="w-full bg-primary hover:bg-[#0a4f25] active:scale-[0.98]
                                    text-white font-bold text-sm py-3.5 rounded-xl
                                    shadow-md hover:shadow-lg hover:-translate-y-0.5
                                    transition-all disabled:opacity-60 disabled:hover:translate-y-0
                                    tracking-wide mt-1">
                                {isLoading
                                    ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                                    : <span className="flex items-center justify-center gap-2">
                                        Sign In <i className="fa-solid fa-arrow-right text-xs opacity-70" />
                                    </span>
                                }
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-2.5 my-4">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">or</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* Google sign-in */}
                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google Authentication Failed')}
                                useOneTap
                                theme="outline"
                                shape="rectangular"
                                width="320"
                            />
                        </div>

                        {/* Register */}
                        <p className="text-center mt-5 text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link href="/register"
                                className="text-primary font-bold hover:underline underline-offset-2">
                                Sign up free
                            </Link>
                        </p>

                    </div>
                </div>

            </div>
        </div>
    );
}