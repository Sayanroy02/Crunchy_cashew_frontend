'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { COLORS } from '@/constants/styles';
import { API } from '@/constants/api';
import SectionHeading from '@/components/ui/SectionHeading';

// ─── Constants ────────────────────────────────────────────────────────────────

const grades = [
    { id: 'ww180', name: 'WW 180', img: '/images/WW180-min.png' },
    { id: 'ww320', name: 'WW 320', img: '/images/WW320-min.png' },
    { id: 'WS', name: 'White Splits', img: '/images/SS-min.png' },
    { id: 'lwp', name: 'LWP', img: '/images/LWP-min.png' },
];

const ALL_GRADE_SUGGESTIONS = [
    { label: 'WW 180', tag: 'Jumbo', color: '#D97706', text: 'WW 180 (Jumbo) – ~160–180 nuts/lb, Ghana/Ivory Coast/Tanzania' },
    { label: 'WW 240', tag: 'Large', color: '#D97706', text: 'WW 240 (Large) – ~220–240 nuts/lb, Ghana/Ivory Coast/Tanzania' },
    { label: 'WW 320', tag: 'Popular', color: '#D97706', text: 'WW 320 (Most Popular) – ~300–320 nuts/lb, Multi-origin' },
    { label: 'WW 400', tag: 'Value', color: '#D97706', text: 'WW 400 (Value) – ~380–400 nuts/lb, Guinea Bissau/Senegal' },
    { label: 'SW 240', tag: 'Scorched', color: '#6B7280', text: 'SW 240 (Scorched Large) – ~220–240 nuts/lb, for roasting/coating' },
    { label: 'SW 320', tag: 'Scorched', color: '#6B7280', text: 'SW 320 (Scorched Popular) – ~300–320 nuts/lb, all food applications' },
    { label: 'SW 400', tag: 'Scorched', color: '#6B7280', text: 'SW 400 (Processing) – ~380–400 nuts/lb, slicing/dicing/grinding' },
    { label: 'White Splits', tag: 'Form', color: '#0A5246', text: 'White Splits – halved wholes, ~350–360 pcs/250g, topping/coating' },
    { label: 'Large White Pieces', tag: 'Form', color: '#0A5246', text: 'Large White Pieces – quartered, topping/garnishing' },
    { label: 'Small White Pieces', tag: 'Form', color: '#0A5246', text: 'Small White Pieces – 1/8th pieces, sauce/curry thickener' },
    { label: 'Scorched Splits', tag: 'Form', color: '#6B7280', text: 'Scorched Splits – processing/coating' },
    { label: 'Scorched Pieces', tag: 'Form', color: '#6B7280', text: 'Scorched Pieces – further processing applications' },
    { label: 'Small Scorched Pieces', tag: 'Form', color: '#6B7280', text: 'Small Scorched Pieces – fine processing' },
];

const TRUST_BADGES = [
    {
        text: 'Minimum Order Quantity',
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

// ─── Portal — renders outside all stacking contexts onto document.body ────────
// This is critical: the parallax layout uses `transform: translateZ(0)` on the
// scroll container, which creates a new stacking context and traps `position:fixed`
// children. Portal bypasses this entirely.

function Portal({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;
    return createPortal(children, document.body);
}

// ─── Grade Requirements Input ─────────────────────────────────────────────────

function GradeRequirementsInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const [focused, setFocused] = useState(false);
    const [query, setQuery] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setFocused(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
        setQuery(e.target.value.split(/[,\n]/).at(-1)!.trim().toLowerCase());
    };

    const filtered = query.length === 0
        ? ALL_GRADE_SUGGESTIONS
        : ALL_GRADE_SUGGESTIONS.filter(s =>
            s.label.toLowerCase().includes(query) ||
            s.tag.toLowerCase().includes(query) ||
            s.text.toLowerCase().includes(query)
        );

    const appendGrade = (text: string) => {
        const lastIdx = Math.max(value.lastIndexOf(','), value.lastIndexOf('\n'));
        onChange((lastIdx === -1 ? text : value.slice(0, lastIdx + 1) + ' ' + text) + ', ');
        setQuery('');
    };

    return (
        <div ref={wrapperRef} className="relative">
            <textarea rows={3} value={value} onChange={handleChange} onFocus={() => setFocused(true)}
                placeholder="Type a grade (e.g. WW 320, Splits) or scroll suggestions..."
                className="w-full bg-amber-50/60 border border-amber-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                style={{ '--tw-ring-color': COLORS.primary } as React.CSSProperties} />
            {focused && filtered.length > 0 && (
                <div className="mt-2 p-3 bg-white border border-amber-100 rounded-xl shadow-xl max-h-44 overflow-y-auto z-50 relative">
                    <p className="text-[9px] uppercase tracking-widest text-amber-600 font-bold mb-2 px-1">
                        {query ? `Matching "${query}"` : 'All grades — click to add'}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {filtered.map(s => (
                            <button key={s.label} type="button"
                                onMouseDown={e => { e.preventDefault(); appendGrade(s.text); }}
                                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer"
                                style={{ borderColor: s.color + '44', background: s.color + '0D', color: s.color }}>
                                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: s.color }}>{s.tag}</span>
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Bulk Inquiry Popup ───────────────────────────────────────────────────────

export function BulkInquiryPopup({ onClose }: { onClose: () => void }) {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', volume: '', requirements: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // Freeze body scroll — works correctly because this renders directly on <body> via Portal
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

    const setField = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setFormData(p => ({ ...p, [k]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch(API.CONTACT_BULK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    message: `BULK ORDER INQUIRY\nCompany: ${formData.company}\nExpected Volume: ${formData.volume}\nRequirements: ${formData.requirements}`,
                }),
            });
            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', phone: '', company: '', volume: '', requirements: '' });
                setTimeout(() => setStatus('idle'), 4000);
            } else { setStatus('error'); }
        } catch { setStatus('error'); }
    };

    const inputCls = "w-full bg-white border border-amber-200/80 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm";
    const inputStyle = { '--tw-ring-color': COLORS.primary } as React.CSSProperties;

    return (
        <Portal>
            <div
                className="fixed inset-0 flex items-center justify-center px-4 py-6"
                style={{ zIndex: 99999, backgroundColor: 'rgba(10,82,70,0.45)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 24 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    onClick={e => e.stopPropagation()}
                    className="relative w-full max-w-xl rounded-[28px] hide-scrollbar"
                    style={{
                        background: 'linear-gradient(160deg, #FFFEF5 0%, #FFFBEA 35%, #FEF9D7 70%, #FDF3B0 100%)',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.18), 0 12px 40px rgba(246,176,0,0.2), 0 0 0 1.5px rgba(246,176,0,0.3)',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                    }}
                >
                    <style>{`
                        .hide-scrollbar::-webkit-scrollbar { display: none; }
                        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
                    `}</style>
                    {/* Dot texture */}
                    <div className="absolute inset-0 rounded-[28px] pointer-events-none overflow-hidden"
                        style={{ backgroundImage: 'radial-gradient(circle, #D9770610 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                    {/* Top accent stripe */}
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[28px] overflow-hidden">
                        <div className="flex h-full">
                            <div className="flex-1" style={{ background: COLORS.green }} />
                            <div className="flex-1" style={{ background: COLORS.primary }} />
                            <div className="flex-1" style={{ background: COLORS.green }} />
                        </div>
                    </div>

                    {/* Close button */}
                    <button onClick={onClose} aria-label="Close"
                        className="absolute top-4 right-4 z-[60] w-8 h-8 rounded-full flex items-center justify-center text-black/35 hover:text-black hover:bg-black/05 transition-all hover:scale-110">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Header */}
                    <div className="relative z-10 text-center px-8 pt-8 pb-5">
                        <div className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.22em] px-3 py-1.5 rounded-full mb-3"
                            style={{ backgroundColor: COLORS.primary, color: '#000' }}>
                            🏭 Factory Direct
                        </div>
                        <h2 className="text-2xl md:text-[1.75rem] font-black text-black leading-tight tracking-tight">
                            Place a Bulk Inquiry
                        </h2>
                        <p className="text-black/45 text-[13px] mt-1.5 leading-relaxed">
                            Our B2B team responds within <span className="font-bold text-black/60">24 hours</span> with a tailored quote.
                        </p>
                        <div className="flex items-center justify-center gap-3 mt-4">
                            <div className="h-px w-12 bg-amber-200" />
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.primary }} />
                            <div className="h-px w-12 bg-amber-200" />
                        </div>
                    </div>

                    {/* Form */}
                    <div className="relative z-10 px-8 pb-8">
                        {status === 'success' ? (
                            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
                                    className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-5 shadow-lg"
                                    style={{ background: `linear-gradient(135deg, ${COLORS.primary}, #FFD54F)` }}>✓</motion.div>
                                <h3 className="font-black text-2xl text-black mb-2">Inquiry Submitted!</h3>
                                <p className="text-black/50 text-sm max-w-xs mx-auto leading-relaxed">
                                    We've received your request. Our team will reach out shortly.
                                </p>
                                <button onClick={() => setStatus('idle')} className="mt-5 text-xs font-bold underline underline-offset-2" style={{ color: COLORS.green }}>
                                    Submit another request →
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div>
                                        <label className="block text-[10px] font-black text-black/40 mb-1.5 uppercase tracking-widest">Full Name *</label>
                                        <input required type="text" value={formData.name} onChange={setField('name')} className={inputCls} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-black/40 mb-1.5 uppercase tracking-widest">Email *</label>
                                        <input required type="email" value={formData.email} onChange={setField('email')} className={inputCls} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-black/40 mb-1.5 uppercase tracking-widest">Phone *</label>
                                        <input required type="tel" value={formData.phone} onChange={setField('phone')} className={inputCls} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-black/40 mb-1.5 uppercase tracking-widest">Company</label>
                                        <input type="text" value={formData.company} onChange={setField('company')} className={inputCls} style={inputStyle} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-black/40 mb-1.5 uppercase tracking-widest">Monthly Volume *</label>
                                    <select required value={formData.volume} onChange={setField('volume')} className={inputCls} style={inputStyle}>
                                        <option value="">Select volume range</option>
                                        <option value="5-10">5 – 10 kg</option>
                                        <option value="10-50">10 – 50 kg</option>
                                        <option value="50-100">50 – 100 kg</option>
                                        <option value="100-500">100 – 500 kg</option>
                                        <option value="500-1000">500 – 1,000 kg</option>
                                        <option value="1000+">1,000+ kg</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-black/40 mb-1.5 uppercase tracking-widest">Grades / Requirements</label>
                                    <GradeRequirementsInput value={formData.requirements} onChange={v => setFormData(p => ({ ...p, requirements: v }))} />
                                    <p className="text-[10px] text-amber-600/60 mt-1.5">💡 Click a grade chip to add it, or type to filter</p>
                                </div>
                                {status === 'error' && (
                                    <p className="text-red-600 text-xs font-medium bg-red-50 p-3 rounded-xl border border-red-100">
                                        ⚠ Failed to submit. Please try again.
                                    </p>
                                )}
                                <button type="submit" disabled={status === 'loading'}
                                    className="w-full font-black text-sm py-4 rounded-2xl transition-all flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 mt-1"
                                    style={{ background: `linear-gradient(135deg, ${COLORS.green} 0%, #0B6B58 100%)`, color: '#fff', boxShadow: '0 8px 28px rgba(10,82,70,0.3)' }}>
                                    {status === 'loading' ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Sending inquiry...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                                            Submit Wholesale Inquiry
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </Portal>
    );
}

// ─── Grade Card ───────────────────────────────────────────────────────────────

function GradeCard({ grade }: { grade: typeof grades[0] }) {
    return (
        <div className="grade-card-link flex-shrink-0 snap-center flex flex-col items-center w-[160px] md:w-auto overflow-visible isolate">
            <div className="grade-circle rounded-full flex items-center justify-center relative z-20"
                style={{ width: '100%', aspectRatio: '1 / 1', transition: 'transform 0.3s ease' }}>
                <img src={grade.img} alt={grade.name} className="w-full h-full object-cover scale-[1.05]"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = '/images/crunchy-cashews-product.png'; }} />
            </div>
            <span className="text-center font-bold relative z-10 -mt-2 md:-mt-10"
                style={{ fontSize: '1.3rem', lineHeight: '1.2', color: COLORS.black }}>
                {grade.name}
            </span>
        </div>
    );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CTABanner({ onOpenPopup }: { onOpenPopup: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.55 }}
            className="mt-10 relative rounded-[28px] overflow-hidden"
            style={{
                background: COLORS.heading,
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
        >
            {/* Top Right Decorative Pattern — Stylized Grid */}
            <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-[0.08] translate-x-1/4 -translate-y-1/4 select-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                }} />

            {/* Bottom Left Decorative Pattern — Concentric Circles */}
            <div className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none opacity-[0.06] -translate-x-1/3 translate-y-1/3 select-none">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="absolute inset-0 rounded-full border border-white"
                        style={{ transform: `scale(${0.2 * i})` }} />
                ))}
            </div>

            {/* Subtle Gradient Overlay for Depth */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)' }} />

            {/* Hanging Cashew Tree Image */}
            <div className="absolute -right-8 -top-12 bottom-0 w-1/3 pointer-events-none z-10 hidden md:block group-hover:scale-105 transition-transform duration-700">
                <img
                    src="/images/Cashew-In-Tree.png"
                    alt=""
                    className="w-full h-full object-contain object-right transform rotate-[-5deg] scale-125"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-7 md:px-10 py-8 md:py-9">

                {/* Left: Pitch */}
                <div className="flex-1 text-center md:text-left">
                    {/* <div className="inline-flex items-center gap-2 mb-3">
                        <span className="h-px w-5 bg-emerald-400/60" /> */}
                    {/* <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.22em]">Factory Direct · Siliguri</span> */}
                    {/* </div> */}

                    <h3 className="text-[1.45rem] md:text-[1.75rem] font-black text-white leading-tight tracking-tight mb-2.5">
                        Looking for a reliable,{' '}
                        <span style={{ color: COLORS.primary }}>factory-direct</span>{' '}
                        supplier?
                    </h3>

                    <p className="text-white/80 text-sm leading-relaxed max-w-[620px] mb-4">
                        Cut out the middlemen. Get consistent grading, custom packaging, and volume pricing shipped straight from our Yu Nut Processing Industry facility in Siliguri.
                    </p>

                    {/* Trust badges */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {TRUST_BADGES.map(b => (
                            <span key={b.text}
                                className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                                style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.12)' }}>
                                <span className="text-emerald-400">{b.icon}</span>
                                {b.text}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right: CTA buttons — horizontal */}
                <div className="flex flex-col gap-3 w-full md:w-auto flex-shrink-0 justify-center md:justify-center md:-translate-x-16 md:translate-y-2 relative z-20">
                    {/* Top — Download B2B Catalog — 3D glass */}
                    <motion.a
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        href="/document/Cashew-Catalogue.pdf"
                        download
                        className="font-bold px-6 py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                        style={{
                            background: 'linear-gradient(160deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 100%)',
                            color: 'rgba(255,255,255,0.92)',
                            border: '1.5px solid rgba(255,255,255,0.35)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.12)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3" />
                        </svg>
                        Download B2B Catalog
                    </motion.a>

                    {/* Bottom — Request Custom Quote — yellow solid */}
                    <motion.button
                        whileHover={{ scale: 1.04, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onOpenPopup}
                        className="group font-black px-6 py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                        style={{
                            background: `linear-gradient(135deg, ${COLORS.primary} 0%, #FFD54F 100%)`,
                            color: '#000',
                            boxShadow: '0 2px 12px rgba(246,176,0,0.45)',
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                        </svg>
                        Request Custom Quote
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="group-hover:translate-x-0.5 transition-transform">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </motion.button>

                </div>
            </div>
        </motion.div>
    );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function BulkOrderCard() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Parallax logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 50, damping: 20 });
    const springY = useSpring(y, { stiffness: 50, damping: 20 });

    // Move slightly in opposite direction
    const moveX = useTransform(springX, [-500, 500], [20, -20]);
    const moveY = useTransform(springY, [-500, 500], [20, -20]);

    const openPopup = useCallback(() => setIsPopupOpen(true), []);
    const closePopup = useCallback(() => setIsPopupOpen(false), []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
    };

    return (
        <section
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            className="py-4 md:py-6 bg-bg-cream relative overflow-hidden"
        >
            {/* Decorative Fruits with Parallax */}
            <motion.div
                style={{ x: moveX, y: moveY }}
                className="absolute top-[-5%] right-[-3%] w-[150px] md:w-[220px] h-auto pointer-events-none z-[11] hidden sm:block"
            >
                <img
                    src="/images/Right-Fruit-2-2-1.png"
                    alt=""
                    className="w-full h-auto drop-shadow-2xl brightness-110"
                />
            </motion.div>

            <motion.div
                style={{ x: moveX, y: moveY }}
                className="absolute top-[8%] left-[-4%] w-[120px] md:w-[180px] h-auto pointer-events-none z-[11] hidden sm:block rotate-[-15deg]"
            >
                <img
                    src="/images/Fruit-3-1.png"
                    alt=""
                    className="w-full h-auto drop-shadow-2xl brightness-110"
                />
            </motion.div>


            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* Header */}
                <div className="text-center relative z-20">
                    <span className="font-bold tracking-widest uppercase text-xs mb-2 block" style={{ color: COLORS.black }}>
                        Export-Quality B2B
                    </span>
                    <SectionHeading text="Global Supply &" highlight="Bulk Orders" />
                    <p className="text-black/60 max-w-2xl mx-auto text-sm md:text-base mt-2">
                        Partner with us for export-grade cashews. We ensure stringent quality control for every batch, with reliable shipping across borders and beyond.
                    </p>
                </div>

                {/* Grade Cards — mobile scroll */}
                <div className="flex md:hidden overflow-x-auto pb-4 gap-4 snap-x snap-mandatory px-2 hide-scrollbar -mt-4">
                    {grades.map(g => <GradeCard key={g.id} grade={g} />)}
                </div>

                {/* Grade Cards — desktop grid */}
                <div className="hidden md:grid grid-cols-4 gap-4 mb-2 -mt-6 md:-mt-10 relative z-10">
                    {grades.map(g => <GradeCard key={g.id} grade={g} />)}
                </div>

                <CTABanner onOpenPopup={openPopup} />
            </div>

            {/* Popup via Portal — bypasses transform stacking context */}
            {isPopupOpen && <BulkInquiryPopup onClose={closePopup} />}

            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
                .grade-card-link:hover .grade-circle { transform: scale(1.09); }
            `}</style>
        </section>
    );
}