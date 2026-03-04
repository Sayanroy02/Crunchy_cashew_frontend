'use client';

import React, { useState, useEffect } from 'react';

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
}

const defaultForm = { name: '', description: '', price: 0, stock: 0, discount: 0, category: 'Cashew', is_available: true, image_url: '' };

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ ...defaultForm });
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/products');
            if (res.ok) setProducts(await res.json());
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchProducts(); }, []);

    const openAdd = () => {
        setEditingId(null);
        setFormData({ ...defaultForm });
        setFile(null);
        setError('');
        setIsModalOpen(true);
    };

    const openEdit = (p: any) => {
        setEditingId(p._id || p.id);
        setFormData({
            name: p.name || '',
            description: p.description || '',
            price: p.price || 0,
            stock: p.stock || 0,
            discount: p.discount || 0,
            category: p.category || 'Cashew',
            is_available: p.is_available !== false,
            image_url: p.image_url || '',
        });
        setFile(null);
        setError('');
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this product? This cannot be undone.')) return;
        const token = getToken();
        try {
            const res = await fetch(`http://localhost:8000/api/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchProducts();
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        const token = getToken();
        const fd = new FormData();
        Object.entries(formData).forEach(([key, value]) => fd.append(key, value.toString()));
        if (file) fd.append('file', file);

        const url = editingId
            ? `http://localhost:8000/api/products/${editingId}`
            : 'http://localhost:8000/api/products/';
        const method = editingId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: fd
            });
            if (res.ok) {
                setIsModalOpen(false);
                setFormData({ ...defaultForm });
                setFile(null);
                setEditingId(null);
                fetchProducts();
            } else {
                const err = await res.json();
                setError(err.detail || 'Failed to save product');
            }
        } catch (e) {
            setError('Connection error — is the backend running?');
        } finally {
            setIsSubmitting(false);
        }
    };

    const field = (label: string, key: string, type = 'text', required = true) => (
        <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            <input
                type={type}
                required={required}
                value={(formData as any)[key]}
                onChange={e => setFormData({ ...formData, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#0c5c2b] transition-colors"
            />
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">
                    Manage Catalog <span className="text-sm font-normal text-gray-400 ml-2">({products.length} products)</span>
                </h1>
                <button onClick={openAdd} className="bg-[#0c5c2b] text-white px-4 py-2.5 rounded-xl hover:bg-green-800 transition font-bold shadow-sm flex items-center gap-2">
                    <i className="fa-solid fa-plus"></i> Add Product
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-xl h-48 animate-pulse border border-gray-100"></div>)}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-semibold">Product</th>
                                    <th className="p-4 font-semibold">Price</th>
                                    <th className="p-4 font-semibold">Discount</th>
                                    <th className="p-4 font-semibold">Stock</th>
                                    <th className="p-4 font-semibold text-center">Status</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {products.map((p) => (
                                    <tr key={p._id || p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {p.image_url ? (
                                                    <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">🥜</div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-gray-800">{p.name}</p>
                                                    <p className="text-xs text-gray-400">{p.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 font-semibold">₹{p.price}</td>
                                        <td className="p-4 text-[#FBB21B] font-bold">{p.discount ? `${p.discount}%` : '—'}</td>
                                        <td className="p-4">{p.stock} units</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${p.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                {p.is_available ? '● Active' : '● Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEdit(p)} className="flex items-center gap-1.5 bg-[#FBB21B]/10 hover:bg-[#FBB21B]/20 text-[#2c1a0e] px-3 py-1.5 rounded-lg text-xs font-bold transition">
                                                    <i className="fa-solid fa-pen-to-square"></i> Edit
                                                </button>
                                                <button onClick={() => handleDelete(p._id || p.id)} className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr><td colSpan={6} className="p-12 text-center text-gray-400">No products found. Add your first product!</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">{editingId ? '✏️ Edit Product' : '+ Add New Product'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
                        </div>
                        <div className="p-5 overflow-y-auto">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                                    <i className="fa-solid fa-circle-exclamation"></i> {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {field('Product Name', 'name')}
                                {field('Category', 'category')}
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700">Description</label>
                                    <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#0c5c2b] min-h-[90px] transition-colors resize-none" />
                                </div>
                                {field('Price (₹)', 'price', 'number')}
                                {field('Stock Quantity', 'stock', 'number')}
                                {field('Discount (%)', 'discount', 'number', false)}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Availability</label>
                                    <select value={formData.is_available ? 'true' : 'false'} onChange={e => setFormData({ ...formData, is_available: e.target.value === 'true' })}
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#0c5c2b]">
                                        <option value="true">Active (visible in shop)</option>
                                        <option value="false">Inactive (hidden)</option>
                                    </select>
                                </div>
                                {editingId ? (
                                    /* EDIT MODE: show thumbnail, no manual URL */
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-semibold text-gray-700">Current Image (auto-filled)</label>
                                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                            {formData.image_url ? (
                                                <img src={formData.image_url} alt="Current" className="w-20 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0" />
                                            ) : (
                                                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🖼️</div>
                                            )}
                                            <div>
                                                <p className="text-xs font-semibold text-gray-600">Image is auto-filled from existing product.</p>
                                                <p className="text-xs text-gray-400 mt-0.5">Upload a new file below to replace it.</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* ADD MODE: manual URL available */
                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-sm font-semibold text-gray-700">Image URL (Cloudinary) — or upload below</label>
                                        <input type="url" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                            placeholder="https://res.cloudinary.com/..." className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-[#0c5c2b]" />
                                    </div>
                                )}
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700">Upload Image File (optional)</label>
                                    <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-green-50 file:text-[#0c5c2b] hover:file:bg-green-100 cursor-pointer border-2 border-gray-200 rounded-xl p-2" />
                                </div>
                                <div className="md:col-span-2 pt-2">
                                    <button type="submit" disabled={isSubmitting}
                                        className="w-full bg-[#0c5c2b] text-white py-3 rounded-xl font-bold hover:bg-green-800 transition disabled:opacity-50 flex items-center justify-center gap-2">
                                        {isSubmitting ? <><i className="fa-solid fa-spinner animate-spin"></i> Saving...</> : <>{editingId ? '💾 Save Changes' : '+ Add Product'}</>}
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
