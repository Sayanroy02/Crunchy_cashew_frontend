'use client';

import React, { useState, useEffect, useRef } from 'react';
import { API } from '@/constants/api';
import RichTextEditor from '@/components/ui/RichTextEditor';

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
}

const CATEGORIES = ['Health', 'Recipes', 'Sustainability', 'Newsroom'] as const;
type Category = typeof CATEGORIES[number];
const EMPTY_FORM = { title: '', author: '', slug: '', content: '', tags: '', category: 'Health' as Category };

export default function AdminBlogs() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<any | null>(null); // null = add mode

    const [form, setForm] = useState(EMPTY_FORM);
    const fileRef = useRef<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean, type: 'delete' | 'status', blogId: string, currentStatus?: string, message: string }>({ isOpen: false, type: 'delete', blogId: '', message: '' });

    // Auto-generate slug from title only in add mode
    useEffect(() => {
        if (!editingBlog && form.title) {
            setForm(prev => ({
                ...prev,
                slug: prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }));
        }
    }, [form.title, editingBlog]);

    const fetchBlogs = async () => {
        try {
            const res = await fetch(API.ADMIN_BLOGS, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            if (res.ok) {
                setBlogs(await res.json());
            } else {
                const err = await res.json().catch(() => ({}));
                console.error('Admin blogs fetch failed:', res.status, err.detail);
            }
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const downloadCSV = () => {
        const headers = ['Blog ID', 'Title', 'Author', 'Category', 'Views', 'Date', 'Tags', 'Slug'];
        
        const rows = blogs.map(b => {
            const date = b.created_at ? new Date(b.created_at).toLocaleDateString('en-GB') : '';
            return [
                b._id,
                b.title || '',
                b.author || '',
                b.category || '',
                b.views || 0,
                date,
                (b.tags || []).join(', '),
                b.slug || ''
            ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `blogs_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const openAdd = () => {
        setEditingBlog(null);
        setForm(EMPTY_FORM);
        fileRef.current = null;
        setError('');
        setIsModalOpen(true);
    };

    const openEdit = (blog: any) => {
        setEditingBlog(blog);
        setForm({
            title: blog.title || '',
            author: blog.author || '',
            slug: blog.slug || '',
            content: blog.content || '',
            tags: (blog.tags || []).join(', '),
            category: blog.category || 'Health'
        });
        fileRef.current = null;
        setError('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBlog(null);
        setForm(EMPTY_FORM);
        fileRef.current = null;
        setError('');
    };

    const confirmDelete = (id: string) => {
        setConfirmDialog({ isOpen: true, type: 'delete', blogId: id, message: 'Are you sure you want to delete this blog post?' });
    };

    const confirmToggleStatus = (id: string, status: string) => {
        const isDisabling = status !== 'hidden';
        setConfirmDialog({ 
            isOpen: true, 
            type: 'status', 
            blogId: id, 
            currentStatus: status, 
            message: `Are you sure you want to ${isDisabling ? 'disable' : 'enable'} this blog post?` 
        });
    };

    const executeConfirm = () => {
        if (confirmDialog.type === 'delete') {
            handleDelete(confirmDialog.blogId);
        } else if (confirmDialog.type === 'status') {
            handleToggleStatus(confirmDialog.blogId, confirmDialog.currentStatus || '');
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
    };

    const handleDelete = async (id: string) => {
        const res = await fetch(API.ADMIN_BLOG(id), {
            method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (res.ok) fetchBlogs();
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'hidden' ? 'published' : 'hidden';
        try {
            const res = await fetch(`${API.ADMIN_BLOGS}/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchBlogs();
                setSuccess(newStatus === 'hidden' ? '🚫 Blog disabled from customer panel' : '✅ Blog enabled in customer panel');
                setTimeout(() => setSuccess(''), 4000);
            }
        } catch (e) {
            setError('Failed to update status.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if (!editingBlog && !fileRef.current) {
            setError('Please upload a cover image.');
            setIsSubmitting(false);
            return;
        }

        const formattedTags = form.tags
            .split(',')
            .map((t: string) => {
                const clean = t.trim();
                if (!clean) return '';
                return clean.startsWith('#') ? clean : `#${clean}`;
            })
            .filter(Boolean)
            .join(', ');

        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('author', form.author);
        fd.append('slug', form.slug);
        fd.append('content', form.content);
        fd.append('tags', formattedTags);
        fd.append('category', form.category);
        if (fileRef.current) fd.append('file', fileRef.current);

        const isEdit = !!editingBlog;
        const url = isEdit
            ? API.ADMIN_BLOG(editingBlog._id)
            : API.ADMIN_BLOGS;
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${getToken()}` },
                body: fd
            });
            if (res.ok) {
                closeModal();
                setSuccess(isEdit ? '✅ Blog updated!' : '✅ Blog published!');
                setTimeout(() => setSuccess(''), 4000);
                fetchBlogs();
            } else {
                const err = await res.json().catch(() => ({}));
                setError(err.detail || 'Failed. Please try again.');
            }
        } catch {
            setError('Connection error.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Manage Journal</h1>
                <div className="flex items-center gap-2">
                    <button onClick={downloadCSV} className="bg-white border border-gray-200 text-green-700 hover:text-green-800 px-4 py-2 rounded-lg transition font-medium shadow-sm flex items-center gap-2 active:scale-95 text-sm">
                        <i className="fa-solid fa-file-excel" /> Download Excel
                    </button>
                    <button onClick={openAdd} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-800 transition font-medium shadow-sm flex items-center gap-2 text-sm">
                        <i className="fa-solid fa-pen-nib" /> Write Article
                    </button>
                </div>
            </div>

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
                    <i className="fa-solid fa-circle-check text-green-500 text-lg" /> {success}
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {['skeleton-1', 'skeleton-2', 'skeleton-3'].map(id => <div key={id} className="bg-white rounded-xl h-64 animate-pulse border border-gray-100" />)}
                </div>
            ) : blogs.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
                    <i className="fa-solid fa-pen-nib text-4xl mb-4 block" />
                    <p className="mt-3">No journal entries yet. Write your first post!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {blogs.map((b) => (
                        <div key={b._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                            {b.image_url ? (
                                <img src={b.image_url} alt={b.title} className="w-full h-48 object-cover" />
                            ) : (
                                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-4xl">📰</div>
                            )}
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-bold text-xl mb-2 line-clamp-2">{b.title}</h3>
                                <div className="flex items-center text-xs text-gray-500 mb-3 gap-4">
                                    <span><i className="fa-regular fa-user mr-1" />{b.author}</span>
                                    {b.created_at && <span suppressHydrationWarning><i className="fa-regular fa-calendar mr-1" />{new Date(b.created_at).toLocaleDateString()}</span>}
                                </div>
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {b.category && (
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                            (b.category === 'Health' || b.category === 'Health Articles') ? 'bg-green-100 text-green-700' :
                                            (b.category === 'Recipes' || b.category === 'Recipes Blog') ? 'bg-amber-100 text-amber-700' :
                                            (b.category === 'Newsroom') ? 'bg-indigo-100 text-indigo-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>{b.category}</span>
                                    )}
                                    {(b.tags || []).slice(0, 3).map((tag: string, i: number) => (
                                        <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md">#{tag}</span>
                                    ))}
                                </div>
                                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                                    <span className="text-sm font-bold text-primary"><i className="fa-regular fa-eye mr-1" />{b.views || 0} views</span>
                                    <div className="flex gap-2 flex-wrap justify-end">
                                        <button onClick={() => confirmToggleStatus(b._id, b.status)} className={`px-3 py-1.5 rounded transition font-medium text-sm flex items-center gap-1 ${b.status === 'hidden' ? 'text-green-600 hover:bg-green-50' : 'text-gray-500 hover:bg-gray-100'}`}>
                                            <i className={`fa-solid ${b.status === 'hidden' ? 'fa-eye' : 'fa-eye-slash'}`} />
                                            {b.status === 'hidden' ? 'Enable' : 'Disable'}
                                        </button>
                                        <button onClick={() => openEdit(b)} className="text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded transition font-medium text-sm flex items-center gap-1">
                                            <i className="fa-solid fa-pen mr-1" />Edit
                                        </button>
                                        <button onClick={() => confirmDelete(b._id)} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded transition font-medium text-sm flex items-center gap-1">
                                            <i className="fa-solid fa-trash mr-1" />Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Compose / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-bold">{editingBlog ? '✏️ Edit Article' : 'Compose Journal Entry'}</h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                                    <i className="fa-solid fa-circle-exclamation" /> {error}
                                </div>
                            )}
                            <form id="blogForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 md:col-span-2">
                                    <label htmlFor="blog-title" className="text-sm font-medium text-gray-700">Article Title <span className="text-red-500">*</span></label>
                                    <input id="blog-title" type="text" required value={form.title}
                                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-primary/30 focus:border-primary text-xl font-medium text-gray-800"
                                        placeholder="The Health Benefits of Premium Cashews..." />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="blog-slug" className="text-sm font-medium text-gray-700">SEO Slug</label>
                                    <div className="flex bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                                        <span className="px-3 py-2 text-gray-400 border-r border-gray-200 bg-gray-100 select-none text-sm">/blogs/</span>
                                        <input id="blog-slug" type="text" required value={form.slug}
                                            onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') }))}
                                            className="w-full px-4 py-2 bg-transparent outline-none text-gray-600 text-sm" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="blog-category" className="text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                                    <select
                                        id="blog-category"
                                        value={form.category}
                                        onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}
                                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-primary/30 focus:border-primary bg-white"
                                        required
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="blog-author" className="text-sm font-medium text-gray-700">Author</label>
                                    <input id="blog-author" type="text" required value={form.author}
                                        onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-primary/30"
                                        placeholder="Crunchy Cashews Editorial" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label htmlFor="blog-tags" className="text-sm font-medium text-gray-700">Hashtags (comma separated)</label>
                                    <input id="blog-tags" type="text" value={form.tags}
                                        onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-primary/30"
                                        placeholder="Health, Nutrition, Recipes" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label htmlFor="blog-file" className="text-sm font-medium text-gray-700">
                                        Cover Image <span className="text-red-500">*</span> {editingBlog ? '(upload to replace current)' : ''}
                                    </label>
                                    {editingBlog?.image_url && (
                                        <div className="flex items-center gap-3 mb-2">
                                            <img src={editingBlog.image_url} alt="Current" className="w-16 h-16 object-cover rounded-lg border" />
                                            <p className="text-xs text-gray-500">Current image shown above. Upload to replace.</p>
                                        </div>
                                    )}
                                    <input id="blog-file" type="file" accept="image/*" onChange={e => { fileRef.current = e.target.files?.[0] || null; }}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-green-50 file:text-primary hover:file:bg-green-100 cursor-pointer border rounded-lg p-2" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Content (Markdown / HTML supported) <span className="text-red-500">*</span></label>
                                    <RichTextEditor
                                        value={form.content}
                                        onChange={html => setForm(f => ({ ...f, content: html }))}
                                        placeholder="Write your amazing content here..."
                                    />
                                </div>
                                <div className="md:col-span-2 pt-2">
                                    <button type="submit" disabled={isSubmitting}
                                        className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-green-800 transition disabled:opacity-50 flex items-center justify-center gap-2">
                                        {isSubmitting
                                            ? <><i className="fa-solid fa-spinner animate-spin" /> {editingBlog ? 'Saving...' : 'Publishing...'}</>
                                            : <><i className="fa-solid fa-paper-plane" /> {editingBlog ? 'Save Changes' : 'Publish Article'}</>
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Confirm Modal */}
            {confirmDialog.isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="text-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmDialog.type === 'delete' ? 'bg-red-100 text-red-500' : 'bg-amber-100 text-amber-500'}`}>
                                <i className={`fa-solid text-2xl ${confirmDialog.type === 'delete' ? 'fa-trash' : 'fa-circle-exclamation'}`}></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Are you sure?</h3>
                            <p className="text-gray-500 mb-6">{confirmDialog.message}</p>
                            <div className="flex gap-3">
                                <button onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} className="flex-1 py-2.5 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition active:scale-95">
                                    No, cancel
                                </button>
                                <button onClick={executeConfirm} className={`flex-1 py-2.5 rounded-xl text-white font-bold transition active:scale-95 ${confirmDialog.type === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-green-700'}`}>
                                    Yes, I'm sure
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
