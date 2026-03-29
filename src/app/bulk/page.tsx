'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import Link from 'next/link';
import { API } from '@/constants/api';
import Image from 'next/image';

// ─── Scroll helper ────────────────────────────────────────────────────────────
function scrollTo(ref: React.RefObject<HTMLElement | null>) {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── Grade Data ───────────────────────────────────────────────────────────────

const gradeCategories = [
    {
        id: 'white-wholes',
        title: 'White Wholes',
        subtitle: 'Premium whole cashews — prized for visual appeal, size, and taste.',
        accent: '#000000',
        items: [
            {
                code: 'WW 180',
                image: '/images/WW180-min.png',
                tagline: 'Jumbo Grade',
                description: 'The highest grade by size. Critical where visual appeal and nut size matter. ~160–180 nuts/lb.',
                origins: 'Ghana · Ivory Coast · Tanzania',
                link: 'http://www.amazon.in/dp/B0983Y6F8P?ref=myi_title_dp',
            },
            {
                code: 'WW 240',
                image: '/images/WW240-min.png',
                tagline: 'Large Grade',
                description: 'Large nuts ideal for visual-first applications. ~220–240 nuts/lb.',
                origins: 'Ghana · Ivory Coast · Tanzania',
                link: 'http://www.amazon.in/dp/B0983W92KN?ref=myi_title_dp',
            },
            {
                code: 'WW 320',
                image: '/images/WW320-min.png',
                tagline: 'Most Popular',
                description: 'Mid-size and the #1 traded cashew grade worldwide. Versatile for all food applications. ~300–320 nuts/lb.',
                origins: 'Multi-origin',
                link: 'http://www.amazon.in/dp/B094K427J7?ref=myi_title_dp',
            },
            {
                code: 'WW 400',
                image: '/images/WW450-min.png',
                tagline: 'Value Grade',
                description: 'Smallest white whole. Great where visual appeal matters but size is flexible. ~380–400 nuts/lb.',
                origins: 'Guinea Bissau · Senegal',
                link: 'http://www.amazon.in/dp/B0987SRM89?ref=myi_title_dp',
            },
        ],
    },
    {
        id: 'scorched-wholes',
        title: 'Scorched Wholes',
        subtitle: 'Ideal for roasting, coating, and processing — where appearance is secondary.',
        accent: '#F6B000',
        items: [
            {
                code: 'SW 240',
                image: '/images/SW240-min.png',
                tagline: 'Large Scorched',
                description: 'Scorched variant of WW240. Large nuts suited for roasting and coating. ~220–240 nuts/lb.',
                origins: 'Multi-origin',
                link: 'http://www.amazon.in/dp/B0983Z14VC?ref=myi_title_dp',
            },
            {
                code: 'SW 320',
                image: '/images/SW320-min.png',
                tagline: 'Most Popular Scorched',
                description: 'Most popular scorched grade. Perfect for all processed food applications. ~300–320 nuts/lb.',
                origins: 'Multi-origin',
                link: 'http://www.amazon.in/dp/B0983Z14VC?ref=myi_title_dp',
            },
            {
                code: 'SW 400',
                image: '/images/SW450-min.png',
                tagline: 'Processing Grade',
                description: 'Best for slicing, dicing, grinding and further processing. ~380–400 nuts/lb.',
                origins: 'Multi-origin',
                link: 'http://www.amazon.in/dp/B0983Z14VC?ref=myi_title_dp',
            },
        ],
    },
    {
        id: 'cashew-forms',
        title: 'Cashew Forms',
        subtitle: 'Splits and pieces — optimized for toppings, coatings, and culinary formulations.',
        accent: '#000000',
        items: [
            {
                code: 'White Splits',
                image: '/images/S-min.png',
                tagline: 'Halved Whole',
                description: 'Whole cashew split into halves. ~350–360 pieces/250g. For topping and coating.',
                origins: 'Multi-origin',
                link: 'http://www.amazon.in/dp/B09854W53D?ref=myi_title_dp',
            },
            {
                code: 'Large White Pieces',
                image: '/images/LWP-min.png',
                tagline: 'Quartered',
                description: 'Whole cashew diced into 4 pieces. For topping, coating and garnishing.',
                origins: 'Multi-origin',
                link: 'http://www.amazon.in/dp/B09856N2D8?ref=myi_title_dp',
            },
            {
                code: 'Small White Pieces',
                image: '/images/WSP.png',
                tagline: 'Micro Pieces',
                description: 'Diced into 8 pieces. Used as topping or sauce / curry thickener.',
                origins: 'Multi-origin',
                link: 'http://www.amazon.in/dp/B09856JVLD?ref=myi_title_dp',
            },
            {
                code: 'Scorched Splits',
                image: '/images/SS-min.png',
                tagline: 'Scorched Halved',
                description: 'Scorched variety of White Splits. For applications where visual appeal is not important.',
                origins: 'Multi-origin',
                link: 'http://www.amazon.in/dp/B09854W53D?ref=myi_title_dp',
            },
            {
                code: 'Scorched Pieces',
                image: '/images/SP-min.png',
                tagline: 'Scorched Quarters',
                description: 'Scorched Large White Pieces for further processing applications.',
                origins: 'Multi-origin',
                link: 'http://www.amazon.in/dp/B09856N2D8?ref=myi_title_dp',
            },
            {
                code: 'Small Scorched Pieces',
                image: '/images/SSP-min.png',
                tagline: 'Fine Processing',
                description: 'Scorched Small White Pieces for processing where appearance is not critical.',
                origins: 'Multi-origin',
                link: 'http://www.amazon.in/dp/B09856JVLD?ref=myi_title_dp',
            },
        ],
    },
];

// ─── All grade suggestion chips (flat list for the form) ──────────────────────

const ALL_GRADE_SUGGESTIONS = [
    // White Wholes
    { label: 'WW 180', tag: 'Jumbo', color: '#F6B000', text: 'WW 180 (Jumbo) – ~160–180 nuts/lb, Ghana/Ivory Coast/Tanzania' },
    { label: 'WW 240', tag: 'Large', color: '#F6B000', text: 'WW 240 (Large) – ~220–240 nuts/lb, Ghana/Ivory Coast/Tanzania' },
    { label: 'WW 320', tag: 'Popular', color: '#F6B000', text: 'WW 320 (Most Popular) – ~300–320 nuts/lb, Multi-origin' },
    { label: 'WW 400', tag: 'Value', color: '#F6B000', text: 'WW 400 (Value) – ~380–400 nuts/lb, Guinea Bissau/Senegal' },
    // Scorched Wholes
    { label: 'SW 240', tag: 'Scorched', color: '#000000', text: 'SW 240 (Scorched Large) – ~220–240 nuts/lb, for roasting/coating' },
    { label: 'SW 320', tag: 'Scorched', color: '#000000', text: 'SW 320 (Scorched Popular) – ~300–320 nuts/lb, all food applications' },
    { label: 'SW 400', tag: 'Scorched', color: '#000000', text: 'SW 400 (Processing) – ~380–400 nuts/lb, slicing/dicing/grinding' },
    // Cashew Forms
    { label: 'White Splits', tag: 'Form', color: '#000000', text: 'White Splits – halved wholes, ~350–360 pcs/250g, topping/coating' },
    { label: 'Large White Pieces', tag: 'Form', color: '#000000', text: 'Large White Pieces – quartered, topping/garnishing' },
    { label: 'Small White Pieces', tag: 'Form', color: '#000000', text: 'Small White Pieces – 1/8th pieces, sauce/curry thickener' },
    { label: 'Scorched Splits', tag: 'Form', color: '#000000', text: 'Scorched Splits – processing/coating, visual appeal not critical' },
    { label: 'Scorched Pieces', tag: 'Form', color: '#000000', text: 'Scorched Pieces – further processing applications' },
    { label: 'Small Scorched Pieces', tag: 'Form', color: '#000000', text: 'Small Scorched Pieces – fine processing, appearance not critical' },
];

// ─── Smart Grade Input ────────────────────────────────────────────────────────

function GradeRequirementsInput({
    value,
    onChange,
}: {
    value: string;
    onChange: (val: string) => void;
}) {
    const [focused, setFocused] = useState(false);
    const [query, setQuery] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setFocused(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Extract last "word/phrase" after the last comma or newline to filter suggestions
    const getActiveQuery = (text: string) => {
        const parts = text.split(/[,\n]/);
        return parts[parts.length - 1].trim().toLowerCase();
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
        setQuery(getActiveQuery(e.target.value));
    };

    const filtered = query.length === 0
        ? ALL_GRADE_SUGGESTIONS
        : ALL_GRADE_SUGGESTIONS.filter(
            (s) =>
                s.label.toLowerCase().includes(query) ||
                s.tag.toLowerCase().includes(query) ||
                s.text.toLowerCase().includes(query)
        );

    const appendGrade = (gradeText: string) => {
        // Replace the partial last segment with the full grade text
        const parts = value.split(/(?<=[,\n])/); // split but keep delimiter
        const lastIdx = Math.max(value.lastIndexOf(','), value.lastIndexOf('\n'));
        let newVal: string;
        if (lastIdx === -1) {
            newVal = gradeText;
        } else {
            newVal = value.slice(0, lastIdx + 1) + ' ' + gradeText;
        }
        onChange(newVal + ', ');
        setQuery('');
    };

    const showDropdown = focused && filtered.length > 0;

    return (
        <div ref={wrapperRef} className="relative">
            <textarea
                rows={4}
                value={value}
                onChange={handleTextChange}
                onFocus={() => setFocused(true)}
                placeholder="Type a grade (e.g. WW 320, Splits) or scroll suggestions below..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                style={{'--tw-ring-color': '#F6B000'} as any}
            />

            {/* Suggestion chips — always visible below textarea when focused or empty */}
            {focused && (
                <div className="mt-2 p-3 bg-white border border-gray-100 rounded-xl shadow-lg max-h-52 overflow-y-auto z-30">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 px-1">
                        {query ? `Matching "${query}"` : 'All grades — click to add'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {filtered.map((s) => (
                            <button
                                key={s.label}
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault(); // don't blur textarea
                                    appendGrade(s.text);
                                }}
                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer"
                                style={{
                                    borderColor: s.color + '55',
                                    background: s.color + '10',
                                    color: s.color,
                                }}
                            >
                                <span
                                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                                    style={{ background: s.color }}
                                >
                                    {s.tag}
                                </span>
                                {s.label}
                            </button>
                        ))}
                        {filtered.length === 0 && (
                            <p className="text-xs text-gray-400 italic px-1">No grades match your search.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Animated Counter Hook ────────────────────────────────────────────────────

function useIntersectionObserver(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, visible };
}

// ─── Grade Card ───────────────────────────────────────────────────────────────

function GradeCard({
    item,
    accent,
    index,
    visible,
}: {
    item: (typeof gradeCategories)[0]['items'][0];
    accent: string;
    index: number;
    visible: boolean;
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(32px)',
                transition: `opacity 0.55s ease ${index * 0.08}s, transform 0.55s ease ${index * 0.08}s`,
                textDecoration: 'none',
            }}
            className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        >
            {/* Image */}
            <div
                className="relative overflow-hidden"
                style={{ background: '#F8F5F0', height: '180px' }}
            >
                <Image
                    src={item.image}
                    alt={item.code}
                    width={400}
                    height={180}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                />
                <span
                    className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full text-white"
                    style={{ background: accent, letterSpacing: '0.04em' }}
                >
                    {item.tagline}
                </span>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5">
                <h4 className="font-bold text-gray-900 text-base mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                    {item.code}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-3">{item.description}</p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">{item.origins}</span>
                    <span
                        className="text-xs font-bold px-3 py-1 rounded-full transition-colors duration-200"
                        style={{
                            background: hovered ? accent : '#F0F0F0',
                            color: hovered ? '#fff' : '#444',
                        }}
                    >
                        Buy Now →
                    </span>
                </div>
            </div>
        </a>
    );
}

// ─── Grade Section ────────────────────────────────────────────────────────────

function GradeSection({ category }: { category: (typeof gradeCategories)[0] }) {
    const { ref, visible } = useIntersectionObserver();

    return (
        <div ref={ref} className="mb-20">
            {/* Category Header */}
            <div
                className="flex items-center gap-4 mb-8"
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateX(0)' : 'translateX(-20px)',
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                }}
            >
                <div className="w-1 rounded-full h-12" style={{ background: category.accent }} />
                <div>
                    <h3
                        className="text-2xl md:text-3xl font-bold text-gray-900"
                        style={{ fontFamily: 'Georgia, serif' }}
                    >
                        {category.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-0.5">{category.subtitle}</p>
                </div>
            </div>

            {/* Cards Grid */}
            <div
                className={`grid gap-5 ${category.items.length === 3
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                    }`}
            >
                {category.items.map((item, i) => (
                    <GradeCard key={item.code} item={item} accent={category.accent} index={i} visible={visible} />
                ))}
            </div>
        </div>
    );
}

// ─── Grades Block ─────────────────────────────────────────────────────────────

function OurGradesSection() {
    const { ref, visible } = useIntersectionObserver(0.1);

    return (
        <section className="max-w-7xl mx-auto px-6 py-20">
            {/* Section Title */}
            <div
                ref={ref}
                className="text-center mb-16"
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(24px)',
                    transition: 'opacity 0.6s ease, transform 0.6s ease',
                }}
            >
                <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4" style={{ backgroundColor: '#F6B000', color: '#000000' }}>
                    Grades Catalogue
                </span>
                <h2
                    className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: 'Georgia, serif' }}
                >
                    Our Grades
                </h2>
                <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
                    Each cashew grade is unique — affecting sensory properties and the application potential of your finished product.
                </p>
                <div className="flex items-center justify-center gap-3 mt-6">
                    <div className="h-px w-16 bg-gray-200" />
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F6B000' }} />
                    <div className="h-px w-16 bg-gray-200" />
                </div>
            </div>

            {gradeCategories.map((cat) => (
                <GradeSection key={cat.id} category={cat} />
            ))}
        </section>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BulkOrderPage() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const formRef = useRef<HTMLDivElement>(null);
    const inquiryRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        volume: '',
        requirements: '',
    });

    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [queryStatus, setQueryStatus] = useState<{
        found: boolean;
        status?: string;
        notes?: string;
        searched: boolean;
    }>({ found: false, searched: false });
    const [searchEmail, setSearchEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus('loading');
        try {
            const res = await fetch(API.CONTACT_BULK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    company: formData.company,
                    volume: formData.volume,
                    requirements: formData.requirements,
                    message: `BULK ORDER INQUIRY\nCompany: ${formData.company}\nExpected Volume: ${formData.volume}\nRequirements: ${formData.requirements}`, // Kept for backwards compatibility if needed, though mostly obsolete
                }),
            });
            if (res.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', phone: '', company: '', volume: '', requirements: '' });
                setTimeout(() => setSubmitStatus('idle'), 5000);
            } else {
                setSubmitStatus('error');
            }
        } catch {
            setSubmitStatus('error');
        }
    };

    const handleStatusCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setQueryStatus({ ...queryStatus, searched: true });
        try {
            const res = await fetch(API.CONTACT_TRACK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: searchEmail }),
            });
            if (res.ok) {
                const data = await res.json();
                if (data.found) {
                    setQueryStatus({
                        searched: true,
                        found: true,
                        status: data.status,
                        notes: data.notes,
                    });
                } else {
                    setQueryStatus({ searched: true, found: false });
                }
            } else {
                setQueryStatus({ searched: true, found: false });
            }
        } catch {
            setQueryStatus({ searched: true, found: false });
        }
    };

    return (
        <div className="bg-white min-h-screen">
            {/* ── Hero ── */}
            <section
                className="relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #FFF9E7 0%, #FFFE71 100%)' }}
            >
                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.07] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)',
                        backgroundSize: '24px 24px',
                    }}
                />

                {/* Left cashew image */}
                <div className="absolute left-0 bottom-0 flex items-end pointer-events-none select-none transition-opacity duration-1000"
                    style={{ width: 'clamp(160px, 22vw, 340px)', height: '115%' }}>
                    <Image
                        src="/images/Right-Hero-Section.png"
                        alt=""
                        fill
                        priority
                        className="object-contain object-bottom"
                        style={{ transform: 'scaleX(-1)', opacity: 0.95 }}
                        sizes="(max-width: 768px) 160px, 340px"
                    />
                </div>

                {/* Right cashew image */}
                <div className="absolute right-0 bottom-0 flex items-end pointer-events-none select-none transition-opacity duration-1000"
                    style={{ width: 'clamp(160px, 22vw, 340px)', height: '115%' }}>
                    <Image
                        src="/images/Right-Hero-Section.png"
                        alt=""
                        fill
                        priority
                        className="object-contain object-bottom"
                        style={{ opacity: 0.95 }}
                        sizes="(max-width: 768px) 160px, 340px"
                    />
                </div>

                {/* Center content */}
                <div className="relative z-10 py-14 md:py-16 px-6 text-center max-w-3xl mx-auto text-black">
                    {/* Star rating bar */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-4 h-4 text-black fill-black" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-xs text-black/60 font-semibold tracking-wide">Trusted by 480+ businesses</span>
                    </div>

                    <h1
                        className="text-4xl md:text-6xl font-bold leading-[1.1] mb-4"
                        style={{ fontFamily: 'Georgia, serif' }}
                    >
                        Wholesale &amp;<br />Bulk Orders
                    </h1>
                    <p className="text-black/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-2">
                        Factory-direct cashews. Uncompromised quality.<br className="hidden md:block" />
                        Competitive B2B margins. Reliable supply chains.
                    </p>

                    {/* Trust pills */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-4 mb-8">
                        {['✓ 100% Natural', '✓ Direct from Factory', '✓ 24hr Quote'].map((t) => (
                            <span key={t} className="text-xs bg-black/5 border border-black/10 text-black px-3 py-1 rounded-full">
                                {t}
                            </span>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => scrollTo(formRef)}
                            className="group flex items-center gap-2 font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all duration-200 text-sm hover:scale-105 active:scale-95"
                            style={{ backgroundColor: '#000000', color: '#F6B000' }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Place Bulk Order
                        </button>
                        <button
                            onClick={() => scrollTo(inquiryRef)}
                            className="group flex items-center gap-2 bg-black/5 hover:bg-black/10 border border-black/10 text-black font-bold px-7 py-3.5 rounded-xl transition-all duration-200 text-sm hover:scale-105 active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                            </svg>
                            Track My Inquiry
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Our Grades ── */}
            <div className="bg-[#FAFAF8]">
                <OurGradesSection />
            </div>

            {/* ── Divider ── */}
            <div className="relative h-16 bg-[#FAFAF8]">
                <div className="absolute inset-x-0 bottom-0 h-16 bg-white" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />
            </div>

            {/* ── Bulk Order Form ── */}
            <div ref={formRef} className="max-w-7xl mx-auto px-6 pb-24" style={{ scrollMarginTop: '80px' }}>
                {/* Form section label */}
                <div className="text-center mb-12">
                    <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4" style={{ backgroundColor: '#F6B000', color: '#000000' }}>
                        Get a Quote
                    </span>
                    <h2
                        className="text-3xl md:text-4xl font-bold text-gray-900"
                        style={{ fontFamily: 'Georgia, serif' }}
                    >
                        Place a Bulk Inquiry
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        Our B2B team responds within 24 hours with a tailored quote.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden border border-gray-100">
                    {/* Form */}
                    <div className="w-full md:w-3/5 p-8 md:p-12">
                        <h2
                            className="text-3xl font-bold text-gray-900 mb-2"
                            style={{ fontFamily: 'Georgia, serif' }}
                        >
                            Request Wholesale Pricing
                        </h2>
                        <p className="text-gray-500 mb-8 text-sm">
                            Fill out the form below and our B2B team will provide a tailored quote within 24 hours.
                        </p>

                        {submitStatus === 'success' ? (
                            <div className="bg-primary/10 text-black p-8 rounded-2xl border border-primary/20 text-center">
                                <div className="text-5xl mb-4 text-primary">
                                    <i className="fa-solid fa-circle-check" />
                                </div>
                                <h3 className="font-bold text-2xl mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                                    Inquiry Submitted!
                                </h3>
                                <p className="text-sm">
                                    We've received your bulk order request. Our team will get back to you shortly.
                                </p>
                                <button
                                    onClick={() => setSubmitStatus('idle')}
                                    className="mt-6 text-primary font-bold hover:underline text-sm"
                                >
                                    Submit another request
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
                                            Full Name *
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                            style={{'--tw-ring-color': '#F6B000'} as any}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
                                            Email Address *
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                            style={{'--tw-ring-color': '#F6B000'} as any}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
                                            Phone Number *
                                        </label>
                                        <input
                                            required
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                            style={{'--tw-ring-color': '#F6B000'} as any}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                            style={{'--tw-ring-color': '#F6B000'} as any}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
                                        Expected Monthly Volume (kg) *
                                    </label>
                                    <select
                                        required
                                        value={formData.volume}
                                        onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                        style={{'--tw-ring-color': '#F6B000'} as any}
                                    >
                                        <option value="">Select an option</option>
                                        <option value="5-10">5 – 10 kg</option>
                                        <option value="10-50">10 – 50 kg</option>
                                        <option value="50-100">50 – 100 kg</option>
                                        <option value="100-500">100 – 500 kg</option>
                                        <option value="500-1000">500 – 1,000 kg</option>
                                        <option value="1000+">1,000+ kg</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
                                        Specific Requirements / Grades
                                    </label>
                                    <GradeRequirementsInput
                                        value={formData.requirements}
                                        onChange={(val) => setFormData({ ...formData, requirements: val })}
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1.5">
                                        💡 Click any grade chip to add it, or type to filter suggestions
                                    </p>
                                </div>

                                {submitStatus === 'error' && (
                                    <p className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                                        ⚠ Failed to submit. Please try again.
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitStatus === 'loading'}
                                    className="w-full font-bold text-base py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 active:scale-95"
                                    style={{ backgroundColor: '#000000', color: '#F6B000' }}
                                >
                                    {submitStatus === 'loading' ? '⏳ Sending...' : '📩 Submit Wholesale Inquiry'}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Track Status */}
                    <div ref={inquiryRef} className="w-full md:w-2/5 bg-gray-50 p-8 md:p-12 border-t md:border-t-0 md:border-l border-gray-100" style={{ scrollMarginTop: '80px' }}>
                        <div className="sticky top-32">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm border border-gray-100">
                                🔍
                            </div>
                            <h3
                                className="text-2xl font-bold text-gray-900 mb-3"
                                style={{ fontFamily: 'Georgia, serif' }}
                            >
                                Track Existing Query
                            </h3>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                Already submitted a bulk order request or factory visit? Enter your email to check the
                                current status of your inquiry.
                            </p>

                            {!isAuthenticated && (
                                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-6 text-xs border border-blue-100">
                                    ℹ️ Log in to automatically track all your queries from your{' '}
                                    <Link href="/profile" className="font-bold underline">
                                        Profile Dashboard
                                    </Link>
                                    .
                                </div>
                            )}

                            <form onSubmit={handleStatusCheck} className="space-y-4">
                                <input
                                    required
                                    type="email"
                                    placeholder="Enter your email"
                                    value={searchEmail}
                                    onChange={(e) => setSearchEmail(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-primary hover:text-black transition-colors shadow-md text-sm"
                                >
                                    Check Status
                                </button>
                            </form>

                            {queryStatus.searched && (
                                <div className="mt-8">
                                    {queryStatus.found ? (
                                        <div className="bg-white p-5 rounded-xl border-l-4 border-yellow-400 shadow-sm">
                                            <span className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-1 block">
                                                Status
                                            </span>
                                            <span className="inline-block bg-yellow-100 text-yellow-800 font-bold px-3 py-1 rounded-full text-xs mb-3">
                                                {queryStatus.status}
                                            </span>
                                            <p className="text-xs text-gray-600 italic border-t border-gray-100 pt-3 mt-1">
                                                "{queryStatus.notes}"
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-xs">
                                            No recent inquiries found for this email address.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}