'use client';

import React from 'react';
import Link from 'next/link';
import { COLORS } from '@/constants/styles';

export default function Footer() {
    return (
        <footer
            className="relative text-white overflow-hidden mt-0"
            style={{ 
                background: 'linear-gradient(135deg, #023618 0%, #00170a 100%)'
            }}
        >
            {/* Decorative background blobs */}
            <div
                className="absolute top-0 left-0 w-72 h-72 opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ backgroundColor: COLORS.primary }}
            />
            <div
                className="absolute bottom-0 right-0 w-96 h-96 opacity-15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"
                style={{ backgroundColor: COLORS.primary }}
            />
            <div
                className="absolute top-1/2 left-1/2 w-64 h-64 opacity-10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ backgroundColor: COLORS.primaryLight }}
            />

            {/* Top accent line */}
            <div
                className="w-full h-1 bg-gradient-to-r"
                style={{ backgroundImage: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.accent}, ${COLORS.primary})` }}
            />

            {/* Main Footer Grid */}
            <div className="max-w-7xl mx-auto px-6 pt-12 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                {/* Brand */}
                <div className="flex flex-col gap-5 lg:col-span-1">
                    <div>
                        <div className="inline-flex items-center gap-2 mb-3">
                            <img src="/images/cc-Logo-01-1.png" alt="Crunchy Cashews Logo" className="w-10 h-10 object-contain" />
                            <h2 className="text-xl font-black text-white tracking-tight">Crunchy Cashews</h2>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            Premium cashew manufacturer & supplier based in Siliguri, India. Farm-fresh quality, delivered with care.
                        </p>

                        {/* FSSAI Logo & License */}
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-2xl">
                            <img src="/images/partners/FSSAI_logo.png" alt="FSSAI Logo" className="w-14 h-auto object-contain" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#F6B000]">License No.</span>
                                <span className="text-[11px] text-gray-300 font-mono">12825999000962</span>
                            </div>
                        </div>
                    </div>
                    {/* Social Links */}
                    <div className="flex gap-3">
                        {[
                            { icon: 'fa-brands fa-instagram', href: 'https://www.instagram.com/crunchycashews?igsh=MTdkdGRzY212eTE3MQ==' },
                            { icon: 'fa-brands fa-facebook-f', href: '#' },
                            { icon: 'fa-brands fa-whatsapp', href: '#' },
                            { icon: 'fa-brands fa-youtube', href: '#' },
                        ].map((s, i) => (
                            <a
                                key={i}
                                href={s.href}
                                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-200 hover:scale-110"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = COLORS.primary;
                                    e.currentTarget.style.borderColor = COLORS.primary;
                                    e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.color = 'rgb(156, 163, 175)';
                                }}
                            >
                                <i className={`${s.icon} text-xs`} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold tracking-[3px] uppercase" style={{ color: COLORS.accent }}>Navigate</h3>
                    <ul className="flex flex-col gap-2.5">
                        {[
                            { label: 'Home', href: '/' },
                            { label: 'Shop', href: '/shop' },
                            { label: 'About Us', href: '/about' },
                            { label: 'Bulk Orders', href: '/bulk' },
                            { label: 'Contact', href: '/contact' },
                        ].map(link => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="group flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors duration-200"
                                >
                                    <span
                                        className="w-0 group-hover:w-3 h-[2px] transition-all duration-300 rounded-full"
                                        style={{ backgroundColor: COLORS.accent }}
                                    />
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* B2B Services */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold tracking-[3px] uppercase" style={{ color: COLORS.accent }}>B2B Services</h3>
                    <ul className="flex flex-col gap-2.5">
                        {[
                            { label: 'Wholesale', href: '/bulk' },
                            { label: 'White Label', href: '/bulk' },
                            { label: 'Corporate Gifting', href: '/bulk' },
                        ].map(item => (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    className="group flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors duration-200"
                                >
                                    <span
                                        className="w-0 group-hover:w-3 h-[2px] transition-all duration-300 rounded-full"
                                        style={{ backgroundColor: COLORS.accent }}
                                    />
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>


                {/* Contact */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold tracking-[3px] uppercase" style={{ color: COLORS.accent }}>Contact Us</h3>
                    <ul className="flex flex-col gap-3">
                        <li>
                            <a href="tel:+917847996343" className="group flex items-start gap-3 hover:text-white transition-colors">
                                <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-none mt-0.5 border"
                                    style={{ backgroundColor: `${COLORS.primary}99`, borderColor: COLORS.primary }}
                                >
                                    <i className="fa-solid fa-phone text-xs" style={{ color: COLORS.accent }} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-0.5">Call Us</p>
                                    <p className="text-sm text-gray-300 group-hover:text-white">+91 7847996343</p>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="mailto:crunchycashews18@gmail.com" className="group flex items-start gap-3 hover:text-white transition-colors">
                                <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-none mt-0.5 border"
                                    style={{ backgroundColor: `${COLORS.primary}99`, borderColor: COLORS.primary }}
                                >
                                    <i className="fa-solid fa-envelope text-xs" style={{ color: COLORS.accent }} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                                    <p className="text-sm text-gray-300 group-hover:text-white">crunchycashews18@gmail.com</p>
                                </div>
                            </a>
                        </li>
                        <li>
                            <div className="flex items-start gap-3">
                                <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-none mt-0.5 border"
                                    style={{ backgroundColor: `${COLORS.primary}99`, borderColor: COLORS.primary }}
                                >
                                    <i className="fa-solid fa-location-dot text-xs" style={{ color: COLORS.accent }} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-0.5">Location</p>
                                    <p className="text-sm text-gray-300">YU NUT PROCESSING INDUSTRY,
                                        Gram Panchayat Fulbari-II, Dist. - Jalpaiguri Siliguri (W.B) - 734015 </p>
                                </div>
                            </div>
                        </li>
                    </ul>

                    {/* Payment Types (Moved under Contact) */}
                    <div className="flex flex-col gap-2 mt-0">
                        <span className="text-[10px] font-bold uppercase tracking-[2.5px]" style={{ color: COLORS.accent, opacity: 0.8 }}>We also accept</span>
                        <div className="flex items-center gap-5 text-gray-500">
                            <i className="fa-brands fa-cc-visa text-2xl transition-all duration-300 hover:text-[#1A1F71] hover:scale-110 cursor-pointer" title="Visa" />
                            <i className="fa-brands fa-cc-mastercard text-2xl transition-all duration-300 hover:text-[#EB001B] hover:scale-110 cursor-pointer" title="Mastercard" />
                            <i className="fa-solid fa-building-columns text-xl transition-all duration-300 hover:text-[#F6B000] hover:scale-110 cursor-pointer" title="Net Banking" />
                            <i className="fa-solid fa-qrcode text-xl transition-all duration-300 hover:text-[#6739B7] hover:scale-110 cursor-pointer" title="UPI" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="relative border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="flex flex-col items-center sm:items-start gap-2">
                        <p className="text-xs text-gray-600">
                            &copy; {new Date().getFullYear()} <span className="text-gray-500">Crunchy Cashews.</span> All rights reserved.
                        </p>
                    </div>

                    {/* Attribution — styled, not jarring */}
                    <div className="flex items-center gap-1 text-xs" style={{ color: COLORS.accent, opacity: 0.5 }}>
                        <span>Developed by</span>


                        <a href="https://yunutprocessingindustry.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold ml-1 transition-opacity hover:opacity-100"
                            style={{ color: COLORS.accent, opacity: 0.8 }}
                        >
                            Yu Nut Processing Industry
                        </a>
                    </div>

                    <div className="flex gap-5">
                        {[
                            { label: 'Terms & Conditions', href: '/terms' },
                            { label: 'Privacy Policy', href: '/privacy' },
                            { label: 'Refund Policy', href: '/refund-policy' },
                        ].map(policy => (
                            <Link
                                key={policy.href}
                                href={policy.href}
                                className="text-xs transition-colors shrink-0"
                                style={{ color: COLORS.accent, opacity: 0.6 }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                            >
                                {policy.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}