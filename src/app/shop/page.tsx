'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import ProductCard, { Product } from '@/components/products/ProductCard';
import { API } from '@/constants/api';
import { COLORS } from '@/constants/styles';
import SectionHeading from '@/components/ui/SectionHeading';
import { motion } from 'framer-motion';

// Price range tiers: [label, min, max]
const PRICE_RANGES = [
    { label: 'All prices', min: 0, max: Infinity },
    { label: 'Under ₹100', min: 0, max: 100 },
    { label: '₹100 – ₹500', min: 100, max: 500 },
    { label: '₹500 – ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
    { label: 'Above ₹2,000', min: 2000, max: Infinity },
] as const;

type PriceRangeIndex = number;
type SortKey = 'default' | 'price_asc' | 'price_desc' | 'discount' | 'newest' | 'popular';
type TagFilter = 'all' | 'newest' | 'best_seller' | 'gifting' | 'event';
type EventFilter = 'all' | 'holi' | 'eid' | 'diwali' | 'custom';

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('default');
    const [priceRange, setPriceRange] = useState<PriceRangeIndex>(0); // index into PRICE_RANGES
    const [tagFilter, setTagFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [activeMobileTab, setActiveMobileTab] = useState<'categories' | 'collections' | 'sort' | 'price'>('categories');
    const [tempCategory, setTempCategory] = useState<string>('all');
    const [tempTag, setTempTag] = useState<string>('all');
    const [tempPriceRange, setTempPriceRange] = useState<number>(0);
    const [tempSortKey, setTempSortKey] = useState<SortKey>('default');
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    // Close sort dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setSortOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const openMobileFilters = () => {
        setTempCategory(categoryFilter);
        setTempTag(tagFilter);
        setTempPriceRange(priceRange);
        setTempSortKey(sortKey);
        setSidebarOpen(true);
    };

    const applyMobileFilters = () => {
        setCategoryFilter(tempCategory);
        setTagFilter(tempTag);
        setPriceRange(tempPriceRange);
        setSortKey(tempSortKey);
        setSidebarOpen(false);
    };

    const clearTempFilters = () => {
        setTempCategory('all');
        setTempTag('all');
        setTempPriceRange(0);
        setTempSortKey('default');
    };

    useEffect(() => {
        fetch(API.PRODUCTS)
            .then(res => res.json())
            .then(data => {
                const productList = Array.isArray(data) ? data : (data?.products || data?.data || []);
                setProducts(productList);
                setLoading(false);
            })
            .catch(err => { console.error('Failed to fetch products:', err); setLoading(false); });
    }, []);

    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [sidebarOpen]);

    // Extract unique tags from all products
    const availableTags = useMemo(() => {
        const tags = new Set<string>();
        const list = Array.isArray(products) ? products : [];
        list.forEach(p => {
            if (p.tags) p.tags.forEach(t => tags.add(t));
        });
        return Array.from(tags).sort();
    }, [products]);

    const filtered = useMemo(() => {
        const { min, max } = PRICE_RANGES[priceRange];
        const list = Array.isArray(products) ? products : [];

        let result = list.map(p => {
            // Pre-calculate prices for sorting and filtering
            const prices = p.variants?.map(v => v.price) || [(p as any).price || 0];
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            const discount = p.variants?.[0]?.discount || (p as any).discount || 0;
            return { ...p, _minPrice: minPrice, _maxPrice: maxPrice, _discount: discount };
        }).filter(p => {
            const searchTermLower = searchTerm.toLowerCase().trim();
            const matchSearch = !searchTermLower ||
                p.name.toLowerCase().includes(searchTermLower) ||
                (p.category || '').toLowerCase().includes(searchTermLower) ||
                (p.tags || []).some(t => t.toLowerCase().includes(searchTermLower));

            // Match if any part of the product's price range overlaps with the filter
            const matchPrice = p._minPrice <= max && p._maxPrice >= min;

            const matchTag = tagFilter === 'all' || (p.tags && p.tags.includes(tagFilter));
            const matchCategory = categoryFilter === 'all' ||
                (p.category || '').toLowerCase() === categoryFilter.toLowerCase();

            return matchSearch && matchPrice && matchTag && matchCategory;
        });

        if (sortKey === 'price_asc') result = [...result].sort((a, b) => a._minPrice - b._minPrice);
        else if (sortKey === 'price_desc') result = [...result].sort((a, b) => b._minPrice - a._minPrice);
        else if (sortKey === 'discount') result = [...result].sort((a, b) => b._discount - a._discount);
        else if (sortKey === 'newest') result = [...result].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        else if (sortKey === 'popular') result = [...result].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));

        return result;
    }, [products, searchTerm, sortKey, priceRange, tagFilter, categoryFilter]);

    const tempFilteredCount = useMemo(() => {
        const { min, max } = PRICE_RANGES[tempPriceRange];
        const list = Array.isArray(products) ? products : [];

        return list.filter(p => {
            const prices = p.variants?.map(v => v.price) || [(p as any).price || 0];
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);

            const matchSearch = !searchTerm ||
                p.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
                (p.category || '').toLowerCase().includes(searchTerm.toLowerCase().trim());

            const matchPrice = minPrice <= max && maxPrice >= min;
            const matchTag = tempTag === 'all' || (p.tags && p.tags.includes(tempTag));
            const matchCategory = tempCategory === 'all' ||
                (p.category || '').toLowerCase() === tempCategory.toLowerCase();

            return matchSearch && matchPrice && matchTag && matchCategory;
        }).length;
    }, [products, searchTerm, tempPriceRange, tempTag, tempCategory]);

    const hasFilters = !!searchTerm || sortKey !== 'default' || priceRange !== 0 || tagFilter !== 'all' || categoryFilter !== 'all';
    const clearAll = () => {
        setSearchTerm('');
        setSortKey('default');
        setPriceRange(0);
        setTagFilter('all');
        setCategoryFilter('all');
    };

    return (
        <div className={`min-h-screen pb-24 bg-[#FFF9E7] relative`}>

            {/* Seamless Background Image (like bulk/blogs page) */}
            <div className="absolute top-0 left-0 z-0 w-full h-[35vh] md:h-[45vh] lg:h-[55vh]">
                <img
                    src="https://res.cloudinary.com/da1acfqsn/image/upload/v1779008580/shop-banner_c8nltj.png"
                    alt="Shop Background"
                    className="w-full h-full object-cover object-top opacity-90"
                />
                <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-[#FFF9E7] to-transparent pointer-events-none" />
            </div>

            {/* Mobile sidebar overlay (Full Screen Dual-Pane Pop Up) */}
            {sidebarOpen && (
                <>
                    {/* Semi-transparent backdrop — matches bulk inquiry popup style */}
                    <div
                        className="fixed inset-0 z-[9998] md:hidden"
                        style={{ background: 'rgba(12,10,9,0.72)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
                        onClick={() => setSidebarOpen(false)}
                    />

                    {/* Popup: 80% height, centered, CTABanner-style rounded-[28px] */}
                    <div
                        className="fixed z-[9999] md:hidden flex flex-col overflow-hidden"
                        style={{
                            left: '5%',
                            right: '5%',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            height: '80vh',
                            borderRadius: '28px',
                            background: '#fff',
                            boxShadow: '0 32px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.6)',
                            border: '1px solid rgba(255,255,255,0.15)',
                        }}
                    >
                        {/* Top Bar */}
                        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSidebarOpen(false)} className="p-1">
                                    <i className="fa-solid fa-arrow-left text-xl text-gray-800" />
                                </button>
                                <span className="font-bold text-lg text-gray-800">Filters</span>
                            </div>
                            <button onClick={clearTempFilters} className="text-sm font-bold text-gray-500 hover:text-gray-700">
                                Clear Filters
                            </button>
                        </div>

                        {/* Content Area - Dual Pane — flex-[9] = 90% of space */}
                        <div className="flex overflow-hidden" style={{ flex: 9 }}>
                            {/* Left Pane - Tabs */}
                            <div className="w-1/3 bg-gray-50 border-r border-gray-100 flex flex-col overflow-y-auto">
                                {([
                                    { id: 'categories', label: 'Categories' },
                                    { id: 'collections', label: 'Collection' },
                                    { id: 'sort', label: 'Sort' },
                                    { id: 'price', label: 'Price Range' }
                                ] as const).map(tab => {
                                    const isActive = activeMobileTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveMobileTab(tab.id)}
                                            className={`w-full py-4 px-3 text-left text-xs font-bold transition-all border-l-4 ${isActive 
                                                ? 'bg-white text-emerald-800 border-emerald-700' 
                                                : 'text-gray-600 border-transparent bg-gray-50 hover:bg-gray-100'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Right Pane - Options */}
                            <div className="w-2/3 bg-white p-4 overflow-y-auto flex flex-col gap-3">
                                {activeMobileTab === 'categories' && (
                                    <>
                                        <div className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Select Category</div>
                                        {/* Category Option: All */}
                                        <button
                                            onClick={() => setTempCategory('all')}
                                            className="flex items-center justify-between w-full p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all text-left"
                                        >
                                            <span className="text-sm font-semibold text-gray-800">All Categories</span>
                                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${tempCategory === 'all' ? 'bg-[#FF6F00] border-[#FF6F00] text-white' : 'border-gray-300'}`}>
                                                {tempCategory === 'all' && <i className="fa-solid fa-check text-xs" />}
                                            </div>
                                        </button>
                                        {/* Category Options */}
                                        {['Value Packs', 'Premium', 'Flavors', 'Gifting'].map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setTempCategory(cat)}
                                                className="flex items-center justify-between w-full p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all text-left"
                                            >
                                                <span className="text-sm font-semibold text-gray-800">{cat}</span>
                                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${tempCategory === cat ? 'bg-[#FF6F00] border-[#FF6F00] text-white' : 'border-gray-300'}`}>
                                                    {tempCategory === cat && <i className="fa-solid fa-check text-xs" />}
                                                </div>
                                            </button>
                                        ))}
                                    </>
                                )}

                                {activeMobileTab === 'collections' && (
                                    <>
                                        <div className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Select Collection</div>
                                        {/* Tag Option: All */}
                                        <button
                                            onClick={() => setTempTag('all')}
                                            className="flex items-center justify-between w-full p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all text-left"
                                        >
                                            <span className="text-sm font-semibold text-gray-800">All Products</span>
                                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${tempTag === 'all' ? 'bg-[#FF6F00] border-[#FF6F00] text-white' : 'border-gray-300'}`}>
                                                {tempTag === 'all' && <i className="fa-solid fa-check text-xs" />}
                                            </div>
                                        </button>
                                        {/* Tag Options */}
                                        {availableTags.map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => setTempTag(tag)}
                                                className="flex items-center justify-between w-full p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all text-left"
                                            >
                                                <span className="text-sm font-semibold text-gray-800">{tag}</span>
                                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${tempTag === tag ? 'bg-[#FF6F00] border-[#FF6F00] text-white' : 'border-gray-300'}`}>
                                                    {tempTag === tag && <i className="fa-solid fa-check text-xs" />}
                                                </div>
                                            </button>
                                        ))}
                                    </>
                                )}

                                {activeMobileTab === 'sort' && (
                                    <>
                                        <div className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Select Sort</div>
                                        {([
                                            { value: 'default', label: 'Default', icon: 'fa-solid fa-sparkles' },
                                            { value: 'newest', label: 'Newest First', icon: 'fa-solid fa-clock' },
                                            { value: 'popular', label: 'Popularity', icon: 'fa-solid fa-fire' },
                                            { value: 'price_asc', label: 'Price: Low → High', icon: 'fa-solid fa-arrow-trend-up' },
                                            { value: 'price_desc', label: 'Price: High → Low', icon: 'fa-solid fa-arrow-trend-down' },
                                            { value: 'discount', label: 'Biggest Discount', icon: 'fa-solid fa-tag' },
                                        ] as const).map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setTempSortKey(opt.value)}
                                                className="flex items-center justify-between w-full p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all text-left"
                                            >
                                                <span className="text-sm font-semibold text-gray-800">{opt.label}</span>
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${tempSortKey === opt.value ? 'bg-[#FF6F00] border-[#FF6F00] text-white' : 'border-gray-300'}`}>
                                                    {tempSortKey === opt.value && <i className="fa-solid fa-check text-[10px]" />}
                                                </div>
                                            </button>
                                        ))}
                                    </>
                                )}

                                {activeMobileTab === 'price' && (
                                    <>
                                        <div className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Select Price</div>
                                        {PRICE_RANGES.map((range, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setTempPriceRange(idx)}
                                                className="flex items-center justify-between w-full p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all text-left"
                                            >
                                                <span className="text-sm font-semibold text-gray-800">{range.label}</span>
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${tempPriceRange === idx ? 'bg-[#FF6F00] border-[#FF6F00] text-white' : 'border-gray-300'}`}>
                                                    {tempPriceRange === idx && <i className="fa-solid fa-check text-[10px]" />}
                                                </div>
                                            </button>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Fixed Bottom Bar — flex-[1], always visible */}
                        <div
                            className="flex items-center justify-between px-5 bg-white flex-shrink-0"
                            style={{ flex: 1, minHeight: '64px', borderTop: '1px solid #f3f4f6' }}
                        >
                            <div className="flex items-center gap-1.5">
                                <span className="text-base font-black text-gray-800">{tempFilteredCount}</span>
                                <span className="text-sm font-bold text-gray-500">products found</span>
                            </div>
                            <button
                                onClick={applyMobileFilters}
                                className="font-bold py-2.5 px-7 text-sm text-white active:scale-95 transition-all shadow-lg"
                                style={{ backgroundColor: COLORS.heading, borderRadius: '10px' }}
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-16 lg:pt-20">
                {/* Heading placed naturally over the background */}
                <div className="text-center mb-10 md:mb-16 relative z-20">
                    {/* Eyebrow tag */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="inline-flex items-center gap-2 bg-[#F6B000]/10 border border-[#F6B000]/30 text-[#c48a00] text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F6B000] animate-pulse" />
                        OUR SHOP
                    </motion.div>
                    <SectionHeading
                        text="Snack Smarter,"
                        highlight="Crunch Louder"
                        className="text-3xl md:text-4xl lg:text-5xl drop-shadow-sm"
                    />
                    <p className="text-sm md:text-lg text-gray-700 max-w-2xl mx-auto font-medium mt-3 drop-shadow-sm">
                        Skip the middleman without compromising on taste. Stock up on your favorite roasted, flavored, and raw batches today at prices that make sense.
                    </p>

                    {/* Centered Search Bar like Image 2 */}
                    <div className="mt-8 max-w-2xl mx-auto flex items-center gap-3 px-4">
                        <div className="relative flex-1 shadow-sm rounded-2xl bg-white flex items-center h-14">
                            <i className="fa-solid fa-magnifying-glass absolute left-5 text-gray-400 z-10" />
                            <input
                                type="text"
                                placeholder="Search cashews by name or category..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent border-0 text-black placeholder-gray-400 rounded-2xl px-5 h-full pl-12 focus:outline-none focus:ring-0 transition-all text-sm font-semibold"
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors">
                                    <i className="fa-solid fa-circle-xmark text-lg" />
                                </button>
                            )}
                        </div>
                        <div className="relative" ref={sortDropdownRef}>
                            <button
                                onClick={() => {
                                    if (window.innerWidth < 768) {
                                        openMobileFilters();
                                    } else {
                                        setSortOpen(!sortOpen);
                                    }
                                }}
                                className="flex items-center gap-2 bg-white text-gray-800 font-bold px-6 h-14 rounded-2xl text-sm whitespace-nowrap hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <i className="fa-solid fa-sliders" /> Filter
                            </button>
                            {sortOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden text-left py-2">
                                    {([
                                        { value: 'default', label: 'Default', icon: 'fa-solid fa-sparkles' },
                                        { value: 'newest', label: 'Newest First', icon: 'fa-solid fa-clock' },
                                        { value: 'popular', label: 'Popularity', icon: 'fa-solid fa-fire' },
                                        { value: 'price_asc', label: 'Price: Low → High', icon: 'fa-solid fa-arrow-trend-up' },
                                        { value: 'price_desc', label: 'Price: High → Low', icon: 'fa-solid fa-arrow-trend-down' },
                                        { value: 'discount', label: 'Biggest Discount', icon: 'fa-solid fa-tag' },
                                    ] as const).map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { setSortKey(opt.value as SortKey); setSortOpen(false); }}
                                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold transition-all hover:bg-gray-50"
                                            style={sortKey === opt.value ? { color: COLORS.heading } : { color: '#4B5563' }}
                                        >
                                            <i className={opt.icon} />
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col md:flex-row gap-6 lg:gap-8">

                    {/* ── SIDEBAR ── */}
                    {/* Desktop sidebar */}
                    <aside className="hidden md:flex flex-col gap-6 w-56 lg:w-64 flex-shrink-0">
                        <SidebarContent
                            sortKey={sortKey} setSortKey={setSortKey}
                            priceRange={priceRange} setPriceRange={setPriceRange}
                            tagFilter={tagFilter} setTagFilter={setTagFilter}
                            categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
                            availableTags={availableTags}
                            hasFilters={hasFilters} clearAll={clearAll}
                            resultCount={filtered.length}
                        />
                    </aside>



                    {/* ── PRODUCT GRID ── */}
                    <div className="flex-1 min-w-0">

                        {/* Results header */}
                        {hasFilters && (
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {searchTerm && (
                                            <span className="inline-flex items-center gap-1.5 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                                "{searchTerm}"
                                                <button onClick={() => setSearchTerm('')}><i className="fa-solid fa-xmark" /></button>
                                            </span>
                                        )}
                                        {sortKey !== 'default' && (
                                            <span className="inline-flex items-center gap-1.5 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                                {sortKey === 'price_asc' ? 'Price: Low→High' : sortKey === 'price_desc' ? 'Price: High→Low' : 'Biggest Discount'}
                                                <button onClick={() => setSortKey('default')}><i className="fa-solid fa-xmark" /></button>
                                            </span>
                                        )}
                                        {categoryFilter !== 'all' && (
                                            <span className="inline-flex items-center gap-1.5 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                                Category: {categoryFilter}
                                                <button onClick={() => setCategoryFilter('all')}><i className="fa-solid fa-xmark" /></button>
                                            </span>
                                        )}
                                        {tagFilter !== 'all' && (
                                            <span className="inline-flex items-center gap-1.5 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                                Tag: {tagFilter}
                                                <button onClick={() => setTagFilter('all')}><i className="fa-solid fa-xmark" /></button>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="bg-white rounded-2xl overflow-hidden flex flex-col h-96 animate-pulse border border-gray-100">
                                        <div className="w-full h-56 bg-gray-200" />
                                        <div className="p-5 flex flex-col gap-3 flex-1">
                                            <div className="h-3 bg-gray-200 rounded w-1/4" />
                                            <div className="h-5 bg-gray-200 rounded w-3/4" />
                                            <div className="mt-auto flex justify-between">
                                                <div className="h-6 bg-gray-200 rounded w-1/4" />
                                                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
                                <i className="fa-solid fa-box-open text-6xl text-gray-200 mb-5 block" />
                                <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
                                <p className="text-gray-400 mb-6">
                                    {searchTerm ? `No results for "${searchTerm}"` : 'No products in this price range.'}
                                </p>
                                <button
                                    onClick={clearAll}
                                    className="px-8 py-3 font-bold rounded-xl transition-all shadow-md active:scale-95"
                                    style={{ backgroundColor: COLORS.heading, color: COLORS.white }}
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                                {filtered.map(product => (
                                    <ProductCard key={product.id || product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Extracted sidebar for reuse on desktop + mobile drawer ──
function SidebarContent({
    sortKey, setSortKey,
    priceRange, setPriceRange,
    tagFilter, setTagFilter,
    categoryFilter, setCategoryFilter,
    availableTags,
    hasFilters, clearAll,
    resultCount
}: {
    sortKey: SortKey; setSortKey: (v: SortKey) => void;
    priceRange: PriceRangeIndex; setPriceRange: (v: PriceRangeIndex) => void;
    tagFilter: string; setTagFilter: (v: string) => void;
    categoryFilter: string; setCategoryFilter: (v: string) => void;
    availableTags: string[];
    hasFilters: boolean; clearAll: () => void;
    resultCount: number;
}) {
    const categories = ['Value Packs', 'Premium', 'Flavors', 'Gifting'];
    const categoryIcons: Record<string, string> = {
        'Value Packs': 'fa-solid fa-box-open',
        'Premium': 'fa-solid fa-crown',
        'Flavors': 'fa-solid fa-pepper-hot',
        'Gifting': 'fa-solid fa-gift',
    };
    const [categoriesOpen, setCategoriesOpen] = useState(true);
    const [collectionsOpen, setCollectionsOpen] = useState(false);
    const [priceOpen, setPriceOpen] = useState(false);

    return (
        <div className="flex flex-col gap-6">
            {/* Clear all */}
            {hasFilters && (
                <button
                    onClick={clearAll}
                    className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
                >
                    <i className="fa-solid fa-rotate-left" /> Clear all filters
                </button>
            )}

            {/* Categories */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <button
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    className="w-full flex justify-between items-center font-bold text-gray-800"
                >
                    <span className="flex items-center gap-2">
                        <i className="fa-solid fa-shapes" style={{ color: COLORS.primary }} /> Categories
                    </span>
                    <i className={`fa-solid fa-chevron-${categoriesOpen ? 'up' : 'down'} text-sm text-gray-400 transition-transform`} />
                </button>
                {categoriesOpen && (
                    <div className="flex flex-col gap-2 mt-4">
                        <button
                            onClick={() => setCategoryFilter('all')}
                            className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${categoryFilter === 'all'
                                ? 'shadow-lg scale-[1.02]'
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                            style={categoryFilter === 'all' ? { backgroundColor: COLORS.heading, color: COLORS.white } : {}}
                        >
                            <i className="fa-solid fa-border-all text-xs" />
                            All Categories
                        </button>

                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${categoryFilter === cat
                                    ? 'shadow-lg scale-[1.02]'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                    }`}
                                style={categoryFilter === cat ? { backgroundColor: COLORS.heading, color: COLORS.white } : {}}
                            >
                                <i className={`${categoryIcons[cat] || 'fa-solid fa-layer-group'} text-xs`} />
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Special Collections / Dynamic Tags */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <button
                    onClick={() => setCollectionsOpen(!collectionsOpen)}
                    className="w-full flex justify-between items-center font-bold text-gray-800"
                >
                    <span className="flex items-center gap-2">
                        <i className="fa-solid fa-layer-group" style={{ color: COLORS.primary }} /> Collections
                    </span>
                    <i className={`fa-solid fa-chevron-${collectionsOpen ? 'up' : 'down'} text-sm text-gray-400 transition-transform`} />
                </button>
                {collectionsOpen && (
                    <div className="flex flex-col gap-2 mt-4">
                        <button
                            onClick={() => setTagFilter('all')}
                            className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${tagFilter === 'all'
                                ? 'shadow-lg scale-[1.02]'
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                            style={tagFilter === 'all' ? { backgroundColor: COLORS.heading, color: COLORS.white } : {}}
                        >
                            <i className="fa-solid fa-border-all text-xs" />
                            All Products
                        </button>

                        {availableTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setTagFilter(tag)}
                                className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${tagFilter === tag
                                    ? 'shadow-lg scale-[1.02]'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                    }`}
                                style={tagFilter === tag ? { backgroundColor: COLORS.heading, color: COLORS.white } : {}}
                            >
                                <i className="fa-solid fa-tag text-xs" />
                                {tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <button
                    onClick={() => setPriceOpen(!priceOpen)}
                    className="w-full flex justify-between items-center font-bold text-gray-800"
                >
                    <span className="flex items-center gap-2">
                        <i className="fa-solid fa-indian-rupee-sign" style={{ color: COLORS.primary }} /> Price Range
                    </span>
                    <i className={`fa-solid fa-chevron-${priceOpen ? 'up' : 'down'} text-sm text-gray-400 transition-transform`} />
                </button>
                {priceOpen && (
                    <div className="flex flex-col gap-2 mt-4">
                        {PRICE_RANGES.map((range, idx) => (
                            <button
                                key={idx}
                                onClick={() => setPriceRange(idx)}
                                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${priceRange === idx
                                    ? 'shadow-lg scale-[1.02]'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                    }`}
                                style={priceRange === idx ? { backgroundColor: COLORS.heading, color: COLORS.white } : {}}
                            >
                                <span>{range.label}</span>
                                {priceRange === idx && <i className="fa-solid fa-check text-white text-xs" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Result count badge */}
            <div className="bg-black/5 rounded-2xl px-5 py-4 flex items-center gap-3 border border-black/10">
                <i className="fa-solid fa-box text-lg" style={{ color: COLORS.primary }} />
                <div>
                    <p className="text-xs text-black/50 font-medium">Showing</p>
                    <p className="text-lg font-black" style={{ color: COLORS.black }}>{resultCount} products</p>
                </div>
            </div>
        </div>
    );
}
