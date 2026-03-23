'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
    images: string[];
    name: string;
}

const optimizeCloudinary = (url: string) => {
    if (!url || !url.includes('res.cloudinary.com')) return url;
    // Insert f_auto,q_auto after /upload/
    return url.replace('/upload/', '/upload/f_auto,q_auto/');
};

export default function ProductGallery({ images, name }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const validImages = images.filter(Boolean);

    if (validImages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-gray-300 gap-4 h-full min-h-[400px]">
                <span className="text-8xl">🥜</span>
                <p className="text-sm font-medium text-gray-400">No image available</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row h-full gap-4">
            {/* Thumbnails (Left for Desktop, Bottom for Mobile) */}
            {validImages.length > 1 && (
                <div className="order-2 md:order-1 md:w-24">
                    <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide snap-x">
                        {validImages.map((img, idx) => (
                            <button
                                key={idx}
                                onMouseEnter={() => setActiveIndex(idx)}
                                onClick={() => setActiveIndex(idx)}
                                className={`
                                    relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all snap-center
                                    ${activeIndex === idx ? 'border-primary shadow-md' : 'border-transparent bg-gray-50 hover:border-gray-200'}
                                `}
                            >
                                <Image
                                    src={optimizeCloudinary(img)}
                                    alt={`${name} thumb ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 64px, 80px"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Image Container */}
            <div className="order-1 md:order-2 relative flex-1 flex items-center justify-center bg-gray-50/50 rounded-3xl overflow-hidden min-h-[400px] md:min-h-[500px]">
                <Image
                    src={optimizeCloudinary(validImages[activeIndex])}
                    alt={`${name} - Image ${activeIndex + 1}`}
                    fill
                    className="object-contain p-6 md:p-12 drop-shadow-2xl transition-all duration-500 hover:scale-105"
                    priority
                    sizes="(max-width: 768px) 100vw, 45vw"
                />
                
                {/* Mobile indicators */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 md:hidden">
                    {validImages.map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-1.5 rounded-full transition-all ${i === activeIndex ? 'w-6 bg-primary' : 'w-1.5 bg-gray-300'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
