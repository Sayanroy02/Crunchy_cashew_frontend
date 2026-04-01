'use client';

import React, { useEffect, useRef, useState } from 'react';
import { API } from '@/constants/api';
import { COLORS } from '@/constants/styles';

interface Testimonial {
    _id: string;
    name: string;
    city: string;
    state: string;
    description: string;
    rating?: number;
    image_url?: string;
}

function StarRating({ rating = 5 }: { rating?: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <i
                    key={star}
                    className={`text-sm ${star <= rating ? 'fa-solid fa-star' : 'fa-regular fa-star text-gray-300'}`}
                    style={star <= rating ? { color: COLORS.amber } : {}}
                />
            ))}
        </div>
    );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => onChange(star)}
                    onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
                    className="text-2xl transition-transform hover:scale-110">
                    <i
                        className={`${(hover || value) >= star ? 'fa-solid fa-star' : 'fa-regular fa-star text-gray-300'}`}
                        style={(hover || value) >= star ? { color: COLORS.amber } : {}}
                    />
                </button>
            ))}
        </div>
    );
}

function TestimonialsHeading() {
    const ref = useRef<HTMLHeadingElement>(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold: 0.3 });
        ob.observe(el);
        return () => ob.disconnect();
    }, []);
    return (
        <h2
            ref={ref}
            className="text-4xl md:text-5xl font-black tracking-tight text-center"
            style={{
                color: COLORS.heading,
                opacity: vis ? 1 : 0,
                transform: vis ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 0.6s 0.1s ease, transform 0.6s 0.1s ease',
            }}
        >
            Customer <span className="relative inline-block lg:mt-0">
                <span className="relative z-10">Testimonials</span>
                <span
                    className="absolute bottom-1 md:bottom-2 left-0 h-3 md:h-4 -z-0 opacity-80"
                    style={{
                        backgroundColor: COLORS.highlight,
                        width: vis ? '100%' : '0%',
                        transition: 'width 0.8s 0.5s ease',
                    }}
                />
            </span>
        </h2>
    );
}

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', city: '', state: '', description: '', rating: 5 });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch(API.TESTIMONIALS)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data) && data.length > 0) setTestimonials(data); })
            .catch(err => console.error('Failed to fetch testimonials', err));
    }, []);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus('loading');
        try {
            const res = await fetch(API.TESTIMONIALS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setSubmitStatus('success');
                setTimeout(() => {
                    setFormOpen(false);
                    setFormData({ name: '', city: '', state: '', description: '', rating: 5 });
                    setSubmitStatus('idle');
                }, 3000);
            } else setSubmitStatus('error');
        } catch { setSubmitStatus('error'); }
    };

    const scroll = (dir: 'left' | 'right') => {
        if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
    };

    return (
        <section className="py-10 md:py-12 bg-bg-cream overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                {/* Header - Redesigned to be centered */}
                <div className="flex flex-col items-center text-center mb-16">
                    <span
                        className="font-bold tracking-[4px] uppercase text-xs mb-3 block"
                        style={{ color: COLORS.black }}
                    >
                        What Our Customers Say
                    </span>
                    <TestimonialsHeading />

                    <div className="mt-8 flex flex-wrap justify-center items-center gap-6">
                        <div className="flex items-center gap-3">
                            <button onClick={() => scroll('left')}
                                className="w-12 h-12 rounded-full border-2 bg-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm"
                                style={{ borderColor: COLORS.primary }}
                            >
                                <i className="fa-solid fa-chevron-left text-sm" style={{ color: COLORS.primary }} />
                            </button>
                            <button onClick={() => scroll('right')}
                                className="w-12 h-12 rounded-full border-2 bg-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm"
                                style={{ borderColor: COLORS.primary }}
                            >
                                <i className="fa-solid fa-chevron-right text-sm" style={{ color: COLORS.primary }} />
                            </button>
                        </div>

                        <button
                            onClick={() => setFormOpen(true)}
                            className="bg-black text-white px-8 py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2"
                        >
                            <i className="fa-solid fa-pen-nib text-xs" />
                            Share Your Experience
                        </button>
                    </div>
                </div>

                {/* Horizontal Scroll Row */}
                {testimonials.length > 0 ? (
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        {testimonials.map(t => (
                            <div
                                key={t._id}
                                className="flex-shrink-0 w-72 md:w-80 snap-start flex flex-col rounded-[32px] overflow-hidden border border-white/60 group"
                                style={{
                                    background: 'rgba(255,255,255,0.85)',
                                    backdropFilter: 'blur(12px)',
                                    WebkitBackdropFilter: 'blur(12px)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
                                }}
                            >
                                {t.image_url ? (
                                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                                        <img
                                            src={t.image_url}
                                            alt={`Review by ${t.name}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ) : (
                                    <div className="p-6 pb-0 flex items-start justify-between">
                                        <div
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-black font-black text-xl shadow-inner"
                                            style={{ backgroundColor: COLORS.primaryLight }}
                                        >
                                            {t.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                                            <i className="fa-solid fa-quote-right text-black/20" />
                                        </div>
                                    </div>
                                )}

                                <div className="p-6 pt-5 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <StarRating rating={t.rating} />
                                    </div>
                                    <p className={`text-black font-medium leading-relaxed italic ${t.image_url ? 'line-clamp-3' : 'line-clamp-4'}`}>
                                        "{t.description}"
                                    </p>
                                    <div className="mt-auto pt-5 border-t border-black/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-black font-black text-sm tracking-tight">{t.name}</p>
                                            <p className="text-black/40 text-[10px] font-bold uppercase tracking-wider mt-0.5">{t.city}, {t.state}</p>
                                        </div>
                                        {!t.image_url && <i className="fa-solid fa-circle-check text-primary text-xs opacity-40" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-black/40">
                        <i className="fa-regular fa-comment-dots text-5xl mb-4 block" />
                        <p className="font-medium">No reviews yet — be the first to share!</p>
                    </div>
                )}
            </div>

            {/* Popup Modal Form */}
            {formOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
                    onClick={() => { setFormOpen(false); setSubmitStatus('idle'); }}
                >
                    <div
                        className="relative w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl"
                        style={{
                            background: 'rgba(255,255,255,0.92)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.9)',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => { setFormOpen(false); setSubmitStatus('idle'); }}
                            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/8 hover:bg-black/15 text-black/60 flex items-center justify-center transition-all"
                        >
                            <i className="fa-solid fa-xmark text-base" />
                        </button>

                        <h3 className="text-xl font-black text-black mb-1">Share Your Experience</h3>
                        <p className="text-black/40 text-sm mb-6">We'd love to hear what you think!</p>

                        {submitStatus === 'success' ? (
                            <div className="text-center py-10">
                                <i className="fa-solid fa-circle-check text-5xl text-primary mb-3 block" />
                                <p className="font-bold text-lg text-black">Thank you!</p>
                                <p className="text-black/50 text-sm mt-1">Your review is under review and will appear shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-black/70 block mb-2">Your Rating</label>
                                    <StarPicker value={formData.rating} onChange={v => setFormData(f => ({ ...f, rating: v }))} />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {(['name', 'city', 'state'] as const).map(field => (
                                        <div key={field}>
                                            <label className="text-sm font-bold text-black/70 block mb-1.5 capitalize">{field}</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData[field]}
                                                onChange={e => setFormData(f => ({ ...f, [field]: e.target.value }))}
                                                className="w-full bg-black/5 border border-black/10 rounded-xl px-3 py-2.5 text-sm text-black focus:outline-none focus:bg-white transition-all"
                                                onFocus={(e) => e.target.style.borderColor = COLORS.amber}
                                                onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-black/70 block mb-1.5">Your Review</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description}
                                        onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                                        placeholder="Tell us about your experience..."
                                        className="w-full bg-black/5 border border-black/10 rounded-xl px-3 py-2.5 text-sm text-black focus:outline-none focus:bg-white transition-all resize-none"
                                        onFocus={(e) => e.target.style.borderColor = COLORS.amber}
                                        onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
                                    />
                                </div>

                                {submitStatus === 'error' && (
                                    <p className="text-red-500 text-sm flex items-center gap-1.5">
                                        <i className="fa-solid fa-circle-exclamation" /> Something went wrong. Please try again.
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitStatus === 'loading'}
                                    className="w-full text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg"
                                    style={{ backgroundColor: COLORS.primary, boxShadow: `0 10px 15px -3px ${COLORS.primary}40` }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                >
                                    {submitStatus === 'loading'
                                        ? <><i className="fa-solid fa-spinner animate-spin" /> Submitting...</>
                                        : <><i className="fa-solid fa-paper-plane" /> Submit Review</>
                                    }
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}