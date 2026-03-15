'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { API } from '@/constants/api';

interface Blog {
    _id: string;
    title: string;
    image_url?: string;
    content: string;
    created_at: string;
    author?: string;
    category?: string;
    tags?: string[];
}

const CATEGORIES = ['All', 'Health Articles', 'Recipes Blog', 'Sustainability'] as const;
type CategoryFilter = typeof CATEGORIES[number];

const CATEGORY_ICONS: Record<string, string> = {
    'All': 'fa-solid fa-border-all',
    'Health Articles': 'fa-solid fa-heart-pulse',
    'Recipes Blog': 'fa-solid fa-utensils',
    'Sustainability': 'fa-solid fa-leaf',
};

const CATEGORY_COLORS: Record<string, string> = {
    'Health Articles': 'bg-green-100 text-green-700',
    'Recipes Blog': 'bg-amber-100 text-amber-700',
    'Sustainability': 'bg-blue-100 text-blue-700',
    'Uncategorised': 'bg-gray-100 text-gray-600',
};

export default function BlogsDirectory() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // newest first by default

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

    const filteredBlogs = useMemo(() => {
        let result = [...blogs];

        // Category filter
        if (activeCategory !== 'All') {
            result = result.filter(b => b.category === activeCategory);
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
    }, [blogs, activeCategory, searchTerm, sortOrder]);

    return (
        <div className="bg-bg min-h-screen pb-24">
            {/* Hero Header */}
            <section className="bg-black text-white pt-28 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,var(--theme-primary),transparent)]" />
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                        <i className="fa-solid fa-pen-nib" /> Our Journal
                    </span>
                    <h1 className="text-4xl md:text-6xl font-heading font-black mb-5 leading-tight">
                        Insights, Recipes &<br />
                        <span className="text-yellow">Sustainability</span>
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg mb-10">
                        Expert health guides, cashew recipes, and our commitment to sustainable farming — all in one place.
                    </p>

                    {/* Search + Sort Row */}
                    <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-2xl px-5 py-3.5 pl-11 focus:outline-none focus:bg-white/20 transition-all"
                            />
                        </div>
                        {/* Sort dropdown */}
                        <select
                            value={sortOrder}
                            onChange={e => setSortOrder(e.target.value as 'desc' | 'asc')}
                            className="bg-white/10 border border-white/20 text-white rounded-2xl px-4 py-3.5 focus:outline-none focus:bg-white/20 transition-all cursor-pointer appearance-none min-w-[160px] text-sm font-semibold"
                        >
                            <option value="desc" className="text-black">🕐 Newest First</option>
                            <option value="asc" className="text-black">🕐 Oldest First</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Category Tab Bar */}
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
                        {CATEGORIES.map(cat => {
                            const count = cat === 'All' ? blogs.length : blogs.filter(b => b.category === cat).length;
                            const isActive = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                                        isActive
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <i className={CATEGORY_ICONS[cat]} />
                                    {cat}
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                        isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Blogs Grid */}
            <section className="max-w-7xl mx-auto px-6 py-12">
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
                    <div className="text-center bg-white p-16 rounded-3xl shadow-sm border border-gray-100 max-w-lg mx-auto">
                        <i className="fa-regular fa-folder-open text-6xl text-gray-200 mb-5 block" />
                        <h3 className="text-2xl font-bold text-gray-700 font-heading mb-2">No Articles Found</h3>
                        <p className="text-gray-400 mb-6">
                            {searchTerm ? `No results for "${searchTerm}"` : `No articles in ${activeCategory} yet.`}
                        </p>
                        <div className="flex gap-3 justify-center">
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-bold">
                                    Clear Search
                                </button>
                            )}
                            {activeCategory !== 'All' && (
                                <button onClick={() => setActiveCategory('All')} className="px-5 py-2.5 rounded-full border-2 border-primary text-primary text-sm font-bold">
                                    View All
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBlogs.map(blog => (
                            <Link
                                href={`/blogs/${blog._id}`}
                                key={blog._id}
                                className="bg-white rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 shadow-md hover:shadow-xl flex flex-col border border-gray-100"
                            >
                                {/* Cover Image */}
                                <div className="w-full h-56 relative overflow-hidden bg-gray-50 flex-shrink-0">
                                    {blog.image_url ? (
                                        <img
                                            src={blog.image_url}
                                            alt={blog.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <i className={`${CATEGORY_ICONS[blog.category || 'All']} text-5xl text-gray-200`} />
                                        </div>
                                    )}
                                    {/* Category Badge */}
                                    {blog.category && (
                                        <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${CATEGORY_COLORS[blog.category] || CATEGORY_COLORS['Uncategorised']}`}>
                                            <i className={`${CATEGORY_ICONS[blog.category] || 'fa-solid fa-tag'} mr-1.5`} />
                                            {blog.category}
                                        </span>
                                    )}
                                    {/* Date */}
                                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                                        {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-7 flex flex-col flex-grow">
                                    {blog.author && (
                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                            <i className="fa-solid fa-user-pen text-primary" />
                                            {blog.author}
                                        </p>
                                    )}
                                    <h3 className="text-xl font-bold font-heading text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                        {blog.title}
                                    </h3>
                                    <p className="text-gray-500 line-clamp-3 mb-5 flex-grow leading-relaxed text-sm">
                                        {(blog.content || '').replace(/<[^>]*>?/gm, '')}
                                    </p>
                                    <span className="text-primary font-bold flex items-center gap-2 text-sm mt-auto group-hover:gap-3 transition-all">
                                        Read Article <i className="fa-solid fa-arrow-right-long" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
