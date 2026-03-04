'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Blog {
    _id: string;
    title: string;
    image_url?: string;
    content: string;
    created_at: string;
}

export default function BlogsDirectory() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('http://localhost:8000/api/cms/blogs')
            .then(res => res.json())
            .then(data => {
                setBlogs(data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load blogs", err);
                setLoading(false);
            });
    }, []);

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-bg-cream min-h-screen pb-24">
            {/* Header */}
            <section className="bg-black text-white py-20 px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Insights & News</h1>
                <p className="text-gray-300 max-w-2xl mx-auto text-lg mb-10">
                    Dive into the world of premium cashew processing, healthy recipes, and global industry updates directly from our experts.
                </p>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative">
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-full px-6 py-4 pl-14 focus:outline-none focus:bg-white/20 transition-all font-body"
                    />
                    <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
            </section>

            {/* Blogs Grid */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
                        <i className="fa-regular fa-folder-open text-6xl text-gray-300 mb-4 block"></i>
                        <h3 className="text-2xl font-bold text-gray-700 font-heading mb-2">No Articles Found</h3>
                        <p className="text-gray-500">We couldn't find any blogs matching your search term.</p>
                        <button onClick={() => setSearchTerm('')} className="mt-6 text-primary font-bold hover:underline">Clear Search</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBlogs.map(blog => (
                            <Link href={`/blogs/${blog._id}`} key={blog._id} className="bg-white rounded-3xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300 shadow-md hover:shadow-xl flex flex-col border border-gray-100">
                                <div className="w-full h-64 relative overflow-hidden bg-gray-50">
                                    {blog.image_url ? (
                                        <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <i className="fa-solid fa-image text-5xl"></i>
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-text-dark font-bold text-xs px-4 py-2 rounded-full shadow-sm">
                                        {new Date(blog.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <h3 className="text-2xl font-bold font-heading text-text-dark mb-4 line-clamp-2 group-hover:text-primary transition-colors">{blog.title}</h3>
                                    <p className="text-gray-600 line-clamp-3 mb-6 flex-grow font-body leading-relaxed">
                                        {blog.content.replace(/<[^>]*>?/gm, '')}
                                    </p>
                                    <span className="text-primary font-bold flex items-center gap-2 uppercase tracking-wider text-sm mt-auto group-hover:gap-3 transition-all">
                                        Read Article <i className="fa-solid fa-arrow-right-long"></i>
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
