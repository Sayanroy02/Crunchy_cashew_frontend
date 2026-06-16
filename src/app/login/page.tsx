'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '@/lib/store/features/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';
import { API } from '@/constants/api';
import { COLORS } from '@/constants/styles';
import SectionHeading from '@/components/ui/SectionHeading';

type ViewState = 'login' | 'forgot_email' | 'forgot_otp' | 'forgot_reset';

export default function LoginPage() {
    const [view, setView] = useState<ViewState>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [timer, setTimer] = useState(600);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (view === 'forgot_otp' && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [view, timer]);

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

    const handleForgotEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!forgotEmail) return setError('Please enter your email address');
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(API.AUTH_FORGOT_PASSWORD, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Failed to send OTP');
            setTimer(600);
            setOtp(['', '', '', '', '', '']);
            setView('forgot_otp');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtpSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) return setError('Please enter a 6-digit OTP');
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(API.AUTH_VERIFY_OTP, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail, otp: code })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Invalid OTP');
            setResetToken(data.reset_token);
            setView('forgot_reset');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return setError('Passwords do not match');
        if (newPassword.length < 6) return setError('Password must be at least 6 characters');
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(API.AUTH_RESET_PASSWORD, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail, reset_token: resetToken, new_password: newPassword })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Failed to reset password');
            setView('login');
            setPassword('');
            setUsername(forgotEmail);
            setError('');
            alert('Password reset successfully! You can now log in.');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    // Format timer to mm:ss
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div
            className={`w-full flex items-center justify-center pt-16 pb-12 px-4 sm:pt-20 sm:pb-16 sm:px-5 lg:pt-24 lg:pb-20 lg:px-8 ${COLORS.bg}`}
            style={{ minHeight: 'calc(100vh - 112px)' }}
        >
            <div className="w-full max-w-[860px] bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">

                {/* ════════════════════════════════
                    BRAND PANEL
                ════════════════════════════════ */}
                <div className="relative flex flex-col items-center justify-center overflow-hidden
                    w-full py-8 px-5
                    lg:w-[42%] lg:py-12 lg:px-8 lg:min-h-[540px]"
                    style={{ backgroundColor: COLORS.heading }}
                >
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 72%, rgba(12,92,43,0.38) 0%, transparent 68%)' }} />
                    <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
                        style={{ background: 'linear-gradient(to top, rgba(200,169,110,0.1), transparent)' }} />

                    <div className="relative z-10 flex flex-col items-center mt-4 lg:mt-0 w-full">
                        <img
                            src="/images/login-page-img-new.png"
                            alt="Crunchy Cashews illustration"
                            className="object-contain w-[85%] max-w-[380px] h-full"
                            style={{ filter: 'drop-shadow(0 10px 28px rgba(0,0,0,0.6))' }}
                        />

                        <div className="mt-4 lg:mt-6 text-center px-2">
                            <SectionHeading
                                text="Experience the"
                                highlight="Perfect Crunch"
                                className="text-white !text-lg !sm:text-xl !lg:text-[1.45rem] font-bold leading-snug tracking-tight text-center mb-3"
                                textColor="#ffffff"
                                highlightColor="#F6B000"
                            />
                            <p className="hidden sm:block text-white text-xs lg:text-sm mt-2 max-w-[240px] mx-auto leading-relaxed">
                                Sign in for faster checkout, easy reordering, and real-time shipment tracking.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ════════════════════════════════
                    FORM PANEL
                ════════════════════════════════ */}
                <div className="flex-1 flex items-center justify-center bg-white
                    px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">

                    <div className="w-full max-w-[320px]">

                        {/* Error Alert */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-6 text-sm font-medium flex items-center gap-2">
                                <i className="fa-solid fa-circle-exclamation flex-shrink-0 text-xs" />
                                {error}
                            </div>
                        )}

                        {/* --- VIEW: LOGIN --- */}
                        {view === 'login' && (
                            <>
                                <div className="mb-6">
                                    <h1 className="text-[1.6rem] font-bold text-gray-900 tracking-tight">Welcome back</h1>
                                    <p className="text-gray-400 mt-1 text-sm leading-relaxed">
                                        Sign in to manage your orders &amp; wishlist
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
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
                                        <div className="flex justify-end mt-1">
                                            <button
                                                type="button"
                                                onClick={() => { setError(''); setView('forgot_email'); }}
                                                className="text-[11px] text-green-700 font-bold hover:underline"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                    </div>

                                    <button type="submit" disabled={isLoading}
                                        className="text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2 w-full disabled:opacity-60"
                                        style={{ backgroundColor: COLORS.heading }}
                                    >
                                        {isLoading
                                            ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                                            : <span className="flex items-center justify-center gap-2">
                                                Sign In <i className="fa-solid fa-arrow-right text-xs opacity-70" />
                                            </span>
                                        }
                                    </button>
                                </form>

                                <div className="flex items-center gap-2.5 my-4">
                                    <div className="flex-1 h-px bg-gray-200" />
                                    <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">or</span>
                                    <div className="flex-1 h-px bg-gray-200" />
                                </div>

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

                                <p className="text-center mt-5 text-sm text-gray-500">
                                    Don't have an account?{' '}
                                    <Link href="/register"
                                        className="text-green-700 font-bold hover:underline underline-offset-2">
                                        Sign up
                                    </Link>
                                </p>
                            </>
                        )}

                        {/* --- VIEW: FORGOT EMAIL --- */}
                        {view === 'forgot_email' && (
                            <>
                                <div className="mb-6">
                                    <button
                                        onClick={() => { setError(''); setView('login'); }}
                                        className="mb-4 text-xs font-semibold text-gray-400 hover:text-primary flex items-center gap-1 transition-colors"
                                    >
                                        <i className="fa-solid fa-arrow-left" /> Back to Login
                                    </button>
                                    <h1 className="text-[1.6rem] font-bold text-gray-900 tracking-tight">Forgot Password</h1>
                                    <p className="text-gray-400 mt-1 text-sm leading-relaxed">
                                        Enter your registered email and we'll send you an OTP to reset your password.
                                    </p>
                                </div>

                                <form onSubmit={handleForgotEmailSubmit} className="space-y-6">
                                    <div className="space-y-1.5">
                                        <label htmlFor="forgotEmail"
                                            className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                            <input
                                                type="email" id="forgotEmail" required
                                                value={forgotEmail}
                                                onChange={e => setForgotEmail(e.target.value)}
                                                placeholder="name@example.com"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400
                                                    focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" disabled={isLoading}
                                        className="text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2 w-full disabled:opacity-60"
                                        style={{ backgroundColor: COLORS.heading }}
                                    >
                                        {isLoading
                                            ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                                            : <span className="flex items-center justify-center gap-2">
                                                Request OTP <i className="fa-solid fa-paper-plane text-xs opacity-70" />
                                            </span>
                                        }
                                    </button>
                                </form>
                            </>
                        )}

                        {/* --- VIEW: FORGOT OTP --- */}
                        {view === 'forgot_otp' && (
                            <>
                                <div className="mb-6">
                                    <button
                                        onClick={() => { setError(''); setView('forgot_email'); }}
                                        className="mb-4 text-xs font-semibold text-gray-400 hover:text-primary flex items-center gap-1 transition-colors"
                                    >
                                        <i className="fa-solid fa-arrow-left" /> Back
                                    </button>
                                    <h1 className="text-[1.6rem] font-bold text-gray-900 tracking-tight">Verify OTP</h1>
                                    <p className="text-gray-400 mt-1 text-sm leading-relaxed">
                                        We sent a 6-digit code to <span className="font-bold text-gray-700">{forgotEmail}</span>
                                    </p>
                                </div>

                                <form onSubmit={handleVerifyOtpSubmit} className="space-y-6">
                                    <div className="flex justify-between items-center gap-2">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`otp-${index}`}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={e => handleOtpChange(index, e.target.value)}
                                                onKeyDown={e => handleOtpKeyDown(index, e)}
                                                className="w-10 h-12 text-center text-lg font-bold bg-gray-50 border border-gray-200 rounded-xl
                                                    focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                                            />
                                        ))}
                                    </div>

                                    <div className="flex flex-col items-center justify-center gap-1">
                                        {timer > 0 ? (
                                            <p className="text-xs font-semibold text-gray-500">
                                                Code expires in <span className="text-primary font-bold">{formatTime(timer)}</span>
                                            </p>
                                        ) : (
                                            <p className="text-xs font-semibold text-red-500">OTP has expired</p>
                                        )}

                                        <button
                                            type="button"
                                            onClick={handleForgotEmailSubmit}
                                            disabled={timer > 0 || isLoading}
                                            className={`text-xs font-bold transition-colors ${timer > 0 ? 'text-gray-300' : 'text-primary hover:underline'}`}
                                        >
                                            Resend OTP
                                        </button>
                                    </div>

                                    <button type="submit" disabled={isLoading || otp.join('').length < 6}
                                        className="text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2 w-full disabled:opacity-60"
                                        style={{ backgroundColor: COLORS.heading }}
                                    >
                                        {isLoading
                                            ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                                            : <span className="flex items-center justify-center gap-2">
                                                Verify Code <i className="fa-solid fa-check-circle text-xs opacity-70" />
                                            </span>
                                        }
                                    </button>
                                </form>
                            </>
                        )}

                        {/* --- VIEW: FORGOT RESET --- */}
                        {view === 'forgot_reset' && (
                            <>
                                <div className="mb-6">
                                    <h1 className="text-[1.6rem] font-bold text-gray-900 tracking-tight">New Password</h1>
                                    <p className="text-gray-400 mt-1 text-sm leading-relaxed">
                                        Enter your new secure password below.
                                    </p>
                                </div>

                                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                            <input
                                                type={showPassword ? 'text' : 'password'} required
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
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

                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                            <input
                                                type={showPassword ? 'text' : 'password'} required
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-10 pr-11 text-sm text-gray-800 placeholder-gray-400
                                                    focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" disabled={isLoading}
                                        className="text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2 w-full mt-2 disabled:opacity-60"
                                        style={{ backgroundColor: COLORS.heading }}
                                    >
                                        {isLoading
                                            ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                                            : <span className="flex items-center justify-center gap-2">
                                                Set Password <i className="fa-solid fa-save text-xs opacity-70" />
                                            </span>
                                        }
                                    </button>
                                </form>
                            </>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
}