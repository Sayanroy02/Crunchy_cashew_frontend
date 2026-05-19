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
        <section className="py-10 md:py-14 bg-bg-cream relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between items-start mb-10 gap-6">
                    <div className="text-left">
                        <span className="text-black font-bold tracking-[4px] uppercase text-xs mb-3 block">
                            Latest News &amp; Insights
                        </span>
                        <SectionHeading text="Read Our" highlight="Blogs" className="text-3xl md:text-5xl mb-3" />
                    </div>

                    <Link
                        href="/blogs"
                        className="bg-green-700 text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl inline-flex items-center justify-center gap-2 group whitespace-nowrap"
                    >
                        View All Articles
                        <i className="fa-solid fa-arrow-right-long group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog, index) => (
                        <BlogCard
                            key={blog._id}
                            blog={blog}
                            className={index !== 0 ? 'hidden md:flex' : ''}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}