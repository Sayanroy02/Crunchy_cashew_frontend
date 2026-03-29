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
        <section className="py-4 md:py-6 bg-bg-cream relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="max-w-2xl">
                        <span className="text-black font-bold tracking-widest uppercase text-sm mb-2 block">Latest News & Insights</span>
                        <motion.h2
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 }}
                          className="text-4xl md:text-5xl font-black tracking-tight mb-4"
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
                              style={{ backgroundColor: COLORS.highlight }}
                            />
                          </span>
                        </motion.h2>
                        <p className="text-black/60 text-lg">Stay updated with the latest in cashew farming, recipes, and industry trends.</p>
                    </div>
                    <Link href="/blogs" className="hidden md:inline-block border-2 font-bold px-8 py-3 rounded-full transition-all duration-300" 
                        style={{ color: COLORS.black, borderColor: COLORS.black }} 
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = COLORS.primary; e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.color = COLORS.black; }} 
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = COLORS.black; e.currentTarget.style.color = COLORS.black; }}
                    >
                        View All Articles
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog, index) => (
                        <Link
                            href={`/blogs/${blog._id}`}
                            key={blog._id}
                            className={`bg-bg-cream rounded-3xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300 shadow-md hover:shadow-xl flex flex-col ${index !== 0 ? "hidden md:flex" : ""
                                }`}
                        >
                            <div className="w-full h-60 relative overflow-hidden bg-gray-200">
                                {blog.image_url ? (
                                    <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <i className="fa-solid fa-image text-4xl"></i>
                                    </div>
                                )}
                                {blog.featured && (
                                    <div className="absolute top-4 right-4 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-10" style={{ backgroundColor: COLORS.amber }}>
                                        <i className="fa-solid fa-star"></i> Featured
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-white font-bold text-xs px-3 py-1 rounded-full shadow-sm" style={{ color: COLORS.primary }}>
                                    {new Date(blog.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                            </div>
                            <div className="p-8 flex flex-col flex-grow bg-white border-t-4" style={{ borderColor: COLORS.primary }}>
                                <h3 className="text-xl font-bold font-heading mb-4 line-clamp-2 transition-colors" style={{ color: COLORS.black }}>{blog.title}</h3>
                                <p className="text-black/60 line-clamp-3 mb-6 flex-grow">
                                    {blog.content.replace(/<[^>]*>?/gm, '')}
                                </p>
                                <span className="font-bold flex items-center gap-2 uppercase tracking-wide text-sm mt-auto group-hover:gap-3 transition-all" style={{ color: COLORS.black }}>
                                    Read More <i className="fa-solid fa-arrow-right-long" style={{ color: COLORS.primary }}></i>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link href="/blogs" className="inline-block border-2 font-bold px-8 py-3 rounded-full transition-all duration-300 w-full" style={{ color: COLORS.black, borderColor: COLORS.black }}>
                        View All Articles
                    </Link>
                </div>
            </div>
        </section>
    );
}