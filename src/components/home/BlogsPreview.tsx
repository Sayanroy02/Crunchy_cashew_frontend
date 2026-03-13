'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API } from '@/constants/api';

interface Blog {
    _id: string;
    title: string;
    image_url?: string;
    content: string;
    created_at: string;
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
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="max-w-2xl">
                        <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">Latest News & Insights</span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-text-dark mb-4">Read Our Blogs</h2>
                        <p className="text-gray-600 text-lg">Stay updated with the latest in cashew farming, recipes, and industry trends.</p>
                    </div>
                    <Link href="/blogs" className="hidden md:inline-block border-2 border-text-dark text-text-dark font-bold px-8 py-3 rounded-full hover:bg-text-dark hover:text-white transition-colors duration-300">
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
                                <div className="absolute top-4 left-4 bg-white text-text-dark font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                                    {new Date(blog.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                            </div>
                            <div className="p-8 flex flex-col flex-grow bg-white border-t-4 border-primary">
                                <h3 className="text-xl font-bold font-heading text-text-dark mb-4 line-clamp-2 group-hover:text-primary transition-colors">{blog.title}</h3>
                                <p className="text-gray-600 line-clamp-3 mb-6 flex-grow">
                                    {blog.content.replace(/<[^>]*>?/gm, '')}
                                </p>
                                <span className="text-primary font-bold flex items-center gap-2 uppercase tracking-wide text-sm mt-auto group-hover:gap-3 transition-all">
                                    Read More <i className="fa-solid fa-arrow-right-long"></i>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link href="/blogs" className="inline-block border-2 border-text-dark text-text-dark font-bold px-8 py-3 rounded-full hover:bg-text-dark hover:text-white transition-colors duration-300 w-full">
                        View All Articles
                    </Link>
                </div>
            </div>
        </section>
    );
}