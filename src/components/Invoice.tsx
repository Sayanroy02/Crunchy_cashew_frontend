'use client';

import React from 'react';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';

interface InvoiceProps {
    order: any;
    onClose?: () => void;
}

export default function Invoice({ order, onClose }: InvoiceProps) {
    if (!order) return null;

    const isCancelled = order.status === 'Cancelled';
    const orderId = order._id || order.id;
    const trackingUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/profile/orders/${orderId}`
        : '';

    // Calculations
    const subtotal = order.subtotal || order.total_amount - (order.shipping_fee || 0);
    const shippingFee = order.shipping_fee || 0;
    const totalAmount = order.total_amount;
    const taxIncluded = Math.round(subtotal * 0.12);

    return (
        <div className="bg-white text-black font-serif w-full p-8 print:p-0" id="invoice-bill">
            
            {/* Header / Brand */}
            <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-black">
                <div className="flex items-center gap-4">
                    <Image 
                        src="/images/cc-Logo-01-1.png" 
                        alt="CC Logo" 
                        width={60} 
                        height={60} 
                        className="object-contain"
                    />
                    <div>
                        <h1 className="text-2xl font-bold uppercase tracking-tight">CRUNCHY CASHEWS</h1>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Premium Quality Nuts & Cashew Processing</p>
                    </div>
                </div>
                <div className="text-right">
                     <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Tax Invoice / Bill of Purchase</p>
                     <p className="text-xl font-bold text-black border-2 border-black px-4 py-1 inline-block uppercase">
                        {order.invoice_no || `CC${new Date().toISOString().substring(0,10).replace(/-/g,'')}000`}
                     </p>
                </div>
            </div>

            {/* From / To (Clean Columns) */}
            <div className="grid grid-cols-2 gap-12 mb-8 lowercase sm:uppercase">
                <div className="space-y-1.5 uppercase">
                    <h3 className="text-[10px] font-bold text-gray-400 border-b border-gray-200 pb-1 mb-2">FROM (VENDOR)</h3>
                    <p className="font-bold text-sm">CRUNCHY CASHEWS</p>
                    <p className="text-[11px] text-black leading-tight">
                        YU NUT PROCESSING INDUSTRY,<br/>
                        Gram Panchayat Fulbari-II, Dist. - Jalpaiguri<br/>
                        Siliguri (W.B) - 734015
                    </p>
                    <p className="text-[11px] font-bold pt-1">PH: +91 7847996343</p>
                    <p className="text-[11px] font-bold lowercase">crunchycashews18@gmail.com</p>
                </div>
                <div className="space-y-1.5 uppercase text-right">
                    <h3 className="text-[10px] font-bold text-gray-400 border-b border-gray-200 pb-1 mb-2 text-right">TO (CUSTOMER)</h3>
                    <p className="font-bold text-sm">{order.customer?.name}</p>
                    <p className="text-[11px] text-black leading-tight ml-auto max-w-[240px]">
                        {order.customer?.address}
                    </p>
                    <p className="text-[11px] font-bold pt-1">PH: {order.customer?.phone}</p>
                    <p className="text-[11px] font-bold">{order.customer?.email || '—'}</p>
                </div>
            </div>

            {/* Order Meta Table */}
            <div className="mb-8 overflow-hidden border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 uppercase text-[10px] font-bold text-gray-500 border-b border-gray-200">
                            <th className="p-3 border-r border-gray-200">Order Reference</th>
                            <th className="p-3 border-r border-gray-200 text-center">Order Date</th>
                            <th className="p-3 border-r border-gray-200 text-center">Payment Mode</th>
                            <th className="p-3 text-right">Payment Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-[12px] font-bold text-gray-800">
                        <tr>
                            <td className="p-3 border-r border-gray-200">#{orderId.slice(-12).toUpperCase()}</td>
                            <td className="p-3 border-r border-gray-200 text-center">{new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            <td className="p-3 border-r border-gray-200 text-center">{order.payment_mode}</td>
                            <td className="p-3 text-right">{order.payment_status}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Items Table */}
            <div className="mb-8 border border-gray-200 min-h-[200px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 uppercase text-[10px] font-bold text-gray-500 border-b border-gray-200">
                            <th className="p-3 border-r border-gray-200 w-12 text-center">#</th>
                            <th className="p-3 border-r border-gray-200">Product Description</th>
                            <th className="p-3 border-r border-gray-200 text-center w-24">QTY</th>
                            <th className="p-3 border-r border-gray-200 text-right w-32">Unit Price</th>
                            <th className="p-3 text-right w-32">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="text-[12px]">
                        {order.items?.map((item: any, idx: number) => (
                            <tr key={idx} className="border-b border-gray-100 last:border-0 uppercase">
                                <td className="p-3 border-r border-gray-200 text-center text-gray-400 font-mono">{idx + 1}</td>
                                <td className="p-3 border-r border-gray-200">
                                    <p className="font-bold">{item.name || item.product_name}</p>
                                    <p className="text-[10px] text-gray-400">{item.variant || 'Standard Pack'}</p>
                                </td>
                                <td className="p-3 border-r border-gray-200 text-center font-bold">{item.quantity}</td>
                                <td className="p-3 border-r border-gray-200 text-right">₹{item.price.toLocaleString('en-IN')}</td>
                                <td className="p-3 text-right font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className="flex justify-between items-start gap-12">
                <div className="flex flex-col items-center">
                    <QRCodeSVG value={trackingUrl} size={100} level="H" includeMargin={false} />
                    <p className="text-[8px] font-bold text-gray-400 mt-2 uppercase text-center tracking-widest">Tracking QR</p>
                </div>
                <div className="w-[300px] border border-black p-0 uppercase">
                    <div className="flex justify-between p-3 border-b border-gray-100 text-[11px] font-bold">
                        <span className="text-gray-500">Subtotal</span>
                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between p-3 border-b border-gray-100 text-[11px] font-bold">
                        <span className="text-gray-500">Delivery Charges</span>
                        <span className={shippingFee === 0 ? "text-green-700" : ""}>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-100 text-[16px] font-black">
                        <span>Total Amount</span>
                        <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="p-3 text-[9px] text-gray-400 border-t border-gray-200 italic font-bold">
                        *Inclusive of all taxes
                    </div>
                </div>
            </div>

            {/* Terms & Note */}
            <div className="mt-12 pt-8 border-t-2 border-black text-center uppercase">
                <p className="text-[12px] font-bold tracking-[0.2em] mb-2 uppercase">Thank You for your Purchase!</p>
                <div className="bg-gray-50 border border-gray-200 p-4 max-w-lg mx-auto rounded-tl-xl rounded-br-xl">
                    <p className="text-[10px] text-gray-500 leading-snug">
                        <strong>Terms:</strong> This is a computer-generated invoice. No signature is required. 
                        Cancellations are strictly disabled once the order has been <strong>dispatched</strong> from our store.
                    </p>
                </div>
            </div>

            {isCancelled && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.2] rotate-[-20deg]">
                    <span className="text-[120px] font-black border-[15px] border-red-600 px-12 py-4 text-red-600 uppercase">CANCELLED</span>
                </div>
            )}
            
            <style jsx>{`
                @page {
                    size: A4;
                    margin: 10mm;
                }
                @media print {
                    body {
                        font-family: 'serif' !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>
        </div>
    );
}
