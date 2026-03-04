'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function OrderSuccessContent() {
    const params = useSearchParams();
    const orderId = params.get('order_id');
    const success = params.get('success');

    if (!success || !orderId) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-center animate-bounce-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <i className="fa-solid fa-circle-check text-4xl text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Order Placed!</h2>
                <p className="text-gray-500 text-sm mb-1">Your order has been confirmed.</p>
                <code className="block text-xs bg-gray-100 text-[#0c5c2b] font-mono font-bold px-4 py-2 rounded-xl mt-3 mb-6 select-all">
                    #{orderId.slice(-10).toUpperCase()}
                </code>
                <div className="flex flex-col gap-3">
                    <Link href={`/track?order=${orderId}`}
                        className="block bg-[#0c5c2b] text-white font-bold py-3 rounded-xl hover:bg-green-800 transition flex items-center justify-center gap-2">
                        <i className="fa-solid fa-truck-fast" /> Track Your Order
                    </Link>
                    <Link href="/shop"
                        className="block bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition text-sm">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccessModal() {
    return (
        <Suspense fallback={null}>
            <OrderSuccessContent />
        </Suspense>
    );
}
