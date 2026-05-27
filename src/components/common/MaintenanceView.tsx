'use client';

import React from 'react';

export default function MaintenanceView() {
    return (
        <div 
            className="min-h-screen flex flex-col items-center justify-center relative px-6 py-12 text-center overflow-hidden"
            style={{
                background: 'radial-gradient(circle at 25% 30%, rgba(246, 176, 0, 0.22) 0%, transparent 45%), radial-gradient(circle at 75% 25%, rgba(139, 92, 246, 0.15) 0%, transparent 40%), #FDFBF7',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
        >
            {/* Soft Ambient Blob */}
            <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-orange-400/10 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-purple-400/5 blur-[100px] pointer-events-none" />

            {/* Content Wrapper */}
            <div className="relative z-10 max-w-2xl flex flex-col items-center">
                {/* Brand Logo & Name */}
                <div className="flex items-center gap-3 mb-12 select-none">
                    <img 
                        src="/images/cc-Logo-01-1.png" 
                        alt="Crunchy Cashews Logo" 
                        className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-sm"
                    />
                    <span className="text-xl md:text-2xl font-black uppercase tracking-wider text-emerald-800">
                        Crunchy Cashews
                    </span>
                </div>

                {/* Heading */}
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-6 leading-tight max-w-xl">
                    Sorry! We're under construction maintenance!
                </h1>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-500 font-semibold leading-relaxed max-w-lg mb-12 px-2">
                    Our website is currently undergoing scheduled maintenance, we will be back soon! Thank you for being so patient. Contact us for more information!
                </p>

                {/* Follow Us / Social Section */}
                <div className="flex flex-col items-center">
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                        Follow us
                    </p>
                    
                    {/* Social Buttons */}
                    <div className="flex items-center gap-4 mb-6">
                        {/* Instagram */}
                        <a 
                            href="https://www.instagram.com/crunchycashews?igsh=MTdkdGRzY212eTE3MQ==" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md hover:shadow-lg"
                            title="Instagram"
                        >
                            <i className="fa-brands fa-instagram text-lg" />
                        </a>

                        {/* WhatsApp */}
                        <a 
                            href="https://wa.me/917847996343" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md hover:shadow-lg"
                            title="WhatsApp"
                        >
                            <i className="fa-brands fa-whatsapp text-lg" />
                        </a>

                        {/* Email */}
                        <a 
                            href="mailto:crunchycashews18@gmail.com" 
                            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md hover:shadow-lg"
                            title="Email"
                        >
                            <i className="fa-regular fa-envelope text-lg" />
                        </a>
                    </div>

                    {/* Support Email Link */}
                    <a 
                        href="mailto:crunchycashews18@gmail.com" 
                        className="text-sm font-black text-gray-800 hover:text-emerald-700 transition-colors border-b-2 border-black/10 pb-0.5"
                    >
                        crunchycashews18@gmail.com
                    </a>
                </div>
            </div>
        </div>
    );
}
