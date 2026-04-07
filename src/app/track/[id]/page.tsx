'use client';

/**
 * Public Order Tracking Page — /track/[id]
 * Allows customers to track their order status without authentication.
 * Uses GET /api/orders/track/:id
 */

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { API } from '@/constants/api';
import { 
    ORDER_STATUS_CLASSES, 
    COLORS 
} from '@/constants/styles';
import OrderTracking from '@/components/OrderTracking';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicOrderTracking() {
    const params = useParams();
    const router = useRouter();
    const orderId = params?.id as string;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrder = async () => {
        setLoading(true);
        setError('');
        try {
            // Public tracking endpoint doesn't require token
            const res = await fetch(API.ORDER_TRACK(orderId));
            if (res.ok) {
                const data = await res.json();
                setOrder(data);
            } else {
                const err = await res.json().catch(() => ({}));
                setError(err.detail || 'Order not found or invalid link.');
            }
        } catch (err) {
            setError('Unable to track order. Please check your internet connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orderId) fetchOrder();
    }, [orderId]);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Locating Order...</p>
            </div>
        </div>
    );

    if (error || !order) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 max-w-md w-full text-center"
            >
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                    <i className="fa-solid fa-ghost" />
                </div>
                <h2 className="text-2xl font-black text-gray-800 mb-2">Order Not Found</h2>
                <p className="text-gray-500 mb-8 leading-relaxed font-medium">The tracking link you used is invalid or the order has been archived.</p>
                <Link 
                    href="/shop"
                    className="block w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    Back to Shop
                </Link>
            </motion.div>
        </div>
    );

    const isCancelled = order.status === 'Cancelled';
    const date = new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen bg-[#f4f6f9] py-16 px-4">
            <div className="max-w-xl mx-auto space-y-6">
                
                {/* Header Card */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                    {/* Background Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
                    
                    <div className="flex flex-col items-center text-center relative z-10">
                        <div 
                            className="w-16 h-16 rounded-3xl flex items-center justify-center text-2xl mb-4 shadow-lg shadow-primary/10" 
                            style={{ backgroundColor: COLORS.primary, color: '#fff' }}
                        >
                            <i className="fa-solid fa-truck-fast"></i>
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Order Tracking</h1>
                        <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">#{orderId.slice(-10).toUpperCase()}</p>
                    </div>

                    <div className="mt-10 pt-10 border-t border-gray-50 space-y-8">
                        {/* Stepper Integration */}
                        <OrderTracking currentStatus={order.status} isCancelled={isCancelled} />
                    </div>
                </div>

                {/* Summary Info */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 divide-y divide-gray-50">
                    <div className="pb-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Summary</p>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Status</p>
                                <p className="text-sm font-black text-gray-800">{order.status}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Placed On</p>
                                <p className="text-sm font-black text-gray-800">{date}</p>
                            </div>
                        </div>
                    </div>

                    <div className="py-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Delivery Estimate</p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                                <i className="fa-solid fa-clock-rotate-left"></i>
                            </div>
                            <p className="text-sm font-bold text-gray-600">Standard Delivery: 5-7 Business Days</p>
                        </div>
                    </div>

                    <div className="pt-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Items ({order.items?.length || 0})</p>
                        <div className="space-y-3">
                            {(order.items || []).map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                    <p className="font-bold text-gray-700 leading-none">
                                        <span className="text-primary mr-2 opacity-50">{item.quantity}x</span>
                                        {item.name || item.product_name}
                                    </p>
                                    <p className="font-black text-gray-900 opacity-20">•••</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col gap-3 pt-6">
                    <Link 
                        href="/login"
                        className="text-center bg-gray-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-black/10 active:scale-95 transition-all text-sm uppercase tracking-widest"
                    >
                        Login to View Full Details
                    </Link>
                    <Link 
                        href="/shop"
                        className="text-center text-gray-400 font-bold hover:text-gray-600 transition-colors text-xs uppercase tracking-widest"
                    >
                        ← Continue Shopping
                    </Link>
                </div>
                
                <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest pt-10">
                    © {new Date().getFullYear()} Crunchy Cashews Support Terminal
                </p>
            </div>

            <style jsx global>{`
                body { background-color: #f4f6f9 !important; }
            `}</style>
        </div>
    );
}
