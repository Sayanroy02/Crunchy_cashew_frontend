'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { API } from '@/constants/api';
import { COLORS } from '@/constants/styles';
import SectionHeading from '@/components/ui/SectionHeading';
import { motion } from 'framer-motion';

// Dynamically import Lottie — prevents SSR crash / loading hang
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

/* ─── Types ─── */
type Tab = 'general' | 'visit';
type Status = 'idle' | 'loading' | 'success' | 'error';

/* ══════ SVG Icons ══════ */
const IconLocation = () => (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const IconPhone = () => (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);
const IconEmail = () => (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
    <svg className="w-6 h-6" style={{ color: COLORS.button }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);
const IconWarn = () => (
    <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
);
const IconInfo = () => (
    <svg className="w-4 h-4" style={{ color: COLORS.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
        'w-full bg-[#f8fbfa] border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-[#1a1f1c] font-medium outline-none transition-all duration-200 placeholder:text-gray-300';

    return (
        <div className="flex flex-col gap-1.5 focus-within:ring-2 focus-within:ring-opacity-10" style={{ '--tw-ring-color': COLORS.primary } as any}>
            <label className="text-[11px] font-bold tracking-widest uppercase ml-0.5" style={{ color: COLORS.black }}>
                {label}{required && <span style={{ color: COLORS.primary }} className="ml-0.5">*</span>}
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
                    style={{ '--tw-border-color': 'transparent' } as any}
                />
            )}
        </div>
    );
}

/* ══════ Sidebar info row ══════ */
function InfoRow({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) {
    return (
        <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-[14px] border border-white/80 bg-transparent flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <p style={{ color: COLORS.button }} className="text-[10px] font-black tracking-widest uppercase mb-1 mt-0.5">{title}</p>
                {lines.map((l, i) => <p key={i} className="text-white text-sm leading-relaxed">{l}</p>)}
            </div>
        </div>
    );
}

/* ══════════════════════════════════
   MAIN COMPONENT
 ══════════════════════════════════ */
function ContactContent() {
    const searchParams = useSearchParams();
    const [lottieData, setLottieData] = useState<object | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('general');
    const [status, setStatus] = useState<Status>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const [form, setForm] = useState({ name: '', email: '', phone: '', enquiry_type: '', message: '' });
    const [visitForm, setVisitForm] = useState({ name: '', email: '', company: '', date: '' });

    // Handle Search Params for Pre-filling
    useEffect(() => {
        const preFill = searchParams.get('enquiry');
        if (preFill) {
            setForm(p => ({ ...p, enquiry_type: preFill }));
        }
    }, [searchParams]);

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

    return (
        <main className={`min-h-screen pb-24 bg-[#FFF9E7] relative`}>

            {/* Seamless Background Image */}
            <div className="absolute top-0 left-0 z-0 w-full h-[35vh] md:h-[45vh] lg:h-[55vh]">
                <img
                    src="https://res.cloudinary.com/da1acfqsn/image/upload/v1779008580/contact-us_wdd2w9.png"
                    alt="Contact Background"
                    className="w-full h-full object-cover object-bottom opacity-80"
                />
                <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-[#FFF9E7] to-transparent pointer-events-none" />
            </div>

            {/* Floating Cashew Decoration */}
            <div className="absolute top-[15%] left-0 w-[140px] pointer-events-none z-[5] hidden xl:block rotate-[-15deg]">
                <img
                    src="/images/Fruit-3-1.png"
                    alt=""
                    className="w-full h-auto drop-shadow-2xl brightness-110"
                />
            </div>

            {/* ══ HERO ══ */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-16 lg:pt-20 flex flex-col items-center text-center pb-16">
                <span className="inline-block font-bold tracking-[0.25em] uppercase text-[10px] md:text-xs mb-4 px-3 py-1 bg-[#F6B000] text-black rounded-sm shadow-sm">
                    We'd love to hear from you
                </span>
                <SectionHeading
                    text="Get in"
                    highlight="Touch"
                    className="text-3xl md:text-4xl lg:text-5xl drop-shadow-sm mb-6"
                />
                <p className="text-gray-700 text-sm md:text-lg max-w-2xl leading-relaxed font-medium drop-shadow-sm">
                    Bulk wholesale orders, general questions, or just curious about our cashews — we reply within 24 hours.
                </p>
            </section>

            {/* ══ CARD ══ */}
            <section className="max-w-5xl mx-auto px-4 md:px-8 -mt-10 pb-20 relative z-10">
                <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col lg:flex-row">

                    {/* ── Sidebar ── */}
                    <aside className="lg:w-80 shrink-0 flex flex-col p-8 md:p-10 gap-8 relative overflow-hidden" style={{ backgroundColor: COLORS.heading }}>
                        <div aria-hidden className="absolute -bottom-12 -right-12 w-52 h-52 rounded-full pointer-events-none" style={{ backgroundColor: `${COLORS.button}1A` }} />
                        <div aria-hidden className="absolute top-24 -left-8 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />

                        {/* heading */}
                        <div className="relative z-10">
                            <h2 className="text-white text-xl font-black mb-2">Contact Info</h2>
                            <div className="w-8 h-1 rounded-full" style={{ backgroundColor: COLORS.button }} />
                        </div>

                        {/* info rows */}
                        <div className="relative z-10 flex flex-col gap-6">
                            <InfoRow icon={<IconLocation />} title="Factory"
                                lines={['YU NUT PROCESSING INDUSTRY,Gram Panchayat Fulbari-II, Dist. - Jalpaiguri Siliguri (W.B) - 734015']} />
                            <InfoRow icon={<IconPhone />} title="Phone"
                                lines={['+91 7847996343', 'Mon – Fri · 9am – 6pm IST']} />
                            <InfoRow icon={<IconEmail />} title="Email"
                                lines={['crunchycashews18@gmail.com']} />
                        </div>

                        {/* socials */}
                        <div className="relative z-10 border-t border-white/10 pt-6 mt-auto">
                            <p style={{ color: COLORS.button }} className="text-[10px] font-bold tracking-widest uppercase mb-3">Follow Us</p>
                            <div className="flex gap-3">
                                {['fa-instagram', 'fa-facebook-f', 'fa-whatsapp', 'fa-youtube'].map(ic => (
                                    <a key={ic} href="https://www.instagram.com/crunchycashews?igsh=MTdkdGRzY212eTE3MQ=="
                                        className="w-11 h-11 rounded-[14px] bg-transparent border border-white/30 flex items-center justify-center text-white transition-all duration-300 hover:bg-[#F6B000] hover:border-[#F6B000] hover:-translate-y-1"
                                    >
                                        <i className={`fa-brands ${ic} text-lg`} />
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
                            <div className="flex p-1 rounded-2xl border w-full sm:w-auto shrink-0" style={{ backgroundColor: `${COLORS.black}08`, borderColor: `${COLORS.black}1A` }}>
                                {(['general', 'visit'] as Tab[]).map(tab => (
                                    <button key={tab} onClick={() => switchTab(tab)}
                                        className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === tab ? 'shadow' : 'text-gray-400'}`}
                                        style={activeTab === tab ? { backgroundColor: COLORS.black, color: COLORS.white } : {}}
                                    >
                                        {tab === 'general' ? 'General' : 'Factory Visit'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Status banners */}
                        {status === 'success' && (
                            <div className="flex items-center gap-4 border rounded-2xl p-5 mb-6" style={{ backgroundColor: `${COLORS.primary}1A`, borderColor: `${COLORS.primary}33` }}>
                                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.black }}>
                                    <IconCheck />
                                </div>
                                <div>
                                    <p className="font-bold text-sm" style={{ color: COLORS.black }}>Sent successfully!</p>
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
                                            { value: 'White Labeling', label: 'White Labeling / Private Branding' },
                                            { value: 'Support', label: 'Order Support' },
                                            { value: 'Feedback', label: 'Feedback' },
                                        ]}
                                    />
                                </div>
                                <Field label="Your Message" name="message" value={form.message} onChange={onChange} required as="textarea" />
                                <div className="pt-2">
                                    <button type="submit" disabled={status === 'loading'}
                                        className="inline-flex items-center gap-3 font-bold text-sm px-8 py-4 rounded-2xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                        style={{ backgroundColor: COLORS.black, color: COLORS.primary }}
                                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = COLORS.primary; e.currentTarget.style.color = COLORS.black; }}
                                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = COLORS.heading; e.currentTarget.style.color = COLORS.primary; }}
                                    >
                                        {status === 'loading'
                                            ? <span className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: COLORS.primary }} />
                                            : <><span>Send Message</span><IconSend /></>}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ── Visit Form ── */}
                        {activeTab === 'visit' && (
                            <form onSubmit={submitVisit} className="flex flex-col gap-4">
                                <div className="flex items-start gap-3 border rounded-2xl p-4 shadow-sm" style={{ backgroundColor: `${COLORS.primary}08`, borderColor: `${COLORS.primary}1A` }}>
                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${COLORS.button}33` }}>
                                        <IconInfo />
                                    </div>
                                    <p className="text-sm leading-relaxed" style={{ color: COLORS.primary }}>
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
                                        className="inline-flex items-center gap-3 font-bold text-sm px-8 py-4 rounded-2xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                        style={{ backgroundColor: COLORS.black, color: COLORS.primary }}
                                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = COLORS.primary; e.currentTarget.style.color = COLORS.black; }}
                                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = COLORS.black; e.currentTarget.style.color = COLORS.primary; }}
                                    >
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
                        <div key={s.label} className="bg-white rounded-2xl p-5 text-center shadow-sm border" style={{ borderColor: `${COLORS.primary}0D` }}>
                            <p className="text-2xl font-black" style={{ color: COLORS.primary }}>{s.value}</p>
                            <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default function ContactPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-bg-cream flex items-center justify-center font-bold italic text-primary animate-pulse">Loading Contact Form...</div>}>
            <ContactContent />
        </Suspense>
    );
}