'use client';

import React, { useState, useEffect } from 'react';
import { COLORS } from '@/constants/styles';

export default function ErrorView() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleMouseMove = (e: MouseEvent) => {
                const x = (e.clientX / window.innerWidth) - 0.5; // -0.5 to 0.5
                const y = (e.clientY / window.innerHeight) - 0.5; // -0.5 to 0.5
                setMousePos({ x, y });
            };
            window.addEventListener('mousemove', handleMouseMove);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
            };
        }
    }, []);

    // Calculate interactive rotation: moves on mouse movement, otherwise static (0deg)
    const leftRotation = mousePos.x * 12; // range: -6 to 6 degrees
    const rightRotation = -mousePos.x * 12; // opposite direction for symmetry

    return (
        <div 
            className="min-h-screen w-full flex flex-col items-center justify-center relative px-6 py-12 text-center overflow-hidden"
            style={{
                backgroundColor: '#FFF9E7',
                fontFamily: 'var(--font-montserrat), system-ui, -apple-system, sans-serif'
            }}
        >
            {/* Hanging Cashew Tree - Left (Hidden on mobile, negative margin to touch top border, smaller size) */}
            <div 
                className="hidden md:block absolute left-0 pointer-events-none select-none z-20 origin-top-left transition-transform duration-300 ease-out"
                style={{
                    transform: `rotate(${leftRotation}deg)`,
                    top: '-45px',
                    left: '-15px',
                    width: '190px'
                }}
            >
                <img 
                    src="/images/Cashew-In-Tree.png" 
                    alt="Cashew Tree Hanging Left" 
                    className="w-full h-auto object-contain drop-shadow-md"
                />
            </div>

            {/* Hanging Cashew Tree - Right (Hidden on mobile, negative margin to touch top border, smaller size, flipped) */}
            <div 
                className="hidden md:block absolute right-0 pointer-events-none select-none z-20 origin-top-right transition-transform duration-300 ease-out"
                style={{
                    transform: `rotate(${rightRotation}deg) scale-x(-1)`,
                    top: '-45px',
                    right: '-15px',
                    width: '190px'
                }}
            >
                <img 
                    src="/images/Cashew-In-Tree.png" 
                    alt="Cashew Tree Hanging Right" 
                    className="w-full h-auto object-contain drop-shadow-md"
                />
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute top-[25%] left-[25%] w-[250px] h-[250px] rounded-full bg-[#00863D]/5 blur-[80px] pointer-events-none" />

            {/* Content Wrapper */}
            <div className="relative z-10 max-w-2xl flex flex-col items-center">
                {/* Brand Logo - Centered & Clean (No Background Container) */}
                <div className="mb-10 select-none">
                    <img 
                        src="/images/cc-Logo-01-1.png" 
                        alt="Crunchy Cashews Logo" 
                        className="w-24 h-24 md:w-32 md:h-32 object-contain filter drop-shadow-sm"
                    />
                </div>

                {/* Styled Error Heading */}
                <h1
                    className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-sm mb-6 text-center"
                    style={{ color: COLORS.heading }}
                >
                    We're fixing things{' '}
                    <span
                        className="block mt-1"
                        style={{ color: COLORS.highlight }}
                    >
                        behind the scenes
                    </span>
                </h1>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-700 font-semibold leading-relaxed max-w-lg mb-10 px-2">
                    Looks like our server ran into an unexpected problem. Don't worry—it's on us! We're working hard to get Crunchy Cashews back up and running. Please try again shortly.
                </p>

                <button
                    onClick={() => window.location.href = '/'}
                    className="bg-green-700 text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 mb-10"
                >
                    <i className="fa-solid fa-rotate-right text-sm md:text-xs" />
                    <span>Refresh</span>
                </button>

                {/* Follow Us / Social Section */}
                <div className="flex flex-col items-center">
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#00863D] mb-4">
                        Follow us
                    </p>
                    
                    {/* Social Buttons */}
                    <div className="flex items-center gap-4 mb-6">
                        {/* Instagram */}
                        <a 
                            href="https://www.instagram.com/crunchycashews?igsh=MTdkdGRzY212eTE3MQ==" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-black text-white hover:bg-[#00863D] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md"
                            title="Instagram"
                        >
                            <i className="fa-brands fa-instagram text-lg" />
                        </a>

                        {/* WhatsApp */}
                        <a 
                            href="https://wa.me/917847996343" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-black text-white hover:bg-[#00863D] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md"
                            title="WhatsApp"
                        >
                            <i className="fa-brands fa-whatsapp text-lg" />
                        </a>

                        {/* Email */}
                        <a 
                            href="mailto:crunchycashews18@gmail.com" 
                            className="w-10 h-10 rounded-full bg-black text-white hover:bg-[#00863D] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md"
                            title="Email"
                        >
                            <i className="fa-regular fa-envelope text-lg" />
                        </a>
                    </div>

                    {/* Support Email Link */}
                    <a 
                        href="mailto:crunchycashews18@gmail.com" 
                        className="text-sm font-bold text-gray-800 hover:text-[#00863D] transition-colors border-b-2 border-black/10 pb-0.5"
                    >
                        crunchycashews18@gmail.com
                    </a>
                </div>
            </div>
        </div>
    );
}
