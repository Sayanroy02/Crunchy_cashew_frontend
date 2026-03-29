'use client';

import React, { useState, useEffect, useRef } from 'react';
import { API } from '@/constants/api';

type Tab = 'story' | 'team' | 'process' | 'visit';

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'story', label: 'Our Story', icon: 'fa-book-open' },
    { id: 'team', label: 'Our Team', icon: 'fa-users' },
    { id: 'process', label: 'Our Process', icon: 'fa-gear' },
    { id: 'visit', label: 'Visit Factory', icon: 'fa-building' },
];

const PROCESS_STEPS = [
    {
        id: 1, title: 'Procurement', tag: 'Origin',
        image: '/images/Rectangle-112.jpg', video: null as string | null, noMedia: false,
        body: `We procure the highest-quality raw cashew nuts from farmers at the origin. At least 90% of the raw cashews processed are acquired directly from the farm-gate and the remaining from certified raw cashew trading companies. We acquire only the finest quality raw cashew nuts from esteemed origins in Africa to manufacture prime cashew kernels for customers worldwide.`,
        fact: 'Sourced from Tanzania, Ghana & Benin',
    },
    {
        id: 2, title: 'Drying', tag: 'Preservation',
        image: '/images/cashew-drying.jpg', video: null, noMedia: false,
        body: `After procuring high-quality raw cashew nuts from farm-gate, they are dried to reduce moisture content, preventing deterioration during storage and greatly increasing shelf-life. We use modern drying methods and machinery which keeps the nuts healthy and reduces processing time required.`,
        fact: 'Moisture reduced for maximum shelf-life',
    },
    {
        id: 3, title: 'Roasting', tag: 'Processing',
        image: null, video: null, noMedia: true,
        body: `Raw cashew nuts are steamed to make shells brittle and easy to cut. Once the steaming process is complete, nuts are spread evenly on a clean surface for air drying. We employ technically designed steam roasting boilers that help remove the shell with minimal effort.`,
        fact: 'Steam boilers designed for precision',
    },
    {
        id: 4, title: 'Shelling', tag: 'Extraction',
        image: null, video: '/videos/cashew_shelling (1)-transcode.mp4', noMedia: false,
        body: `Due to the unique kidney shape of the raw cashew nut, it has an outer shell that is very hard to crack. The shell contains an oil called CNSL with several industrial applications. We use highly developed shelling technology to separate cashew shell and kernels.`,
        fact: 'Highest % of unbroken whole kernels',
    },
    {
        id: 5, title: 'Peeling', tag: 'Refinement',
        image: null, video: '/videos/Cashew-Process-Peeling-transcode.mp4', noMedia: false,
        body: `Peeling removes the testa/skin from the kernel using friction and air pressure. We have an integrated system of machines and skilled workforce that enables us to continuously improve our peeling process and minimize the occurrence of broken kernels.`,
        fact: 'Integrated machine + skilled labour system',
    },
    {
        id: 6, title: 'Grading', tag: 'Quality',
        image: null, video: '/videos/cashew-grading-transcode.mp4', noMedia: false,
        body: `Cashew Kernels are graded into white / scorched wholes, splits, butts and more. Depending on shape, size and colour there are more than 25 grades of cashew kernels. We achieve accuracy and consistency in grading by using specially designed machines paired with highly-trained skilled labour.`,
        fact: '25+ grades sorted with precision',
    },
    {
        id: 7, title: 'Packaging', tag: 'Delivery',
        image: '/images/packaging.jpg', video: null, noMedia: false,
        body: `At the last stage, cashew kernels pass through Infra-red heating and a dust cleaner to remove any foreign particles. Our 3-layered packaging includes tin, plastic and nitrogen gas sealing that makes it moisture-free and highly durable.`,
        fact: '3-layer nitrogen-sealed for freshness',
    },
];

const TEAM = [
    {
        name: 'Suresh Jindal', initial: 'SJ', color: '#000000',
        role: 'Mentor & Investor',
        bio: 'With his rich experience of more than 40 years, Suresh has been an involved mentor, investor and a profound leader for the company. He is a fitness freak and always aims for perfection in every task that he does.',
    },
    {
        name: 'Naveen Jindal', initial: 'NJ', color: '#F6B000',
        role: 'Head of Procurement & Sales',
        bio: 'Naveen is the head of the procurement and sales department. He has a vast experience of 10+ years of procurement. He did his graduation and masters from Bangalore. He is an active sportsperson who has played state level cricket.',
    },
    {
        name: 'Nitesh Jindal', initial: 'NT', color: '#000000',
        role: 'Finance & Technology',
        bio: 'Nitesh brings a modern perspective to the team with his 2+ years of experience in a cashew manufacturing company in South India. He handles finances and explores technology adoptions for the company.',
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────────────────────
const Shimmer = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
);
function StorySkeleton() {
    return (
        <div className="space-y-4">
            <Shimmer className="h-8 w-52" />
            <Shimmer className="h-4 w-full" /><Shimmer className="h-4 w-5/6" />
            <Shimmer className="h-4 w-full" /><Shimmer className="h-4 w-4/5" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
                {[0, 1, 2, 3].map(i => <Shimmer key={i} className="h-20" />)}
            </div>
        </div>
    );
}
function TeamSkeleton() {
    return (
        <div className="space-y-4">
            <Shimmer className="h-8 w-36" />
            {[0, 1, 2].map(i => (
                <div key={i} className="flex gap-4 items-start p-4 border border-gray-100 rounded-xl">
                    <Shimmer className="w-12 h-12 !rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Shimmer className="h-5 w-32" /><Shimmer className="h-3 w-24" /><Shimmer className="h-4 w-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}
function BookSkeleton() {
    return (
        <div className="space-y-4">
            <Shimmer className="h-8 w-44" />
            <Shimmer className="h-4 w-2/3" />
            <div className="flex gap-4 pt-3">
                <Shimmer className="flex-1 h-80 rounded-xl" />
                <Shimmer className="flex-1 h-80 rounded-xl" />
            </div>
            <div className="flex justify-center gap-3 pt-2">
                <Shimmer className="h-10 w-24" /><Shimmer className="h-10 w-24" />
            </div>
        </div>
    );
}
function VisitSkeleton() {
    return (
        <div className="space-y-4">
            <Shimmer className="h-5 w-28" /><Shimmer className="h-8 w-56" /><Shimmer className="h-4 w-3/4" />
            <div className="space-y-3 pt-2 border border-gray-100 rounded-xl p-5">
                <div className="grid grid-cols-2 gap-3"><Shimmer className="h-10" /><Shimmer className="h-10" /></div>
                <div className="grid grid-cols-2 gap-3"><Shimmer className="h-10" /><Shimmer className="h-10" /></div>
                <Shimmer className="h-11" />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROCESS MEDIA
// ─────────────────────────────────────────────────────────────────────────────
function ProcessMedia({ step, active }: { step: typeof PROCESS_STEPS[0]; active: boolean }) {
    if (step.noMedia) {
        return (
            <div className="w-full h-full bg-gradient-to-br from-stone-800 via-amber-800 to-amber-600 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 22px,rgba(255,255,255,0.025) 22px,rgba(255,255,255,0.025) 44px)'
                }} />
                <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="flex gap-5 mb-2">
                        {[0, 1, 2].map(i => (
                            <div key={i} className="w-0.5 bg-white/50 rounded-full"
                                style={{ height: 52, animation: active ? `steamRise 2.4s ease-in-out ${i * 0.6}s infinite` : 'none' }} />
                        ))}
                    </div>
                    <div className="w-24 h-14 rounded-xl bg-stone-900/50 border border-amber-600/30 flex items-center justify-center">
                        <span className="text-4xl text-amber-300/80">♨</span>
                    </div>
                    <p className="text-white/50 text-xs tracking-[0.2em] uppercase mt-2">Steam Roasting</p>
                </div>
            </div>
        );
    }
    if (step.video) {
        return (
            <video key={step.video} autoPlay={active} loop muted playsInline className="w-full h-full object-cover">
                <source src={step.video} type="video/mp4" />
            </video>
        );
    }
    if (step.image) {
        return <img src={step.image} alt={step.title} className="w-full h-full object-cover" />;
    }
    return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOK PROCESS (Desktop)
// ─────────────────────────────────────────────────────────────────────────────
function BookProcess() {
    const [page, setPage] = useState(0);
    const [dir, setDir] = useState<'next' | 'prev'>('next');
    const [animKey, setAnimKey] = useState(0);
    const total = PROCESS_STEPS.length;
    const step = PROCESS_STEPS[page];

    const go = (direction: 'next' | 'prev') => {
        if (direction === 'next' && page >= total - 1) return;
        if (direction === 'prev' && page <= 0) return;
        setDir(direction);
        setAnimKey(k => k + 1);
        setPage(p => direction === 'next' ? p + 1 : p - 1);
    };

    return (
        <div className="about-animate select-none">
            {/* Header */}
            <div className="flex items-end justify-between mb-5">
                <div>
                    <h2 className="text-2xl md:text-3xl font-heading font-black text-black">Our Process</h2>
                    <p className="text-black/40 text-sm mt-0.5">From farm-gate in Africa to your table — 7 steps of care</p>
                </div>
                <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">
                    {page + 1} / {total}
                </span>
            </div>

            {/* Book container */}
            <div
                className="book-wrapper relative rounded-2xl overflow-hidden border border-amber-100"
                style={{ background: '#fdf8f0', boxShadow: '0 8px 40px rgba(120,80,20,0.10), 0 2px 8px rgba(0,0,0,0.04)' }}
            >
                {/* Spine line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-amber-200/60 z-10 pointer-events-none" />
                {/* Top rule */}
                <div className="absolute top-0 left-0 right-0 h-8 flex items-center px-6 gap-3 z-10" style={{ background: '#f5ede0' }}>
                    <div className="flex gap-1.5">
                        {PROCESS_STEPS.map((_, i) => (
                            <button key={i} onClick={() => { setDir(i > page ? 'next' : 'prev'); setAnimKey(k => k + 1); setPage(i); }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === page ? 'w-5' : 'bg-amber-300/50 w-1.5 hover:bg-amber-400/70'}`}
                                style={i === page ? { backgroundColor: '#F6B000' } : {}} />
                        ))}
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-amber-700/50 uppercase tracking-widest">Crunchy Cashews</span>
                    </div>
                </div>

                {/* Page spread — LEFT (image) + RIGHT (text) */}
                <div
                    key={animKey}
                    className={`flex h-[420px] pt-8 page-turn-${dir}`}
                >
                    {/* LEFT PAGE — media */}
                    <div className="w-1/2 relative overflow-hidden" style={{ background: '#f0e8d8' }}>
                        {/* Corner fold */}
                        <div className="absolute bottom-0 right-0 w-8 h-8 z-10 pointer-events-none"
                            style={{ background: 'linear-gradient(225deg, #fdf8f0 50%, transparent 50%)' }} />
                        {/* Page number */}
                        <div className="absolute bottom-3 left-5 text-[10px] font-bold text-amber-700/40 z-10">
                            pg. {(page + 1) * 2 - 1}
                        </div>

                        {/* Illustration area */}
                        <div className="absolute inset-0 top-0">
                            <ProcessMedia step={step} active={true} />
                            {/* Sepia wash overlay for book feel */}
                            <div className="absolute inset-0 mix-blend-multiply opacity-20"
                                style={{ background: 'linear-gradient(180deg, #c8a06e 0%, transparent 60%)' }} />
                        </div>

                        {/* Step badge */}
                        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-black text-xs font-black shadow-lg" style={{ backgroundColor: '#F6B000' }}>
                                {step.id}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/90 drop-shadow-sm bg-black/20 px-2 py-0.5 rounded-full">
                                {step.tag}
                            </span>
                        </div>
                    </div>

                    {/* RIGHT PAGE — text */}
                    <div className="w-1/2 flex flex-col justify-between px-8 py-5 relative" style={{ background: '#fdf8f0' }}>
                        {/* Ruled lines background */}
                        <div className="absolute inset-0 top-8"
                            style={{
                                backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #e8dcc8 27px, #e8dcc8 28px)',
                                backgroundPosition: '0 16px',
                            }}
                        />
                        {/* Page number */}
                        <div className="absolute bottom-3 right-5 text-[10px] font-bold text-amber-700/40 z-10">
                            pg. {(page + 1) * 2}
                        </div>

                        <div className="relative z-10">
                            {/* Chapter-style heading */}
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700/60 mb-1">
                                Step {step.id} — {step.tag}
                            </p>
                            <h3 className="font-heading font-black text-2xl text-gray-800 mb-4 leading-tight"
                                style={{ fontStyle: 'italic' }}>
                                {step.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-[1.85] mb-5">
                                {step.body}
                            </p>

                            {/* Fact callout — looks like a sticky note */}
                            <div className="inline-block px-3 py-2 rounded"
                                style={{ background: '#fffbe8', boxShadow: '2px 2px 6px rgba(0,0,0,0.08)', transform: 'rotate(-0.5deg)' }}>
                                <p className="text-xs font-semibold text-amber-800">✦ {step.fact}</p>
                            </div>
                        </div>

                        {/* Navigation arrows — bottom of right page */}
                        <div className="relative z-10 flex items-center justify-between mt-4">
                            <button
                                onClick={() => go('prev')}
                                disabled={page === 0}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${page === 0
                                    ? 'opacity-25 cursor-not-allowed border-gray-200 text-gray-300'
                                    : 'border-amber-200 text-amber-800 hover:bg-amber-50 active:scale-95'
                                    }`}
                            >
                                <i className="fa-solid fa-arrow-left text-xs" />
                                <span className="hidden sm:inline">Previous</span>
                            </button>

                            {/* Step dots in middle */}
                            <div className="flex gap-1">
                                {PROCESS_STEPS.map((_, i) => (
                                    <button key={i}
                                        onClick={() => { setDir(i > page ? 'next' : 'prev'); setAnimKey(k => k + 1); setPage(i); }}
                                        className={`rounded-full transition-all duration-300 ${i === page ? 'w-5 h-1.5' : 'bg-amber-300/50 w-1.5 h-1.5 hover:bg-amber-500/50'
                                            }`}
                                        style={i === page ? { backgroundColor: '#F6B000' } : {}}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => go('next')}
                                disabled={page === total - 1}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${page === total - 1
                                    ? 'opacity-25 cursor-not-allowed border-gray-200 text-gray-300'
                                    : 'border-black text-black hover:bg-black hover:text-white active:scale-95'
                                    }`}
                            >
                                <span className="hidden sm:inline">Next</span>
                                <i className="fa-solid fa-arrow-right text-xs" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Download link */}
            <div className="flex justify-end mt-4">
                <a href="/document/Guide-Book-on-Crunchy-Cashew-Processing-Process.pdf"
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline">
                    <i className="fa-solid fa-file-pdf" /> Download Full Process Guide
                </a>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE PROCESS — scroll cards
// ─────────────────────────────────────────────────────────────────────────────
function MobileProcess() {
    const [visible, setVisible] = useState<Set<number>>(new Set());
    const refs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const obs = new IntersectionObserver(
            entries => {
                entries.forEach(e => {
                    const idx = Number((e.target as HTMLElement).dataset.idx);
                    if (e.isIntersecting) setVisible(v => new Set([...v, idx]));
                });
            },
            { threshold: 0.2 }
        );
        refs.current.forEach(el => el && obs.observe(el));
        return () => obs.disconnect();
    }, []);

    return (
        <div className="about-animate">
            <h2 className="text-2xl font-heading font-black text-black mb-1">Our Process</h2>
            <p className="text-black/40 text-sm mb-6">7 steps from farm-gate to your table</p>

            <div className="space-y-5">
                {PROCESS_STEPS.map((step, idx) => (
                    <div
                        key={step.id}
                        ref={el => { refs.current[idx] = el; }}
                        data-idx={idx}
                        className="mobile-card rounded-xl overflow-hidden border border-amber-100/80"
                        style={{
                            background: '#fdf8f0',
                            boxShadow: '0 2px 12px rgba(120,80,20,0.07)',
                            opacity: visible.has(idx) ? 1 : 0,
                            transform: visible.has(idx) ? 'translateY(0)' : 'translateY(20px)',
                            transition: `opacity 0.5s ease ${idx * 0.05}s, transform 0.5s ease ${idx * 0.05}s`,
                        }}
                    >
                        {/* Media */}
                        <div className="aspect-video w-full overflow-hidden relative">
                            <ProcessMedia step={step} active={visible.has(idx)} />
                            <div className="absolute inset-0 mix-blend-multiply opacity-15"
                                style={{ background: 'linear-gradient(180deg, #c8a06e 0%, transparent 70%)' }} />
                            <div className="absolute top-3 left-3 flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-black text-xs font-black shadow" style={{ backgroundColor: '#F6B000' }}>
                                    {step.id}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/90 bg-black/20 px-2 py-0.5 rounded-full">
                                    {step.tag}
                                </span>
                            </div>
                        </div>

                        {/* Text — book paper style */}
                        <div className="px-5 pt-4 pb-5 relative">
                            <div className="absolute inset-0"
                                style={{
                                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, #e8dcc8 23px, #e8dcc8 24px)',
                                    backgroundPosition: '0 12px',
                                    opacity: 0.4,
                                }} />
                            <div className="relative z-10">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700/60 mb-0.5">Step {step.id}</p>
                                <h3 className="font-heading font-black text-lg text-gray-800 mb-2" style={{ fontStyle: 'italic' }}>{step.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-3">{step.body}</p>
                                <div className="inline-block px-3 py-1.5 rounded text-xs font-semibold text-amber-800"
                                    style={{ background: '#fffbe8', boxShadow: '1px 1px 4px rgba(0,0,0,0.07)' }}>
                                    ✦ {step.fact}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <a href="/documents/Guide-Book-on-Crunchy-Cashew-Processing-Process.pdf"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 font-semibold px-5 py-2.5 rounded-lg transition-all shadow-md text-sm active:scale-95"
                style={{ backgroundColor: '#000000', color: '#F6B000' }}>
                <i className="fa-solid fa-file-pdf" /> Download Full Process Guide
            </a>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AboutPage() {
    const [activeTab, setActiveTab] = useState<Tab>('story');
    const [isLoading, setIsLoading] = useState(true);
    const [visitForm, setVisitForm] = useState({ name: '', email: '', date: '', company: '' });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        const t = setTimeout(() => setIsLoading(false), 700);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        setIsLoading(true);
        const t = setTimeout(() => setIsLoading(false), 380);
        return () => clearTimeout(t);
    }, [activeTab]);

    const handleVisitSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus('loading');
        try {
            const res = await fetch(API.CONTACT_VISIT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(visitForm),
            });
            if (res.ok) {
                setSubmitStatus('success');
                setVisitForm({ name: '', email: '', date: '', company: '' });
                setTimeout(() => setSubmitStatus('idle'), 5000);
            } else { setSubmitStatus('error'); }
        } catch { setSubmitStatus('error'); }
    };

    function renderContent() {
        if (isLoading) {
            if (activeTab === 'story') return <StorySkeleton />;
            if (activeTab === 'team') return <TeamSkeleton />;
            if (activeTab === 'process') return <BookSkeleton />;
            return <VisitSkeleton />;
        }

        if (activeTab === 'story') return (
            <div className="about-animate">
                <h2 className="text-2xl md:text-3xl font-heading font-black text-black mb-5">About Crunchy Cashews</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    <span className="font-semibold text-gray-800">We are India's modern cashew manufacturing company</span> that
                    has been ethically sourcing raw cashews from the best cashew-producing African countries — majorly{' '}
                    <span className="font-semibold" style={{ color: '#F6B000' }}>Tanzania, Ghana, and Benin</span>.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    With our extended experience and our{' '}
                    <span className="font-semibold text-gray-800">commitment towards equal employment opportunities for women</span>,
                    we have built a highly advanced and efficient operation chain that reduces production costs and final prices.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    We have a fully fledged{' '}
                    <span className="font-semibold text-gray-800">28,800 sq. ft. processing facility in Siliguri, West Bengal</span>{' '}
                    where we execute end-to-end production of our cashews.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-7">
                    Our production facilities hold various quality management and food safety certifications. We agree to the{' '}
                    <span className="font-semibold text-gray-800">Global Compact</span> on human rights, labour, environment and
                    anti-corruption. Our cashew nuts are known for their{' '}
                    <span className="font-semibold text-gray-800">superior quality, nutritional properties and rich taste.</span>
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { value: '28,800', label: 'Sq. ft. facility' },
                        { value: '3+', label: 'African origins' },
                        { value: '25+', label: 'Cashew grades' },
                        { value: '100%', label: 'Quality assured' },
                    ].map(s => (
                        <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                            <p className="font-black text-xl" style={{ color: '#F6B000' }}>{s.value}</p>
                            <p className="text-xs text-black/40 mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        );

        if (activeTab === 'team') return (
            <div className="about-animate">
                <h2 className="text-2xl md:text-3xl font-heading font-black text-black mb-6">Our Team</h2>
                <div className="space-y-4">
                    {TEAM.map(m => (
                        <div key={m.name}
                            className="flex gap-4 items-start p-5 border border-gray-100 rounded-xl hover:border-black/10 hover:shadow-md transition-all bg-gray-50/40">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0"
                                style={{ background: m.color, color: m.color === '#F6B000' ? '#000000' : '#ffffff' }}>{m.initial}</div>
                            <div>
                                <p className="font-bold text-gray-800">{m.name}</p>
                                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#F6B000' }}>{m.role}</p>
                                <p className="text-gray-500 text-sm leading-relaxed">{m.bio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );

        if (activeTab === 'process') return (
            <>
                {/* Desktop book */}
                <div className="hidden md:block"><BookProcess /></div>
                {/* Mobile cards */}
                <div className="md:hidden"><MobileProcess /></div>
            </>
        );

        if (activeTab === 'visit') return (
            <div className="about-animate">
                <div className="mb-6">
                    <span className="inline-block font-bold uppercase tracking-widest text-xs px-3 py-1 rounded-full mb-3" style={{ backgroundColor: '#F6B000', color: '#000000' }}>
                        Exclusive Tour
                    </span>
                    <h2 className="text-2xl md:text-3xl font-heading font-black text-black mb-2">See the Magic Happen</h2>
                    <p className="text-black/50 text-sm leading-relaxed max-w-lg">
                        We invite bulk buyers, B2B partners, and food industry professionals to visit our Siliguri processing
                        facility and witness our state-of-the-art roasting lines firsthand.
                    </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 md:p-6 border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">Request a Factory Visit</h3>
                    {submitStatus === 'success' ? (
                        <div className="bg-primary/10 text-black p-6 rounded-xl border border-primary/20 text-center">
                            <i className="fa-solid fa-calendar-check text-3xl mb-3 text-primary block" />
                            <p className="font-bold text-lg mb-1">Request Received!</p>
                            <p className="text-sm text-black/60">Our tour coordinator will contact you shortly to confirm.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleVisitSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Full Name *</label>
                                    <input required type="text" value={visitForm.name}
                                        onChange={e => setVisitForm({ ...visitForm, name: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Email Address *</label>
                                    <input required type="email" value={visitForm.email}
                                        onChange={e => setVisitForm({ ...visitForm, email: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Company Name</label>
                                    <input type="text" value={visitForm.company}
                                        onChange={e => setVisitForm({ ...visitForm, company: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Requested Date *</label>
                                    <input required type="date" value={visitForm.date}
                                        onChange={e => setVisitForm({ ...visitForm, date: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all" />
                                </div>
                            </div>
                            {submitStatus === 'error' && <p className="text-red-500 text-xs font-medium">Failed to submit. Please try again.</p>}
                            <button type="submit" disabled={submitStatus === 'loading'}
                                className="w-full font-bold py-3 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-60 active:scale-95"
                                style={{ backgroundColor: '#000000', color: '#F6B000' }}>
                                {submitStatus === 'loading'
                                    ? <><i className="fa-solid fa-spinner animate-spin" /> Sending...</>
                                    : <><i className="fa-solid fa-paper-plane" /> Submit Request</>}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-bg min-h-screen pb-16">

            {/* VIDEO HERO */}
            <section className="relative h-[70vh] min-h-[480px] max-h-[700px] overflow-hidden">
                <video autoPlay loop muted playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    poster="/images/Rectangle-112.jpg">
                    <source src="/videos/cashew-about.webm" type="video/webm" />
                    <source src="/videos/7020392_420_Air_3840x2160.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 md:px-12 md:pb-14">
                    <div className="max-w-5xl mx-auto">
                        <span className="inline-block font-bold tracking-[0.22em] uppercase text-xs mb-3" style={{ color: '#F6B000' }}>About Us</span>
                        <h1 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight mb-3 drop-shadow-lg">
                            A Bunch to Talk<br />About Us
                        </h1>
                        <p className="text-white/65 text-base md:text-lg max-w-xl">
                            The passion, people, and processes behind every perfectly roasted Crunchy Cashew.
                        </p>
                    </div>
                </div>
            </section>

            {/* STICKY TABS */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 md:px-6">
                    <div className="flex overflow-x-auto scrollbar-hide">
                        {TABS.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex-shrink-0 flex items-center gap-2 px-5 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-200'
                                    }`}>
                                <i className={`fa-solid ${tab.icon} text-sm`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* CONTENT CARD */}
            <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-10">
                    {renderContent()}
                </div>
            </div>

            <style>{`
        /* Utilities */
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes about-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .about-animate { animation: about-in 0.28s ease both; }

        @keyframes steamRise {
          0%,100% { transform: translateY(0) scaleX(1); opacity: 0.5; }
          50%     { transform: translateY(-20px) scaleX(1.6); opacity: 0.1; }
        }

        /* Book page-turn animations */
        @keyframes pageTurnNext {
          0%   { opacity: 0; transform: translateX(32px) rotateY(-6deg); }
          100% { opacity: 1; transform: translateX(0) rotateY(0deg); }
        }
        @keyframes pageTurnPrev {
          0%   { opacity: 0; transform: translateX(-32px) rotateY(6deg); }
          100% { opacity: 1; transform: translateX(0) rotateY(0deg); }
        }

        .page-turn-next {
          animation: pageTurnNext 0.38s cubic-bezier(0.22, 0.61, 0.36, 1) both;
          transform-origin: left center;
          perspective: 900px;
        }
        .page-turn-prev {
          animation: pageTurnPrev 0.38s cubic-bezier(0.22, 0.61, 0.36, 1) both;
          transform-origin: right center;
          perspective: 900px;
        }

        /* Book shadow depth */
        .book-wrapper {
          perspective: 1200px;
        }
      `}</style>
        </div>
    );
}