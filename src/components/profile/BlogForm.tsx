'use client';

import React, { useState } from 'react';
import { API } from '@/constants/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import RichTextEditor from '@/components/ui/RichTextEditor';

interface BlogFormProps {
    blog?: any;
    onClose: () => void;
    onSuccess: () => void;
}

const CATEGORIES = ['Health', 'Recipes', 'Sustainability', 'Newsroom'];

export default function BlogForm({ blog, onClose, onSuccess }: BlogFormProps) {
    const [title, setTitle] = useState(blog?.title || '');
    const [content, setContent] = useState(blog?.content || '');
    const [category, setCategory] = useState(blog?.category || 'Health');
    const [tags, setTags] = useState(blog?.tags?.join(', ') || '');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const token = useSelector((state: RootState) => state.auth.token);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!blog && !image) {
            setError('Please upload a cover image.');
            setLoading(false);
            return;
        }

        try {
            const formattedTags = tags
                .split(',')
                .map((t: string) => {
                    const clean = t.trim();
                    if (!clean) return '';
                    return clean.startsWith('#') ? clean : `#${clean}`;
                })
                .filter(Boolean)
                .join(', ');

            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('category', category);
            formData.append('tags', formattedTags);
            if (image) {
                formData.append('file', image);
            }

            const url = blog ? API.CUSTOMER_BLOG_UPDATE(blog._id) : API.CUSTOMER_BLOG_SUBMIT;
            const method = blog ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const data = await res.json();
                setError(data.detail || 'Failed to save blog');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-black text-gray-800">{blog ? 'Edit Blog' : 'Upload New Blog'}</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-bold flex items-center gap-2">
                            <i className="fa-solid fa-circle-exclamation"></i>
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Blog Title <span className="text-red-500">*</span></label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl py-3 px-4 outline-none transition-all font-semibold text-gray-800"
                            placeholder="Enter a catchy title..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Category <span className="text-red-500">*</span></label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl py-3 px-4 outline-none transition-all font-semibold text-gray-800 appearance-none"
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Hashtags (comma separated)</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl py-3 px-4 outline-none transition-all font-semibold text-gray-800"
                                placeholder="healthy, cashews, recipe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Cover Image <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files?.[0] || null)}
                                className="hidden"
                                id="blog-image"
                            />
                            <label
                                htmlFor="blog-image"
                                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                            >
                                {image ? (
                                    <div className="text-center">
                                        <i className="fa-solid fa-file-image text-3xl text-primary mb-2"></i>
                                        <p className="text-sm font-bold text-gray-800">{image.name}</p>
                                        <p className="text-xs text-gray-400">Click to change</p>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-400 group-hover:text-primary transition-colors">
                                        <i className="fa-solid fa-cloud-arrow-up text-4xl mb-3"></i>
                                        <p className="text-sm font-bold tracking-tight">Click to upload cover image</p>
                                        <p className="text-[10px] uppercase font-black opacity-60">PNG, JPG or WEBP (max. 5MB)</p>
                                    </div>
                                )}
                            </label>
                        </div>
                        {blog?.image_url && !image && (
                            <p className="text-[10px] text-gray-400 font-bold mt-1 italic pl-1">Current image will be kept if none uploaded.</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Blog Content <span className="text-red-500">*</span></label>
                        <RichTextEditor
                            value={content}
                            onChange={(html) => setContent(html)}
                            placeholder="Write your story here..."
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <i className="fa-solid fa-circle-notch animate-spin"></i>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-paper-plane"></i>
                                    {blog ? 'Update Blog' : 'Submit for Approval'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
