'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API } from '@/constants/api';
import { COLORS } from '@/constants/styles';
import SectionHeading from '@/components/ui/SectionHeading';

interface Testimonial {
    _id: string;
    name: string;
    city: string;
    state: string;
    description: string;
    rating?: number;
    image_url?: string;
}

// ─── Portal — renders outside all stacking contexts ─────────────────────────
function Portal({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;
    return createPortal(children, document.body);
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


export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const openForm = useCallback(() => setFormOpen(true), []);
    const closeForm = useCallback(() => { setFormOpen(false); setSubmitStatus('idle'); }, []);
    const [formData, setFormData] = useState({ name: '', city: '', state: '', description: '', rating: 5 });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Freeze body scroll when modal is open
    useEffect(() => {
        if (!formOpen) return;
        const y = window.scrollY;
        document.body.style.cssText = `overflow:hidden;position:fixed;top:-${y}px;left:0;right:0;width:100%;`;
        return () => { document.body.style.cssText = ''; window.scrollTo(0, y); };
    }, [formOpen]);

    // Escape listener
    useEffect(() => {
        if (!formOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeForm(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [formOpen, closeForm]);

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

                {/* Header - Redesigned to be "Heading Left, Buttons Right" and compact on mobile */}
                <div className="flex flex-row md:items-end justify-between mb-10 items-center gap-4">
                    <div className="text-left flex-1">
                        <span
                            className="font-bold tracking-[4px] uppercase text-[10px] md:text-xs mb-2 block"
                            style={{ color: COLORS.black }}
                        >
                            What Our Customers Say
                        </span>
                        <SectionHeading text="Customer" highlight="Testimonials" className="mb-0" />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-3">
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
                            onClick={openForm}
                            className="bg-black text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2"
                        >
                            <i className="fa-solid fa-pen-nib text-sm md:text-xs" />
                            <span className="hidden md:inline">Share Your Experience</span>
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

            {/* Popup Modal Form via Portal */}
            <AnimatePresence>
                {formOpen && (
                    <Portal>
                        <div
                            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 lg:p-6"
                            style={{ background: 'rgba(6,46,38,0.45)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
                            onClick={closeForm}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.92, y: 32 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.92, y: 32 }}
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
                                    onClick={closeForm}
                                    className="absolute top-4 right-4 z-[60] w-9 h-9 rounded-full flex items-center justify-center text-black/30 hover:text-black hover:bg-black/5 transition-all hover:scale-110"
                                >
                                    <i className="fa-solid fa-xmark text-lg"></i>
                                </button>

                                <div className="relative z-10 text-center px-8 pt-10 pb-4">
                                    <div className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.22em] px-3 py-1.5 rounded-full mb-3"
                                        style={{ backgroundColor: COLORS.primary, color: '#000' }}>
                                        💬 Wall of Fame
                                    </div>
                                    <h3 className="text-3xl font-black text-black leading-tight tracking-tight mb-2">Share Your Experience</h3>
                                    <p className="text-black/45 text-sm leading-relaxed max-w-xs mx-auto">We'd love to hear what you think! Your review helps us grow.</p>
                                    <div className="flex items-center justify-center gap-3 mt-4">
                                        <div className="h-px w-10 bg-amber-200" />
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.primary }} />
                                        <div className="h-px w-10 bg-amber-200" />
                                    </div>
                                </div>

                                <div className="relative z-10 p-8 pt-4">
                                    {submitStatus === 'success' ? (
                                        <div className="text-center py-10">
                                            <i className="fa-solid fa-circle-check text-5xl text-primary mb-3 block" />
                                            <h4 className="font-black text-2xl text-black mb-2">Thank you!</h4>
                                            <p className="text-black/50 text-sm mt-1">Your review is under review and will appear shortly.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleFormSubmit} className="space-y-5">
                                            <div>
                                                <label className="block text-[10px] font-black text-black/40 mb-2 uppercase tracking-widest">Your Rating</label>
                                                <StarPicker value={formData.rating} onChange={v => setFormData(f => ({ ...f, rating: v }))} />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                {(['name', 'city', 'state'] as const).map(field => (
                                                    <div key={field}>
                                                        <label className="block text-[10px] font-black text-black/40 mb-1.5 uppercase tracking-widest">{field} *</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={formData[field]}
                                                            onChange={e => setFormData(f => ({ ...f, [field]: e.target.value }))}
                                                            className="w-full bg-white border border-amber-200/80 rounded-xl px-3 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm"
                                                            style={{ '--tw-ring-color': COLORS.primary } as any}
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-black text-black/40 mb-1.5 uppercase tracking-widest">Your Review *</label>
                                                <textarea
                                                    required
                                                    rows={4}
                                                    value={formData.description}
                                                    onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                                                    placeholder="Tell us about your experience..."
                                                    className="w-full bg-white border border-amber-200/80 rounded-xl px-3 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm resize-none"
                                                    style={{ '--tw-ring-color': COLORS.primary } as any}
                                                />
                                            </div>

                                            {submitStatus === 'error' && (
                                                <p className="text-red-500 text-sm flex items-center gap-1.5 bg-red-50 p-3 rounded-xl border border-red-100 font-medium">
                                                    <i className="fa-solid fa-circle-exclamation" /> Something went wrong. Please try again.
                                                </p>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={submitStatus === 'loading'}
                                                className="w-full text-black font-black py-4 rounded-xl transition-all shadow-md mt-2 flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                                                style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, #FFD54F 100%)`, boxShadow: '0 8px 28px rgba(246,176,0,0.3)' }}
                                            >
                                                {submitStatus === 'loading'
                                                    ? <><i className="fa-solid fa-spinner animate-spin" /> Submitting...</>
                                                    : <><i className="fa-solid fa-paper-plane" /> Submit Review</>
                                                }
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