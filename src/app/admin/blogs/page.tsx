'use client';

import React, { useState, useEffect } from 'react';

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
}

const EMPTY_FORM = { title: '', author: '', slug: '', content: '', tags: '' };

export default function AdminBlogs() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<any | null>(null); // null = add mode

    const [form, setForm] = useState(EMPTY_FORM);
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
            const res = await fetch('http://localhost:8000/api/cms/admin/blogs', {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            if (res.ok) setBlogs(await res.json());
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const openAdd = () => {
        setEditingBlog(null);
        setForm(EMPTY_FORM);
        setFile(null);
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
            tags: (blog.tags || []).join(', ')
        });
        setFile(null);
        setError('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBlog(null);
        setForm(EMPTY_FORM);
        setFile(null);
        setError('');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this blog post?')) return;
        const res = await fetch(`http://localhost:8000/api/cms/admin/blogs/${id}`, {
            method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (res.ok) fetchBlogs();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('author', form.author);
        fd.append('slug', form.slug);
        fd.append('content', form.content);
        fd.append('tags', form.tags);
        if (file) fd.append('file', file);

        const isEdit = !!editingBlog;
        const url = isEdit
            ? `http://localhost:8000/api/cms/admin/blogs/${editingBlog._id}`
            : 'http://localhost:8000/api/cms/admin/blogs';
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
                <button onClick={openAdd} className="bg-[#0c5c2b] text-white px-4 py-2 rounded-lg hover:bg-green-800 transition font-medium shadow-sm flex items-center gap-2">
                    <i className="fa-solid fa-pen-nib" /> Write Article
                </button>
            </div>

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
                    <i className="fa-solid fa-circle-check text-green-500 text-lg" /> {success}
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-xl h-64 animate-pulse border border-gray-100" />)}
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
                                    {b.created_at && <span><i className="fa-regular fa-calendar mr-1" />{new Date(b.created_at).toLocaleDateString()}</span>}
                                </div>
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {(b.tags || []).slice(0, 3).map((tag: string, i: number) => (
                                        <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md">#{tag}</span>
                                    ))}
                                </div>
                                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                                    <span className="text-sm font-bold text-[#0c5c2b]"><i className="fa-regular fa-eye mr-1" />{b.views || 0} views</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(b)} className="text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded transition font-medium text-sm">
                                            <i className="fa-solid fa-pen mr-1" />Edit
                                        </button>
                                        <button onClick={() => handleDelete(b._id)} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded transition font-medium text-sm">
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
                                    <label className="text-sm font-medium text-gray-700">Article Title</label>
                                    <input type="text" required value={form.title}
                                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-[#0c5c2b]/30 focus:border-[#0c5c2b] text-xl font-medium text-gray-800"
                                        placeholder="The Health Benefits of Premium Cashews..." />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">SEO Slug</label>
                                    <div className="flex bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                                        <span className="px-3 py-2 text-gray-400 border-r border-gray-200 bg-gray-100 select-none text-sm">/blogs/</span>
                                        <input type="text" required value={form.slug}
                                            onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') }))}
                                            className="w-full px-4 py-2 bg-transparent outline-none text-gray-600 text-sm" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Author</label>
                                    <input type="text" required value={form.author}
                                        onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-[#0c5c2b]/30"
                                        placeholder="Crunchy Cashews Editorial" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Tags (comma separated)</label>
                                    <input type="text" value={form.tags}
                                        onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-[#0c5c2b]/30"
                                        placeholder="Health, Nutrition, Recipes" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Cover Image {editingBlog ? '(upload to replace current)' : '(optional)'}
                                    </label>
                                    {editingBlog?.image_url && (
                                        <div className="flex items-center gap-3 mb-2">
                                            <img src={editingBlog.image_url} alt="Current" className="w-16 h-16 object-cover rounded-lg border" />
                                            <p className="text-xs text-gray-500">Current image shown above. Upload to replace.</p>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-green-50 file:text-[#0c5c2b] hover:file:bg-green-100 cursor-pointer border rounded-lg p-2" />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Content (Markdown / HTML supported)</label>
                                    <textarea required value={form.content}
                                        onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                                        className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 ring-[#0c5c2b]/30 min-h-[280px] font-mono text-sm"
                                        placeholder="Write your amazing content here..." />
                                </div>
                                <div className="md:col-span-2 pt-2">
                                    <button type="submit" disabled={isSubmitting}
                                        className="w-full bg-[#0c5c2b] text-white py-3 rounded-xl font-bold hover:bg-green-800 transition disabled:opacity-50 flex items-center justify-center gap-2">
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
        </div>
    );
}
