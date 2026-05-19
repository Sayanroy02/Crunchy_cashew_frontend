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
        title: 'Premium Wholes',
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
                code: 'WW 210',
                image: '/images/WW240-min.png',
                tagline: 'Exceptionally large',
                description: 'Exceptionally large and flawless wholes, perfect for premium branded snacking lines.',
                origins: 'Ghana · Ivory Coast · Tanzania',
                link: 'http://www.amazon.in/dp/B0983W92KN?ref=myi_title_dp',
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
            {
                code: 'p 210',
                image: '/images/WW180-min.png',
                tagline: 'Naturally pale-ivory',
                description: 'Large, naturally pale-ivory jumbos that are excellent for flavored or roasted snacking lines.',
                origins: 'Guinea Bissau · Senegal',
                link: 'http://www.amazon.in/dp/B0987SRM89?ref=myi_title_dp',
            },
            {
                code: 'P 280',
                image: '/images/WW320-min.png',
                tagline: 'Subtly pale',
                description: 'Subtly pale large wholes that offer premium texture and crunch at a highly competitive wholesale margin.',
                origins: 'Guinea Bissau · Senegal',
                link: 'http://www.amazon.in/dp/B0987SRM89?ref=myi_title_dp',
            },
            {
                code: 'SW 280',
                image: '/images/SW240-min.png',
                tagline: 'Lightly scorched',
                description: 'Lightly scorched large wholes delivering a rich, robust flavor that is ideal for commercial roasting.',
                origins: 'Guinea Bissau · Senegal',
                link: 'http://www.amazon.in/dp/B0987SRM89?ref=myi_title_dp',
            },
        ],
    },
    {
        id: 'scorched-wholes',
        title: 'Precision Pieces',
        icon: <UtensilsCrossed className="w-4 h-4" />,
        subtitle: 'Ideal for roasting, coating, and processing — where appearance is secondary.',
        accent: '#F6B000',
        items: [
            {
                code: 'JH / 2pc',
                image: '/images/SS-min.png',
                tagline: 'Scorched Halved',
                description: 'Perfectly split jumbo halves, delivering a premium look for high-end confectionery and garnishing.',
                origins: 'Multi-origin',
                link: 'http://www.amazon.in/dp/B09854W53D?ref=myi_title_dp',
            },
            {
                code: 'JK / 4pc',
                image: '/images/SP-min.png',
                tagline: 'Most Popular Scorched',
                description: 'Uniformly quartered pieces, providing excellent crunch and volume for bakery and culinary inputs.',
                origins: 'Multi-origin',
                link: 'http://www.amazon.in/dp/B0983Z14VC?ref=myi_title_dp',
            },
            {
                code: 'JH2',
                image: '/images/SS-min.png',
                tagline: 'Scorched Halved',
                description: 'Symmetrical standard halves tailored for cost-effective integration into commercial snacks and sweets.',
                origins: 'Multi-origin',
                link: 'http://www.amazon.in/dp/B09854W53D?ref=myi_title_dp',
            },
            {
                code: 'Splits',
                image: '/images/S-min.png',
                tagline: 'Halved Whole',
                description: 'Cleanly separated standard halves, a reliable staple ingredient for bulk food production.',
                origins: 'Multi-origin',
                link: 'http://www.amazon.in/dp/B09854W53D?ref=myi_title_dp',
            },
            {
                code: 'LWP',
                image: '/images/LWP-min.png',
                tagline: 'Quartered',
                description: 'Distinct, bite-sized large white pieces with zero dust, perfect for chocolate manufacturing and premium baking.',
                origins: 'Multi-origin',
                link: 'http://www.amazon.in/dp/B09856N2D8?ref=myi_title_dp',
            },
            {
                code: 'SWP',
                image: '/images/WSP.png',
                tagline: 'Micro Pieces',
                description: 'Finely sized small white pieces offering uniform distribution and texture for health bars and commercial pastries.',
                origins: 'Multi-origin',
                link: 'http://www.amazon.in/dp/B09856JVLD?ref=myi_title_dp',
            },
        ],
    },
    {
        id: 'cashew-forms',
        title: 'Enterprise Grades',
        icon: <ShoppingBag className="w-4 h-4" />,
        subtitle: 'Splits and pieces — optimized for toppings, coatings, and culinary formulations.',
        accent: '#000000',
        items: [
            {
                code: 'Government Tender Grade',
                image: '/images/WW240-min.png',
                tagline: 'Halved Whole',
                description: 'Strictly sorted Grade 240 wholes that rigorously meet and exceed government tender specifications.',
                origins: 'Multi-origin',
                link: 'http://www.amazon.in/dp/B09854W53D?ref=myi_title_dp',
            },
            {
                code: 'Hospitality Grade',
                image: '/images/WW450-min.png',
                tagline: 'Quartered',
                description: 'Flawless, optically sorted king-size wholes reserved exclusively for luxury hotel mini-bars and premium lounges.',
                origins: 'Multi-origin',
                link: 'http://www.amazon.in/dp/B09856N2D8?ref=myi_title_dp',
            },
            {
                code: 'Confectionery Grade',
                image: '/images/S-min.png',
                tagline: 'Micro Pieces',
                description: 'Highly uniform, dust-free splits designed for even baking and seamless integration into premium chocolates.',
                origins: 'Multi-origin',
                link: 'http://www.amazon.in/dp/B09856JVLD?ref=myi_title_dp',
            },
            {
                code: 'Gifting Grade',
                image: '/images/WW240-min.png',
                tagline: 'Scorched Halved',
                description: 'Unblemished, visually perfect wholes curated specifically for high-end festival hampers and corporate gifts.',
                origins: 'Multi-origin',
                link: 'http://www.amazon.in/dp/B09854W53D?ref=myi_title_dp',
            },
        ],
    },
];

// ─── All grade suggestion chips (flat list for the form) ──────────────────────

const ALL_GRADE_SUGGESTIONS = [
    // White Wholes
    { label: 'WW 180', tag: 'Jumbo', color: '#F6B000', text: 'WW 180' },
    { label: 'WW 240', tag: 'Large', color: '#F6B000', text: 'WW 240' },
    { label: 'WW 320', tag: 'Popular', color: '#F6B000', text: 'WW 320' },
    { label: 'WW 400', tag: 'Value', color: '#F6B000', text: 'WW 400' },
    // Scorched Wholes
    { label: 'SW 240', tag: 'Scorched', color: '#000000', text: 'SW 240' },
    { label: 'SW 320', tag: 'Scorched', color: '#000000', text: 'SW 320' },
    { label: 'SW 400', tag: 'Scorched', color: '#000000', text: 'SW 400' },
    // Cashew Forms
    { label: 'White Splits', tag: 'Form', color: '#000000', text: 'White Splits' },
    { label: 'Large White Pieces', tag: 'Form', color: '#000000', text: 'Large White Pieces' },
    { label: 'Small White Pieces', tag: 'Form', color: '#000000', text: 'Small White Pieces' },
    { label: 'Scorched Splits', tag: 'Form', color: '#000000', text: 'Scorched Splits' },
    { label: 'Scorched Pieces', tag: 'Form', color: '#000000', text: 'Scorched Pieces' },
    { label: 'Small Scorched Pieces', tag: 'Form', color: '#000000', text: 'Small Scorched Pieces' },
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
    onToggle,
    isSelected,
}: {
    item: (typeof gradeCategories)[0]['items'][0];
    onToggle: (grade: string) => void;
    isSelected: boolean;
}) {
    return (
        <div
            onClick={() => onToggle(item.code)}
            className="group flex flex-col items-center cursor-pointer transition-all duration-300 py-2 isolate"
        >
            {/* Bowl Image — Circular and Tucked */}
            <div className="relative w-full aspect-square z-20 rounded-full overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <img
                    src={item.image}
                    alt={item.code}
                    className="w-full h-full object-cover transition-all duration-500 transform scale-[1.05] mix-blend-multiply"
                    onError={(e: any) => { e.currentTarget.src = '/images/crunchy-cashews-product.png'; }}
                />
            </div>

            {/* Name Tag — Tucked under the bowl */}
            <div
                className="relative z-10 -mt-3 md:-mt-10 transition-all duration-300 text-center"
            >
                <span
                    className={`text-[1.1rem] md:text-[1.2rem] font-extrabold uppercase tracking-tight transition-colors duration-300 block group-hover:text-[#F6B000] ${isSelected ? 'text-[#F6B000]' : 'text-gray-900'
                        }`}
                    style={{
                        lineHeight: '1.1'
                    }}
                >
                    {item.code}
                </span>
            </div>
        </div>
    );
}



// ─── Businesses We Cater To ──────────────────────────────────────────────────

function BusinessesCateredSection({ openWhatsApp }: { openWhatsApp: (source: string, grade?: string, customMessage?: string) => void }) {
    const categories = [
        {
            title: 'Retailers & Resellers',
            image: '/images/retailers.png',
            message: "Hello,\nI’m interested in partnering as a retailer/reseller for your products. Could you please share your bulk pricing, margin structure, and minimum order requirements?\nLooking forward to collaborating with you. Thank you!"
        },
        {
            title: 'Hotels & Restaurants',
            image: '/images/horeca.png',
            message: "Hello,\nI’m interested in sourcing your products for our hotel/restaurant. Could you please provide details on bulk pricing, supply capacity, and delivery options?\nLooking forward to your response. Thank you!"
        },
        {
            title: 'Bakeries & Confectionery',
            image: '/images/bakery-image.png',
            message: "Hello,\nI’d like to use your products for our bakery/confectionery needs. Please share your bulk pricing, product varieties, and minimum order details.\nExcited to explore this further. Thank you!"
        },
        {
            title: 'Corporate & Events',
            image: '/images/corporate-gifting.png',
            message: "Hello,\nI’m interested in bulk orders for corporate/events purposes. Could you please share pricing details, customization options, and minimum order quantity?\nLooking forward to working together. Thank you!"
        },
    ];

    return (
        <section className="max-w-7xl mx-auto px-6 py-10 md:py-10 relative">
            {/* Smaller Floating Parachute Cashew (desktop only) */}
            <motion.div
                initial={{ y: 0, rotate: -5 }}
                animate={{
                    y: [0, -20, 0],
                    rotate: [-6, 6, -6],
                    x: [0, 6, 0]
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute right-[-2%] xl:right-[-4%] top-0 w-[90px] lg:w-[110px] pointer-events-none select-none z-10 hidden xl:block"
            >
                <img
                    src="/images/Cashew-parachute-03-p-800.png"
                    alt="Parachute Cashew"
                    className="w-full h-auto drop-shadow-2xl"
                />
            </motion.div>

            <div className="text-center mb-12 md:mb-16">
                <SectionHeading
                    text="Industries"
                    highlight="We Supply"
                    className="mb-3 !text-[24px] md:!text-4xl"
                />
                <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                    Consistent quality and reliable volume for businesses of all sizes.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {categories.map((cat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        onClick={() => {
                            openWhatsApp('Industry Supply', undefined, cat.message);
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

                            {/* Deeper gradient covering a larger area for absolute contrast on mobile */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-90 transition-all duration-500" />

                            {/* Title and Button at bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-5 md:p-3.5 lg:p-5 xl:p-6 z-10">
                                <h3 className="text-white font-extrabold text-[13px] sm:text-base md:text-sm lg:text-lg xl:text-xl leading-tight transition-all duration-300 mb-2 md:mb-3 lg:mb-0 lg:group-hover:mb-4 text-center lg:text-left drop-shadow-md">
                                    {cat.title}
                                </h3>

                                <div className="h-9 sm:h-10 md:h-8.5 lg:h-0 lg:opacity-0 lg:group-hover:h-11 lg:group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openWhatsApp('Industry Supply', undefined, cat.message);
                                        }}
                                        className="w-full h-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-lg lg:rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 shadow-md"
                                    >
                                        <i className="fa-brands fa-whatsapp text-white text-sm" />
                                        <span className="text-[10px] sm:text-[11px] md:text-[9.5px] lg:text-xs uppercase tracking-[0.1em]">Enquire</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
// ─── Trusted Partners Marquee ─────────────────────────────────────────────────
function TrustedMarquee() {
    const trackRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<number>(0);
    const xRef = useRef<number>(0);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const singleSetWidth = track.scrollWidth / 5;
        const speed = 0.8; // increase for faster

        const tick = () => {
            xRef.current -= speed;
            if (Math.abs(xRef.current) >= singleSetWidth) {
                xRef.current = 0;
            }
            track.style.transform = `translateX(${xRef.current}px)`;
            animRef.current = requestAnimationFrame(tick);
        };

        animRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animRef.current);
    }, []);

    return (
        <div className={`flex overflow-hidden w-full select-none`}>
            <div
                ref={trackRef}
                className="flex w-max items-center gap-16 md:gap-24 whitespace-nowrap px-8 will-change-transform"
            >
                {[...Array(5)].map((_, idx) => (
                    <div key={idx} className="flex items-center gap-16 md:gap-24 shrink-0">
                        <img src="/images/partners/reliance-logo.png" alt="Smart Bazaar" className="h-20 md:h-30 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                        <img src="/images/partners/Global-nuts.png" alt="Global Nuts" className="h-12 md:h-16 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                        <img src="/images/partners/9to10-logo.png" alt="9to10" className="h-16 md:h-24 w-auto object-contain grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                        <img src="/images/partners/natures-nut.png" alt="Nature's Nut" className="h-12 md:h-16 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                        <img src="/images/partners/SPENCERS%20Logo.png" alt="Spencers" className="h-12 md:h-16 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function OurGradesSection({
    onSelectCheck,
    onToggleGrade,
    openWhatsApp,
}: {
    onSelectCheck: (grade: string) => boolean;
    onToggleGrade: (grade: string) => void;
    openWhatsApp: (source: string, grade?: string, customMessage?: string) => void;
}) {
    const [activeTab, setActiveTab] = useState(gradeCategories[0].id);
    const { ref, visible } = useIntersectionObserver(0.1);
    const scrollRef = useRef<HTMLDivElement>(null);

    const activeCategory = gradeCategories.find(c => c.id === activeTab) || gradeCategories[0];

    const scroll = (dir: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const firstCard = scrollRef.current.firstElementChild as HTMLElement;
        if (firstCard) {
            const cardWidth = firstCard.offsetWidth;
            const amount = cardWidth + 24; // gap-6 = 24px
            scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
        }
    };

    return (
        <section id="our-grades-section" className="max-w-7xl mx-auto px-6 py-10 md:py-10" style={{ scrollMarginTop: '100px' }}>
            {/* Section Title */}
            <div ref={ref} className="text-center mb-6 md:mb-8">
                <SectionHeading
                    text="Precision-Graded Cashews for"
                    highlight="Every Application"
                    className="mb-4 !text-[24px] md:!text-4xl lg:!text-5xl"
                />
                <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                    Optically sorted and processed to exact Yunut Processing Industry specifications for diverse B2B requirements.
                </p>
            </div>


            {/* Tab Navigation */}
            <div className="flex flex-nowrap overflow-x-auto justify-start md:justify-center gap-3 mb-4 pb-2 no-scrollbar -mx-6 px-6 md:mx-0">
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
                    <div className="w-full">
                        <div
                            ref={scrollRef}
                            className="flex gap-6 overflow-x-auto no-scrollbar pb-4"
                            style={{ scrollSnapType: 'x mandatory' }}
                        >
                            {activeCategory.items.map((item) => (
                                <div
                                    key={item.code}
                                    className="w-[calc((100%-24px)/2)] md:w-[calc((100%-48px)/3)] lg:w-[calc((100%-72px)/4)] shrink-0"
                                    style={{ scrollSnapAlign: 'start' }}
                                >
                                    <GradeCard
                                        item={item}
                                        onToggle={onToggleGrade}
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

            {/* Symmetrical Centered Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 md:mt-12 z-20 relative px-4">
                {/* Enquire Now with WhatsApp logo */}
                <button
                    onClick={() => openWhatsApp(
                        'enquiry now about cashew grade button',
                        undefined,
                        'Hello 👋 I’m interested in learning more about your bulk pricing options. Could you please share details regarding pricing tiers, minimum order quantities, and any available discounts?'
                    )}
                    className="w-full sm:w-auto bg-green-700 text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2.5"
                >
                    <i className="fa-brands fa-whatsapp text-base md:text-lg text-white" />
                    Enquire Now
                </button>

                {/* Download Catalogue button */}
                <a
                    href="/document/Cashew-Catalogue.pdf"
                    download="Cashew-Catalogue.pdf"
                    className="w-full sm:w-auto bg-transparent p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2.5 border-2"
                    style={{ borderColor: COLORS.heading, color: COLORS.heading }}
                >
                    <i className="fa-solid fa-download text-sm md:text-base" />
                    Download Catalogue
                </a>
            </div>
        </section>
    );
}


// ─── Why Partner With Us ──────────────────────────────────────────────────────
function WhyPartnerWithUsSection({ openWhatsApp }: { openWhatsApp: (source: string, grade?: string, customMessage?: string) => void }) {
    const pillars = [
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#138808" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 shrink-0">
                    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
                </svg>
            ),
            title: "Exact Grade, Every Batch",
            pain: "Wrong sizes mixed in — packaging lines break down",
            desc: "Avoid packaging line breakdowns. Our automated optical sorters guarantee perfect, uniform sizing in every single batch.",
            accent: '#138808',
            painBg: '#13880810',
            painTextColor: '#0d5e06',
            painLabelColor: '#138808',
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#138808" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 shrink-0">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
                </svg>
            ),
            title: "Fewer Broken Nuts, More Profit",
            pain: "High breakage wastes product and cuts into margins",
            desc: "Maximize your wholesale margins. Gentle, automated handling protects each cashew from intake to the final package.",
            accent: '#138808',
            painBg: '#13880810',
            painTextColor: '#0d5e06',
            painLabelColor: '#138808',
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 640 640" fill="#F6B000" className="w-6 h-6 shrink-0">
                    <path d="M64 320C64 290.4 69 262.1 78.2 235.6L95.5 252.5L90.9 279.5C86.7 303.9 96.5 325.7 112.9 339.4C122.7 445.2 211.7 528.1 320 528.1C428.3 528.1 517.4 445.3 527.1 339.5C543.5 325.8 553.2 304.1 549.1 279.6L544.5 252.6L561.8 235.7C571 262.1 576 290.5 576 320.1C576 461.5 461.4 576.1 320 576.1C178.6 576.1 64 461.4 64 320zM320 112C304.8 112 290 113.6 275.7 116.7L265.4 95.8C261 87 255.1 79.8 248.2 74.2C271 67.6 295.1 64 320 64C344.9 64 369 67.6 391.8 74.2C384.9 79.8 379 87 374.6 95.8L364.3 116.7C350 113.6 335.2 112 320 112zM436.2 366.3C448 362.7 459.9 372.4 455.8 384.1C436 440 382.7 480.1 320 480.1C257.3 480.1 204 440.1 184.2 384.2C180.1 372.6 192 362.8 203.8 366.4C238.5 377 278 382.9 319.9 382.9C361.9 382.9 401.4 376.9 436.2 366.3zM417.7 117.1C423.6 105.2 440.5 105.2 446.4 117.1L469.7 164.3L521.7 171.9C534.8 173.8 540.1 189.9 530.6 199.2L492.9 235.9L501.8 287.7C504 300.8 490.3 310.7 478.6 304.6L432 280L385.5 304.5C373.8 310.7 360 300.7 362.3 287.6L371.2 235.8L333.5 199.1C324 189.8 329.2 173.7 342.4 171.8L394.4 164.2L417.7 117zM222.4 117.1L245.7 164.3L297.7 171.9C310.8 173.8 316.1 189.9 306.6 199.2L268.9 235.9L277.8 287.7C280 300.8 266.3 310.7 254.6 304.6L208 280L161.5 304.5C149.8 310.7 136 300.7 138.3 287.6L147.2 235.8L109.5 199.1C100 189.8 105.2 173.7 118.4 171.8L170.4 164.2L193.7 117C199.6 105.1 216.5 105.1 222.4 117z" />
                </svg>
            ),
            title: "Clean Taste, No Bitterness",
            pain: "Bitter aftertaste and oily residue ruin the product",
            desc: "Zero bitter aftertaste. Advanced processing fully removes CNSL oil, delivering a clean, farm-fresh crunch every single time.",
            accent: '#F6B000',
            painBg: '#F6B00012',
            painTextColor: '#7a5600',
            painLabelColor: '#c98f00',
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F6B000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 shrink-0">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="m9 16 2 2 4-4" />
                </svg>
            ),
            title: "Stock Ready When You Need It",
            pain: "Running out during festivals due to unreliable vendors",
            desc: "No peak-season shortages. Direct African sourcing and massive in-house processing ensure your shipments go out on time.",
            accent: '#F6B000',
            painBg: '#F6B00012',
            painTextColor: '#7a5600',
            painLabelColor: '#c98f00',
        }
    ];

    return (
        <section className="max-w-7xl mx-auto px-6 py-10 md:py-10 my-10 relative overflow-hidden">

            {/* 1. TABLET & DESKTOP VERSION (show on tablet and desktop, hidden on phone) */}
            <div className="hidden md:block">
                <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_2fr] gap-12 xl:gap-16 items-center">

                    {/* LEFT (Top on iPad): Branding & Main Headings */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col gap-5 text-center xl:text-left items-center xl:items-start"
                    >
                        {/* Tagline style: / Why Partner? */}
                        <div className="flex items-center gap-2 justify-center xl:justify-start">
                            <span className="text-xl font-extrabold text-[#F6B000]">/</span>
                            <span className="text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-[#00863D]">
                                Why Partner With Us?
                            </span>
                        </div>

                        <SectionHeading
                            text="The Crunchy"
                            highlight="Cashew Difference"
                            className="!text-3xl md:!text-5xl xl:!text-6xl font-black leading-[1.1] text-center xl:text-left mb-0 w-full"
                        />

                        <p className="text-gray-500 text-sm leading-relaxed max-w-lg xl:max-w-sm font-medium text-center xl:text-left mx-auto xl:mx-0">
                            We solve the most common B2B cashew supply chain headaches so you can focus entirely on growing your brand.
                        </p>

                        {/* CTA Buttons - Side by Side (forced row on md and above) */}
                        <div className="flex flex-row items-center justify-center xl:justify-start gap-3 sm:gap-4 mt-2 pt-4 border-t border-gray-100 w-full">
                            <button
                                onClick={() => {
                                    openWhatsApp(
                                        'why choose Us Section',
                                        undefined,
                                        'Hello 👋 I’m interested in learning more about your bulk pricing options. Could you please share details regarding pricing tiers, minimum order quantities, and any available discounts?'
                                    );
                                }}
                                className="bg-green-700 text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                <i className="fa-brands fa-whatsapp text-lg" />
                                Request bulk pricing
                            </button>
                            <button
                                onClick={() => {
                                    document.getElementById('our-grades-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="bg-transparent p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2 border-2 whitespace-nowrap"
                                style={{ borderColor: COLORS.heading, color: COLORS.heading }}
                            >
                                Explore Our Grades
                            </button>
                        </div>
                    </motion.div>

                    {/* RIGHT (Bottom on iPad): Symmetrical 2x2 Grid with green border lines */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 md:gap-y-16 relative xl:pl-6">
                        {/* Symmetrical Vertical green line down the middle */}
                        <div
                            className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[1.5px]"
                            style={{ backgroundColor: COLORS.heading, opacity: 0.3 }}
                        />

                        {/* Pillar 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            className="flex items-start gap-4 border-b pb-10 md:pb-12 md:pr-8"
                            style={{ borderColor: `${COLORS.heading}30` }}
                        >
                            <div className="p-2.5 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-gray-100 shrink-0">
                                {pillars[0].icon}
                            </div>
                            <div className="flex flex-col gap-1.5 text-left">
                                <h3 className="text-base md:text-[17px] font-bold text-gray-900 leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
                                    {pillars[0].title}
                                </h3>
                                <p className="text-gray-500 text-xs md:text-[13px] leading-relaxed">
                                    {pillars[0].desc}
                                </p>
                            </div>
                        </motion.div>

                        {/* Pillar 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="flex items-start gap-4 border-b pb-10 md:pb-12 md:pl-8"
                            style={{ borderColor: `${COLORS.heading}30` }}
                        >
                            <div className="p-2.5 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-gray-100 shrink-0">
                                {pillars[1].icon}
                            </div>
                            <div className="flex flex-col gap-1.5 text-left">
                                <h3 className="text-base md:text-[17px] font-bold text-gray-900 leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
                                    {pillars[1].title}
                                </h3>
                                <p className="text-gray-500 text-xs md:text-[13px] leading-relaxed">
                                    {pillars[1].desc}
                                </p>
                            </div>
                        </motion.div>

                        {/* Pillar 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="flex items-start gap-4 md:pt-4 md:pr-8"
                        >
                            <div className="p-2.5 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-gray-100 shrink-0">
                                {pillars[2].icon}
                            </div>
                            <div className="flex flex-col gap-1.5 text-left">
                                <h3 className="text-base md:text-[17px] font-bold text-gray-900 leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
                                    {pillars[2].title}
                                </h3>
                                <p className="text-gray-500 text-xs md:text-[13px] leading-relaxed">
                                    {pillars[2].desc}
                                </p>
                            </div>
                        </motion.div>

                        {/* Pillar 4 */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="flex items-start gap-4 md:pt-4 md:pl-8"
                        >
                            <div className="p-2.5 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-gray-100 shrink-0">
                                {pillars[3].icon}
                            </div>
                            <div className="flex flex-col gap-1.5 text-left">
                                <h3 className="text-base md:text-[17px] font-bold text-gray-900 leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
                                    {pillars[3].title}
                                </h3>
                                <p className="text-gray-500 text-xs md:text-[13px] leading-relaxed">
                                    {pillars[3].desc}
                                </p>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* 2. PHONE VERSION (show on mobile `< md`, hidden on tablet/desktop) */}
            <div className="md:hidden flex flex-col gap-8">
                {/* Header & Content */}
                <div className="flex flex-col gap-4 text-center items-center">
                    <div className="flex items-center gap-2 justify-center">
                        <span className="text-xl font-extrabold text-[#F6B000]">/</span>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00863D]">
                            Why Partner With Us?
                        </span>
                    </div>

                    <SectionHeading
                        text="The Crunchy"
                        highlight="Cashew Difference"
                        className="!text-3xl font-black leading-snug text-center mb-0 w-full"
                    />

                    <p className="text-gray-500 text-xs leading-relaxed max-w-xs font-medium text-center">
                        We solve the most common B2B cashew supply chain headaches so you can focus entirely on growing your brand.
                    </p>

                    {/* CTA Buttons - Side by Side */}
                    <div className="flex flex-row flex-wrap items-center justify-center gap-3 mt-1 pt-3 border-t border-gray-100 w-full">
                        <button
                            onClick={() => {
                                openWhatsApp(
                                    'why choose Us Section',
                                    undefined,
                                    'Hello 👋 I’m interested in learning more about your bulk pricing options. Could you please share details regarding pricing tiers, minimum order quantities, and any available discounts?'
                                );
                            }}
                            className="bg-green-700 text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2 text-xs whitespace-nowrap"
                        >
                            <i className="fa-brands fa-whatsapp text-sm" />
                            Request bulk pricing
                        </button>
                        <button
                            onClick={() => {
                                document.getElementById('our-grades-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="bg-transparent p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2 border-2 text-xs whitespace-nowrap"
                            style={{ borderColor: COLORS.heading, color: COLORS.heading }}
                        >
                            Explore Grades
                        </button>
                    </div>
                </div>

                {/* Card stack (as they were like before) */}
                <div className="flex flex-col gap-4">
                    {pillars.map((pillar, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden hover:border-gray-200 transition-colors duration-300"
                        >
                            <div className="h-1 w-full" style={{ backgroundColor: pillar.accent }} />

                            <div className="p-5 flex flex-col gap-4 flex-grow">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: pillar.painBg }}
                                    >
                                        {pillar.icon}
                                    </div>
                                    <h3 className="text-[15px] font-bold text-gray-900 leading-snug">
                                        {pillar.title}
                                    </h3>
                                </div>

                                <div
                                    className="rounded-xl px-3.5 py-3 flex gap-2.5 items-start"
                                    style={{ backgroundColor: pillar.painBg }}
                                >
                                    <span className="text-base mt-0.5">⚠</span>
                                    <div className="flex flex-col gap-1 text-left">
                                        <span
                                            className="text-[10px] font-semibold uppercase tracking-widest"
                                            style={{ color: pillar.painLabelColor }}
                                        >
                                            Your problem
                                        </span>
                                        <p
                                            className="text-[13px] font-semibold leading-snug"
                                            style={{ color: pillar.painTextColor }}
                                        >
                                            {pillar.pain}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100" />

                                <p className="text-[13px] text-gray-500 leading-relaxed text-left flex-grow">
                                    {pillar.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
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

    const toggleGrade = (grade: string) => {
        const currentReqs = formData.requirements;
        const gradeLower = grade.toLowerCase();

        // Split existing requirements and clean up
        const gradesArr = currentReqs.split(',').map(s => s.trim()).filter(Boolean);
        const index = gradesArr.findIndex(g => g.toLowerCase() === gradeLower);

        let newGrades;
        if (index > -1) {
            // Remove if already exists
            newGrades = gradesArr.filter((_, i) => i !== index);
        } else {
            // Add if not exists
            newGrades = [...gradesArr, grade];
        }

        setFormData(prev => ({
            ...prev,
            requirements: newGrades.join(', ')
        }));
    };

    const openWhatsApp = (source: string, grade?: string, customMessage?: string) => {
        const phoneNumber = '917847996343';
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const message = `*Source:* ${baseUrl}/bulk [${source}]\n\n${customMessage || `Hello 👋\n\nI’m interested in learning more about your bulk pricing options${grade ? ` for ${grade}` : ''}. Could you please share details regarding pricing tiers, minimum order quantities, and any available discounts?`}`;
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
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
            <section className="relative w-full pt-16 pb-10 md:pt-10 md:pb-10 overflow-hidden">

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
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-4"
                    >
                        <SectionHeading
                            text="Premium Factory-Direct Cashews for"
                            highlight="India's Top Businesses."
                            className="text-3xl md:text-4xl lg:text-5xl drop-shadow-sm max-w-3xl mx-auto"
                        />
                    </motion.div>

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
                            onClick={() => openWhatsApp('Request Bulk Pricing button')}
                            className="w-full sm:w-auto bg-green-700 text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2"
                        >
                            <i className="fa-brands fa-whatsapp text-base text-white" />
                            Request Bulk Pricing
                        </button>
                        <button
                            onClick={() => {
                                document.getElementById('our-grades-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full sm:w-auto bg-transparent p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2 border-2"
                            style={{ borderColor: COLORS.heading, color: COLORS.heading }}
                        >
                            <i className="fa-solid fa-compass text-xs" />
                            Explore Our Grades
                        </button>
                    </motion.div>

                    {/* Trust badges — more prominent */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="hidden md:flex flex-wrap items-center justify-center gap-3 mb-10"
                    >
                        {[
                            { icon: 'fa-certificate', label: 'ISO Certified Facility' },
                            { icon: 'fa-truck', label: 'Pan-India Delivery' },
                            { icon: 'fa-boxes-stacked', label: 'Small Minimum Orders' },
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

                    {/* Trust badges — Mobile (2x2 Grid below video) */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="grid grid-cols-2 md:hidden gap-2 mt-6 w-full"
                    >
                        {[
                            { icon: 'fa-certificate', label: 'ISO Certified Facility' },
                            { icon: 'fa-truck', label: 'Pan-India Delivery' },
                            { icon: 'fa-boxes-stacked', label: 'Small Minimum Orders' },
                            { icon: 'fa-headset', label: 'Dedicated B2B Support' },
                        ].map(badge => (
                            <span
                                key={badge.label}
                                className="flex items-center justify-center gap-1.5 bg-white border border-gray-100 shadow-sm text-gray-700 text-[10px] sm:text-[11px] font-semibold px-2 py-2.5 rounded-xl text-center leading-tight"
                            >
                                <i className={`fa-solid ${badge.icon} text-[#F6B000] text-[12px] shrink-0`} />
                                <span>{badge.label}</span>
                            </span>
                        ))}
                    </motion.div>

                </div>
            </section>

            {/* ── Our Trusted Partners ── */}
            <section className={`w-full py-5 ${COLORS.bg} border-y border-gray-100/50 overflow-hidden relative z-20`}>
                <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
                    <SectionHeading
                        text="Trusted by India's"
                        highlight="Leading Businesses"
                        className="mb-3 !text-[24px] md:!text-4xl"
                    />
                </div>


                {/* Infinite Marquee */}
                {/* Infinite Marquee */}
                <TrustedMarquee />
            </section>

            {/* ── Businesses We Cater To ── */}
            <div className={COLORS.bg}>
                <BusinessesCateredSection openWhatsApp={openWhatsApp} />
            </div>


            <div className="w-full h-px bg-gray-100 mx-auto max-w-4xl" />

            {/* ── Why Partner With Us ── */}
            <div className={COLORS.bg}>
                <WhyPartnerWithUsSection openWhatsApp={openWhatsApp} />
            </div>

            <div className="w-full h-px bg-gray-100 mx-auto max-w-4xl" />

            {/* ── Our Grades ── */}
            <div className={COLORS.bg}>
                <OurGradesSection onSelectCheck={onSelectCheck} onToggleGrade={toggleGrade} openWhatsApp={openWhatsApp} />
            </div>

            <div className="max-w-7xl mx-auto px-6 mb-10">
                <WhiteLabelBanner />
            </div>

            {/* ── Bulk Order Form ── */}
            <div className="relative w-full overflow-hidden">
                {/* ── Right corner fruit ── */}
                <div className="absolute right-0 top-1/3 w-32 md:w-44 lg:w-56 pointer-events-none select-none z-0 hidden md:block">
                    <img
                        src="/images/Right-Fruit-2-2-1.png"
                        alt=""
                        className="object-contain object-bottom w-full h-auto translate-x-8 md:translate-x-12"
                        aria-hidden="true"
                    />
                </div>

                <div ref={formRef} id="bulk-inquiry-form" className="max-w-7xl mx-auto px-6 py-10 md:py-10 relative z-10" style={{ scrollMarginTop: '80px' }}>
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
                                className="text-[22px] sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2"
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
                                        className="w-full text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2 disabled:opacity-70"
                                        style={{ backgroundColor: COLORS.heading, color: '#ffffff' }}
                                    >
                                        {submitStatus === 'loading' ? (
                                            <>
                                                <i className="fa-solid fa-spinner fa-spin text-sm md:text-xs" />
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-envelope text-sm md:text-xs" />
                                                <span>Submit Wholesale Inquiry</span>
                                            </>
                                        )}
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
                                        className="w-full text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2"
                                        style={{ backgroundColor: COLORS.heading, color: '#ffffff' }}
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
        </div>
    );
}