'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API } from '@/constants/api';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { login } from '@/lib/store/features/authSlice';

export default function QROfferPage() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        uid: ''
    });

    const router = useRouter();
    const dispatch = useDispatch();

    // Prevent search indexing
    useEffect(() => {
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex, nofollow';
        document.head.appendChild(meta);
        return () => { document.head.removeChild(meta); };
    }, []);

    const [availability, setAvailability] = useState({ email: true, phone: true });

    // Real-time check logic
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (userData.email && userData.email.includes('@')) {
                try {
                    const res = await fetch(API.AUTH_REGISTER, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: userData.email, username: 'check', password: 'checking_only_123' })
                    });
                    const data = await res.json();
                    if (!res.ok && data.detail?.toLowerCase().includes('email')) {
                        setAvailability(prev => ({ ...prev, email: false }));
                        setError('Email is already registered');
                    } else {
                        setAvailability(prev => ({ ...prev, email: true }));
                    }
                } catch (e) { }
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [userData.email]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (userData.phone && userData.phone.length >= 10) {
                try {
                    const res = await fetch(API.AUTH_REGISTER, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone: userData.phone, username: 'check', email: 'check@test.com', password: 'checking_only_123' })
                    });
                    const data = await res.json();
                    if (!res.ok && data.detail?.toLowerCase().includes('phone')) {
                        setAvailability(prev => ({ ...prev, phone: false }));
                        setError('Phone number is already registered');
                    } else {
                        setAvailability(prev => ({ ...prev, phone: true }));
                    }
                } catch (e) { }
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [userData.phone]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
        setError(''); // Clear error on change
    };



    const handleStep1Submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userData.username || !userData.email || !userData.password) {
            setError('Please fill in all fields');
            return;
        }
        setStep(2);
    };

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userData.phone || !userData.address) {
            setError('Please provide your phone number and address');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // 1. Try to register
            const regRes = await fetch(API.AUTH_REGISTER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: userData.username,
                    email: userData.email,
                    password: userData.password,
                    phone: userData.phone,
                    address: userData.address
                })
            });

            if (!regRes.ok) {
                const errData = await regRes.json();
                if (errData.detail?.toLowerCase().includes('exists')) {
                    router.push('/');
                    return;
                }
                throw new Error(errData.detail || 'Registration failed');
            }

            const regData = await regRes.json();
            const uid = regData.user?._id || Math.random().toString(36).substr(2, 9).toUpperCase();

            // 2. Auto-login
            const fd = new FormData();
            fd.append('username', userData.email);
            fd.append('password', userData.password);
            const loginRes = await fetch(API.AUTH_LOGIN, { method: 'POST', body: fd });

            if (loginRes.ok) {
                const loginData = await loginRes.json();
                dispatch(login(loginData.access_token));
            }

            setUserData(prev => ({ ...prev, uid }));
            setIsRegistered(true);
            setStep(3);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleWhatsAppShare = () => {
        const text = `🎉 Hey! I just registered on Crunchy Cashews QR Offer!\n\n👤 Name: ${userData.username}\n🆔 UID: ${userData.uid}\n📞 Phone: ${userData.phone}\n📍 Address: ${userData.address}\n\nI'm claiming my reward! 🎁`;
        window.open(`https://wa.me/917847996343?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#FFF9E7] flex flex-col items-center py-6 px-4">
            {/* Logo */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-4"
            >
                <img src="/images/cc-Logo-01-1.png" alt="Logo" className="h-16 w-auto" />
            </motion.div>

            <div className="w-full max-w-xl">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="bg-white rounded-[10px] shadow-2xl p-6 sm:p-8 border border-gray-100"
                        >
                            <div className="text-center mb-4">
                                <span className="inline-block bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[3px] px-4 py-1.5 rounded-full mb-3">
                                    Step 1 of 2
                                </span>
                                <h2 className="text-3xl font-black text-gray-900 leading-tight">Join Us to Claim Your <span className="text-primary">Special Offer</span></h2>

                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-500 text-xs font-bold p-4 rounded-2xl mb-4 border border-red-100 flex items-center gap-3">
                                    <i className="fa-solid fa-circle-exclamation" /> {error}
                                </div>
                            )}



                            <form onSubmit={handleStep1Submit} className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                        <input
                                            type="text" name="username" required
                                            value={userData.username} onChange={handleChange}
                                            placeholder="Enter name"
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/30 focus:bg-white rounded-2xl px-5 py-2.5 text-sm outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email ID</label>
                                        <div className="relative">
                                            <input
                                                type="email" name="email" required
                                                value={userData.email} onChange={handleChange}
                                                placeholder="Enter email"
                                                className={`w-full bg-gray-50 border-2 rounded-2xl px-5 py-2.5 text-sm outline-none transition-all ${!availability.email ? 'border-red-400' : 'border-transparent focus:border-primary/30'
                                                    }`}
                                            />
                                            {!availability.email && <i className="fa-solid fa-circle-xmark absolute right-4 top-1/2 -translate-y-1/2 text-red-400" />}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password" required
                                            value={userData.password} onChange={handleChange}
                                            placeholder="Create password"
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/30 focus:bg-white rounded-2xl px-5 py-2.5 text-sm outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!availability.email}
                                    className="w-full bg-[#00863D] hover:bg-[#006b31] disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-lg shadow-green-900/10 transition-all flex items-center justify-center gap-2 mt-2"
                                >
                                    Continue <i className="fa-solid fa-arrow-right text-xs" />
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="bg-white rounded-[10px] shadow-2xl p-6 sm:p-8 border border-gray-100"
                        >
                            <div className="text-center mb-4">
                                <span className="inline-block bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[3px] px-4 py-1.5 rounded-full mb-3">
                                    Step 2 of 2
                                </span>
                                <h2 className="text-3xl font-black text-gray-900 leading-tight">Final details</h2>
                                <p className="text-gray-400 mt-2 text-sm font-medium">Just a few more things to get started</p>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-500 text-xs font-bold p-4 rounded-2xl mb-6 border border-red-100 flex items-center gap-3">
                                    <i className="fa-solid fa-circle-exclamation" /> {error}
                                </div>
                            )}

                            <form onSubmit={handleFinalSubmit} className="space-y-3">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                                    <div className="relative">
                                        <input
                                            type="tel" name="phone" required
                                            value={userData.phone} onChange={handleChange}
                                            placeholder="Enter your mobile number"
                                            className={`w-full bg-gray-50 border-2 rounded-2xl px-5 py-2.5 text-sm font-bold outline-none transition-all ${!availability.phone ? 'border-red-400' : 'border-transparent focus:border-primary/30'
                                                }`}
                                        />
                                        {!availability.phone && <i className="fa-solid fa-circle-xmark absolute right-4 top-1/2 -translate-y-1/2 text-red-400" />}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Shipping Address</label>
                                    <textarea
                                        name="address" required rows={3}
                                        value={userData.address} onChange={handleChange}
                                        placeholder="Street, City, Pincode..."
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/30 focus:bg-white rounded-2xl px-5 py-2.5 text-sm outline-none transition-all resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading || !availability.phone}
                                    className="w-full bg-[#00863D] hover:bg-[#006b31] disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-lg shadow-green-900/10 transition-all flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <><i className="fa-solid fa-spinner animate-spin" /> Processing...</>
                                    ) : (
                                        <><i className="fa-solid fa-check" /> Complete Registration</>
                                    )}
                                </button>
                                <button type="button" onClick={() => setStep(1)} className="w-full text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-gray-600 transition-colors">
                                    Go Back
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center"
                        >
                            {/* Digital Card */}
                            <div className="relative w-full max-w-[400px] bg-gradient-to-br from-[#00863D] to-[#004d23] rounded-[32px] p-8 shadow-2xl overflow-hidden mb-8 border-4 border-primary">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full -ml-16 -mb-16 blur-2xl" />

                                <div className="flex justify-between items-start mb-10">
                                    <img src="/images/cc-Logo-01-1.png" alt="Logo" className="h-10 brightness-0 invert" />
                                    <div className="bg-primary text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                                        Member ID
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-white/50 text-[10px] font-bold uppercase tracking-[2px] mb-1">Name</p>
                                        <p className="text-2xl font-black text-white">{userData.username}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-white/50 text-[10px] font-bold uppercase tracking-[2px] mb-1">Phone</p>
                                            <p className="text-sm font-bold text-white">{userData.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/50 text-[10px] font-bold uppercase tracking-[2px] mb-1">UID</p>
                                            <p className="text-sm font-bold text-primary">{userData.uid}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-white/50 text-[10px] font-bold uppercase tracking-[2px] mb-1">Address</p>
                                        <p className="text-xs text-white/80 line-clamp-2">{userData.address}</p>
                                    </div>
                                </div>

                                <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic">Crunchy Cashews Elite</p>
                                    <i className="fa-solid fa-qrcode text-white/20 text-3xl" />
                                </div>
                            </div>

                            <div className="w-full space-y-4 text-center">
                                <h3 className="text-2xl font-black text-gray-900">Registration Successful!</h3>
                                <p className="text-gray-500 text-sm max-w-xs mx-auto">Share your digital card to WhatsApp to claim your exclusive reward.</p>

                                <button
                                    onClick={handleWhatsAppShare}
                                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-4 rounded-2xl shadow-lg shadow-green-900/10 transition-all flex items-center justify-center gap-3 text-lg"
                                >
                                    <i className="fa-brands fa-whatsapp text-2xl" /> Share to WhatsApp
                                </button>

                                <p className="text-[10px] text-gray-400 font-medium leading-relaxed max-w-xs mx-auto italic mt-6">
                                    *Note: Verification will be done manually and may take some time to verify authenticity.
                                </p>

                                <button onClick={() => router.push('/')} className="text-primary font-bold text-sm hover:underline">
                                    Back to Store
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
