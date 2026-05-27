'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
    images: string[];
    name: string;
    videoUrl?: string;
}

const optimizeCloudinary = (url: string) => {
    if (!url || !url.includes('res.cloudinary.com')) return url;
    // Insert f_auto,q_auto after /upload/
    return url.replace('/upload/', '/upload/f_auto,q_auto/');
};

// Extract Youtube Video ID and build embed URL
function getYoutubeEmbedUrl(url: string | undefined): string | null {
    if (!url) return null;
    let videoId = '';
    
    if (url.includes('/shorts/')) {
        const parts = url.split('/shorts/');
        if (parts[1]) {
            videoId = parts[1].split(/[?#]/)[0];
        }
    } else if (url.includes('v=')) {
        const parts = url.split('v=');
        if (parts[1]) {
            videoId = parts[1].split('&')[0].split(/[?#]/)[0];
        }
    } else if (url.includes('youtu.be/')) {
        const parts = url.split('youtu.be/');
        if (parts[1]) {
            videoId = parts[1].split(/[?#]/)[0];
        }
    } else if (url.includes('/embed/')) {
        const parts = url.split('/embed/');
        if (parts[1]) {
            videoId = parts[1].split(/[?#]/)[0];
        }
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0` : null;
}

// Extract Youtube Video ID and build cover thumbnail URL
function getYoutubeThumbnailUrl(url: string | undefined): string | null {
    if (!url) return null;
    let videoId = '';
    
    if (url.includes('/shorts/')) {
        const parts = url.split('/shorts/');
        if (parts[1]) {
            videoId = parts[1].split(/[?#]/)[0];
        }
    } else if (url.includes('v=')) {
        const parts = url.split('v=');
        if (parts[1]) {
            videoId = parts[1].split('&')[0].split(/[?#]/)[0];
        }
    } else if (url.includes('youtu.be/')) {
        const parts = url.split('youtu.be/');
        if (parts[1]) {
            videoId = parts[1].split(/[?#]/)[0];
        }
    } else if (url.includes('/embed/')) {
        const parts = url.split('/embed/');
        if (parts[1]) {
            videoId = parts[1].split(/[?#]/)[0];
        }
    }
    
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
}

export default function ProductGallery({ images, name, videoUrl }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const validImages = images.filter(Boolean);
    const embedUrl = getYoutubeEmbedUrl(videoUrl);

    // Build the gallery list including video if available
    const galleryItems = [
        ...validImages.map((img, idx) => ({ type: 'image', url: img, idx })),
        ...(embedUrl ? [{ type: 'video', url: embedUrl, idx: validImages.length }] : [])
    ];

    if (galleryItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-gray-300 gap-4 h-full min-h-[400px]">
                <span className="text-8xl">🥜</span>
                <p className="text-sm font-medium text-gray-400">No image available</p>
            </div>
        );
    }

    const activeItem = galleryItems[activeIndex] || galleryItems[0];

    return (
        <div className="flex flex-col md:flex-row h-full gap-4">
            {/* Thumbnails (Left for Desktop, Bottom for Mobile) */}
            {galleryItems.length > 1 && (
                <div className="order-2 md:order-1 md:w-24">
                    <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide snap-x">
                        {galleryItems.map((item, idx) => (
                            <button
                                key={idx}
                                onMouseEnter={() => setActiveIndex(idx)}
                                onClick={() => setActiveIndex(idx)}
                                className={`
                                    relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all snap-center
                                    ${activeIndex === idx ? 'border-primary shadow-md font-bold' : 'border-transparent bg-gray-50 hover:border-gray-200'}
                                `}
                            >
                                {item.type === 'image' ? (
                                    <Image
                                        src={optimizeCloudinary(item.url)}
                                        alt={`${name} thumb ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 64px, 80px"
                                    />
                                ) : (
                                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                                        {getYoutubeThumbnailUrl(videoUrl) ? (
                                            <img
                                                src={getYoutubeThumbnailUrl(videoUrl)!}
                                                alt="Video Thumbnail"
                                                className="w-full h-full object-cover opacity-60"
                                            />
                                        ) : (
                                            validImages[0] && (
                                                <Image
                                                    src={optimizeCloudinary(validImages[0])}
                                                    alt="Video Thumbnail"
                                                    fill
                                                    className="object-cover opacity-50"
                                                    sizes="(max-width: 768px) 64px, 80px"
                                                />
                                            )
                                        )}
                                        <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                                            <i className="fa-solid fa-play text-white text-base drop-shadow-md"></i>
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Display Container */}
            <div className={`order-1 md:order-2 relative flex-1 flex justify-center bg-gray-50/50 rounded-3xl overflow-hidden min-h-[400px] md:min-h-[500px] ${activeItem.type === 'video' ? 'items-start pt-4 md:pt-8' : 'items-center'}`}>
                {activeItem.type === 'image' ? (
                    <Image
                        src={optimizeCloudinary(activeItem.url)}
                        alt={`${name} - Image ${activeIndex + 1}`}
                        fill
                        className="object-contain p-6 md:p-12 drop-shadow-2xl transition-all duration-500 hover:scale-105"
                        priority
                        sizes="(max-width: 768px) 100vw, 45vw"
                    />
                ) : (
                    <div className="w-full flex items-center justify-center p-4">
                        <iframe
                            src={activeItem.url}
                            title={`${name} product video`}
                            className="aspect-[9/16] rounded-2xl shadow-lg border-0 bg-transparent"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            style={{ height: '440px', maxHeight: '85vh' }}
                        ></iframe>
                    </div>
                )}
                
                {/* Mobile indicators */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 md:hidden">
                    {galleryItems.map((_, i) => (
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
