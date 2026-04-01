'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '@/constants/api';
import { COLORS } from '@/constants/styles';



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
            // Using the actual backend endpoint we saw in contact.js
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

    /* 
    // OLD VISIT OUR FACTORY CODE (Commented Out as requested)
    return (
        <section className="py-4 md:py-36 bg-bg-cream relative z-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-start">
                        <div className="relative w-full max-w-md">
                            <div className="rounded-2xl overflow-hidden shadow-2xl relative aspect-[4/5] w-full bg-primary/10">
                                <video
                                    ref={videoRef}
                                    muted
                                    loop
                                    playsInline
                                    preload="none"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 md:top-[10%] md:left-auto md:right-0 md:translate-x-[50%] w-20 h-20 md:w-24 md:h-24 z-10 hover:scale-105 transition-transform duration-300">
                                <div className="relative w-full h-full">
                                    <Image
                                        src="/images/cc-Logo-01-1.png"
                                        alt="Crunchy Cashews Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                            Visit Our Factory
                        </h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            The process of harvesting, roasting, and grading premium cashews in equipped chambers with constant
                            quality control takes immense precision. We show curious visitors this kingdom of cashews during a
                            guided tour of our specialized factory.
                        </p>
                        <p className="text-gray-600 mb-10 leading-relaxed">
                            You will also have the opportunity to visit our processing units, where you can familiarize yourself
                            with the interesting process of grading and sorting. And at the tasting session, you will feel the
                            authentic crunch, and you will also bring home unique delicacies directly from the source.
                        </p>
                        <div className="flex flex-wrap items-center gap-4 mb-10 w-full md:w-auto">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-primary text-white font-bold px-8 py-4 rounded-full hover:bg-primary-light transition-colors shadow-lg"
                            >
                                Reserve
                            </button>
                            <Link
                                href="/about"
                                className="bg-transparent text-gray-900 font-bold px-8 py-4 rounded-full border-2 border-primary hover:bg-primary/5 transition-colors"
                            >
                                About Farm
                            </Link>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                            Do You Have Questions About the Farm? <Link href="/contact" className="text-primary hover:underline font-bold">Contact Us</Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
    */

    return (
        <section className="py-10 md:py-12 bg-bg-cream relative z-20 overflow-hidden">

            {/* ── Left corner fruit (yellow/green cashew) ── */}
            <div className="absolute left-0 bottom-0 w-28 md:w-40 lg:w-52 xl:w-60 pointer-events-none select-none z-10">
                <Image
                    src="/images/Fruit-3.png"
                    alt=""
                    width={200}
                    height={200}
                    className="object-contain object-bottom w-full h-auto -translate-x-6 md:-translate-x-8"
                    aria-hidden="true"
                />
            </div>

            {/* ── Right corner fruit (red cashew) ── */}
            <div className="absolute right-0 bottom-0 w-28 md:w-40 lg:w-52 xl:w-60 pointer-events-none select-none z-10">
                <Image
                    src="/images/Right-Fruit-2-2-1.png"
                    alt=""
                    width={200}
                    height={200}
                    className="object-contain object-bottom w-full h-auto translate-x-6 md:translate-x-8"
                    aria-hidden="true"
                />
            </div>

            <div className="max-w-5xl mx-auto px-6 text-center">
                <div className="flex flex-col items-center text-center mb-10">
                    <span className="text-black font-bold tracking-[4px] uppercase text-xs mb-3 block">Our Production Facility</span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black tracking-tight mb-0"
                        style={{ color: COLORS.heading }}
                    >
                        About Our <span className="relative inline-block">
                            <span className="relative z-10">Factory</span>
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: '80%' }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="absolute bottom-1 md:bottom-2 inset-x-1 h-3 md:h-4 -z-0 opacity-80"
                                style={{
                                    backgroundColor: COLORS.highlight,
                                    borderRadius: '5px',
                                    height: '30%',
                                    transition: 'width 0.8s 0.5s ease',
                                }}
                            />
                        </span>
                    </motion.h2>
                </div>

                {/* 3. Video below heading */}
                <div className="relative w-full max-w-4xl mx-auto mb-10 group">
                    <div className="rounded-[20px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative aspect-video bg-primary/5">
                        <video
                            ref={videoRef}
                            muted
                            loop
                            playsInline
                            preload="none"
                            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                        {/* Floating Logo Overlay
                        <div className="absolute bottom-8 right-8 w-16 h-16 md:w-20 md:h-20 drop-shadow-2xl">
                            <Image
                                src="/images/cc-Logo-01-1.png"
                                alt="Crunchy Cashews Logo"
                                fill
                                className="object-contain"
                            />
                        </div> */}
                    </div>
                </div>

                {/* 4. Content below video with centered text */}
                <div className="max-w-3xl mx-auto">
                    <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed font-medium">
                        At Crunchy Cashews, precision meets tradition. Our factory is equipped with state-of-the-art
                        roasting and grading chambers where every single nut undergoes rigorous quality control.
                    </p>

                    <p className="text-gray-500 mb-12 leading-relaxed">
                        We take pride in our transparent process. From the initial harvesting to the final vacuum-sealed
                        packaging, we ensure that the authentic crunch and premium quality are preserved. Our facility
                        is a testament to our commitment to delivering the finest cashews directly from the source to your doorstep.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-5">
                        <button
                            onClick={openModal}
                            className="w-full sm:w-auto bg-primary text-black font-bold px-10 py-4 rounded-2xl hover:bg-primary/80 transition-all shadow-2xl hover:-translate-y-1 active:translate-y-0"
                        >
                            Reserve a Tour
                        </button>
                        <Link
                            href="/about"
                            className="w-full sm:w-auto bg-white text-black font-bold px-10 py-4 rounded-2xl border-2 border-black hover:bg-gray-50 transition-all hover:-translate-y-1 active:translate-y-0"
                        >
                            Learn More
                        </Link>
                    </div>

                    <p className="text-sm text-gray-400 font-bold tracking-wide">
                        INTERESTED IN A BULK ORDER? <Link href="/bulk" className="text-primary hover:underline ml-1">GET A QUOTE</Link>
                    </p>
                </div>
            </div>

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
                                {/* Dot texture */}
                                <div className="absolute inset-0 rounded-[32px] pointer-events-none opacity-[0.08]"
                                    style={{ backgroundImage: 'radial-gradient(circle, #D97706 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                                {/* Top accent stripe */}
                                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[32px] overflow-hidden flex">
                                    <div className="flex-1" style={{ background: COLORS.heading }} />
                                    <div className="flex-1" style={{ background: COLORS.primary }} />
                                    <div className="flex-1" style={{ background: COLORS.heading }} />
                                </div>

                                {/* Close button */}
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