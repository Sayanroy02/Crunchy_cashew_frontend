'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { API } from '@/constants/api';
import { COLORS } from '@/constants/styles';

interface Blog {
    _id: string;
    title: string;
    image_url?: string;
    content: string;
    created_at: string;
    featured?: boolean;
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
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="max-w-2xl">
                        <span className="text-black font-bold tracking-[4px] uppercase text-xs mb-3 block">Latest News & Insights</span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black tracking-tight mb-6"
                            style={{ color: COLORS.heading }}
                        >
                            Read Our <span className="relative inline-block">
                                <span className="relative z-10">Blogs</span>
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '100%' }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="absolute bottom-1 md:bottom-2 left-0 h-3 md:h-4 -z-0 opacity-80"
                                    style={{
                                        backgroundColor: COLORS.highlight,
                                        borderRadius: '5px',
                                        height: '30%',
                                        width: '100%',
                                        transition: 'width 0.8s 0.5s ease',
                                    }}
                                />
                            </span>
                        </motion.h2>
                        {/* <p className="text-black/50 text-lg font-medium max-w-xl mx-auto">Stay updated with the latest in cashew farming, recipes, and industry trends.</p> */}
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {blogs.map((blog, index) => (
                        <Link
                            href={`/blogs/${blog._id}`}
                            key={blog._id}
                            className={`group bg-white rounded-[40px] overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-3 ${index !== 0 ? "hidden md:flex" : ""
                                }`}
                        >
                            <div className="w-full h-72 relative overflow-hidden">
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

                            <div className="p-10 flex flex-col flex-grow relative">
                                {/* Category Hint */}
                                <span className="text-[10px] font-black uppercase tracking-[3px] text-primary mb-4 block">Insights</span>

                                <h3 className="text-2xl font-bold leading-tight mb-4 line-clamp-2 transition-colors group-hover:text-primary" style={{ color: COLORS.black }}>
                                    {blog.title}
                                </h3>

                                <p className="text-black/40 text-sm leading-relaxed line-clamp-3 mb-8 flex-grow font-medium">
                                    {blog.content.replace(/<[^>]*>?/gm, '')}
                                </p>

                                <div className="pt-6 border-t border-black/5 mt-auto flex items-center justify-between group/btn">
                                    <span className="font-bold uppercase tracking-[2px] text-[11px] flex items-center gap-2 transition-all">
                                        Read Full Story
                                    </span>
                                    <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <i className="fa-solid fa-arrow-right-long text-xs"></i>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="mt-5 flex justify-center">
                    <Link href="/blogs" className="group inline-flex items-center gap-3 font-bold uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 text-sm"
                        style={{ backgroundColor: COLORS.button, color: COLORS.buttonText, boxShadow: '0 4px 20px rgba(246, 176, 0, 0.2)' }}
                    >
                        View All Articles
                        <i className="fa-solid fa-arrow-right-long group-hover:translate-x-1 transition-transform"></i>
                    </Link>
                </div>
            </div>
        </section>
    );
}