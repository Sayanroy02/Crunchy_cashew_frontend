'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API } from '@/constants/api';
import { COLORS } from '@/constants/styles';
import SectionHeading from '@/components/ui/SectionHeading';
import BlogCard from '@/components/ui/BlogCard';
import type { BlogCardData } from '@/components/ui/BlogCard';

export default function BlogsPreview() {
    const [blogs, setBlogs] = useState<BlogCardData[]>([]);

    useEffect(() => {
        fetch(API.BLOGS)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    setBlogs(data.slice(0, 3));
                }
            })
            .catch(err => console.error('Failed to fetch blogs', err));
    }, []);

    if (blogs.length === 0) return null;

    return (
        <section className="py-4 md:py-8 bg-bg-cream relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between items-center md:items-start mb-10 gap-6">
                    <div className="text-center md:text-left w-full md:w-auto">
                        <span className="text-black font-bold tracking-[4px] uppercase text-xs mb-3 block">
                            Latest News &amp; Insights
                        </span>
                        <SectionHeading text="Read Our" highlight="Blogs" className="text-3xl md:text-5xl mb-3" />
                    </div>

                    <Link
                        href="/blogs"
                        className="hidden md:inline-flex bg-green-700 text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl items-center justify-center gap-2 group whitespace-nowrap"
                    >
                        View All Articles
                        <i className="fa-solid fa-arrow-right-long group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Cards Grid */}
                <div className="flex overflow-x-auto pb-8 md:pb-12 -mx-6 px-6 gap-6 md:mx-0 md:px-0 md:pb-0 scrollbar-hide snap-x md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8">
                    {blogs.map((blog) => (
                        <BlogCard
                            key={blog._id}
                            blog={blog}
                            className="min-w-[85%] sm:min-w-[350px] md:min-w-0 snap-center"
                        />
                    ))}
                </div>

                {/* Mobile View All Button */}
                <div className="flex md:hidden justify-center mt-8">
                    <Link
                        href="/blogs"
                        className="bg-green-700 text-white p-4 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl inline-flex items-center justify-center gap-2 group whitespace-nowrap"
                    >
                        View All Articles
                        <i className="fa-solid fa-arrow-right-long group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}