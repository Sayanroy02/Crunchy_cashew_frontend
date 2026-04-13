'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { API_BASE } from '@/constants/api';
import { COLORS } from '@/constants/styles';
import SectionHeading from '@/components/ui/SectionHeading';

// ─── Portal — renders outside all stacking contexts ─────────────────────────
function Portal({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;
    return createPortal(children, document.body);
}

export default function AboutFactory() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', date: '', purpose: '' });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const videoRef = useRef<HTMLVideoElement>(null);
    const sectionRef = useRef<HTMLElement>(null);

    // Parallax logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 50, damping: 20 });
    const springY = useSpring(y, { stiffness: 50, damping: 20 });

    const leftMoveX = useTransform(springX, [-500, 500], [15, -15]);
    const leftMoveY = useTransform(springY, [-500, 500], [15, -15]);
    const rightMoveX = useTransform(springX, [-500, 500], [-10, 10]);
    const rightMoveY = useTransform(springY, [-500, 500], [-10, 10]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
    };

    // Lazy-play: only start buffering + playing when the video is in the viewport
    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.src = '/videos/cashew-video.webm';
                    el.play().catch(() => { });
                } else {
                    el.pause();
                }
            },
            { threshold: 0.25 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Freeze body scroll when modal is open
    useEffect(() => {
        if (!isModalOpen) return;
        const y = window.scrollY;
        document.body.style.cssText = `overflow:hidden;position:fixed;top:-${y}px;left:0;right:0;width:100%;`;
        return () => { document.body.style.cssText = ''; window.scrollTo(0, y); };
    }, [isModalOpen]);

    // Escape listener
    useEffect(() => {
        if (!isModalOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isModalOpen, closeModal]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus('loading');
        try {
            const res = await fetch(`${API_BASE}/api/contact/visit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setSubmitStatus('success');
                setTimeout(() => { setIsModalOpen(false); setSubmitStatus('idle'); setFormData({ name: '', email: '', phone: '', company: '', date: '', purpose: '' }) }, 3000);
            } else {
                setSubmitStatus('error');
            }
        } catch {
            setSubmitStatus('error');
        }
    };

    return (
        <section 
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            className="py-20 md:py-36 bg-bg-cream relative z-20 overflow-hidden"
        >
            {/* ── Left corner fruit ── */}
            <motion.div 
                style={{ x: leftMoveX, y: leftMoveY }}
                className="absolute left-0 bottom-0 w-24 md:w-32 lg:w-44 pointer-events-none select-none z-10"
            >
                <img
                    src="/images/Fruit-3.png"
                    alt=""
                    className="object-contain object-bottom w-full h-auto -translate-x-6 md:-translate-x-8"
                    aria-hidden="true"
                />
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                    {/* 1. Mobile Heading — Only visible on mobile, at the very top (Order 1) */}
                    <div className="w-full lg:hidden flex flex-col items-start order-1">
                        <span className="text-black font-bold tracking-[4px] uppercase text-[10px] mb-2 block">Our Production Facility</span>
                        <SectionHeading text="About Our" highlight="Factory" className="text-4xl mb-0" />
                    </div>

                    {/* 2. Video Section — Shown second on mobile, first on desktop (Order 2) */}
                    <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-start order-2">
                        <div className="relative w-full max-w-md">
                            <div className="rounded-[40px] overflow-hidden shadow-2xl relative aspect-[4/5] w-full bg-primary/10">
                                <video
                                    ref={videoRef}
                                    muted
                                    loop
                                    playsInline
                                    preload="none"
                                    className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. Content Section — Shown third on mobile, second on desktop (Order 3) */}
                    <div className="w-full lg:w-1/2 flex flex-col items-start text-left order-3">
                        {/* Desktop Heading — Only visible on large screens */}
                        <div className="hidden lg:block">
                            <span className="text-black font-bold tracking-[4px] uppercase text-xs mb-3 block">Our Production Facility</span>
                            <SectionHeading text="About Our" highlight="Factory" className="text-5xl mb-6" />
                        </div>
                        
                        <p className="text-gray-700 text-lg md:text-xl mb-6 leading-relaxed font-medium">
                            The process of harvesting, roasting, and grading premium cashews in equipped chambers with constant
                            quality control takes immense precision. We show curious visitors this kingdom of cashews during a
                            guided tour of our specialized factory.
                        </p>
                        
                        <p className="text-gray-600 mb-10 leading-relaxed">
                            You will also have the opportunity to visit our processing units, where you can familiarize yourself
                            with the interesting process of grading and sorting. And at the tasting session, you will feel the
                            authentic crunch, and you will also bring home unique delicacies directly from the source.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mb-10">
                            <button
                                onClick={openModal}
                                className="bg-primary text-black font-bold px-8 py-4 rounded-2xl hover:bg-primary/80 transition-all shadow-lg hover:-translate-y-1 active:translate-y-0"
                            >
                                Reserve
                            </button>
                            <Link
                                href="/about"
                                className="bg-white text-black font-bold px-8 py-4 rounded-2xl border-2 border-black hover:bg-gray-50 transition-all hover:-translate-y-1 active:translate-y-0"
                            >
                                About Farm
                            </Link>
                        </div>
                        
                        <p className="text-sm text-gray-400 font-bold tracking-wide">
                            Do You Have Questions About the Farm? <Link href="/contact" className="text-primary hover:underline font-bold">Contact Us</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Right corner fruit ── */}
            <motion.div 
                style={{ x: rightMoveX, y: rightMoveY }}
                className="absolute right-0 bottom-0 w-24 md:w-32 lg:w-44 pointer-events-none select-none z-10"
            >
                <img
                    src="/images/Right-Fruit-2-2-1.png"
                    alt=""
                    className="object-contain object-bottom w-full h-auto translate-x-6 md:translate-x-8"
                    aria-hidden="true"
                />
            </motion.div>

            {/* Reservation Modal Pop-up via Portal */}
            <AnimatePresence>
                {isModalOpen && (
                    <Portal>
                        <div
                            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 lg:p-6"
                            style={{ background: 'rgba(6,46,38,0.45)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
                            onClick={closeModal}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.92, y: 24 }}
                                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                onClick={e => e.stopPropagation()}
                                className="relative w-full max-w-lg rounded-[32px] overflow-hidden hide-scrollbar"
                                style={{
                                    background: 'linear-gradient(160deg, #FFFEF5 0%, #FFFBEA 35%, #FEF9D7 70%, #FDF3B0 100%)',
                                    boxShadow: '0 40px 100px rgba(0,0,0,0.18), 0 12px 40px rgba(246,176,0,0.2), 0 0 0 1.5px rgba(246,176,0,0.3)',
                                    maxHeight: '90vh',
                                    overflowY: 'auto'
                                }}
                            >
                                <style>{`
                                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                                    .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
                                `}</style>
                                <div className="absolute inset-0 rounded-[32px] pointer-events-none opacity-[0.08]"
                                    style={{ backgroundImage: 'radial-gradient(circle, #D97706 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[32px] overflow-hidden flex">
                                    <div className="flex-1" style={{ background: COLORS.heading }} />
                                    <div className="flex-1" style={{ background: COLORS.primary }} />
                                    <div className="flex-1" style={{ background: COLORS.heading }} />
                                </div>

                                <button
                                    onClick={closeModal}
                                    className="absolute top-4 right-4 z-[60] w-9 h-9 rounded-full flex items-center justify-center text-black/30 hover:text-black hover:bg-black/5 transition-all hover:scale-110"
                                >
                                    <i className="fa-solid fa-xmark text-lg"></i>
                                </button>

                                <div className="relative z-10 text-center px-8 pt-10 pb-4">
                                    <div className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.22em] px-3 py-1.5 rounded-full mb-3"
                                        style={{ backgroundColor: COLORS.primary, color: '#000' }}>
                                        📍 Plant Tour
                                    </div>
                                    <h3 className="text-3xl font-black text-black leading-tight tracking-tight mb-2">Reserve a Factory Visit</h3>
                                    <p className="text-black/45 text-sm leading-relaxed max-w-xs mx-auto">Schedule a primary tour of our processing units in Siliguri.</p>
                                    <div className="flex items-center justify-center gap-3 mt-4">
                                        <div className="h-px w-10 bg-amber-200" />
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.primary }} />
                                        <div className="h-px w-10 bg-amber-200" />
                                    </div>
                                </div>

                                <div className="relative z-10 p-8 pt-4">
                                    {submitStatus === 'success' ? (
                                        <div className="text-center py-8">
                                            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <i className="fa-solid fa-check text-4xl text-black"></i>
                                            </div>
                                            <h4 className="text-2xl font-bold text-gray-900 mb-2">Reservation Requested!</h4>
                                            <p className="text-gray-600">Our team will contact you shortly to confirm your visit date and time.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[10px] font-black text-black/40 mb-1.5 uppercase tracking-widest">Full Name *</label>
                                                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white border border-amber-200/80 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm" style={{ '--tw-ring-color': COLORS.primary } as any} />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-black/40 mb-1.5 uppercase tracking-widest">Company / Group</label>
                                                    <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full bg-white border border-amber-200/80 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm" style={{ '--tw-ring-color': COLORS.primary } as any} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[10px] font-black text-black/40 mb-1.5 uppercase tracking-widest">Email *</label>
                                                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-white border border-amber-200/80 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm" style={{ '--tw-ring-color': COLORS.primary } as any} />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-black/40 mb-1.5 uppercase tracking-widest">Phone *</label>
                                                    <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-white border border-amber-200/80 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm" style={{ '--tw-ring-color': COLORS.primary } as any} />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-black text-black/40 mb-1.5 uppercase tracking-widest">Requested Date *</label>
                                                <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full bg-white border border-amber-200/80 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm" style={{ '--tw-ring-color': COLORS.primary } as any} />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-black text-black/40 mb-1.5 uppercase tracking-widest">Purpose of Visit</label>
                                                <textarea value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })} rows={3} className="w-full bg-white border border-amber-200/80 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm resize-none" style={{ '--tw-ring-color': COLORS.primary } as any}></textarea>
                                            </div>

                                            {submitStatus === 'error' && (
                                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
                                                    Something went wrong. Please try again.
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={submitStatus === 'loading'}
                                                className="w-full text-black font-black py-4 rounded-xl transition-all shadow-md mt-2 flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                                                style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, #FFD54F 100%)`, boxShadow: '0 8px 28px rgba(246,176,0,0.3)' }}
                                            >
                                                {submitStatus === 'loading' ? 'Submitting...' : 'Submit Request'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </Portal>
                )}
            </AnimatePresence>
        </section>
    );
}