'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { login, logout } from '@/lib/store/features/authSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard, { Product } from '@/components/products/ProductCard';
import { API } from '@/constants/api';
import { ORDER_STATUS_CLASSES, PAYMENT_STATUS_CLASSES, CANCELLABLE_STATUSES, COLORS } from '@/constants/styles';
import CustomerBlogs from '@/components/profile/CustomerBlogs';

const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

interface UserProfile {
    username: string;
    email: string;
    phone?: string;
    address?: string;
    role: string;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="text-2xl transition-transform hover:scale-110"
                >
                    <i className={`${(hover || value) >= star ? 'fa-solid fa-star text-amber' : 'fa-regular fa-star text-gray-300'}`} />
                </button>
            ))}
        </div>
    );
}

type TabKey = 'home' | 'settings' | 'orders' | 'wishlist' | 'blogs' | 'reviews' | 'support';

const SIDEBAR_TABS: { key: TabKey; label: string; icon: string }[] = [
    { key: 'orders', label: 'My Orders', icon: 'fa-box' },
    { key: 'wishlist', label: 'My Wishlist', icon: 'fa-heart' },
    { key: 'blogs', label: 'My Blogs', icon: 'fa-blog' },
    { key: 'reviews', label: 'My Ratings & Reviews', icon: 'fa-star' },
    { key: 'support', label: 'Support & Queries', icon: 'fa-headset' },
    { key: 'settings', label: 'Settings', icon: 'fa-gear' },
];

const MOBILE_SERVICES = [
    { key: 'wishlist', label: 'Wishlist', icon: 'fa-regular fa-heart', color: 'text-pink-500' },
    { key: 'blogs', label: 'Blogs', icon: 'fa-regular fa-newspaper', color: 'text-amber' },
    { key: 'reviews', label: 'Reviews', icon: 'fa-regular fa-star', color: 'text-orange-500' },
    { key: 'support', label: 'Support', icon: 'fa-regular fa-comment-dots', color: 'text-blue-500' },
    { key: 'settings', label: 'Settings', icon: 'fa-solid fa-gear', color: 'text-gray-500' },
];

const MOBILE_ORDER_STATUSES = [
    { key: 'Pending', label: 'Pending', icon: 'fa-regular fa-clock' },
    { key: 'Processing', label: 'Processing', icon: 'fa-solid fa-arrows-rotate' },
    { key: 'Delivered', label: 'Delivered', icon: 'fa-regular fa-circle-check' },
    { key: 'Cancelled', label: 'Cancelled', icon: 'fa-regular fa-circle-xmark' }
];

export default function ProfilePage() {
    return (
        <Suspense fallback={
            <div className={`min-h-screen py-8 px-4 flex justify-center items-center ${COLORS.bg}`}>
                <img src="/images/cc-Logo-01-1.png" alt="Loading..." className="w-20 h-20 animate-bounce object-contain" />
            </div>
        }>
            <ProfileContent />
        </Suspense>
    );
}

function ProfileContent() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabKey>('home');
    const [currentDesktopTab, setCurrentDesktopTab] = useState<TabKey>('orders');
    const [mobileOrderFilter, setMobileOrderFilter] = useState<string>('All');

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ username: '', phone: '', address: '', city: '', state: '', pincode: '' });
    const [locating, setLocating] = useState(false);

    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.token);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderSuccess = searchParams.get('success') === 'true';
    const successOrderId = searchParams.get('order_id');
    const [showSuccessModal, setShowSuccessModal] = useState(orderSuccess);

    const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [visits, setVisits] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [tabLoading, setTabLoading] = useState(false);

    const [reviewForm, setReviewForm] = useState({ name: '', city: '', state: '', description: '', rating: 5 });
    const [reviewStatus, setReviewStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['home', 'settings', 'orders', 'wishlist', 'blogs', 'reviews', 'support'].includes(tab)) {
            setActiveTab(tab as TabKey);
            setCurrentDesktopTab(tab as TabKey);
        } else if (!tab) {
            setActiveTab('home');
            setCurrentDesktopTab('orders');
        }
    }, [searchParams]);

    useEffect(() => {
        if (!isAuthenticated) { router.push('/login'); return; }
        const fetchProfile = async () => {
            try {
                const localToken = localStorage.getItem('access_token');
                const res = await fetch(API.AUTH_ME, {
                    headers: { 'Authorization': `Bearer ${token || localToken}` }
                });
                if (!res.ok) throw new Error('Failed to fetch profile details');
                const data = await res.json();
                setProfile(data);
                let parsedCity = '';
                let parsedState = '';
                let parsedPincode = '';
                let cleanAddress = data.address || '';

                if (cleanAddress && cleanAddress.includes(',')) {
                    const parts = cleanAddress.split(',').map((p: string) => p.trim());
                    if (parts.length >= 3) {
                        const lastPart = parts[parts.length - 1];
                        const numsInLast = lastPart.replace(/[^0-9]/g, '');
                        if (numsInLast.length >= 5) {
                            parsedPincode = numsInLast;
                            parsedState = parts[parts.length - 2];
                            parsedCity = parts[parts.length - 3];
                            cleanAddress = parts.slice(0, parts.length - 3).join(', ');
                        }
                    }
                }

                setEditForm({
                    username: data.username || '',
                    phone: data.phone || '',
                    address: cleanAddress,
                    city: parsedCity,
                    state: parsedState,
                    pincode: parsedPincode
                });
                setReviewForm(prev => ({ ...prev, name: data.username || '' }));
            } catch (err) {
                console.error('Failed to load profile:', err);
                dispatch(logout());
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [isAuthenticated, router, token, dispatch]);

    useEffect(() => {
        const tab = window.innerWidth < 768 ? activeTab : currentDesktopTab;
        if (tab === 'wishlist') fetchWishlist();
        else if (tab === 'support') fetchQueries();
        else if (tab === 'orders' || tab === 'home') fetchOrders();
    }, [activeTab, currentDesktopTab]);

    const fetchWishlist = async () => {
        try {
            setTabLoading(true);
            const saved = localStorage.getItem('wishlistItems');
            if (saved) {
                const list: string[] = JSON.parse(saved);
                if (list.length > 0) {
                    const res = await fetch(API.PRODUCTS);
                    if (res.ok) {
                        const all = await res.json();
                        setWishlistProducts(all.filter((p: any) => list.includes(p.id || p._id)));
                    }
                } else setWishlistProducts([]);
            }
        } catch (e) { console.error(e); } finally { setTabLoading(false); }
    };

    const fetchOrders = async () => {
        try {
            setTabLoading(true);
            const res = await fetch(API.MY_ORDERS, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setOrders(await res.json());
        } catch (e) { console.error(e); } finally { setTabLoading(false); }
    };

    const cancelOrder = async (orderId: string) => {
        const order = orders.find(o => o._id === orderId);
        if (order?.status === 'Packed') {
            alert(`Cannot cancel, order is already ${order.status}`);
            return;
        }

        if (!confirm('Are you sure you want to cancel this order?')) return;
        try {
            const res = await fetch(API.ORDER_CANCEL(orderId), {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'Cancelled' } : o));
            } else {
                const err = await res.json().catch(() => ({}));
                alert(err.detail || 'Cannot cancel order.');
            }
        } catch { alert('Network error.'); }
    };

    const fetchQueries = async () => {
        try {
            setTabLoading(true);
            const headers = { 'Authorization': `Bearer ${token}` };
            const [enqRes, visRes] = await Promise.all([
                fetch(API.MY_ENQUIRIES, { headers }),
                fetch(API.MY_VISITS, { headers })
            ]);
            if (enqRes.ok) setEnquiries(await enqRes.json());
            if (visRes.ok) setVisits(await visRes.json());
        } catch (e) { console.error(e); } finally { setTabLoading(false); }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const fullAddress = `${editForm.address}, ${editForm.city}, ${editForm.state}, ${editForm.pincode}`;
            const submitData = {
                username: editForm.username,
                phone: editForm.phone,
                address: fullAddress
            };
            const res = await fetch(API.AUTH_PROFILE, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(submitData)
            });
            if (res.ok) {
                const data = await res.json();
                if (data.access_token) {
                    dispatch(login(data.access_token));
                }
                setIsEditing(false);
                const meRes = await fetch(API.AUTH_ME, {
                    headers: { 'Authorization': `Bearer ${data.access_token || token}` }
                });
                if (meRes.ok) setProfile(await meRes.json());
            }
        } catch (err) { console.error('Update failed', err); }
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) return alert('Geolocation not supported');
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            async pos => {
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
                    const data = await res.json();
                    if (data.display_name) {
                        setEditForm(prev => ({ ...prev, address: data.display_name }));
                    }
                } catch { alert('Could not get address'); }
                setLocating(false);
            },
            () => { alert('Permission denied'); setLocating(false); }
        );
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setReviewStatus('loading');
        try {
            const res = await fetch(API.TESTIMONIALS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewForm),
            });
            if (res.ok) {
                setReviewStatus('success');
                setReviewForm(prev => ({ ...prev, description: '', rating: 5 }));
                setTimeout(() => setReviewStatus('idle'), 3000);
            } else setReviewStatus('error');
        } catch { setReviewStatus('error'); }
    };

        if (loading) return (
            <div className={`min-h-[80vh] flex justify-center items-center ${COLORS.bg}`}>
                <img src="/images/cc-Logo-01-1.png" alt="Loading..." className="w-20 h-20 animate-bounce object-contain" />
            </div>
        );

    const displayedOrders = mobileOrderFilter === 'All' ? orders : orders.filter(o => o.status === mobileOrderFilter);

    return (
        <div className="min-h-screen bg-[#FFF9E7] font-sans">
            {/* ── Order Success Modal ── */}
            {showSuccessModal && successOrderId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber to-yellow" />
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <i className="fa-solid fa-check text-4xl text-green-500 drop-shadow-sm" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-2">Order Confirmed!</h3>
                        <p className="text-gray-500 mb-6 font-medium">Thank you for your purchase.</p>
                        <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-gray-100">
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Order ID</p>
                            <p className="font-black text-gray-800 tracking-wider">#{successOrderId}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Link href={`/profile/orders/${successOrderId}`} className="w-full bg-black text-amber font-black py-4 rounded-xl shadow-lg hover:bg-gray-900 active:scale-95 transition-all uppercase tracking-wide">
                                Track Order
                            </Link>
                            <button onClick={() => { setShowSuccessModal(false); router.replace('/profile'); }} className="w-full bg-gray-100 text-gray-600 font-bold py-4 rounded-xl hover:bg-gray-200 active:scale-95 transition-all">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════
                DESKTOP VIEW 
            ══════════════════════════════════════ */}
            <div className="hidden md:flex flex-col max-w-[1200px] mx-auto pt-10 pb-10 px-6">
                <div className="flex gap-8 items-start mb-8">
                    {/* Desktop Sidebar */}
                    <div className="w-72 shrink-0 flex flex-col gap-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Profile Info Card */}
                            <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl text-white shadow-md shrink-0 font-black tracking-widest" style={{ backgroundColor: COLORS.heading }}>
                                    {getInitials(profile?.username)}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Hello</p>
                                    <h2 className="text-base font-black text-gray-800 line-clamp-1">{profile?.username}</h2>
                                </div>
                            </div>

                            {/* Sidebar Navigation */}
                            <div className="flex flex-col p-3 gap-1">
                                {SIDEBAR_TABS.map(tab => (
                                    <button key={tab.key} onClick={() => { setCurrentDesktopTab(tab.key); }}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentDesktopTab === tab.key ? 'shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                        style={currentDesktopTab === tab.key ? { backgroundColor: COLORS.heading, color: 'white' } : {}}>
                                        <i className={`fa-solid ${tab.icon} w-5 text-center ${currentDesktopTab === tab.key ? 'text-white' : 'text-gray-400'}`}></i>
                                        {tab.label}
                                    </button>
                                ))}
                                <div className="h-px bg-gray-100 my-2 mx-2"></div>
                                <button onClick={() => { dispatch(logout()); router.push('/'); }}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                                    <i className="fa-solid fa-right-from-bracket w-5 text-center"></i>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Content Area */}
                    <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
                        {currentDesktopTab === 'settings' && (
                            <div className="animate-in slide-in-from-right-4 duration-300">
                                <h2 className="text-xl font-black text-gray-800 mb-6 border-b border-gray-100 pb-4">Personal Information</h2>

                                <div className="flex gap-10">
                                    {/* Profile Picture */}
                                    <div className="w-32 h-32 rounded-full flex items-center justify-center text-4xl text-white shadow-lg border-4 border-white ring-1 ring-gray-100 shrink-0 font-black tracking-widest" style={{ backgroundColor: COLORS.heading }}>
                                        {getInitials(profile?.username)}
                                    </div>

                                    {/* Form */}
                                    <div className="flex-1 max-w-xl">
                                        {!isEditing ? (
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="font-black text-lg text-gray-800">Account Details</h3>
                                                    <button onClick={() => setIsEditing(true)}
                                                        className="text-sm font-bold px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
                                                        <i className="fa-solid fa-pen" /> Edit
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-800 mb-2">Display Name</p>
                                                        <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600">{profile?.username}</div>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-800 mb-2">Email</p>
                                                        <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 truncate">{profile?.email}</div>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <p className="text-xs font-bold text-gray-800 mb-2">Phone Number</p>
                                                        <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600">{profile?.phone || 'Not provided'}</div>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <p className="text-xs font-bold text-gray-800 mb-2">Address</p>
                                                        <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 min-h-[80px]">
                                                            {profile?.address || 'Not provided. Update to receive orders.'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                                <div className="grid grid-cols-2 gap-y-6 gap-x-6">
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-800 mb-2 block">Display Name</label>
                                                        <input type="text" value={editForm.username}
                                                            onChange={e => setEditForm(r => ({ ...r, username: e.target.value }))}
                                                            className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 outline-none text-sm transition-colors font-semibold focus:border-black"
                                                            placeholder="Your full name" />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-800 mb-2 block">Phone Number</label>
                                                        <input type="text" value={editForm.phone}
                                                            onChange={e => setEditForm(r => ({ ...r, phone: e.target.value }))}
                                                            className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 outline-none text-sm transition-colors font-semibold focus:border-black"
                                                            placeholder="10-digit mobile number" />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <label className="text-xs font-bold text-gray-800">Street Address</label>
                                                            <button type="button" onClick={handleGetLocation}
                                                                className="text-[10px] bg-gray-100 text-gray-600 font-bold px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors uppercase tracking-widest flex items-center gap-1">
                                                                <i className="fa-solid fa-location-crosshairs"></i> Auto-locate
                                                            </button>
                                                        </div>
                                                        <textarea rows={3} value={editForm.address}
                                                            onChange={e => setEditForm(r => ({ ...r, address: e.target.value }))}
                                                            className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 outline-none text-sm transition-colors resize-none font-semibold focus:border-black mb-4"
                                                            placeholder="Enter street address" />

                                                        <div className="grid grid-cols-3 gap-4">
                                                            <div>
                                                                <label className="text-xs font-bold text-gray-800 mb-2 block">City</label>
                                                                <input type="text" value={editForm.city}
                                                                    onChange={e => setEditForm(r => ({ ...r, city: e.target.value }))}
                                                                    className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 outline-none text-sm transition-colors font-semibold focus:border-black"
                                                                    placeholder="City" />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-bold text-gray-800 mb-2 block">State</label>
                                                                <input type="text" value={editForm.state}
                                                                    onChange={e => setEditForm(r => ({ ...r, state: e.target.value }))}
                                                                    className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 outline-none text-sm transition-colors font-semibold focus:border-black"
                                                                    placeholder="State" />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-bold text-gray-800 mb-2 block">PIN Code</label>
                                                                <input type="text" value={editForm.pincode}
                                                                    onChange={e => setEditForm(r => ({ ...r, pincode: e.target.value }))}
                                                                    className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 outline-none text-sm transition-colors font-semibold focus:border-black"
                                                                    placeholder="PIN Code" maxLength={6} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <button type="submit"
                                                        className="bg-green-700 text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2 flex-1 md:flex-none">
                                                        <i className="fa-solid fa-check text-sm md:text-xs" />
                                                        <span>Save Complete Info</span>
                                                    </button>
                                                    <button type="button" onClick={() => setIsEditing(false)}
                                                        className="p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-sm flex items-center justify-center gap-2 bg-transparent border-2"
                                                        style={{ color: COLORS.heading, borderColor: COLORS.heading }}>
                                                        <i className="fa-solid fa-xmark text-sm md:text-xs" />
                                                        <span>Cancel</span>
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentDesktopTab === 'orders' && (
                            <div className="animate-in slide-in-from-right-4 duration-300">
                                <h2 className="text-xl font-black text-gray-800 mb-6 border-b border-gray-100 pb-4">My Orders</h2>
                                <OrderListRenderer orders={orders} tabLoading={tabLoading} cancelOrder={cancelOrder} />
                            </div>
                        )}

                        {currentDesktopTab === 'wishlist' && (
                            <div className="animate-in slide-in-from-right-4 duration-300">
                                <h2 className="text-xl font-black text-gray-800 mb-6 border-b border-gray-100 pb-4">My Wishlist</h2>
                                <WishlistRenderer wishlistProducts={wishlistProducts} tabLoading={tabLoading} />
                            </div>
                        )}

                        {currentDesktopTab === 'blogs' && (
                            <div className="animate-in slide-in-from-right-4 duration-300">
                                <h2 className="text-xl font-black text-gray-800 mb-6 border-b border-gray-100 pb-4">My Blogs</h2>
                                <CustomerBlogs />
                            </div>
                        )}

                        {currentDesktopTab === 'reviews' && (
                            <div className="animate-in slide-in-from-right-4 duration-300 max-w-2xl">
                                <h2 className="text-xl font-black text-gray-800 mb-2">My Ratings & Reviews</h2>
                                <p className="text-sm text-gray-400 mb-6 border-b border-gray-100 pb-4">Share your experience with Crunchy Cashews.</p>
                                <ReviewFormRenderer reviewForm={reviewForm} setReviewForm={setReviewForm} reviewStatus={reviewStatus} handleReviewSubmit={handleReviewSubmit} profile={profile} />
                            </div>
                        )}

                        {currentDesktopTab === 'support' && (
                            <div className="animate-in slide-in-from-right-4 duration-300">
                                <h2 className="text-xl font-black text-gray-800 mb-6 border-b border-gray-100 pb-4">Support & Queries</h2>
                                <QueriesRenderer enquiries={enquiries} visits={visits} tabLoading={tabLoading} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Desktop Bottom Highlights */}
                <div className="flex items-center justify-around bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl shadow-sm" style={{ backgroundColor: COLORS.heading, color: 'white' }}>
                            <i className="fa-solid fa-box-open" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Free Shipping</h4>
                            <p className="text-xs text-gray-400 font-medium">Free shipping for order above ₹1499</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl shadow-sm" style={{ backgroundColor: COLORS.heading, color: 'white' }}>
                            <i className="fa-solid fa-wallet" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Flexible Payment</h4>
                            <p className="text-xs text-gray-400 font-medium">Multiple secure payment options</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl shadow-sm" style={{ backgroundColor: COLORS.heading, color: 'white' }}>
                            <i className="fa-solid fa-headset" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">24x7 Support</h4>
                            <p className="text-xs text-gray-400 font-medium">We support online all days</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════
                MOBILE VIEW 
            ══════════════════════════════════════ */}
            <div className="md:hidden">
                {activeTab === 'home' ? (
                    <div className="animate-in fade-in duration-300 min-h-screen pb-20 bg-[#FFF9E7]">
                        {/* Header */}
                        <div className="relative pt-12 pb-24 px-6 rounded-b-[40px] shadow-sm overflow-hidden" style={{ backgroundColor: COLORS.heading }}>
                            {/* Decorative background shapes */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl text-white shadow-xl border-4 border-white/20 mb-3 bg-white/10 backdrop-blur-sm font-black tracking-widest">
                                    {getInitials(profile?.username)}
                                </div>
                                <h2 className="text-2xl font-black text-white">{profile?.username}</h2>
                                <p className="text-sm font-medium text-white/80 capitalize">{profile?.role}</p>
                            </div>
                        </div>

                        {/* Overlapping Quick Access - Orders */}
                        <div className="px-5 -mt-12 relative z-20">
                            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-5 border border-gray-50">
                                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
                                    <h3 className="font-black text-gray-800">My Orders</h3>
                                    <button onClick={() => { setActiveTab('orders'); setMobileOrderFilter('All'); }} className="text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center gap-1">
                                        View All <i className="fa-solid fa-chevron-right text-[10px]" />
                                    </button>
                                </div>
                                <div className="flex justify-between items-start">
                                    {MOBILE_ORDER_STATUSES.map(status => (
                                        <button key={status.key} onClick={() => { setActiveTab('orders'); setMobileOrderFilter(status.key); }} className="flex flex-col items-center gap-2 group">
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-active:scale-95 transition-transform" style={{ color: COLORS.amber }}>
                                                <i className={`${status.icon} text-xl`} />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-500 text-center">{status.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Services Grid */}
                        <div className="px-5 mt-8">
                            <h3 className="font-black text-gray-800 mb-4 ml-1">Services</h3>
                            <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                                {MOBILE_SERVICES.map(service => (
                                    <button key={service.key} onClick={() => setActiveTab(service.key as TabKey)} className="flex flex-col items-center gap-2 group">
                                        <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 group-active:scale-95 transition-transform ${service.color}`}>
                                            <i className={`${service.icon} text-2xl`} />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-600 text-center leading-tight">{service.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="px-5 mt-10">
                            <button onClick={() => { dispatch(logout()); router.push('/'); }}
                                className="w-full bg-white rounded-2xl p-4 flex items-center justify-center gap-3 shadow-sm border border-gray-100 text-red-500 font-bold active:bg-gray-50">
                                <i className="fa-solid fa-right-from-bracket" /> Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Mobile Detail Screen */
                    <div className="animate-in slide-in-from-right-8 duration-300 bg-[#FFF9E7] min-h-screen pt-8">
                        {/* Detail Header */}
                        <div className="flex items-center justify-between bg-[#FFF9E7] px-5 py-4">
                            <div className="flex items-center gap-4">
                                <button onClick={() => { setActiveTab('home'); setMobileOrderFilter('All'); }}
                                    className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-600 active:scale-95 transition-transform shadow-sm">
                                    <i className="fa-solid fa-chevron-left text-sm"></i>
                                </button>
                                <h2 className="text-xl font-black text-gray-800 tracking-tight">
                                    {SIDEBAR_TABS.find(t => t.key === activeTab)?.label || 'Details'}
                                </h2>
                            </div>
                        </div>

                        {/* Order Filters */}
                        {activeTab === 'orders' && (
                            <div className="flex gap-2 overflow-x-auto px-5 py-3 scrollbar-hide bg-[#FFF9E7]">
                                {['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'].map(f => (
                                    <button key={f} onClick={() => setMobileOrderFilter(f)}
                                        className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap flex-shrink-0 transition-colors ${mobileOrderFilter === f ? 'text-white shadow-md' : 'bg-white text-gray-500 shadow-sm border border-gray-100'}`}
                                        style={mobileOrderFilter === f ? { backgroundColor: COLORS.heading } : {}}>
                                        {f}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Content Area */}
                        <div className="p-5 pb-10">
                            {activeTab === 'settings' && (
                                <div className="space-y-6">
                                    {!isEditing ? (
                                        <div className="space-y-5 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl text-white shrink-0 font-black tracking-widest" style={{ backgroundColor: COLORS.heading }}>
                                                        {getInitials(profile?.username)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-black text-sm text-gray-800">{profile?.username}</h3>
                                                        <p className="text-[10px] text-gray-400 font-bold mt-0.5">{profile?.email}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => setIsEditing(true)} className="text-gray-500 bg-gray-50 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-gray-200">
                                                    <i className="fa-solid fa-pen text-xs" />
                                                </button>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Phone</p>
                                                <p className="text-sm font-semibold text-gray-800">{profile?.phone || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Address</p>
                                                <p className="text-sm font-semibold text-gray-800">{profile?.address || 'Not provided'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleUpdateProfile} className="space-y-5 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                            <div>
                                                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1.5">Full Name</label>
                                                <input type="text" value={editForm.username} onChange={e => setEditForm(r => ({ ...r, username: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none text-sm font-semibold mb-4" />
                                                <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1.5">Phone</label>
                                                <input type="text" value={editForm.phone} onChange={e => setEditForm(r => ({ ...r, phone: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none text-sm font-semibold" />
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">Street Address</label>
                                                    <button type="button" onClick={handleGetLocation} className="text-[10px] font-bold px-3 py-1 rounded-full inline-flex items-center gap-1 bg-gray-100 text-gray-600">
                                                        <i className="fa-solid fa-location-crosshairs"></i> Auto Locate
                                                    </button>
                                                </div>
                                                <textarea rows={2} value={editForm.address} onChange={e => setEditForm(r => ({ ...r, address: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none text-sm font-semibold resize-none mb-4" placeholder="Street address" />

                                                <div className="grid grid-cols-2 gap-3 mb-4">
                                                    <div>
                                                        <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1.5">City</label>
                                                        <input type="text" value={editForm.city} onChange={e => setEditForm(r => ({ ...r, city: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none text-sm font-semibold" placeholder="City" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1.5">State</label>
                                                        <input type="text" value={editForm.state} onChange={e => setEditForm(r => ({ ...r, state: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none text-sm font-semibold" placeholder="State" />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1.5">PIN Code</label>
                                                        <input type="text" value={editForm.pincode} onChange={e => setEditForm(r => ({ ...r, pincode: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none text-sm font-semibold" placeholder="PIN Code" maxLength={6} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 pt-2">
                                                <button type="submit" className="bg-green-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 flex-1">
                                                    <i className="fa-solid fa-check text-xs" /> Save
                                                </button>
                                                <button type="button" onClick={() => setIsEditing(false)} className="py-3.5 rounded-xl font-bold text-sm bg-transparent border-2 flex items-center justify-center gap-2 flex-1" style={{ color: COLORS.heading, borderColor: COLORS.heading }}>
                                                    <i className="fa-solid fa-xmark text-xs" /> Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            )}

                            {activeTab === 'orders' && <OrderListRenderer orders={displayedOrders} tabLoading={tabLoading} cancelOrder={cancelOrder} isMobile />}
                            {activeTab === 'wishlist' && <WishlistRenderer wishlistProducts={wishlistProducts} tabLoading={tabLoading} />}
                            {activeTab === 'blogs' && <CustomerBlogs />}
                            {activeTab === 'reviews' && <ReviewFormRenderer reviewForm={reviewForm} setReviewForm={setReviewForm} reviewStatus={reviewStatus} handleReviewSubmit={handleReviewSubmit} profile={profile} />}
                            {activeTab === 'support' && <QueriesRenderer enquiries={enquiries} visits={visits} tabLoading={tabLoading} />}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Renderers ──

function OrderListRenderer({ orders, tabLoading, cancelOrder, isMobile }: any) {
    const [searchTerm, setSearchTerm] = useState('');

    if (tabLoading) return (
        <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
    );

    const filteredOrders = orders.filter((o: any) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        if (o._id?.toLowerCase().includes(term)) return true;
        const amount = String(o.total_amount || o.totalAmount || '');
        if (amount.includes(term)) return true;
        if (o.items?.some((item: any) => {
            const name = item.product_name || item.product?.name || item.name || '';
            return name.toLowerCase().includes(term);
        })) return true;
        return false;
    });

    return (
        <div className="space-y-4">
            <div className="relative mb-6">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                    type="text"
                    placeholder="Search by Order ID, Amount, or Item Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 outline-none text-sm font-semibold shadow-sm focus:border-black transition-colors"
                />
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-transparent">
                    <div className="w-20 h-20 bg-white/60 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-white/50">
                        <i className="fa-solid fa-box-open text-3xl text-gray-400" />
                    </div>
                    <h3 className="text-lg font-black text-gray-800 mb-2">No Orders Yet</h3>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">You haven't placed any orders.</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-transparent">
                    <p className="text-sm text-gray-500 font-semibold">We couldn't find any orders matching your search.</p>
                </div>
            ) : (
                filteredOrders.map((o: any) => <ExpandableOrderCard key={o._id} order={o} cancelOrder={cancelOrder} isMobile={isMobile} />)
            )}
        </div>
    );
}

function ExpandableOrderCard({ order, cancelOrder, isMobile }: any) {
    const [expanded, setExpanded] = useState(false);
    const router = useRouter();
    const canCancel = CANCELLABLE_STATUSES.includes(order.status);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all">
            <div onClick={() => setExpanded(!expanded)} className="p-4 md:p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors select-none">
                <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 text-gray-400 overflow-hidden">
                        {order.items?.[0] && (order.items[0].product_image || order.items[0].image || order.items[0].product?.images?.[0]) ? (
                            <img src={order.items[0].product_image || order.items[0].image || order.items[0].product?.images?.[0]} alt="Order" className="w-full h-full object-cover" />
                        ) : (
                            <i className="fa-solid fa-box text-xl" />
                        )}
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Order #{order._id.slice(-6)}</p>
                        <h3 className="font-black text-gray-800">{order.items?.length || 0} Items</h3>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-gray-800">₹{order.total_amount || order.totalAmount}</p>
                    </div>
                    <i className={`fa-solid fa-chevron-down text-gray-400 text-sm transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {expanded && (
                <div className="border-t border-gray-100 bg-gray-50/30 p-4 md:p-5 animate-in fade-in duration-300">
                    <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-gray-100">
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Total Price</p>
                            <p className="font-black text-gray-800 text-sm">₹{order.total_amount || order.totalAmount}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Order Status</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block ${ORDER_STATUS_CLASSES[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Payment Method</p>
                            <p className="font-bold text-gray-600 text-sm">{order.payment_mode || order.paymentMode || 'Online'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Payment Status</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block ${PAYMENT_STATUS_CLASSES[order.payment_status || order.paymentStatus] || 'bg-gray-100 text-gray-600'}`}>{order.payment_status || order.paymentStatus || '-'}</span>
                        </div>
                    </div>

                    <div className="space-y-3 mb-5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Items</p>
                        {order.items?.map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                                    {item.product_image || item.image || item.product?.images?.[0] ? (
                                        <img src={item.product_image || item.image || item.product?.images?.[0]} alt={item.product_name || item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <i className="fa-solid fa-box text-gray-300"></i>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.product_name || item.product?.name || item.name || 'Product'}</p>
                                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-black text-gray-800">₹{item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        <button onClick={() => router.push('/our-product')} className="px-5 py-3 bg-green-700 hover:bg-green-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 sm:flex-1">
                            <i className="fa-solid fa-basket-shopping" /> Continue Shopping
                        </button>
                        <button onClick={() => router.push(`/profile/orders/${order._id}`)} className="px-5 py-3 bg-white border hover:bg-gray-50 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 sm:flex-none" style={{ borderColor: COLORS.heading, color: COLORS.heading }}>
                            <i className="fa-solid fa-circle-info" /> Details
                        </button>
                        <div className="flex gap-2 justify-stretch sm:justify-end sm:flex-1">
                            <Link href={`/profile/orders/${order._id}?download=true`} className="flex-1 sm:flex-none text-center px-4 py-3 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-xs rounded-xl transition-colors">
                                Bill PDF
                            </Link>
                            {canCancel && order.status !== 'Cancelled' && (
                                <button onClick={() => cancelOrder(order._id)} className="flex-1 sm:flex-none px-4 py-3 bg-white border border-red-100 text-red-500 hover:bg-red-50 font-bold text-xs rounded-xl transition-colors">
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function WishlistRenderer({ wishlistProducts, tabLoading }: any) {
    if (tabLoading) return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
    );
    if (wishlistProducts.length === 0) return (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <i className="fa-regular fa-heart text-3xl text-gray-300 mb-4" />
            <h3 className="text-lg font-black text-gray-800">Wishlist Empty</h3>
            <p className="text-sm text-gray-400 mt-2">Save items you love.</p>
        </div>
    );
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlistProducts.map((p: any) => <ProductCard key={p._id || p.id} product={p} />)}
        </div>
    );
}

function QueriesRenderer({ enquiries, visits, tabLoading }: any) {
    if (tabLoading) return <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />;
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2"><i className="fa-solid fa-message text-gray-400" /> My Enquiries</h3>
                    <span className="text-xs font-bold bg-white px-2 py-1 rounded-md text-gray-500 shadow-sm">{enquiries.length}</span>
                </div>
                <div className="p-2">
                    {enquiries.length > 0 ? (
                        <div className="space-y-2">
                            {enquiries.map((e: any, i: number) => (
                                <div key={i} className="p-3 bg-white border border-gray-50 rounded-xl">
                                    <p className="font-bold text-gray-800 text-sm mb-1">{e.subject || 'Enquiry'}</p>
                                    <p className="text-xs text-gray-500 mb-2">{e.message}</p>
                                    <p className="text-[10px] text-gray-400 font-bold bg-gray-50 inline-block px-2 py-0.5 rounded">Status: {e.status || 'Pending'}</p>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-sm text-gray-400 p-4 text-center">No enquiries found.</p>}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2"><i className="fa-solid fa-building text-gray-400" /> Factory Visits</h3>
                    <span className="text-xs font-bold bg-white px-2 py-1 rounded-md text-gray-500 shadow-sm">{visits.length}</span>
                </div>
                <div className="p-2">
                    {visits.length > 0 ? (
                        <div className="space-y-2">
                            {visits.map((v: any, i: number) => (
                                <div key={i} className="p-3 bg-white border border-gray-50 rounded-xl flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm mb-1">{v.date || (v.preferredDate ? new Date(v.preferredDate).toLocaleDateString() : 'Date Not Provided')}</p>
                                        <p className="text-xs text-gray-500">{v.company || v.purpose || 'Factory Visit'}</p>
                                    </div>
                                    <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded-md text-gray-600">{v.status || 'Pending'}</span>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-sm text-gray-400 p-4 text-center">No visits scheduled.</p>}
                </div>
            </div>
        </div>
    );
}

function ReviewFormRenderer({ reviewForm, setReviewForm, reviewStatus, handleReviewSubmit, profile }: any) {
    const [myReviews, setMyReviews] = useState<any[]>([]);

    useEffect(() => {
        if (profile?.username) {
            fetch(API.TESTIMONIALS)
                .then(res => res.json())
                .then(data => {
                    const userReviews = data.filter((t: any) => t.name === profile.username);
                    setMyReviews(userReviews);
                })
                .catch(err => console.error("Could not fetch reviews:", err));
        }
    }, [profile?.username, reviewStatus]); // Re-fetch when reviewStatus changes (e.g. success)

    return (
        <div>
            <form onSubmit={handleReviewSubmit} className="space-y-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Name" required value={reviewForm.name} onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black font-semibold" />
                    <input type="text" placeholder="City, State" required value={reviewForm.city} onChange={e => setReviewForm({ ...reviewForm, city: e.target.value })} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black font-semibold" />
                </div>
                <textarea placeholder="Share your experience..." required rows={3} value={reviewForm.description} onChange={e => setReviewForm({ ...reviewForm, description: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black font-semibold resize-none" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-gray-50">
                    <div>
                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Your Rating</p>
                        <StarPicker value={reviewForm.rating} onChange={(v) => setReviewForm({ ...reviewForm, rating: v })} />
                    </div>
                    <button type="submit" disabled={reviewStatus === 'loading'} className="bg-green-700 text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50">
                        {reviewStatus === 'loading' ? <i className="fa-solid fa-spinner fa-spin text-sm md:text-xs" /> : <i className="fa-solid fa-pen-nib text-sm md:text-xs" />}
                        <span className="hidden md:inline">Share Your Experience</span>
                        <span className="md:hidden">Submit Review</span>
                    </button>
                </div>
                {reviewStatus === 'success' && <p className="text-green-600 text-xs font-bold mt-2 bg-green-50 p-2 rounded-lg"><i className="fa-solid fa-circle-check" /> Submitted successfully!</p>}
                {reviewStatus === 'error' && <p className="text-red-500 text-xs font-bold mt-2 bg-red-50 p-2 rounded-lg"><i className="fa-solid fa-circle-exclamation" /> Failed to submit review.</p>}
            </form>

            {myReviews.length > 0 && (
                <div className="space-y-4">
                    <h3 className="font-black text-gray-800 text-lg border-b border-gray-100 pb-2">Your Previous Reviews</h3>
                    {myReviews.map((r: any, idx: number) => (
                        <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-gray-800">{r.name}</h4>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{r.city}</p>
                                </div>
                                <div className="flex text-amber text-xs">
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className={i < (r.rating || 5) ? "fa-solid fa-star" : "fa-regular fa-star"} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 italic">"{r.description}"</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}