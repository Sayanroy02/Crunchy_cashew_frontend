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
                <div className="flex flex-row md:items-end justify-between items-center gap-4 mb-10">
                    <div className="text-left flex-1">
                        <span className="text-black font-bold tracking-[4px] uppercase text-[10px] md:text-xs mb-2 block">
                            Latest News &amp; Insights
                        </span>
                        <SectionHeading text="Read Our" highlight="Blogs" className="mb-0" />
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/blogs"
                            className="hidden md:inline-flex bg-green-700 text-white p-4 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl items-center justify-center gap-2 group whitespace-nowrap w-[240px]"
                        >
                            View All Blogs
                            <i className="fa-solid fa-arrow-right-long group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
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
                        View All Blogs
                        <i className="fa-solid fa-arrow-right-long group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}