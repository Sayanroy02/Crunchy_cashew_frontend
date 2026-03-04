'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Blog {
    _id: string;
    title: string;
    image_url?: string;
    content: string;
    created_at: string;
}

export default function BlogDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!id) return;

        fetch(`http://localhost:8000/api/cms/blogs/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Blog not found');
                return res.json();
            })
            .then(data => {
                setBlog(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load blog", err);
                setError(true);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-cream pt-32 pb-24 px-6 flex justify-center">
                <div className="max-w-3xl w-full">
                    <div className="h-12 bg-gray-200 rounded-lg w-3/4 animate-pulse mb-6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse mb-12"></div>
                    <div className="h-96 bg-gray-200 rounded-3xl w-full animate-pulse mb-12"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-bg-cream pt-32 pb-24 flex items-center justify-center px-6">
                <div className="text-center max-w-lg">
                    <i className="fa-solid fa-triangle-exclamation text-6xl text-highlight mb-6"></i>
                    <h1 className="text-4xl font-heading font-bold text-text-dark mb-4">Article Not Found</h1>
                    <p className="text-gray-600 font-body mb-8 text-lg">
                        The blog post you're looking for doesn't exist or has been removed.
                    </p>
                    <Link href="/blogs" className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-green-800 transition-colors">
                        Back to Blogs <i className="fa-solid fa-arrow-left ml-2"></i>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-white pb-24">
            {/* Header / Hero */}
            <div className="bg-bg-cream pt-32 pb-16 px-6 relative">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <Link href="/blogs" className="inline-flex items-center text-primary font-bold uppercase tracking-wider text-sm mb-8 hover:underline">
                        <i className="fa-solid fa-arrow-left mr-2"></i> Back to all articles
                    </Link>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-text-dark mb-6 leading-tight">
                        {blog.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-gray-500 font-body text-sm font-medium">
                        <span><i className="fa-regular fa-calendar mr-2"></i>{new Date(blog.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <span>•</span>
                        <span><i className="fa-regular fa-clock mr-2"></i>{Math.max(1, Math.ceil(blog.content.length / 1000))} min read</span>
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-20 mb-16">
                <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gray-100 border-4 border-white">
                    {blog.image_url ? (
                        <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <i className="fa-solid fa-image text-8xl"></i>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6">
                <div
                    className="prose prose-lg prose-green max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-text-dark prose-p:font-body prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Tags/Share (Optional placeholder) */}
                <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex gap-3">
                        <span className="bg-gray-100 text-gray-600 font-bold text-xs px-4 py-2 rounded-full uppercase tracking-wider">Cashews</span>
                        <span className="bg-gray-100 text-gray-600 font-bold text-xs px-4 py-2 rounded-full uppercase tracking-wider">Health</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-500 uppercase">Share:</span>
                        <button className="w-10 h-10 rounded-full bg-gray-100 text-text-dark hover:bg-primary hover:text-white transition-colors flex items-center justify-center"><i className="fa-brands fa-facebook-f"></i></button>
                        <button className="w-10 h-10 rounded-full bg-gray-100 text-text-dark hover:bg-primary hover:text-white transition-colors flex items-center justify-center"><i className="fa-brands fa-twitter"></i></button>
                        <button className="w-10 h-10 rounded-full bg-gray-100 text-text-dark hover:bg-primary hover:text-white transition-colors flex items-center justify-center"><i className="fa-brands fa-linkedin-in"></i></button>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="max-w-4xl mx-auto px-6 mt-24">
                <div className="bg-primary text-white rounded-3xl p-10 md:p-16 text-center shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -tr-32 -mr-32 pointer-events-none"></div>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 relative z-10">Taste the Quality Yourself</h2>
                    <p className="text-green-50 mb-8 max-w-lg mx-auto relative z-10">Order our premium, freshly roasted cashews direct from the factory.</p>
                    <Link href="/shop" className="inline-block bg-highlight text-black font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300 relative z-10 shadow-lg">
                        Shop Now <i className="fa-solid fa-cart-shopping ml-2"></i>
                    </Link>
                </div>
            </div>
        </article>
    );
}
