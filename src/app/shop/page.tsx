'use client';

import React, { useEffect, useState, useMemo } from 'react';
import ProductCard, { Product } from '@/components/products/ProductCard';
import { API } from '@/constants/api';

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
    const [tagFilter, setTagFilter] = useState<TagFilter>('all');
    const [eventFilter, setEventFilter] = useState<EventFilter>('all');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        fetch(API.PRODUCTS)
            .then(res => res.json())
            .then(data => { setProducts(data); setLoading(false); })
            .catch(err => { console.error('Failed to fetch products:', err); setLoading(false); });
    }, []);

    const filtered = useMemo(() => {
        const { min, max } = PRICE_RANGES[priceRange];
        let result = products.filter(p => {
            const matchSearch = !searchTerm.trim() ||
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.category || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchPrice = p.price >= min && p.price <= max;

            let matchTag = true;
            if (tagFilter === 'newest') matchTag = !!p.isNew;
            else if (tagFilter === 'best_seller') matchTag = !!p.isBestSeller;
            else if (tagFilter === 'gifting') matchTag = !!p.isGift;
            else if (tagFilter === 'event') matchTag = !!p.event?.type;

            let matchEvent = true;
            if (tagFilter === 'event' && eventFilter !== 'all') {
                matchEvent = p.event?.type === eventFilter;
            }

            return matchSearch && matchPrice && matchTag && matchEvent;
        });

        if (sortKey === 'price_asc') result = [...result].sort((a, b) => a.price - b.price);
        else if (sortKey === 'price_desc') result = [...result].sort((a, b) => b.price - a.price);
        else if (sortKey === 'discount') result = [...result].sort((a, b) => (b.discount || 0) - (a.discount || 0));
        else if (sortKey === 'newest') result = [...result].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        else if (sortKey === 'popular') result = [...result].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));

        return result;
    }, [products, searchTerm, sortKey, priceRange, tagFilter, eventFilter]);

    const hasFilters = !!searchTerm || sortKey !== 'default' || priceRange !== 0 || tagFilter !== 'all' || eventFilter !== 'all';
    const clearAll = () => {
        setSearchTerm('');
        setSortKey('default');
        setPriceRange(0);
        setTagFilter('all');
        setEventFilter('all');
    };

    return (
        <div className="bg-bg min-h-screen pb-24 pt-12">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex gap-8">

                    {/* ── SIDEBAR ── */}
                    {/* Desktop sidebar */}
                    <aside className="hidden lg:flex flex-col gap-6 w-64 flex-shrink-0">
                        <SidebarContent
                            sortKey={sortKey} setSortKey={setSortKey}
                            priceRange={priceRange} setPriceRange={setPriceRange}
                            tagFilter={tagFilter} setTagFilter={setTagFilter}
                            eventFilter={eventFilter} setEventFilter={setEventFilter}
                            hasFilters={hasFilters} clearAll={clearAll}
                            resultCount={filtered.length}
                        />
                    </aside>

                    {/* Mobile sidebar overlay */}
                    {sidebarOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col">
                                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                                    <h3 className="font-bold text-lg">Filters</h3>
                                    <button onClick={() => setSidebarOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
                                        <i className="fa-solid fa-xmark text-gray-500" />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-5">
                                    <SidebarContent
                                        sortKey={sortKey} setSortKey={setSortKey}
                                        priceRange={priceRange} setPriceRange={setPriceRange}
                                        tagFilter={tagFilter} setTagFilter={setTagFilter}
                                        eventFilter={eventFilter} setEventFilter={setEventFilter}
                                        hasFilters={hasFilters} clearAll={clearAll}
                                        resultCount={filtered.length}
                                    />
                                </div>
                                <div className="p-5 border-t border-gray-100">
                                    <button onClick={() => setSidebarOpen(false)} className="w-full bg-primary text-white font-bold py-3 rounded-xl">
                                        Show {filtered.length} Results
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── PRODUCT GRID ── */}
                    <div className="flex-1 min-w-0">
                        {/* Search Bar */}
                        <div className="mb-6 flex items-center gap-3">
                            <div className="relative flex-1 shadow-sm rounded-2xl">
                                <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                <input
                                    type="text"
                                    placeholder="Search cashews by name or category..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full bg-white border border-gray-200 text-gray-800 placeholder-gray-400 rounded-2xl px-5 py-4 pl-14 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-semibold"
                                />
                                {searchTerm && (
                                    <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                        <i className="fa-solid fa-circle-xmark text-lg" />
                                    </button>
                                )}
                            </div>
                            {/* Mobile Filter Trigger */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 text-gray-800 font-bold px-5 py-4 rounded-2xl text-sm whitespace-nowrap hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <i className="fa-solid fa-sliders" /> Filters
                                {hasFilters && <span className="w-2 h-2 rounded-full bg-primary" />}
                            </button>
                        </div>

                        {/* Results header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">
                                    {loading ? 'Loading...' : (
                                        <><span className="font-bold text-gray-800">{filtered.length}</span> {filtered.length === 1 ? 'product' : 'products'} found</>
                                    )}
                                </p>
                                {hasFilters && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {searchTerm && (
                                            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                                                "{searchTerm}"
                                                <button onClick={() => setSearchTerm('')}><i className="fa-solid fa-xmark" /></button>
                                            </span>
                                        )}
                                        {sortKey !== 'default' && (
                                            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                                                {sortKey === 'price_asc' ? 'Price: Low→High' : sortKey === 'price_desc' ? 'Price: High→Low' : 'Biggest Discount'}
                                                <button onClick={() => setSortKey('default')}><i className="fa-solid fa-xmark" /></button>
                                            </span>
                                        )}
                                        {priceRange !== 0 && (
                                            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                                                {PRICE_RANGES[priceRange].label}
                                                <button onClick={() => setPriceRange(0)}><i className="fa-solid fa-xmark" /></button>
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                            {/* Desktop quick sort */}
                            <select
                                value={sortKey}
                                onChange={e => setSortKey(e.target.value as SortKey)}
                                className="hidden sm:block text-sm border-2 border-gray-200 rounded-xl px-3 py-2 bg-white font-semibold text-gray-700 focus:outline-none focus:border-primary transition-colors"
                            >
                                <option value="default">Sort: Default</option>
                                <option value="newest">Sort: Newest First</option>
                                <option value="popular">Sort: Popularity</option>
                                <option value="price_asc">Price: Low → High</option>
                                <option value="price_desc">Price: High → Low</option>
                                <option value="discount">Biggest Discount</option>
                            </select>
                        </div>

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
                                    className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-green-800 transition-colors"
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
    eventFilter, setEventFilter,
    hasFilters, clearAll,
    resultCount
}: {
    sortKey: SortKey; setSortKey: (v: SortKey) => void;
    priceRange: PriceRangeIndex; setPriceRange: (v: PriceRangeIndex) => void;
    tagFilter: TagFilter; setTagFilter: (v: TagFilter) => void;
    eventFilter: EventFilter; setEventFilter: (v: EventFilter) => void;
    hasFilters: boolean; clearAll: () => void;
    resultCount: number;
}) {
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

            {/* Special Collections */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-layer-group text-primary" /> Collections
                </h3>
                <div className="flex flex-col gap-2">
                    {([
                        { value: 'all', label: 'All Products', icon: 'fa-solid fa-border-all' },
                        { value: 'newest', label: 'Newest Arrivals', icon: 'fa-solid fa-sparkles' },
                        { value: 'best_seller', label: 'Best Sellers', icon: 'fa-solid fa-trophy' },
                        { value: 'gifting', label: 'Gifting Specials', icon: 'fa-solid fa-gift' },
                        { value: 'event', label: 'Event Specials', icon: 'fa-solid fa-calendar-star' },
                    ] as const).map(opt => (
                        <div key={opt.value} className="flex flex-col gap-2">
                            <button
                                onClick={() => {
                                    setTagFilter(opt.value);
                                    if (opt.value !== 'event') setEventFilter('all');
                                }}
                                className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${tagFilter === opt.value
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <i className={`${opt.icon} text-xs`} />
                                {opt.label}
                            </button>

                            {/* Sub-filters for Event */}
                            {opt.value === 'event' && tagFilter === 'event' && (
                                <div className="flex flex-wrap gap-2 px-2 py-1 bg-red-50/50 rounded-xl border border-red-100 animate-slide-in">
                                    {([
                                        { value: 'all', label: 'All Events' },
                                        { value: 'holi', label: 'Holi' },
                                        { value: 'eid', label: 'Eid' },
                                        { value: 'diwali', label: 'Diwali' },
                                    ] as const).map(evt => (
                                        <button
                                            key={evt.value}
                                            onClick={() => setEventFilter(evt.value)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${eventFilter === evt.value
                                                ? 'bg-red-600 text-white shadow-sm'
                                                : 'bg-white text-red-600 border border-red-100 hover:bg-red-50'
                                                }`}
                                        >
                                            {evt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Sort */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-arrow-up-wide-short text-primary" /> Sort By
                </h3>
                <div className="flex flex-col gap-2">
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
                            onClick={() => setSortKey(opt.value)}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${sortKey === opt.value
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <i className={opt.icon} />
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-indian-rupee-sign text-primary" /> Price Range
                </h3>
                <div className="flex flex-col gap-2">
                    {PRICE_RANGES.map((range, idx) => (
                        <button
                            key={idx}
                            onClick={() => setPriceRange(idx)}
                            className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${priceRange === idx
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <span>{range.label}</span>
                            {priceRange === idx && <i className="fa-solid fa-check text-white text-xs" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Result count badge */}
            <div className="bg-primary/5 rounded-2xl px-5 py-4 flex items-center gap-3 border border-primary/10">
                <i className="fa-solid fa-box text-primary text-lg" />
                <div>
                    <p className="text-xs text-gray-500 font-medium">Showing</p>
                    <p className="text-lg font-black text-primary">{resultCount} products</p>
                </div>
            </div>
        </div>
    );
}
