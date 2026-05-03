'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import Link from 'next/link';
import { API } from '@/constants/api';
import Image from 'next/image';
import { COLORS } from '@/constants/styles';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Truck,
    ChefHat,
    ShoppingBag,
    CheckCircle2,
    Clock,
    Factory,
    Search,
    ArrowRight,
    Package,
    Tag,
    UtensilsCrossed,
    ChevronLeft,
    ChevronRight,
    Target,
    Leaf,
    ShieldCheck,
    CalendarDays
} from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import WhiteLabelBanner from '@/components/home/WhiteLabelBanner';

// ─── Scroll helper ────────────────────────────────────────────────────────────
function scrollTo(ref: React.RefObject<HTMLElement | null>) {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// ─── Grade Data ───────────────────────────────────────────────────────────────

const gradeCategories = [
    {
        id: 'white-wholes',
        title: 'White Wholes',
        icon: <Package className="w-4 h-4" />,
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
        icon: <UtensilsCrossed className="w-4 h-4" />,
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
        icon: <ShoppingBag className="w-4 h-4" />,
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
                style={{ '--tw-ring-color': '#F6B000' } as any}
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

function GradeCard({
    item,
    onEnquire,
    isSelected,
}: {
    item: (typeof gradeCategories)[0]['items'][0];
    onEnquire: (grade: string) => void;
    isSelected: boolean;
}) {
    return (
        <div
            onClick={() => onEnquire(item.code)}
            className="group relative w-full flex flex-col cursor-pointer transition-all duration-300"
            style={{
                borderRadius: '20px',
                background: isSelected
                    ? 'linear-gradient(145deg, rgba(246,176,0,0.12) 0%, rgba(255,255,255,0.95) 100%)'
                    : 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(249,249,247,0.9) 100%)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: isSelected
                    ? '1px solid rgba(246,176,0,0.6)'
                    : '1px solid rgba(255,255,255,0.8)',
                boxShadow: isSelected
                    ? '0 8px 32px rgba(246,176,0,0.2), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)'
                    : '0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)',
            }}
        >
            {/* Glossy top shine */}
            <div
                className="absolute top-0 left-0 right-0 h-1/2 rounded-t-[20px] pointer-events-none"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)' }}
            />

            {/* Image */}
            <div className="relative w-full flex items-center justify-center pt-4 pb-1 px-4">
                <div className="relative w-full aspect-square overflow-hidden">
                    <Image
                        src={item.image}
                        alt={item.code}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-110"
                        sizes="300px"
                    />
                </div>
                {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#F6B000] flex items-center justify-center shadow-md z-10">
                        <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                    </div>
                )}
            </div>

            {/* Name + Button */}
            <div className="px-4 pb-4 pt-2 flex items-center justify-between gap-2">
                <h4
                    className="text-sm md:text-base font-black text-gray-900 leading-tight transition-colors duration-300 group-hover:text-[#FBB21B]"
                >
                    {item.code}
                </h4>
                <div
                    className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${isSelected
                        ? 'bg-black text-[#F6B000] shadow-lg shadow-black/20'
                        : 'bg-[#F6B000] text-black shadow-lg shadow-[#F6B000]/30'
                        }`}
                    title="Enquire Now"
                >
                    <Package className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
}



// ─── Businesses We Cater To ──────────────────────────────────────────────────

function BusinessesCateredSection() {
    const categories = [
        {
            title: 'Retailers & Resellers',
            image: '/images/retailers.png',
        },
        {
            title: 'Hotels & Restaurants',
            image: '/images/Horeca.png',
        },
        {
            title: 'Bakeries & Confectionery',
            image: '/images/bakery.png',
        },
        {
            title: 'Corporate & Events',
            image: '/images/corporate_gifting.png',
        },
    ];

    return (
        <section className="max-w-7xl mx-auto px-6 py-10 md:py-16">
            <div className="text-center mb-12 md:mb-16">
                <SectionHeading
                    text="Industries We"
                    highlight="Supply"
                    className="mb-3 !text-[24px] md:!text-4xl"
                />
                <div className="w-16 h-1 bg-[#F6B000] mx-auto rounded-full mb-6" />
                <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                    Consistent quality and reliable volume for businesses of all sizes.
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                {categories.map((cat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        onClick={() => {
                            const form = document.getElementById('bulk-inquiry-form');
                            form?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="group flex flex-col items-center cursor-pointer"
                    >
                        {/* Dark Image Card with text inside */}
                        <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-gray-900 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
                            <Image
                                src={cat.image}
                                alt={cat.title}
                                fill
                                className="object-cover object-center transition-all duration-700 group-hover:scale-105"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"
                            />

                            {/* Minimal gradient only at very bottom for text */}
                            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/65 to-transparent" />

                            {/* Title text at bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                <h3 className="text-white font-medium text-base md:text-lg leading-snug group-hover:font-black group-hover:text-[#F6B000] transition-all duration-300">
                                    {cat.title}
                                </h3>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

function OurGradesSection({
    onEnquire,
    onSelectCheck
}: {
    onEnquire: (grade: string) => void;
    onSelectCheck: (grade: string) => boolean;
}) {
    const [activeTab, setActiveTab] = useState(gradeCategories[0].id);
    const { ref, visible } = useIntersectionObserver(0.1);
    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [cardWidth, setCardWidth] = useState(0);

    // Responsive card width: 4 on desktop, 3 on tablet, 2 on mobile
    useEffect(() => {
        const updateWidth = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.offsetWidth;
            const gap = 16; // gap-4 = 16px
            if (window.innerWidth >= 1024) {
                setCardWidth((w - gap * 3) / 4); // 4 cards
            } else if (window.innerWidth >= 768) {
                setCardWidth((w - gap * 2) / 3); // 3 cards
            } else {
                setCardWidth((w - gap) / 2); // 2 cards
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const activeCategory = gradeCategories.find(c => c.id === activeTab) || gradeCategories[0];

    const scroll = (dir: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const amount = cardWidth + 16;
        scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
    };

    return (
        <section className="max-w-7xl mx-auto px-6 py-4 md:py-6">
            {/* Section Title */}
            <div ref={ref} className="text-center mb-6 md:mb-8">
                <SectionHeading
                    text="Our"
                    highlight="Grades"
                    className="mb-2 !text-[22px] md:!text-4xl"
                />
                <div className="w-16 h-1 bg-[#F6B000] mx-auto rounded-full mb-4" />
                <p className="text-gray-500 max-w-2xl mx-auto text-[13px] leading-relaxed italic">
                    Premium factory-processed grades optimized for diverse B2B applications.
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-nowrap overflow-x-auto justify-start md:justify-center gap-3 mb-8 pb-4 no-scrollbar -mx-6 px-6 md:mx-0">
                {gradeCategories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className={`group flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-300 text-sm shadow-sm border ${activeTab === cat.id
                            ? 'bg-[#F6B000] text-black border-[#F6B000] px-5 md:px-6 py-3'
                            : 'bg-white text-gray-500 border-gray-100 hover:border-[#F6B000] hover:text-gray-900 px-4 md:px-6 py-3'
                            }`}
                    >
                        <span className={`${activeTab === cat.id ? 'text-black' : 'text-gray-400 group-hover:text-[#F6B000]'}`}>
                            {cat.icon}
                        </span>
                        <span className={`${activeTab === cat.id ? 'block' : 'hidden md:block'}`}>
                            {cat.title}
                        </span>
                    </button>
                ))}
            </div>

            {/* Tab Content — Horizontal Scroll */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="relative"
                >
                    {/* Left Arrow */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center hover:bg-[#F6B000] hover:border-[#F6B000] transition-all duration-200 group"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-black" />
                    </button>

                    {/* Scrollable Row */}
                    <div ref={containerRef}>
                        <div
                            ref={scrollRef}
                            className="flex gap-4 overflow-x-auto no-scrollbar pb-4"
                            style={{ scrollSnapType: 'x mandatory' }}
                        >
                            {activeCategory.items.map((item) => (
                                <div
                                    key={item.code}
                                    className="flex-shrink-0"
                                    style={{ width: cardWidth > 0 ? cardWidth : undefined, scrollSnapAlign: 'start' }}
                                >
                                    <GradeCard
                                        item={item}
                                        onEnquire={onEnquire}
                                        isSelected={onSelectCheck(item.code)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center hover:bg-[#F6B000] hover:border-[#F6B000] transition-all duration-200 group"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-black" />
                    </button>
                </motion.div>
            </AnimatePresence>
        </section>
    );
}


// ─── Why Partner With Us ──────────────────────────────────────────────────────
function WhyPartnerWithUsSection() {
    const pillars = [
        {
            icon: <Target className="w-7 h-7 text-[#138808]" />,
            title: "Precision Optical Grading",
            pain: "Inconsistent sizing and mixed batches ruining packaging lines.",
            copy: "Utilizing advanced automated cutting machinery, we ensure strict uniformity across every batch. A WW 320 from us is exactly a WW 320, every single time.",
            accent: '#138808',
        },
        {
            icon: <Leaf className="w-7 h-7 text-[#F6B000]" />,
            title: "Pristine Processing",
            pain: "Bitter taste and residue.",
            copy: "Our Siliguri facility utilizes specialized technical processes to completely remove CNSL oil deposits, guaranteeing a flawlessly clean profile and a farm-fresh crunch.",
            accent: '#F6B000',
        },
        {
            icon: <ShieldCheck className="w-7 h-7 text-[#138808]" />,
            title: "Zero-Compromise Integrity",
            pain: "High breakage rates and wasted product.",
            copy: "From raw sourcing to final packing, our automated handling processes are optimized to protect the nut, delivering a maximum yield of perfectly intact wholes.",
            accent: '#138808',
        },
        {
            icon: <CalendarDays className="w-7 h-7 text-[#F6B000]" />,
            title: "Uninterrupted Supply",
            pain: "Festival season stockouts and unreliable vendors.",
            copy: "By directly sourcing raw materials from Africa and leveraging our massive in-house processing capacity, we guarantee reliable volume and timely delivery, even during peak market demand.",
            accent: '#F6B000',
        }
    ];

    return (
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
            {/* Heading */}
            <div className="text-center mb-16">
                <SectionHeading
                    text="Why Partner"
                    highlight="With Us?"
                    className="mb-4 !text-[28px] md:!text-4xl"
                />
                <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
                    We solve the most common B2B cashew supply chain headaches
                    so you can focus on growing your brand.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pillars.map((pillar, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        className="relative bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.09)] transition-all duration-300 flex flex-col group overflow-hidden"
                    >
                        {/* Colored top accent bar */}
                        <div
                            className="h-1 w-full"
                            style={{ backgroundColor: pillar.accent }}
                        />

                        <div className="p-7 flex flex-col flex-grow">
                            {/* Icon */}
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                                style={{ backgroundColor: `${pillar.accent}15` }}
                            >
                                {pillar.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-[17px] font-black text-gray-900 mb-4 leading-snug">
                                {pillar.title}
                            </h3>

                            {/* Pain point — styled as a quote block */}
                            <div
                                className="flex gap-2.5 items-start mb-4 pb-4 border-b border-gray-100"
                            >
                                <div
                                    className="mt-0.5 w-1 shrink-0 self-stretch rounded-full"
                                    style={{ backgroundColor: pillar.accent }}
                                />
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">
                                        Pain Point
                                    </span>
                                    <p className="text-[13px] text-gray-600 italic leading-snug">
                                        "{pillar.pain}"
                                    </p>
                                </div>
                            </div>

                            {/* Solution copy */}
                            <p className="text-[13px] text-gray-500 leading-relaxed flex-grow">
                                {pillar.copy}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
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
        partnershipType: '',
        fssaiGstin: '',
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

    const onSelectCheck = (grade: string) => {
        return formData.requirements.toLowerCase().includes(grade.toLowerCase());
    };

    const scrollToForm = (grade?: string) => {
        if (grade) {
            setFormData(prev => ({
                ...prev,
                requirements: grade + ', ' + prev.requirements
            }));
        }
        scrollTo(formRef);
    };

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
                    partnership_type: formData.partnershipType,
                    fssai_gstin: formData.fssaiGstin,
                    volume: formData.volume,
                    requirements: formData.requirements,
                    message: `BULK ORDER INQUIRY\nCompany: ${formData.company}\nPartnership: ${formData.partnershipType}\nFSSAI/GSTIN: ${formData.fssaiGstin}\nVolume: ${formData.volume}\nRequirements: ${formData.requirements}`,
                }),
            });
            if (res.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', phone: '', company: '', partnershipType: '', fssaiGstin: '', volume: '', requirements: '' });
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
        <div className={`min-h-screen bg-[#FFF9E7]`}>
            {/* ── Hero ── */}
            <section className="relative w-full pt-6 pb-12 md:pt-10 md:pb-20 overflow-hidden">

                {/* Background Image */}
                <div className="absolute top-0 left-0 z-0 w-full h-[60%]">
                    <img
                        src="https://res.cloudinary.com/da1acfqsn/image/upload/v1777750353/ChatGPT_Image_May_3_2026_01_02_14_AM_jae8us.png"
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#FFF9E7] to-transparent pointer-events-none" />
                </div>

                {/* Background Decor blobs */}
                <div className="absolute top-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-white opacity-60 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none z-0" />
                <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#F6B000] opacity-[0.05] rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none z-0" />

                <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center">

                    {/* Eyebrow tag */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="inline-flex items-center gap-2 bg-[#F6B000]/10 border border-[#F6B000]/30 text-[#c48a00] text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F6B000] animate-pulse" />
                        B2B &amp; Wholesale Supply
                    </motion.div>

                    {/* Headline — fixed line break */}
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-[26px] md:text-[42px] font-black text-black leading-[1.3] mb-4 max-w-3xl mx-auto"
                    >
                        Premium{' '}
                        <span className="text-[#F6B000]">Factory-Direct</span>{' '}
                        Cashews<br />
                        for{' '}
                        <span
                            className="text-transparent bg-clip-text"
                            style={{
                                backgroundImage: 'linear-gradient(to right, #FF9933 0%, #138808 100%)',
                                WebkitTextStroke: '0.3px rgba(0,0,0,0.12)',
                                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
                            }}
                        >
                            India's
                        </span>{' '}
                        Top Businesses.
                    </motion.h1>

                    {/* Subtitle — shorter, punchier */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[14px] md:text-[16px] text-gray-500 leading-relaxed mb-8 max-w-xl mx-auto font-medium"
                    >
                        Processed in our state-of-the-art Siliguri facility.
                        We combine premium raw material sourcing with advanced automated grading to deliver consistent,
                        export-quality cashews at wholesale volume.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 w-full sm:w-auto"
                    >
                        <button
                            onClick={() => scrollTo(formRef)}
                            className="w-full sm:w-auto h-12 flex items-center justify-center gap-2 bg-[#F6B000] text-black font-bold px-8 rounded-xl shadow-[0_4px_20px_rgba(246,176,0,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 text-sm"
                        >
                            <i className="fa-solid fa-tag text-xs" />
                            Request Bulk Pricing
                        </button>
                        <button
                            onClick={() => {
                                document.getElementById('our-grades-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full sm:w-auto h-12 flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-800 font-bold px-8 rounded-xl transition-all duration-300 hover:border-[#F6B000] hover:text-black active:scale-95 text-sm shadow-sm"
                        >
                            <i className="fa-solid fa-layer-group text-xs text-[#F6B000]" />
                            Explore Our Grades
                        </button>
                    </motion.div>

                    {/* Trust badges — more prominent */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="flex flex-wrap items-center justify-center gap-3 mb-10"
                    >
                        {[
                            { icon: 'fa-certificate', label: 'ISO Certified Facility' },
                            { icon: 'fa-truck', label: 'Pan-India Delivery' },
                            { icon: 'fa-boxes-stacked', label: 'Bulk Orders Welcome' },
                            { icon: 'fa-headset', label: 'Dedicated B2B Support' },
                        ].map(badge => (
                            <span
                                key={badge.label}
                                className="flex items-center gap-2 bg-white border border-gray-100 shadow-sm text-gray-700 text-[12px] font-semibold px-4 py-2 rounded-full"
                            >
                                <i className={`fa-solid ${badge.icon} text-[#F6B000] text-[11px]`} />
                                {badge.label}
                            </span>
                        ))}
                    </motion.div>

                    {/* Video */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="w-full relative rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] bg-white border-[6px] md:border-8 border-white aspect-[4/3] sm:aspect-video md:aspect-[21/9]"
                    >
                        <video
                            src="https://res.cloudinary.com/da1acfqsn/video/upload/v1777747446/VN20260503_001215_u2yinn.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            className="w-full h-full object-cover"
                        />

                        {/* Video overlay label */}
                        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                            Yu Nut Processing — Siliguri Facility
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* ── Our Trusted Partners ── */}
            <section className={`w-full py-10 ${COLORS.bg} border-y border-gray-100/50 overflow-hidden relative z-20`}>
                <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
                    <SectionHeading
                        text="Trusted by India's"
                        highlight="Leading Businesses"
                        className="mb-3 !text-[24px] md:!text-4xl"
                    />
                </div>

                {/* Infinite Marquee */}
                <div className={`flex overflow-hidden w-full ${COLORS.bg} select-none`}>
                    <motion.div
                        className="flex items-center gap-16 md:gap-24 whitespace-nowrap px-8"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
                    >
                        {/* Repeat logos twice for seamless loop */}
                        {[...Array(2)].map((_, idx) => (
                            <div key={idx} className="flex items-center gap-16 md:gap-24 grayscale opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-default">
                                <i className="fa-brands fa-amazon text-5xl md:text-6xl text-gray-600"></i>
                                <i className="fa-brands fa-google text-5xl md:text-6xl text-gray-600"></i>
                                <i className="fa-brands fa-microsoft text-5xl md:text-6xl text-gray-600"></i>
                                <i className="fa-brands fa-airbnb text-5xl md:text-6xl text-gray-600"></i>
                                <i className="fa-brands fa-dhl text-5xl md:text-6xl text-gray-600"></i>
                                <i className="fa-brands fa-meta text-5xl md:text-6xl text-gray-600"></i>
                                <i className="fa-brands fa-stripe text-5xl md:text-6xl text-gray-600"></i>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Businesses We Cater To ── */}
            <div className={COLORS.bg}>
                <BusinessesCateredSection />
            </div>


            <div className="w-full h-px bg-gray-100 mx-auto max-w-4xl" />

            {/* ── Why Partner With Us ── */}
            <div className={COLORS.bg}>
                <WhyPartnerWithUsSection />
            </div>

            <div className="w-full h-px bg-gray-100 mx-auto max-w-4xl" />

            {/* ── Our Grades ── */}
            <div className={COLORS.bg}>
                <OurGradesSection onEnquire={scrollToForm} onSelectCheck={onSelectCheck} />
            </div>

            <div className="max-w-7xl mx-auto px-6 mb-12">
                <WhiteLabelBanner />
            </div>

            {/* ── Bulk Order Form ── */}
            <div ref={formRef} id="bulk-inquiry-form" className="max-w-7xl mx-auto px-6 py-4 md:py-6" style={{ scrollMarginTop: '80px' }}>
                {/* Form section label */}
                <div className="text-center mb-6 md:mb-8">
                    <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: '#F6B000', color: '#000000' }}>
                        Get a Quote
                    </span>
                    <SectionHeading
                        text="Wholesale"
                        highlight="Inquiries"
                        className="mb-2 !text-[22px] md:!text-4xl"
                    />
                    <p className="text-gray-500 max-w-2xl mx-auto text-[13px] leading-relaxed italic">
                        Our B2B team responds within 24 hours with a tailored quote and priority service.
                    </p>
                </div>

                <div className="bg-white rounded-2xl md:rounded-[3rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100 min-h-[600px]">
                    {/* Form */}
                    <div className="w-full md:w-3/5 p-8 md:p-12">
                        <h2
                            className="text-3xl font-bold text-gray-900 mb-2"
                            style={{ fontFamily: 'Georgia, serif' }}
                        >
                            Request Custom Wholesale Pricing
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
                                            style={{ '--tw-ring-color': '#F6B000' } as any}
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
                                            style={{ '--tw-ring-color': '#F6B000' } as any}
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
                                            style={{ '--tw-ring-color': '#F6B000' } as any}
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
                                            style={{ '--tw-ring-color': '#F6B000' } as any}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
                                            Partnership Type *
                                        </label>
                                        <select
                                            required
                                            value={formData.partnershipType}
                                            onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                            style={{ '--tw-ring-color': '#F6B000' } as any}
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Retailer">Retailer / Reseller</option>
                                            <option value="HoReCa">Hotel / Restaurant / Cafe</option>
                                            <option value="Bakery">Bakery / Confectionery</option>
                                            <option value="Corporate">Corporate / Events</option>
                                            <option value="Distributor">Distributor / Wholesaler</option>
                                            <option value="Other">Other Business</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
                                            FSSAI / GSTIN (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter ID if applicable"
                                            value={formData.fssaiGstin}
                                            onChange={(e) => setFormData({ ...formData, fssaiGstin: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                            style={{ '--tw-ring-color': '#F6B000' } as any}
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
                                        style={{ '--tw-ring-color': '#F6B000' } as any}
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
                                    style={{ backgroundColor: '#F6B000', color: '#000000' }}
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