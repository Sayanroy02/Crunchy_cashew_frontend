'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { API } from '@/constants/api';
import Image from 'next/image';
import BlogForm from './BlogForm';

export default function CustomerBlogs() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBlog, setEditingBlog] = useState<any>(null);

    const token = useSelector((state: RootState) => state.auth.token);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const res = await fetch(API.CUSTOMER_BLOGS, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setBlogs(await res.json());
            }
        } catch (err) {
            console.error('Failed to fetch customer blogs', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [token]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'published': return 'bg-primary/20 text-black border-primary/20';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'published': return 'fa-circle-check';
            case 'rejected': return 'fa-circle-xmark';
            default: return 'fa-clock';
        }
    };

    // ── Loading skeleton ──
    if (loading) return (
        <div className="space-y-3 p-1">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-4 flex gap-3 border border-gray-100">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-100 animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                        <div className="h-3.5 bg-gray-100 rounded-full animate-pulse w-3/4" />
                        <div className="h-3 bg-gray-100 rounded-full animate-pulse w-full" />
                        <div className="h-3 bg-gray-100 rounded-full animate-pulse w-5/6" />
                        <div className="h-3 bg-gray-100 rounded-full animate-pulse w-1/2 mt-2" />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="animate-in slide-in-from-right-4 duration-300">

            {/* ── Header ── */}
            <div className="flex justify-between items-start sm:items-center mb-5 gap-3">
                <div>
                    <h2 className="text-lg sm:text-xl font-black text-gray-800 leading-tight">My Blogs</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                        Share your knowledge & recipes
                    </p>
                </div>
                <button
                    onClick={() => { setEditingBlog(null); setShowForm(true); }}
                    className="bg-primary text-white font-bold px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0"
                >
                    <i className="fa-solid fa-plus text-[11px]" />
                    <span className="hidden xs:inline">New Blog</span>
                    <span className="xs:hidden">New</span>
                </button>
            </div>

            {/* ── Empty State ── */}
            {blogs.length === 0 ? (
                <div className="text-center py-14 sm:py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 px-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <i className="fa-solid fa-blog text-2xl sm:text-3xl text-gray-200"></i>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-gray-800 mb-1">No blogs uploaded yet</h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-6 max-w-xs mx-auto leading-relaxed">
                        Upload your first blog about health, recipes, or sustainability to get started.
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="text-primary font-bold text-sm bg-white border border-gray-200 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Create Your First Blog
                    </button>
                </div>
            ) : (
                /* ── Blog List ── */
                <div className="grid gap-3 sm:gap-4">
                    {blogs.map((blog) => (
                        <div
                            key={blog._id}
                            className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 active:scale-[0.99]"
                        >
                            <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">

                                {/* Thumbnail */}
                                {blog.image_url ? (
                                    <Image
                                        src={blog.image_url}
                                        alt={blog.title}
                                        width={96}
                                        height={96}
                                        sizes="(max-width: 640px) 80px, 96px"
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0"
                                    />
                                ) : (
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 shrink-0 border border-gray-100">
                                        <i className="fa-solid fa-image text-xl sm:text-2xl"></i>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="flex-1 min-w-0 flex flex-col justify-between">

                                    {/* Top row: title + status badge */}
                                    <div className="flex justify-between items-start gap-2 mb-1">
                                        <h3 className="font-black text-gray-800 text-sm sm:text-base leading-tight line-clamp-1 flex-1">
                                            {blog.title}
                                        </h3>
                                        <span className={`inline-flex items-center gap-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md border shrink-0 ${getStatusStyle(blog.status)}`}>
                                            <i className={`fa-solid ${getStatusIcon(blog.status)} text-[8px]`} />
                                            <span className="hidden sm:inline">{blog.status || 'pending'}</span>
                                        </span>
                                    </div>

                                    {/* Excerpt */}
                                    <p className="text-[11px] sm:text-xs text-gray-400 line-clamp-2 leading-relaxed mb-2">
                                        {blog.content}
                                    </p>

                                    {/* Bottom row: meta + action */}
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                        <div className="flex items-center gap-1.5">
                                            {/* Category pill */}
                                            {blog.category && (
                                                <span className="text-[9px] sm:text-[10px] font-bold text-primary bg-primary/8 px-2 py-0.5 rounded-full border border-primary/15 uppercase tracking-wide">
                                                    {blog.category}
                                                </span>
                                            )}
                                            {/* Date */}
                                            <span className="text-[9px] sm:text-[10px] text-gray-300 font-bold">
                                                {new Date(blog.created_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short', year: '2-digit'
                                                })}
                                            </span>
                                        </div>

                                        {/* Edit button */}
                                        <button
                                            onClick={() => { setEditingBlog(blog); setShowForm(true); }}
                                            className="text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-primary hover:text-white active:scale-95 transition-all shrink-0"
                                        >
                                            <i className="fa-solid fa-pen text-[8px] mr-1" />
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile-only status label strip (shows full text on small screens) */}
                            <div className={`sm:hidden px-3 pb-2.5 flex items-center gap-1.5`}>
                                <i className={`fa-solid ${getStatusIcon(blog.status)} text-[9px] ${blog.status === 'published' ? 'text-primary' :
                                        blog.status === 'rejected' ? 'text-red-500' : 'text-yellow-600'
                                    }`} />
                                <span className={`text-[9px] font-black uppercase tracking-widest ${blog.status === 'published' ? 'text-primary' :
                                        blog.status === 'rejected' ? 'text-red-500' : 'text-yellow-600'
                                    }`}>
                                    {blog.status === 'published' ? 'Published — Live on site' :
                                        blog.status === 'rejected' ? 'Rejected — needs revision' :
                                            'Pending review'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Blog Form Modal ── */}
            {showForm && (
                <BlogForm
                    blog={editingBlog}
                    onClose={() => setShowForm(false)}
                    onSuccess={fetchBlogs}
                />
            )}
        </div>
    );
}