'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { API } from '@/constants/api';

// Dynamically import Lottie — prevents SSR crash / loading hang
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

/* ─── Types ─── */
type Tab = 'general' | 'visit';
type Status = 'idle' | 'loading' | 'success' | 'error';

/* ══════ SVG Icons ══════ */
const IconLocation = () => (
    <svg className="w-5 h-5 text-[#FBB21B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const IconPhone = () => (
    <svg className="w-5 h-5 text-[#FBB21B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);
const IconEmail = () => (
    <svg className="w-5 h-5 text-[#FBB21B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);
const IconSend = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);
const IconCal = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
const IconCheck = () => (
    <svg className="w-6 h-6 text-[#FBB21B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);
const IconWarn = () => (
    <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
);
const IconInfo = () => (
    <svg className="w-4 h-4 text-[#0A5246]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const IconChevronDown = () => (
    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

/* ══════ Reusable Field ══════ */
interface FieldProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    required?: boolean;
    as?: 'textarea' | 'select';
    options?: { value: string; label: string }[];
    placeholder?: string;
}

function Field({ label, name, type = 'text', value, onChange, required, as, options, placeholder }: FieldProps) {
    const inputClass =
        'w-full bg-[#f4f9f7] border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-[#1a1f1c] font-medium outline-none focus:border-[#0A5246] focus:ring-2 focus:ring-[#0A5246]/10 transition-all duration-200 placeholder:text-gray-300';

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[#0A5246] tracking-widest uppercase ml-0.5">
                {label}{required && <span className="text-[#FBB21B] ml-0.5">*</span>}
            </label>

            {as === 'textarea' ? (
                <textarea
                    name={name} value={value} rows={5} required={required}
                    onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
                    placeholder={placeholder ?? 'Write your message here…'}
                    className={`${inputClass} resize-none`}
                />
            ) : as === 'select' ? (
                <div className="relative">
                    <select
                        name={name} value={value} required={required}
                        onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
                        className={`${inputClass} appearance-none cursor-pointer`}
                    >
                        <option value="" disabled>Select one…</option>
                        {options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <IconChevronDown />
                </div>
            ) : (
                <input
                    name={name} type={type} value={value} required={required}
                    onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
                    placeholder={placeholder ?? (type === 'date' ? '' : `Enter ${label.toLowerCase()}`)}
                    className={inputClass}
                />
            )}
        </div>
    );
}

/* ══════ Sidebar info row ══════ */
function InfoRow({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-[#FBB21B] text-[10px] font-bold tracking-widest uppercase mb-0.5">{title}</p>
                {lines.map((l, i) => <p key={i} className="text-white/70 text-sm leading-relaxed">{l}</p>)}
            </div>
        </div>
    );
}

/* ══════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════ */
export default function ContactPage() {
    const [lottieData, setLottieData] = useState<object | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('general');
    const [status, setStatus] = useState<Status>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const [form, setForm] = useState({ name: '', email: '', phone: '', enquiry_type: '', message: '' });
    const [visitForm, setVisitForm] = useState({ name: '', email: '', company: '', date: '' });

    // Load lottie separately — never blocks page render
    useEffect(() => {
        fetch('/images/lottie-files/Awareness-campaign-social-marketing.json')
            .then(r => r.json())
            .then(setLottieData)
            .catch(() => { /* silently fail */ });
    }, []);

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const onVisitChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setVisitForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const switchTab = (tab: Tab) => { setActiveTab(tab); setStatus('idle'); setErrorMsg(''); };

    const submitGeneral = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch(API.CONTACT_ENQUIRY, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error('Could not send. Please try again.');
            setStatus('success');
            setForm({ name: '', email: '', phone: '', enquiry_type: '', message: '' });
        } catch (err: any) { setStatus('error'); setErrorMsg(err.message); }
    };

    const submitVisit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch(API.CONTACT_VISIT, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(visitForm),
            });
            if (!res.ok) throw new Error('Could not submit. Please try again.');
            setStatus('success');
            setVisitForm({ name: '', email: '', company: '', date: '' });
        } catch (err: any) { setStatus('error'); setErrorMsg(err.message); }
    };

    /* ── render ── */
    return (
        <main className="min-h-screen bg-[#E1EDEB]">

            {/* ══ HERO ══ */}
            <section className="relative bg-[#0A5246] overflow-hidden pt-28 pb-24">
                {/* blobs */}
                <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#073d34] animate-blob" />
                    <div className="absolute -top-10 right-0 w-72 h-72 rounded-full bg-[#FBB21B]/10 animate-blob animation-delay-2000" />
                    <div className="absolute bottom-0 left-1/2 w-64 h-64 rounded-full bg-[#073d34] animate-blob animation-delay-4000" />
                    <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
                        <defs><pattern id="dotpat" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="white" /></pattern></defs>
                        <rect width="100%" height="100%" fill="url(#dotpat)" />
                    </svg>
                </div>

                {/* Lottie – desktop right */}
                {lottieData && (
                    <div aria-hidden className="hidden lg:block absolute right-0 bottom-0 w-80 h-80 opacity-20 pointer-events-none">
                        <Lottie animationData={lottieData} loop />
                    </div>
                )}

                <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#FBB21B] animate-pulse" />
                        <span className="text-[#FBB21B] text-[10px] font-bold tracking-widest uppercase">We'd love to hear from you</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-5">
                        Get in <span className="text-[#FBB21B]">Touch</span>
                    </h1>
                    <p className="text-white/55 text-base md:text-lg max-w-md leading-relaxed">
                        Bulk wholesale orders, general questions, or just curious about our cashews — we reply within 24 hours.
                    </p>
                </div>
            </section>

            {/* ══ CARD ══ */}
            <section className="max-w-5xl mx-auto px-4 md:px-8 -mt-10 pb-20 relative z-10">
                <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col lg:flex-row">

                    {/* ── Sidebar ── */}
                    <aside className="bg-[#0A5246] lg:w-72 shrink-0 flex flex-col p-8 md:p-10 gap-8 relative overflow-hidden">
                        <div aria-hidden className="absolute -bottom-12 -right-12 w-52 h-52 rounded-full bg-[#FBB21B]/10 pointer-events-none" />
                        <div aria-hidden className="absolute top-24 -left-8 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />

                        {/* heading */}
                        <div className="relative z-10">
                            <h2 className="text-white text-xl font-black mb-2">Contact Info</h2>
                            <div className="w-8 h-1 bg-[#FBB21B] rounded-full" />
                        </div>

                        {/* info rows */}
                        <div className="relative z-10 flex flex-col gap-6">
                            <InfoRow icon={<IconLocation />} title="Factory"
                                lines={['123 Cashew Lane, Industrial Area,', 'Siliguri, West Bengal 734001']} />
                            <InfoRow icon={<IconPhone />} title="Phone"
                                lines={['+91 98765 43210', 'Mon – Fri · 9am – 6pm IST']} />
                            <InfoRow icon={<IconEmail />} title="Email"
                                lines={['info@crunchycashews.in']} />
                        </div>

                        {/* socials */}
                        <div className="relative z-10 border-t border-white/10 pt-6 mt-auto">
                            <p className="text-[#FBB21B] text-[10px] font-bold tracking-widest uppercase mb-3">Follow Us</p>
                            <div className="flex gap-3">
                                {['fa-facebook-f', 'fa-instagram', 'fa-twitter', 'fa-whatsapp'].map(ic => (
                                    <a key={ic} href="#"
                                        className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white/60 hover:bg-[#FBB21B] hover:text-[#0A5246] hover:border-[#FBB21B] transition-all duration-200">
                                        <i className={`fa-brands ${ic} text-sm`} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* lottie on mobile inside sidebar */}
                        {lottieData && (
                            <div aria-hidden className="lg:hidden -mx-4 -mb-4 opacity-20 pointer-events-none">
                                <Lottie animationData={lottieData} loop />
                            </div>
                        )}
                    </aside>

                    {/* ── Form area ── */}
                    <div className="flex-1 p-6 md:p-10">

                        {/* Tab bar */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-[#1a1f1c]">
                                    {activeTab === 'general' ? 'Send a Message' : 'Request a Factory Visit'}
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">
                                    {activeTab === 'general'
                                        ? 'Fill in the form and we\'ll reply within 24 hours.'
                                        : 'Book a guided tour of our roasting facility.'}
                                </p>
                            </div>
                            <div className="flex bg-[#f4f9f7] p-1 rounded-2xl border border-[#0A5246]/10 w-full sm:w-auto shrink-0">
                                {(['general', 'visit'] as Tab[]).map(tab => (
                                    <button key={tab} onClick={() => switchTab(tab)}
                                        className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === tab ? 'bg-[#0A5246] text-white shadow' : 'text-gray-400 hover:text-[#0A5246]'}`}>
                                        {tab === 'general' ? 'General' : 'Factory Visit'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Status banners */}
                        {status === 'success' && (
                            <div className="flex items-center gap-4 bg-[#f0f9f6] border border-[#0A5246]/20 rounded-2xl p-5 mb-6">
                                <div className="w-11 h-11 rounded-2xl bg-[#0A5246] flex items-center justify-center shrink-0">
                                    <IconCheck />
                                </div>
                                <div>
                                    <p className="font-bold text-[#0A5246] text-sm">Sent successfully!</p>
                                    <p className="text-gray-400 text-xs mt-0.5">Our team will get back to you soon.</p>
                                </div>
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                                <IconWarn />
                                <p className="text-red-600 text-sm font-medium">{errorMsg}</p>
                            </div>
                        )}

                        {/* ── General Form ── */}
                        {activeTab === 'general' && (
                            <form onSubmit={submitGeneral} className="flex flex-col gap-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Full Name" name="name" value={form.name} onChange={onChange} required />
                                    <Field label="Email Address" name="email" type="email" value={form.email} onChange={onChange} required />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={onChange} />
                                    <Field label="Enquiry Type" name="enquiry_type" value={form.enquiry_type} onChange={onChange} as="select"
                                        options={[
                                            { value: 'General Inquiry', label: 'General Inquiry' },
                                            { value: 'Bulk Order', label: 'Bulk Order Request' },
                                            { value: 'Support', label: 'Order Support' },
                                            { value: 'Feedback', label: 'Feedback' },
                                        ]}
                                    />
                                </div>
                                <Field label="Your Message" name="message" value={form.message} onChange={onChange} required as="textarea" />
                                <div className="pt-2">
                                    <button type="submit" disabled={status === 'loading'}
                                        className="inline-flex items-center gap-3 bg-[#1a1f1c] hover:bg-[#0A5246] text-[#FBB21B] font-bold text-sm px-8 py-4 rounded-2xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                                        {status === 'loading'
                                            ? <span className="w-5 h-5 border-2 border-[#FBB21B] border-t-transparent rounded-full animate-spin" />
                                            : <><span>Send Message</span><IconSend /></>}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ── Visit Form ── */}
                        {activeTab === 'visit' && (
                            <form onSubmit={submitVisit} className="flex flex-col gap-4">
                                <div className="flex items-start gap-3 bg-[#f4f9f7] border border-[#0A5246]/15 rounded-2xl p-4">
                                    <div className="w-8 h-8 rounded-xl bg-[#FBB21B]/20 flex items-center justify-center shrink-0">
                                        <IconInfo />
                                    </div>
                                    <p className="text-[#0A5246] text-sm leading-relaxed">
                                        Visits are available <strong>Monday to Friday · 10am – 4pm.</strong> We'll confirm within 2 business days.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Full Name" name="name" value={visitForm.name} onChange={onVisitChange} required />
                                    <Field label="Email Address" name="email" type="email" value={visitForm.email} onChange={onVisitChange} required />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Company Name" name="company" value={visitForm.company} onChange={onVisitChange} />
                                    <Field label="Preferred Date" name="date" type="date" value={visitForm.date} onChange={onVisitChange} required />
                                </div>
                                <div className="pt-2">
                                    <button type="submit" disabled={status === 'loading'}
                                        className="inline-flex items-center gap-3 bg-[#0A5246] hover:bg-[#073d34] text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                                        {status === 'loading'
                                            ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            : <><span>Request Factory Visit</span><IconCal /></>}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* ══ STAT STRIP ══ */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                    {[
                        { value: '24h', label: 'Response Time' },
                        { value: '500+', label: 'Wholesale Clients' },
                        { value: '15+', label: 'Years in Business' },
                        { value: '100%', label: 'Premium Quality' },
                    ].map(s => (
                        <div key={s.label} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-[#0A5246]/5">
                            <p className="text-2xl font-black text-[#0A5246]">{s.value}</p>
                            <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}