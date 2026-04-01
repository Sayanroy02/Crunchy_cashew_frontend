'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { API_BASE } from '@/constants/api';
import { COLORS } from '@/constants/styles';


export default function AboutFactory() {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                                whileInView={{ width: '100%' }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="absolute bottom-1 md:bottom-2 left-0 h-3 md:h-4 -z-0 opacity-80"
                                style={{ backgroundColor: COLORS.highlight }}
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
                            onClick={() => setIsModalOpen(true)}
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

            {/* Reservation Modal Pop-up */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
                        <div className="bg-primary p-6 text-center relative">
                            <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>Reserve a Factory Visit</h3>
                            <p className="text-white/80 text-sm">Schedule a primary tour of our processing units.</p>
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-white/60 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </div>

                        <div className="p-8">
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
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name *</label>
                                            <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Company / Group</label>
                                            <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email *</label>
                                            <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone *</label>
                                            <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Requested Date *</label>
                                        <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Purpose of Visit</label>
                                        <textarea value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"></textarea>
                                    </div>

                                    {submitStatus === 'error' && (
                                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
                                            Something went wrong. Please try again.
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={submitStatus === 'loading'}
                                        className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-light transition-colors shadow-md mt-2"
                                    >
                                        {submitStatus === 'loading' ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}