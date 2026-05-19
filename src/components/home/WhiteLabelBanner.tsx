'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS } from '@/constants/styles';
import { API } from '@/constants/api';
import {
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
        title: 'In-House Processing',
        subtitle: 'Customize product ranges',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        ),
    },
    {
        title: 'Custom Retail Packaging',
        subtitle: 'Simplify to your brand',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
            </svg>
        ),
    },
    {
        title: 'Export & Pan-India Ready',
        subtitle: 'Retail-ready and logistics',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
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
                    <div className="absolute top-0 left-0 right-0 h-24 bg-[#00863D] overflow-hidden">
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
    const pathname = usePathname();
    const isBulkPage = pathname === '/bulk';

    const handleCTA = () => {
        if (isBulkPage) {
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
            const message = `Source: ${baseUrl}/bulk [White label banner]

Hello 👋
I’d like to know more about your white label options. Could you please share the details regarding pricing, features, customization, and how the overall process works?`;

            const whatsappUrl = `https://wa.me/917847996343?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        } else {
            setIsPopupOpen(true);
        }
    };

    return (
        <section className={`py-6 md:py-8 overflow-hidden ${COLORS.bg}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative rounded-[32px] overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, ${COLORS.heading} 0%, #006b31 100%)`,
                        boxShadow: '0 20px 40px -10px rgba(0, 134, 61, 0.2)',
                    }}
                >
                    {/* Decorative Elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[500px] h-[500px]">
                            {[500, 400, 300, 200, 100].map((size, i) => (
                                <div
                                    key={i}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03]"
                                    style={{ width: size, height: size }}
                                />
                            ))}
                        </div>
                        <div className="absolute top-1/4 right-[10%] w-48 h-48 bg-primary/10 rounded-full blur-[80px]" />
                        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                    </div>

                    <div className="relative z-10 px-6 py-6 md:px-12 md:py-8">
                        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 lg:gap-10">

                            {/* Left Side: Content */}
                            <div className="flex-1 text-center lg:text-left">
                                {/* Subtitle with lines */}
                                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                                    <div className="h-[1.5px] w-6 md:w-8 bg-primary/40 rounded-full" />
                                    <span className="text-primary text-[10px] font-black uppercase tracking-[0.25em]">
                                        WHITE LABEL SERVICES
                                    </span>
                                    <div className="h-[1.5px] w-6 md:w-8 bg-primary/40 rounded-full" />
                                </div>

                                <motion.h2
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="text-[1.45rem] md:text-[1.75rem] font-black text-white leading-tight mb-2"
                                >
                                    Launch Your Own <span style={{ color: COLORS.primary }}>Cashew Brand.</span>
                                </motion.h2>

                                <p className="text-white/80 text-[16px] leading-snug max-w-[500px] mb-5 font-medium">
                                    Leverage our state-of-the-art processing facility to sell premium, factory-direct cashews under your own label. We handle the grading, roasting, and custom packaging so you can focus on selling.
                                </p>

                                {/* Desktop Buttons */}
                                <div className="hidden lg:flex items-center gap-4">
                                    <button
                                        onClick={handleCTA}
                                        className="group font-black px-6 py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 whitespace-nowrap transition-all hover:scale-105 active:scale-95 shadow-xl"
                                        style={{
                                            background: `linear-gradient(135deg, ${COLORS.primary} 0%, #FFD54F 100%)`,
                                            color: '#000',
                                        }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                                        </svg>
                                        {isBulkPage ? 'Discuss White Label Options' : 'Partner With Us'}
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="group-hover:translate-x-0.5 transition-transform">
                                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                        </svg>
                                    </button>
                                    {!isBulkPage && (
                                        <a
                                            href="/bulk"
                                            className="h-11 px-7 rounded-xl border-2 border-white/20 text-white font-black text-[13px] flex items-center gap-2.5 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 shadow-xl"
                                        >
                                            <BookOpen className="w-4 h-4" />
                                            Know More
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Right Side: Visual Mockup */}
                            <div className="flex-1 w-full max-w-[320px] lg:max-w-none relative lg:h-[260px] -mt-2 lg:mt-0">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    className="relative w-full h-full flex items-center justify-center lg:justify-end"
                                >
                                    <div className="relative w-full h-[220px] md:h-[260px] lg:h-[320px] lg:w-[150%] lg:absolute lg:right-[-8%] lg:bottom-[-15%] drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]">
                                        <img
                                            src="/images/YOUR_LOGO.png"
                                            alt="Custom Branding Packaging"
                                            className="w-full h-full object-contain object-center lg:object-right-bottom scale-[1.1] transform-gpu origin-bottom-right"
                                        />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Mobile Buttons */}
                            <div className="lg:hidden w-full flex flex-col gap-2 mt-1">
                                <button
                                    onClick={handleCTA}
                                    className="group font-black w-full px-6 py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 whitespace-nowrap transition-all hover:scale-105 active:scale-95 shadow-xl"
                                    style={{
                                        background: `linear-gradient(135deg, ${COLORS.primary} 0%, #FFD54F 100%)`,
                                        color: '#000',
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                                    </svg>
                                    {isBulkPage ? 'Discuss White Label Options' : 'Partner With Us'}
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="group-hover:translate-x-0.5 transition-transform">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                    </svg>
                                </button>
                                {!isBulkPage && (
                                    <a
                                        href="/bulk"
                                        className="w-full h-11 rounded-xl border-2 border-white/20 text-white font-black text-[13px] flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl"
                                    >
                                        <BookOpen className="w-4 h-4" />
                                        Know More
                                    </a>
                                )}
                            </div>

                        </div>

                        {/* Bottom: Trust Badges */}
                        {/* <div className="mt-6 md:mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-4">
                                {TRUST_BADGES.map((badge, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex flex-row items-center text-left gap-3 group"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-primary border border-white/10 shrink-0 transition-all duration-300">
                                            <div className="scale-75">{badge.icon}</div>
                                        </div>
                                        <div className="space-y-0">
                                            <h3 className="text-white font-black text-[14px] leading-tight">
                                                {badge.title}
                                            </h3>
                                            <p className="text-white/40 font-bold text-[9px] uppercase tracking-wider">
                                                {badge.subtitle}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div> */}
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
