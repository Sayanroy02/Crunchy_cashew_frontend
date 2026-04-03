'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { API } from '@/constants/api';
import { COLORS } from '@/constants/styles';
import SectionHeading from '@/components/ui/SectionHeading';

interface Blog {
    _id: string;
    title: string;
    image_url?: string;
    content: string;
    created_at: string;
    featured?: boolean;
    category?: string;
    tags?: string[];
}

export default function BlogsPreview() {
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        fetch(API.BLOGS)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    setBlogs(data.slice(0, 3));
                }
            })
            .catch(err => console.error("Failed to fetch blogs", err));
    }, []);

    if (blogs.length === 0) return null;

    return (
        <section className="py-20 md:py-28 bg-bg-cream relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between items-start mb-14 gap-6">
                    <div className="text-left">
                        <span className="text-black font-bold tracking-[4px] uppercase text-xs mb-3 block">Latest News & Insights</span>
                        <SectionHeading text="Read Our" highlight="Blogs" className="text-3xl md:text-5xl mb-3" />
                    </div>

                    <Link href="/blogs" className="group inline-flex items-center gap-3 font-bold uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 text-sm whitespace-nowrap"
                        style={{ backgroundColor: COLORS.button, color: COLORS.buttonText, boxShadow: '0 4px 20px rgba(246, 176, 0, 0.2)' }}
                    >
                        View All Articles
                        <i className="fa-solid fa-arrow-right-long group-hover:translate-x-1 transition-transform"></i>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {blogs.map((blog, index) => (
                        <Link
                            href={`/blogs/${blog._id}`}
                            key={blog._id}
                            className={`group bg-white rounded-[32px] overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2 ${index !== 0 ? "hidden md:flex" : ""
                                }`}
                        >
                            <div className="w-full h-60 relative overflow-hidden">
                                {blog.image_url ? (
                                    <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                        <i className="fa-solid fa-image text-5xl"></i>
                                    </div>
                                )}

                                {blog.featured && (
                                    <div className="absolute top-6 right-6 text-white text-[10px] font-black uppercase tracking-[2px] px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 z-10" style={{ backgroundColor: COLORS.amber }}>
                                        <i className="fa-solid fa-star text-[8px]"></i> Special
                                    </div>
                                )}

                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm text-black">
                                    {new Date(blog.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                </div>
                            </div>

                            <div className="p-7 flex flex-col flex-grow relative">
                                {/* Category Hint */}
                                <span className="text-[10px] font-black uppercase tracking-[3px] text-primary mb-3 block">
                                    {blog.category || (blog.tags && blog.tags.length > 0 ? blog.tags[0] : "Insights")}
                                </span>

                                <h3 className="text-xl font-bold leading-tight mb-3 line-clamp-2 transition-colors group-hover:text-primary" style={{ color: COLORS.black }}>
                                    {blog.title}
                                </h3>

                                <p className="text-black/40 text-[13px] leading-relaxed line-clamp-2 mb-6 flex-grow font-medium">
                                    {blog.content.replace(/<[^>]*>?/gm, '')}
                                </p>

                                <div className="pt-5 border-t border-black/5 mt-auto flex items-center justify-between group/btn text-black">
                                    <span className="font-bold uppercase tracking-[2px] text-[10px] flex items-center gap-2 transition-all">
                                        Read Full Story
                                    </span>
                                    <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <i className="fa-solid fa-arrow-right-long text-xs"></i>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}