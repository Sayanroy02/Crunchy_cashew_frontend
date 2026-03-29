'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { API_BASE } from '@/constants/api';


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
                    el.play().catch(() => {});
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

    return (
        <section className="py-4 md:py-36 bg-bg-cream relative z-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left Side - Image with Floating Badge */}
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

                            {/* Floating Badge (Logo) */}
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

                    {/* Right Side - Content */}
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
