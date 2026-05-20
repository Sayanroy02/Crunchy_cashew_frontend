'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { API } from '@/constants/api';
import { COLORS } from '@/constants/styles';
import BlogCard from '@/components/ui/BlogCard';
import type { BlogCardData } from '@/components/ui/BlogCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { motion } from 'framer-motion';

const CATEGORIES = ['All', 'Health', 'Recipes', 'Sustainability'] as const;
type CategoryFilter = typeof CATEGORIES[number];

const CATEGORY_DISPLAY_NAMES: Record<CategoryFilter, string> = {
    'All': 'All Categories',
    'Health': 'Health',
    'Recipes': 'Recipes',
    'Sustainability': 'Sustainability',
};

export default function BlogsDirectory() {
    const [blogs, setBlogs] = useState<BlogCardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch(API.BLOGS)
            .then(res => res.json())
            .then(data => {
                setBlogs(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load blogs", err);
                setLoading(false);
            });
    }, []);

    // Close filter dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredBlogs = useMemo(() => {
        let result = [...blogs];

        // Category filter
        if (activeCategory !== 'All') {
            result = result.filter(b => {
                const cat = b.category || '';
                if (activeCategory === 'Health') return cat === 'Health' || cat === 'Health Articles';
                if (activeCategory === 'Recipes') return cat === 'Recipes' || cat === 'Recipes Blog';
                return cat === activeCategory;
            });
        }

        // Featured filter
        if (showFeaturedOnly) {
            result = result.filter(b => b.featured);
        }

        // Search filter
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(b =>
                b.title.toLowerCase().includes(term) ||
                (b.content || '').toLowerCase().includes(term) ||
                (b.author || '').toLowerCase().includes(term)
            );
        }

        // Sort
        result.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [blogs, activeCategory, searchTerm, sortOrder, showFeaturedOnly]);

    return (
        <div className={`min-h-screen pb-24 bg-[#FFF9E7]`}>
            {/* Hero Header */}
            <section className="relative h-[450px] md:h-[550px] flex items-center justify-center">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://res.cloudinary.com/da1acfqsn/image/upload/v1777967174/ChatGPT_Image_May_5_2026_01_16_00_PM_s0vfn3.png"
                        alt="Blog Hero"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Floating Cashew Decoration
                <div className="absolute top-[20%] left-0 w-[140px] pointer-events-none z-[5] hidden xl:block rotate-[-15deg]">
                    <img
                        src="/images/Fruit-3-1.png"
                        alt=""
                        className="w-full h-auto drop-shadow-2xl brightness-110"
                    />
                </div> */}

                <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
                    {/* Eyebrow tag */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="inline-flex items-center gap-2 bg-[#F6B000]/10 border border-[#F6B000]/30 text-[#c48a00] text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F6B000] animate-pulse" />
                        Our Journal
                    </motion.div>
                    <h1
                        className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-sm mb-6 text-center"
                        style={{ color: COLORS.heading }}
                    >
                        Insights, Recipes &{' '}
                        <span
                            className="block"
                            style={{ color: COLORS.highlight }}
                        >
                            Sustainability
                        </span>
                    </h1>
                    <p className="text-black/80 max-w-2xl mx-auto text-base md:text-lg font-medium mb-12 drop-shadow-sm">
                        Expert health guides, cashew recipes, and our commitment to sustainable farming — all in one place.
                    </p>

                    {/* Unified Search + Filter Bar */}
                    <div className="max-w-xl mx-auto relative flex items-center gap-3">
                        <div className="relative flex-1 group">
                            <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-black/40 group-focus-within:text-[#F6B000] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-white/90 backdrop-blur-xl border border-white/50 text-black placeholder-black/40 rounded-2xl px-6 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#F6B000]/20 focus:bg-white shadow-xl transition-all font-medium"
                            />
                        </div>

                        {/* Filter Trigger Button */}
                        <div className="relative" ref={filterRef}>
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`h-[58px] px-6 rounded-2xl border flex items-center gap-2 font-bold transition-all shadow-xl ${isFilterOpen || activeCategory !== 'All' || showFeaturedOnly
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white/90 backdrop-blur-xl border-white/50 text-black hover:bg-white'
                                    }`}
                            >
                                <i className="fa-solid fa-sliders" />
                                <span className="hidden sm:inline">Filter</span>
                                {(activeCategory !== 'All' || showFeaturedOnly) && (
                                    <span className="w-2 h-2 rounded-full bg-[#F6B000] animate-pulse" />
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {isFilterOpen && (
                                <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-[10px] shadow-[0_15px_40px_rgba(0,0,0,0.15)] border border-gray-100 p-4 z-[100] animate-slide-in-up origin-top-right">
                                    <div className="space-y-4">
                                        {/* Sort Section */}
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Sort By</p>
                                            <div className="flex flex-col gap-0.5">
                                                <button
                                                    onClick={() => setSortOrder('desc')}
                                                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${sortOrder === 'desc' ? 'bg-[#F6B000]/10 text-black' : 'text-gray-500 hover:bg-gray-50'}`}
                                                >
                                                    Newest First <i className={`fa-solid fa-check text-[10px] ${sortOrder === 'desc' ? 'opacity-100' : 'opacity-0'}`} />
                                                </button>
                                                <button
                                                    onClick={() => setSortOrder('asc')}
                                                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${sortOrder === 'asc' ? 'bg-[#F6B000]/10 text-black' : 'text-gray-500 hover:bg-gray-50'}`}
                                                >
                                                    Oldest First <i className={`fa-solid fa-check text-[10px] ${sortOrder === 'asc' ? 'opacity-100' : 'opacity-0'}`} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Categories Section */}
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Categories</p>
                                            <div className="flex flex-col gap-0.5">
                                                {CATEGORIES.map(cat => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => setActiveCategory(cat)}
                                                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${activeCategory === cat ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                                                    >
                                                        {CATEGORY_DISPLAY_NAMES[cat]}
                                                        {activeCategory === cat && <i className="fa-solid fa-check text-[10px]" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Special Section */}
                                        <div className="pt-3 border-t border-gray-100">
                                            <button
                                                onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all border ${showFeaturedOnly ? 'bg-black text-[#F6B000] border-black' : 'bg-gray-50 text-gray-500 border-transparent hover:border-gray-200'}`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <i className="fa-solid fa-star" /> Featured Only
                                                </span>
                                                <div className={`w-7 h-3.5 rounded-full relative transition-colors ${showFeaturedOnly ? 'bg-[#F6B000]' : 'bg-gray-300'}`}>
                                                    <div className={`absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all ${showFeaturedOnly ? 'right-0.5' : 'left-0.5'}`} />
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Blogs Grid */}
            <section className="max-w-7xl mx-auto px-6 py-6">
                {/* Results Info */}
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-xl font-heading font-black text-black">
                        {activeCategory === 'All' ? 'All Articles' : CATEGORY_DISPLAY_NAMES[activeCategory]}
                        <span className="ml-3 text-sm text-gray-400 font-bold">{filteredBlogs.length} results</span>
                    </h2>
                    {(activeCategory !== 'All' || showFeaturedOnly || searchTerm) && (
                        <button
                            onClick={() => {
                                setActiveCategory('All');
                                setShowFeaturedOnly(false);
                                setSearchTerm('');
                                setSortOrder('desc');
                            }}
                            className="text-xs font-black uppercase tracking-widest text-[#F6B000] hover:text-black transition-colors flex items-center gap-2"
                        >
                            Reset Filters <i className="fa-solid fa-rotate-right" />
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse">
                                <div className="w-full h-56 bg-gray-200" />
                                <div className="p-7 space-y-3">
                                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                                    <div className="h-4 bg-gray-200 rounded w-full" />
                                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="text-center bg-white p-20 rounded-3xl shadow-sm border border-gray-100 max-w-xl mx-auto">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fa-regular fa-folder-open text-3xl text-gray-200" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 font-heading mb-4">No Articles Found</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                            We couldn't find any articles matching your current search or filters. Try adjusting them.
                        </p>
                        <button
                            onClick={() => {
                                setActiveCategory('All');
                                setShowFeaturedOnly(false);
                                setSearchTerm('');
                            }}
                            className="px-8 py-3 rounded-2xl bg-black text-[#F6B000] text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20"
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {filteredBlogs.map(blog => (
                            <BlogCard key={blog._id} blog={blog} searchTerm={searchTerm} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
