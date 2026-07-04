'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/constants/api';

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
}

const defaultForm = {
    name: '',
    description: '',
    variants: [
        { size: '200g', price: 0, original_price: 0, discount: 0, stock: 0, is_available: true, coupon_code: '', coupon_amount: 0 }
    ],
    category: 'Value Packs',
    is_available: true,
    image_url: '',
    image_urls: [] as string[],
    tags: [] as string[],
    isNew: false,
    isBestSeller: false,
    isGift: false,
    isValuePack: false,
    isPremium: false,
    isFlavors: false,
    event: { type: '', label: '' },
    marketplace_prices: {
        amazon: { price: 0, link: '' },
        flipkart: { price: 0, link: '' },
        blinkit: { price: 0, link: '' },
        swiggy: { price: 0, link: '' }
    },
    video_url: '',
    coupon_enabled: false,
    coupon_code: '',
    coupon_discount: 0,
    discount_type: ''
};

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ ...defaultForm });
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const fetchProducts = async () => {
        try {
            const res = await fetch(API.PRODUCTS);
            if (res.ok) setProducts(await res.json());
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchProducts(); }, []);

    useEffect(() => {
        if (isModalOpen && !editingId) {
            localStorage.setItem('addProductCache', JSON.stringify(formData));
        }
    }, [formData, isModalOpen, editingId]);

    const openAdd = () => {
        setEditingId(null);
        const cached = localStorage.getItem('addProductCache');
        if (cached) {
            try {
                setFormData(JSON.parse(cached));
            } catch (e) {
                setFormData({ ...defaultForm });
            }
        } else {
            setFormData({ ...defaultForm });
        }
        setFiles([]);
        setError('');
        setIsModalOpen(true);
    };

    const openEdit = (p: any) => {
        const id = p._id || p.id;
        if (!id) {
            setError('Could not identify product ID');
            return;
        }
        setEditingId(id);
        
        // Ensure variants exist for editing, fallback to legacy schema if needed
        const variants = p.variants && p.variants.length > 0 
            ? p.variants.map((v: any) => ({
                size: v.size || '',
                price: Number(v.price) || 0,
                original_price: Number(v.original_price) || 0,
                discount: Number(v.discount) || 0,
                stock: Number(v.stock) || 0,
                is_available: v.is_available !== false,
                coupon_code: v.coupon_code || '',
                coupon_amount: Number(v.coupon_amount) || 0
            }))
            : [{ 
                size: 'Standard', 
                price: p.price || 0, 
                original_price: p.price ? Math.round(p.price / (1 - (p.discount || 0) / 100)) : 0,
                discount: p.discount || 0, 
                stock: p.stock || 0, 
                is_available: p.is_available !== false,
                coupon_code: '',
                coupon_amount: 0
              }];

        let discount_type = p.discount_type || '';
        if (!discount_type) {
            if (p.coupon_enabled || variants.some((v: any) => v.coupon_code || v.coupon_amount > 0)) {
                discount_type = 'coupon';
            } else if (variants.some((v: any) => v.discount > 0)) {
                discount_type = 'discount';
            }
        }

        setFormData({
            name: p.name || '',
            description: p.description || '',
            variants: variants,
            category: p.category || 'Value Packs',
            is_available: p.is_available !== false,
            image_url: p.image_url || '',
            tags: p.tags || [],
            isNew: !!p.isNew,
            isBestSeller: !!p.isBestSeller,
            isGift: !!p.isGift,
            isValuePack: !!p.isValuePack,
            isPremium: !!p.isPremium,
            isFlavors: !!p.isFlavors,
            event: p.event || { type: '', label: '' },
            marketplace_prices: p.marketplace_prices || defaultForm.marketplace_prices,
            image_urls: p.image_urls || (p.image_url ? [p.image_url] : []),
            video_url: p.video_url || '',
            coupon_enabled: discount_type === 'coupon',
            coupon_code: p.coupon_code || '',
            coupon_discount: Number(p.coupon_discount) || 0,
            discount_type: discount_type
        });
        setFiles([]);
        setError('');
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this product? This cannot be undone.')) return;
        const token = getToken();
        try {
            const res = await fetch(API.PRODUCT_DETAIL(id), {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchProducts();
            else {
                const err = await res.json();
                alert(err.detail || 'Failed to delete');
            }
        } catch (e) { alert('Connection error'); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        const token = getToken();
        const fd = new FormData();
        
        // Basic fields
        fd.append('name', formData.name);
        fd.append('description', formData.description);
        fd.append('category', formData.category);
        fd.append('is_available', formData.is_available.toString());
        fd.append('isNew', formData.isNew.toString());
        fd.append('isBestSeller', formData.isBestSeller.toString());
        fd.append('isGift', formData.isGift.toString());
        fd.append('isValuePack', formData.isValuePack.toString());
        fd.append('isPremium', formData.isPremium.toString());
        fd.append('isFlavors', formData.isFlavors.toString());
        
        // Complex fields
        fd.append('tags', JSON.stringify(formData.tags));
        fd.append('event', JSON.stringify(formData.event));
        fd.append('marketplace_prices', JSON.stringify(formData.marketplace_prices));
        fd.append('variants', JSON.stringify(formData.variants));
        fd.append('image_urls', JSON.stringify(formData.image_urls));
        fd.append('video_url', formData.video_url);
        fd.append('coupon_enabled', (formData.discount_type === 'coupon').toString());
        fd.append('coupon_code', formData.coupon_code);
        fd.append('coupon_discount', formData.coupon_discount.toString());
        fd.append('discount_type', formData.discount_type || '');
        
        files.forEach(f => fd.append('files', f));

        const id = editingId;
        const url = id ? API.PRODUCT_DETAIL(id) : API.PRODUCTS;
        const method = id ? 'PUT' : 'POST';

        try {
            console.log(`[SUBMIT] ${method} to ${url}`, formData);
            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: fd
            });
            
            const data = await res.json();
            if (res.ok) {
                if (!id) localStorage.removeItem('addProductCache');
                setIsModalOpen(false);
                setFormData({ ...defaultForm });
                setFiles([]);
                setEditingId(null);
                fetchProducts();
            } else {
                console.error('[SUBMIT ERROR]', data);
                setError(`${data.detail || 'Failed to save product'} (${res.status})`);
            }
        } catch (e: any) {
            console.error('[SUBMIT EXCEPTION]', e);
            setError(`Connection error: ${e.message || 'Check if backend is running'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMPChange = (platform: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            marketplace_prices: {
                ...prev.marketplace_prices,
                [platform]: {
                    ...(prev.marketplace_prices as any)[platform],
                    [field]: value
                }
            }
        }));
    };

    const field = (label: string, key: string, type = 'text', required = true) => {
        const id = `field-${key}`;
        return (
            <div className="space-y-1">
                <label htmlFor={id} className="text-sm font-semibold text-gray-700">{label}</label>
                <input
                    id={id}
                    type={type}
                    required={required}
                    value={(formData as any)[key]}
                    onChange={e => setFormData({ ...formData, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-primary transition-colors"
                    placeholder={`Enter ${label.toLowerCase()}`}
                />
            </div>
        );
    };

    const handleAddVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { size: '', price: 0, original_price: 0, discount: 0, stock: 0, is_available: true, coupon_code: '', coupon_amount: 0 }]
        }));
    };

    const handleRemoveVariant = (index: number) => {
        if (formData.variants.length <= 1) return;
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const handleVariantChange = (index: number, field: string, value: any) => {
        const newVariants = [...formData.variants];
        const v = { ...newVariants[index] } as any;
        v[field] = value;
        
        const mode = formData.discount_type;

        if (mode === 'discount') {
            if (field === 'price') {
                const sp = Number(value) || 0;
                v.price = sp;
                const discountAmt = v.original_price - sp;
                v.discount = (v.original_price > 0 && discountAmt > 0) ? Number(((discountAmt / v.original_price) * 100).toFixed(1)) : 0;
            } else if (field === 'discount') {
                const pct = Number(value) || 0;
                v.price = Math.max(0, Math.round(v.original_price * (1 - pct / 100)));
                v.discount = pct;
            } else if (field === 'original_price') {
                const mrp = Number(value) || 0;
                if (v.discount > 0) {
                    v.price = Math.max(0, Math.round(mrp * (1 - v.discount / 100)));
                } else {
                    const discountAmt = mrp - v.price;
                    v.discount = (mrp > 0 && discountAmt > 0) ? Number(((discountAmt / mrp) * 100).toFixed(1)) : 0;
                }
            }
        } else if (mode === 'coupon') {
            if (field === 'original_price') {
                v.price = Number(value) || 0;
            }
            v.discount = 0;
        } else {
            if (field === 'original_price') {
                v.price = Number(value) || 0;
            }
            v.discount = 0;
        }
        
        newVariants[index] = v;
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const handleDiscountTypeChange = (type: string) => {
        setFormData(prev => {
            const nextType = prev.discount_type === type ? '' : type;
            const updatedVariants = prev.variants.map(v => {
                const newV = { ...v };
                if (nextType === 'coupon') {
                    newV.price = newV.original_price;
                    newV.discount = 0;
                } else if (nextType === 'discount') {
                    if (newV.discount > 0) {
                        newV.price = Math.round(newV.original_price * (1 - newV.discount / 100));
                    }
                } else {
                    newV.price = newV.original_price;
                    newV.discount = 0;
                }
                return newV;
            });
            return {
                ...prev,
                discount_type: nextType,
                variants: updatedVariants
            };
        });
    };

    const downloadCSV = () => {
        const headers = ['ID', 'Name', 'Category', 'Status', 'Variants', 'Tags', 'Marketplace Prices', 'Video URL', 'Coupon Code'];
        
        const rows = products.map(p => {
            const status = p.is_available ? 'Active' : 'Inactive';
            const variantsStr = (p.variants || []).map((v: any) => `${v.size}: ₹${v.price} (Stock: ${v.stock}, Disc: ${v.discount}%)`).join(' | ');
            const tagsStr = (p.tags || []).join(', ');
            const mpStr = [
                p.marketplace_prices?.amazon?.price ? `Amazon: ₹${p.marketplace_prices.amazon.price}` : '',
                p.marketplace_prices?.flipkart?.price ? `Flipkart: ₹${p.marketplace_prices.flipkart.price}` : '',
                p.marketplace_prices?.blinkit?.price ? `Blinkit: ₹${p.marketplace_prices.blinkit.price}` : '',
                p.marketplace_prices?.swiggy?.price ? `Swiggy: ₹${p.marketplace_prices.swiggy.price}` : ''
            ].filter(Boolean).join(' | ');

            return [
                p._id || p.id || '',
                p.name || '',
                p.category || '',
                status,
                variantsStr,
                tagsStr,
                mpStr,
                p.video_url || '',
                p.coupon_code || ''
            ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `products_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Manage Catalog <span className="text-sm font-normal text-gray-400 ml-2">({products.length} products)</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${products.length > 0 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                            {products.length > 0 ? 'Backend Connected' : 'Checking Backend...'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={downloadCSV} className="bg-white border border-gray-200 text-green-700 hover:text-green-800 px-4 py-2.5 rounded-xl transition font-bold shadow-sm flex items-center gap-2 active:scale-95 text-sm">
                        <i className="fa-solid fa-file-excel"></i> Download Excel
                    </button>
                    <button onClick={openAdd} className="bg-primary text-white px-4 py-2.5 rounded-xl hover:bg-green-800 transition font-bold shadow-sm flex items-center gap-2 text-sm">
                        <i className="fa-solid fa-plus"></i> Add Product
                    </button>
                </div>
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
                                    <th className="p-4 font-semibold">Pricing</th>
                                    <th className="p-4 font-semibold">Variants</th>
                                    <th className="p-4 font-semibold text-center">Status</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {products.map((p) => {
                                    const variants = p.variants || [];
                                    const minPrice = variants.length > 0 ? Math.min(...variants.map((v: any) => v.price)) : (p.price || 0);
                                    const maxPrice = variants.length > 0 ? Math.max(...variants.map((v: any) => v.price)) : (p.price || 0);
                                    const totalStock = variants.length > 0 ? variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) : (p.stock || 0);
                                    
                                    return (
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
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {p.tags?.slice(0, 3).map((t: string) => (
                                                                <span key={t} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase font-bold">{t}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 font-semibold">
                                                {minPrice === maxPrice ? `₹${minPrice}` : `₹${minPrice} - ₹${maxPrice}`}
                                            </td>
                                            <td className="p-4 text-xs font-medium">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex flex-wrap gap-1">
                                                        {variants.map((v: any, i: number) => (
                                                            <span key={i} className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                                                                {v.size}
                                                            </span>
                                                        ))}
                                                        {variants.length === 0 && <span className="text-gray-400 italic">No sizes</span>}
                                                    </div>
                                                    <span className="text-gray-400 mt-1">{totalStock} units total</span>
                                                </div>
                                            </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${p.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                {p.is_available ? '● Active' : '● Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEdit(p)} className="flex items-center gap-1.5 bg-amber/10 hover:bg-amber/20 text-[#2c1a0e] px-3 py-1.5 rounded-lg text-xs font-bold transition">
                                                    <i className="fa-solid fa-pen-to-square"></i> Edit
                                                </button>
                                                <button onClick={() => handleDelete(p._id || p.id)} className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ); })}
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
                            <div className="flex items-center gap-3">
                                {!editingId && (
                                    <button 
                                        onClick={() => {
                                            if (confirm('Are you sure you want to reset the form?')) {
                                                localStorage.removeItem('addProductCache');
                                                setFormData({ ...defaultForm });
                                            }
                                        }} 
                                        type="button" 
                                        className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5"
                                    >
                                        <i className="fa-solid fa-rotate-right"></i> Reset Form
                                    </button>
                                )}
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
                            </div>
                        </div>
                        <div className="p-5 overflow-y-auto">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                                    <i className="fa-solid fa-circle-exclamation"></i> {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {field('Product Name', 'name')}
                                <div className="space-y-1">
                                    <label htmlFor="prod-category" className="text-sm font-semibold text-gray-700">Category</label>
                                    <select
                                        id="prod-category"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-primary transition-colors"
                                    >
                                        <option value="Value Packs">Value Packs</option>
                                        <option value="Premium">Premium</option>
                                        <option value="Flavors">Flavors</option>
                                        <option value="Gifting">Gifting</option>
                                    </select>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label htmlFor="prod-desc" className="text-sm font-semibold text-gray-700">Description</label>
                                    <textarea id="prod-desc" required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-primary min-h-[90px] transition-colors resize-none" />
                                </div>

                                {/* Variants Section */}
                                <div className="md:col-span-2 p-5 bg-primary/5 rounded-2xl border-2 border-primary/20 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                            <i className="fa-solid fa-layer-group text-primary"></i> Product Variants (Sizes/Weights)
                                        </h3>
                                        <button type="button" onClick={handleAddVariant} className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg font-bold hover:bg-green-800 transition shadow-sm">
                                            + Add size
                                        </button>
                                    </div>

                                    {/* Selection type checkboxes */}
                                    <div className="flex flex-wrap gap-6 items-center p-3 bg-white/60 rounded-xl border border-gray-100">
                                        <span className="text-xs font-bold text-gray-700">Promotion Type:</span>
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={formData.discount_type === 'coupon'}
                                                onChange={() => handleDiscountTypeChange('coupon')}
                                                className="w-4 h-4 text-[#00863D] border-gray-300 rounded focus:ring-primary"
                                            />
                                            <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                                                <i className="fa-solid fa-ticket text-[#F6B000]"></i> Coupon
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={formData.discount_type === 'discount'}
                                                onChange={() => handleDiscountTypeChange('discount')}
                                                className="w-4 h-4 text-[#00863D] border-gray-300 rounded focus:ring-primary"
                                            />
                                            <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                                                <i className="fa-solid fa-percent text-blue-600"></i> Discount
                                            </span>
                                        </label>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {formData.variants.map((v: any, idx: number) => {
                                            const discount_amount = Math.max(0, v.original_price - v.price);
                                            return (
                                                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative animate-slide-in">
                                                    <div className={`grid gap-3 ${
                                                        formData.discount_type === 'discount' 
                                                            ? 'grid-cols-2 sm:grid-cols-5' 
                                                            : formData.discount_type === 'coupon' 
                                                                ? 'grid-cols-2 sm:grid-cols-5' 
                                                                : 'grid-cols-2 sm:grid-cols-3'
                                                    }`}>
                                                        <div className="space-y-1">
                                                            <label htmlFor={`v-${idx}-size`} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Size</label>
                                                            <input id={`v-${idx}-size`} type="text" placeholder="e.g. 200g" value={v.size} onChange={e => handleVariantChange(idx, 'size', e.target.value)} required
                                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-primary" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label htmlFor={`v-${idx}-mrp`} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">MRP (₹)</label>
                                                            <input id={`v-${idx}-mrp`} type="number" value={v.original_price || ''} onChange={e => handleVariantChange(idx, 'original_price', Number(e.target.value))} required
                                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-primary font-bold" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label htmlFor={`v-${idx}-stock`} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stock</label>
                                                            <input id={`v-${idx}-stock`} type="number" value={v.stock || ''} onChange={e => handleVariantChange(idx, 'stock', Number(e.target.value))} required
                                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-primary" />
                                                        </div>

                                                        {formData.discount_type === 'discount' && (
                                                            <>
                                                                <div className="space-y-1">
                                                                    <label htmlFor={`v-${idx}-price`} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Selling Price (₹)</label>
                                                                    <input id={`v-${idx}-price`} type="number" value={v.price || ''} onChange={e => handleVariantChange(idx, 'price', Number(e.target.value))}
                                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-primary font-bold text-green-700" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label htmlFor={`v-${idx}-discount`} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Disc %</label>
                                                                    <div className="flex items-center gap-2">
                                                                        <input id={`v-${idx}-discount`} type="number" value={v.discount || ''} onChange={e => handleVariantChange(idx, 'discount', Number(e.target.value))}
                                                                            className="w-full px-3 py-2 border border-blue-100 bg-white rounded-lg text-xs text-blue-600 font-bold outline-none focus:border-primary" />
                                                                        {formData.variants.length > 1 && (
                                                                            <button type="button" onClick={() => handleRemoveVariant(idx)} className="text-red-400 hover:text-red-600 transition p-1">
                                                                                <i className="fa-solid fa-trash-can text-sm"></i>
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}

                                                        {formData.discount_type === 'coupon' && (
                                                            <>
                                                                <div className="space-y-1">
                                                                    <label htmlFor={`v-${idx}-coupon-code`} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Coupon Code</label>
                                                                    <input id={`v-${idx}-coupon-code`} type="text" placeholder="e.g. SAVE20" value={v.coupon_code || ''} onChange={e => handleVariantChange(idx, 'coupon_code', e.target.value)} required={formData.discount_type === 'coupon'}
                                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-primary" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label htmlFor={`v-${idx}-coupon-amount`} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Coupon Amount (₹)</label>
                                                                    <div className="flex items-center gap-2">
                                                                        <input id={`v-${idx}-coupon-amount`} type="number" value={v.coupon_amount || ''} onChange={e => handleVariantChange(idx, 'coupon_amount', Number(e.target.value))} required={formData.discount_type === 'coupon'}
                                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-primary font-bold text-green-700" />
                                                                        {formData.variants.length > 1 && (
                                                                            <button type="button" onClick={() => handleRemoveVariant(idx)} className="text-red-400 hover:text-red-600 transition p-1">
                                                                                <i className="fa-solid fa-trash-can text-sm"></i>
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}

                                                        {!formData.discount_type && formData.variants.length > 1 && (
                                                            <div className="flex items-end justify-end pb-1 sm:col-span-1">
                                                                <button type="button" onClick={() => handleRemoveVariant(idx)} className="text-red-400 hover:text-red-600 transition p-2">
                                                                    <i className="fa-solid fa-trash-can text-sm"></i> Remove
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Merchandising Tags Section */}
                                <div className="md:col-span-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                        <i className="fa-solid fa-tags text-primary"></i> Merchandising & Marketing Tags
                                    </h3>

                                    <div className="flex flex-col gap-3">
                                        <div className="flex flex-wrap gap-2">
                                            {formData.tags.map((tag, idx) => (
                                                <span key={idx} className="bg-white border-2 border-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 group hover:border-red-200 hover:bg-red-50 transition-colors">
                                                    {tag}
                                                    <button type="button" onClick={() => setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== idx) })} className="text-gray-300 group-hover:text-red-400">
                                                        <i className="fa-solid fa-circle-xmark"></i>
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                id="new-tag-input"
                                                placeholder="Add custom tag (e.g. Roasted, Salted)" 
                                                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl text-xs outline-none focus:border-primary"
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const val = (e.target as HTMLInputElement).value.trim();
                                                        if (val && !formData.tags.includes(val)) {
                                                            setFormData({ ...formData, tags: [...formData.tags, val] });
                                                            (e.target as HTMLInputElement).value = '';
                                                        }
                                                    }
                                                }}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    const input = document.getElementById('new-tag-input') as HTMLInputElement;
                                                    const val = input.value.trim();
                                                    if (val && !formData.tags.includes(val)) {
                                                        setFormData({ ...formData, tags: [...formData.tags, val] });
                                                        input.value = '';
                                                    }
                                                }}
                                                className="bg-gray-800 text-white px-4 rounded-xl text-xs font-bold hover:bg-black transition"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                                        {[
                                            { id: 'isNew', label: 'New Arrival', icon: 'fa-sparkles', color: 'bg-[#00863D] text-white border-[#00863D]', tag: 'New Arrival' },
                                            { id: 'isBestSeller', label: 'Best Seller', icon: 'fa-fire', color: 'bg-[#F6B000] text-black border-[#F6B000]', tag: 'Best Seller' },
                                            { id: 'isEvent', label: 'Event Special', icon: 'fa-calendar-star', color: 'bg-[#EF4444] text-white border-[#EF4444]', tag: 'event' }
                                        ].map(tag => (
                                            <label key={tag.id} className={`flex items-center gap-2 p-2 border rounded-xl cursor-pointer transition-all hover:shadow-sm ${tag.id === 'isEvent' ? (formData.event?.type ? tag.color : 'bg-white border-gray-200') : ((formData as any)[tag.id] ? tag.color : 'bg-white border-gray-200')}`}>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={tag.id === 'isEvent' ? !!formData.event?.type : !!(formData as any)[tag.id]}
                                                    onChange={e => {
                                                        if (tag.id === 'isEvent') {
                                                            const isChecked = e.target.checked;
                                                            const defaultEvent = { type: 'holi', label: 'Holi Special' };
                                                            setFormData(prev => {
                                                                const oldLabel = prev.event?.label;
                                                                let newTags = [...prev.tags];
                                                                if (!isChecked) {
                                                                    if (oldLabel) newTags = newTags.filter(t => t !== oldLabel);
                                                                    newTags = newTags.filter(t => t !== 'event');
                                                                } else {
                                                                    if (!newTags.includes(defaultEvent.label)) newTags.push(defaultEvent.label);
                                                                    newTags = newTags.filter(t => t !== 'event');
                                                                }
                                                                return { 
                                                                    ...prev, 
                                                                    event: isChecked ? defaultEvent : { type: '', label: '' },
                                                                    tags: newTags
                                                                };
                                                            });
                                                        } else {
                                                            const newTags = e.target.checked
                                                                ? (formData.tags.includes(tag.tag) ? formData.tags : [...formData.tags, tag.tag])
                                                                : formData.tags.filter(t => t !== tag.tag);
                                                            setFormData(prev => ({ ...prev, [tag.id]: e.target.checked, tags: newTags }));
                                                        }
                                                    }}
                                                />
                                                <i className={`fa-solid ${tag.icon} text-xs`}></i>
                                                <span className="text-xs font-bold">{tag.label}</span>
                                            </label>
                                        ))}
                                    </div>

                                    {/* Conditional Event Selection */}
                                    {formData.event?.type !== '' && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-200 mt-2 slide-in">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Event Type</label>
                                                <select
                                                    value={formData.event?.type}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        const newLabel = val === 'custom' ? '' : `${val.charAt(0).toUpperCase() + val.slice(1)} Special`;
                                                        setFormData(prev => {
                                                            const oldLabel = prev.event?.label;
                                                            let newTags = [...prev.tags];
                                                            if (oldLabel && newTags.includes(oldLabel)) {
                                                                newTags = newTags.filter(t => t !== oldLabel);
                                                            }
                                                            if (newLabel && !newTags.includes(newLabel)) {
                                                                newTags.push(newLabel);
                                                            }
                                                            return { ...prev, event: { type: val, label: newLabel }, tags: newTags };
                                                        });
                                                    }}
                                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-xs outline-none focus:border-primary"
                                                >
                                                    <option value="holi">Holi</option>
                                                    <option value="eid">Eid</option>
                                                    <option value="diwali">Diwali</option>
                                                    <option value="custom">Custom</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Badge Label</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. DIWALI SPECIAL"
                                                    value={formData.event?.label}
                                                    onChange={e => {
                                                        const newLabel = e.target.value;
                                                        setFormData(prev => {
                                                            const oldLabel = prev.event?.label;
                                                            let newTags = [...prev.tags];
                                                            if (oldLabel && newTags.includes(oldLabel)) {
                                                                newTags = newTags.map(t => t === oldLabel ? newLabel : t);
                                                            } else if (newLabel && !newTags.includes(newLabel)) {
                                                                newTags.push(newLabel);
                                                            }
                                                            return { ...prev, event: { ...prev.event!, label: newLabel }, tags: newTags };
                                                        });
                                                    }}
                                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-xs outline-none focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Real-time Badge Preview */}
                                    <div className="flex flex-wrap gap-2 items-center pt-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-2">Preview:</span>
                                        {formData.isNew && <span className="bg-[#00863D] text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm">NEW Arrival</span>}
                                        {formData.isBestSeller && <span className="bg-[#F6B000] text-black text-[9px] font-black px-2 py-0.5 rounded shadow-sm">BEST SELLER</span>}
                                        {formData.isGift && <span className="bg-[#2563EB] text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm">GIFT HAMPER</span>}
                                        {formData.isValuePack && <span className="bg-[#F97316] text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm">VALUE PACK</span>}
                                        {formData.isPremium && <span className="bg-[#7C3AED] text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm">PREMIUM</span>}
                                        {formData.isFlavors && <span className="bg-[#92400E] text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm">FLAVORS</span>}
                                        {formData.event?.label && <span className="bg-[#EF4444] text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm">{formData.event.label.toUpperCase()}</span>}
                                        {!formData.isNew && !formData.isBestSeller && !formData.isGift && !formData.isValuePack && !formData.isPremium && !formData.isFlavors && !formData.event?.type && <span className="text-[9px] text-gray-300 italic">No marketing badges selected</span>}
                                    </div>
                                </div>

                                {/* Marketplace Prices Section */}
                                <div className="md:col-span-2 p-5 bg-blue-50/30 rounded-2xl border border-blue-100 space-y-4">
                                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                        <i className="fa-solid fa-shop text-blue-600"></i> Marketplace Prices
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Amazon */}
                                        <div className="p-3 bg-white rounded-xl border border-gray-100 space-y-3 shadow-sm">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amazon</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-500">Price (₹)</label>
                                                    <input type="number" value={formData.marketplace_prices.amazon.price} onChange={e => handleMPChange('amazon', 'price', Number(e.target.value))}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-500">Link</label>
                                                    <input type="text" value={formData.marketplace_prices.amazon.link} onChange={e => handleMPChange('amazon', 'link', e.target.value)}
                                                        placeholder="https://..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Flipkart */}
                                        <div className="p-3 bg-white rounded-xl border border-gray-100 space-y-3 shadow-sm">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Flipkart</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-500">Price (₹)</label>
                                                    <input type="number" value={formData.marketplace_prices.flipkart.price} onChange={e => handleMPChange('flipkart', 'price', Number(e.target.value))}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-500">Link</label>
                                                    <input type="text" value={formData.marketplace_prices.flipkart.link} onChange={e => handleMPChange('flipkart', 'link', e.target.value)}
                                                        placeholder="https://..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Blinkit */}
                                        <div className="p-3 bg-white rounded-xl border border-gray-100 space-y-3 shadow-sm">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Blinkit</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <label className="text-[10px] font-bold text-gray-500">Price (₹)</label>
                                                <input type="number" value={formData.marketplace_prices.blinkit.price} onChange={e => handleMPChange('blinkit', 'price', Number(e.target.value))}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-500">Link</label>
                                                <input type="text" value={formData.marketplace_prices.blinkit.link} onChange={e => handleMPChange('blinkit', 'link', e.target.value)}
                                                    placeholder="https://..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500" />
                                            </div>
                                        </div>

                                        {/* Swiggy */}
                                        <div className="p-3 bg-white rounded-xl border border-gray-100 space-y-3 shadow-sm">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Swiggy Instamart</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <label className="text-[10px] font-bold text-gray-500">Price (₹)</label>
                                                <input type="number" value={formData.marketplace_prices.swiggy.price} onChange={e => handleMPChange('swiggy', 'price', Number(e.target.value))}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-500">Link</label>
                                                <input type="text" value={formData.marketplace_prices.swiggy.link} onChange={e => handleMPChange('swiggy', 'link', e.target.value)}
                                                    placeholder="https://..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700 flex justify-between items-center">
                                        <span>Product Gallery (Max 5 Images)</span>
                                        <span className="text-xs font-normal text-gray-400">{(formData.image_urls?.length || 0) + files.length} / 5</span>
                                    </label>
                                    
                                    <div className="grid grid-cols-5 gap-2">
                                        {/* Existing Images */}
                                        {formData.image_urls?.map((url, idx) => (
                                            <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                                                <img src={url} alt={`Gallery image ${idx + 1}`} className="w-full h-full object-cover" />
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, image_urls: prev.image_urls.filter((_, i) => i !== idx) }))}
                                                    className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <i className="fa-solid fa-xmark"></i>
                                                </button>
                                            </div>
                                        ))}
                                        
                                        {/* New File Previews (if any) */}
                                        {files.map((f, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-primary/30 bg-primary/5">
                                                <div className="w-full h-full flex items-center justify-center text-xs text-primary font-bold">NEW</div>
                                                <button 
                                                    type="button"
                                                    onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
                                                    className="absolute top-1 right-1 bg-gray-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                                                >
                                                    <i className="fa-solid fa-xmark"></i>
                                                </button>
                                            </div>
                                        ))}

                                        {/* Empty slots placeholders */}
                                        {Array.from({ length: Math.max(0, 5 - (formData.image_urls?.length || 0) - files.length) }).map((_, i) => (
                                            <div key={i} className="aspect-square rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300">
                                                <i className="fa-solid fa-image"></i>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="relative">
                                        <input 
                                            type="file" 
                                            multiple 
                                            accept="image/*" 
                                            onChange={e => {
                                                const selected = Array.from(e.target.files || []);
                                                const total = (formData.image_urls?.length || 0) + files.length + selected.length;
                                                if (total > 5) {
                                                    setError('Maximum 5 images allowed per product.');
                                                    return;
                                                }
                                                setFiles(prev => [...prev, ...selected]);
                                                setError('');
                                            }}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                        />
                                        <div className="w-full text-sm text-primary font-bold py-2.5 px-4 rounded-xl border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition text-center flex items-center justify-center gap-2">
                                            <i className="fa-solid fa-cloud-arrow-up"></i>
                                            Add Images
                                        </div>
                                    </div>
                                </div>



                                {/* Video URL Section */}
                                <div className="space-y-1 md:col-span-2">
                                    <label htmlFor="prod-video-url" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <i className="fa-brands fa-youtube text-red-600 text-base"></i> Product Video URL (YouTube Shorts/Video 9:16)
                                    </label>
                                    <input
                                        id="prod-video-url"
                                        type="text"
                                        value={formData.video_url}
                                        onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-primary transition-colors"
                                        placeholder="e.g. https://www.youtube.com/shorts/3H02_Y98d7k"
                                    />
                                </div>

                                <div className="md:col-span-2 pt-2">
                                    <button type="submit" disabled={isSubmitting}
                                        className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-green-800 transition disabled:opacity-50 flex items-center justify-center gap-2">
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
