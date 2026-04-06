'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS } from '@/constants/styles';
import { API } from '@/constants/api';
import {
    Download,
    BookOpen,
    Send,
    CheckCircle2,
    X,
    Building2,
    Smartphone,
    User,
    Mail
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const TRUST_BADGES = [
    {
        text: 'In-House Processing',
        icon: (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                <line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" />
            </svg>
        ),
    },
    {
        text: 'Custom Retail Packaging',
        icon: (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
        ),
    },
    {
        text: 'Export & Pan-India Ready',
        icon: (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
        ),
    },
];

// ─── Portal — renders outside all stacking contexts ───────────────────────────

function Portal({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;
    return createPortal(children, document.body);
}

// ─── White Label Inquiry Popup ────────────────────────────────────────────────

function WhiteLabelInquiryPopup({ onClose }: { onClose: () => void }) {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        const y = window.scrollY;
        document.body.style.cssText = `overflow:hidden;position:fixed;top:-${y}px;left:0;right:0;width:100%;`;
        return () => { document.body.style.cssText = ''; window.scrollTo(0, y); };
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch(API.CONTACT_ENQUIRY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    enquiry_type: 'White Labeling',
                    message: `WHITE LABEL INQUIRY\nCompany: ${formData.company}\nDetails: ${formData.message}`,
                }),
            });
            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', phone: '', company: '', message: '' });
                setTimeout(() => { setStatus('idle'); onClose(); }, 3000);
            } else { setStatus('error'); }
        } catch { setStatus('error'); }
    };

    return (
        <Portal>
            <div
                className="fixed inset-0 flex items-center justify-center p-4 z-[99999]"
                style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="relative w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header bg */}
                    <div className="absolute top-0 left-0 right-0 h-24 bg-emerald-900 overflow-hidden">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/20 blur-3xl" />
                    </div>

                    {/* Close button */}
                    <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                        <X className="w-5 h-5" />
                    </button>

                    <div className="relative pt-10 px-8 pb-8">
                        {status === 'success' ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                                </div>
                                <h2 className="text-2xl font-black text-emerald-900 mb-2">Request Received!</h2>
                                <p className="text-gray-500">Our branding experts will contact you within 24 hours.</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-8">
                                    <h2 className="text-2xl font-black text-white mb-1">Get Started</h2>
                                    <p className="text-emerald-100/60 text-sm">Fill in your details to launch your custom label.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-primary" />
                                                <input required name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Company</label>
                                            <div className="relative group">
                                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-primary" />
                                                <input required name="company" value={formData.company} onChange={handleChange} placeholder="Brand Name" className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Work Email</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-primary" />
                                                <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@company.com" className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                                            <div className="relative group">
                                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-primary" />
                                                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 ..." className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Branding Requirements</label>
                                        <textarea name="message" value={formData.message} onChange={handleChange} rows={3} placeholder="Tell us about the cashews, sizes, and flavoring you need for your label..." className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" />
                                    </div>

                                    {status === 'error' && (
                                        <div className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">
                                            Failed to submit. Please try again or call us.
                                        </div>
                                    )}

                                    <button type="submit" disabled={status === 'loading'} className="w-full h-14 bg-primary text-black font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
                                        {status === 'loading' ? (
                                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Submit Branding Request
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </Portal>
    );
}

// ─── Main WhiteLabelBanner ───────────────────────────────────────────────────

export default function WhiteLabelBanner() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    return (
        <section className="py-8 md:py-10 bg-bg-cream">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="relative rounded-[28px] overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #047c3cff 0%, #02a84dff 45%, #00d861ff 100%)',
                        boxShadow: '0 4px 24px rgba(2, 201, 91, 0.45), 0 8px 24px rgba(0,0,0,0.1)',
                    }}
                >
                    {/* Concentric rings — right side decorative */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden">
                        {[300, 230, 165, 105, 52].map((size, i) => (
                            <div key={i} className="absolute top-1/2 right-0 rounded-full border"
                                style={{
                                    width: size, height: size,
                                    transform: `translate(${size * 0.4}px, -50%)`,
                                    borderColor: `rgba(255,255,255,${0.04 + i * 0.025})`,
                                }} />
                        ))}
                        <div className="absolute right-0 top-1/2 w-56 h-56 rounded-full"
                            style={{ background: 'radial-gradient(circle, rgba(13,107,88,0.6) 0%, transparent 70%)', transform: 'translate(30%, -50%)' }} />
                    </div>

                    {/* Subtle dot texture */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle, rgba(255,255,255,0.8) 1.2px, transparent 1.2px),
                                linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.03) 75%, rgba(255,255,255,0.03))
                            `,
                            backgroundSize: '22px 22px, 40px 40px',
                            backgroundPosition: '0 0, 0 0'
                        }} />

                    {/* Right side integrated image — YOUR_LOGO packaging mockup */}
                    <div className="absolute right-0 top-0 bottom-0 w-[42%] pointer-events-none z-10 hidden lg:flex items-end justify-end">
                        {/* Flying parachutes around the image */}
                        <motion.img
                            src="/images/Cashew-parachute-03.png"
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 0.15 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="absolute right-[85%] top-[25%] w-12 h-auto rotate-[-15deg]"
                        />
                        <motion.img
                            src="/images/Cashew-parachute-03.png"
                            initial={{ y: -20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 0.1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="absolute right-[70%] top-[65%] w-8 h-auto rotate-[10deg]"
                        />
                        <motion.img
                            src="/images/Cashew-parachute-03.png"
                            initial={{ x: 20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 0.12 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="absolute right-[15%] top-[15%] w-10 h-auto rotate-[-5deg]"
                        />

                        <img
                            src="/images/YOUR_LOGO.png"
                            alt="Custom Branding Options"
                            className="w-full max-h-[90%] object-contain object-right-bottom transform scale-[0.95] origin-bottom-right translate-y-[2px]"
                        />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 px-7 md:px-12 py-8 md:py-10">

                        {/* Left: Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 mb-4">
                                <span className="h-px w-5 bg-primary/60" />
                                <span className="text-primary text-[10px] font-black uppercase tracking-[0.22em]">Launch Your Brand</span>
                            </div>

                            <h2 className="text-[1.8rem] md:text-[2.2rem] font-black text-white leading-[1.1] tracking-tight mb-4">
                                Launch Your Own Private Label <br className="hidden md:block" />
                                <span style={{ color: COLORS.primary }}>Cashew Brand.</span>
                            </h2>

                            <p className="text-white/80 text-[13.5px] md:text-sm leading-relaxed max-w-[560px] mb-7 font-medium">
                                Turn our premium, factory-direct cashews into your exclusive product line.
                                We provide complete turnkey solutions—from custom grading and unique flavoring
                                to retail-ready packaging and reliable logistics.
                            </p>

                            {/* Trust badges — compact */}
                            <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start mb-8">
                                {TRUST_BADGES.map(b => (
                                    <span key={b.text}
                                        className="inline-flex items-center gap-2 text-[10.5px] font-bold px-3.5 py-1.5 rounded-full"
                                        style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
                                        <span className="text-primary">{b.icon}</span>
                                        {b.text}
                                    </span>
                                ))}
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.04, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsPopupOpen(true)}
                                    className="group w-full sm:w-auto font-black px-8 py-4 rounded-2xl text-[13px] flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-primary/30"
                                    style={{
                                        background: `linear-gradient(135deg, ${COLORS.primary} 0%, #FFD54F 100%)`,
                                        color: '#000',
                                    }}
                                >
                                    Get Started on Your Brand
                                    <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </motion.button>

                                <motion.a
                                    whileHover={{ scale: 1.03, y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    href="/bulk"
                                    className="w-full sm:w-auto font-bold px-7 py-4 rounded-2xl text-[13px] flex items-center justify-center gap-2.5 backdrop-blur-md transition-all"
                                    style={{
                                        background: 'linear-gradient(160deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                                        color: '#fff',
                                        border: '1.5px solid rgba(255,255,255,0.2)',
                                    }}
                                >
                                    <BookOpen className="w-4 h-4" />
                                    Know More
                                </motion.a>
                            </div>
                        </div>

                        {/* Visual spacer for image on desktop */}
                        <div className="hidden lg:block w-[35%] shrink-0" aria-hidden />

                        {/* Mobile Image — only show on small screens */}
                        <div className="lg:hidden w-full mt-4 pointer-events-none px-4 flex justify-end items-end">
                            <img
                                src="/images/YOUR_LOGO.png"
                                alt="Branding Mockup"
                                className="w-full h-auto object-contain mx-auto max-w-[280px] translate-y-[8px]"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Inquiry Popup */}
            <AnimatePresence>
                {isPopupOpen && (
                    <WhiteLabelInquiryPopup onClose={() => setIsPopupOpen(false)} />
                )}
            </AnimatePresence>
        </section>
    );
}
