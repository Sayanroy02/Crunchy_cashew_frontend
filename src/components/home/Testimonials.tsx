'use client';

import React, { useEffect, useRef, useState } from 'react';
import { API } from '@/constants/api';

interface Testimonial {
    _id: string;
    name: string;
    city: string;
    state: string;
    description: string;
    rating?: number;
    video_url?: string;
}

function StarRating({ rating = 5 }: { rating?: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <i
                    key={star}
                    className={`text-sm ${star <= rating ? 'fa-solid fa-star text-amber' : 'fa-regular fa-star text-gray-300'}`}
                />
            ))}
        </div>
    );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => onChange(star)}
                    onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
                    className="text-2xl transition-transform hover:scale-110">
                    <i className={`${(hover || value) >= star ? 'fa-solid fa-star text-amber' : 'fa-regular fa-star text-gray-300'}`} />
                </button>
            ))}
        </div>
    );
}

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', city: '', state: '', description: '', rating: 5, video_url: '' });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Video Upload State
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [durationError, setDurationError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch(API.TESTIMONIALS)
            .then(res => res.json())
            .then(data => { if (Array.isArray(data) && data.length > 0) setTestimonials(data); })
            .catch(err => console.error('Failed to fetch testimonials', err));
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setDurationError(null);
        
        // Basic type check
        if (!file.type.startsWith('video/')) {
            setDurationError("Please upload a valid video file.");
            return;
        }

        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            if (video.duration < 30) {
                setDurationError(`Video must be at least 30 seconds long. Your video is ${Math.round(video.duration)}s.`);
                setVideoFile(null);
                setVideoPreview(null);
            } else {
                setVideoFile(file);
                setVideoPreview(URL.createObjectURL(file));
            }
        };
        video.src = URL.createObjectURL(file);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (durationError) return;

        setSubmitStatus('loading');
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('city', formData.city);
            formDataToSend.append('state', formData.state);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('rating', formData.rating.toString());
            
            if (videoFile) {
                formDataToSend.append('video', videoFile);
            }

            const res = await fetch(API.TESTIMONIALS, {
                method: 'POST',
                body: formDataToSend
            });
            if (res.ok) {
                setSubmitStatus('success');
                setTimeout(() => {
                    setFormOpen(false);
                    setFormData({ name: '', city: '', state: '', description: '', rating: 5, video_url: '' });
                    setVideoFile(null);
                    setVideoPreview(null);
                    setSubmitStatus('idle');
                }, 3000);
            } else setSubmitStatus('error');
        } catch { setSubmitStatus('error'); }
    };

    const scroll = (dir: 'left' | 'right') => {
        if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
    };

    return (
        <section className="py-5 md:py-10 bg-primary overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <span className="text-amber font-bold tracking-[4px] uppercase text-xs mb-2 block">What Our Customers Say</span>
                        <h2 className="text-3xl md:text-4xl font-black text-white">Testimonials</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Scroll arrows */}
                        <button onClick={() => scroll('left')}
                            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all">
                            <i className="fa-solid fa-chevron-left text-sm" />
                        </button>
                        <button onClick={() => scroll('right')}
                            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all">
                            <i className="fa-solid fa-chevron-right text-sm" />
                        </button>
                        <button
                            onClick={() => setFormOpen(!formOpen)}
                            className="border-2 border-amber text-amber hover:bg-amber hover:text-black px-5 py-2  rounded-full text-sm font-bold transition-all"
                        >
                            {formOpen ? 'Close' : '✍ Share Your Experience'}
                        </button>
                    </div>
                </div>

                {/* Horizontal Scroll Row */}
                {testimonials.length > 0 ? (
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        {testimonials.map(t => (
                            <div
                                key={t._id}
                                className="flex-shrink-0 w-72 md:w-80 bg-white/10 backdrop-blur rounded-3xl overflow-hidden snap-start border border-white/10 hover:bg-white/15 transition-all flex flex-col"
                            >
                                {t.video_url ? (
                                    <div 
                                        onClick={() => setSelectedVideo(t.video_url!)}
                                        className="relative aspect-video bg-black group/vid cursor-pointer"
                                    >
                                        <video 
                                            src={t.video_url} 
                                            muted 
                                            playsInline
                                            loop
                                            className="w-full h-full object-cover opacity-80 group-hover/vid:opacity-100 transition-opacity"
                                            onMouseEnter={e => {
                                                const playPromise = e.currentTarget.play();
                                                if (playPromise !== undefined) {
                                                    playPromise.catch(() => { /* Autoplay was prevented */ });
                                                }
                                            }}
                                            onMouseLeave={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/vid:bg-transparent transition-all">
                                            <div className="w-12 h-12 rounded-full bg-amber text-black flex items-center justify-center shadow-xl group-hover/vid:scale-110 transition-transform">
                                                <i className="fa-solid fa-play text-lg ml-1"></i>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur px-2.5 py-1 rounded-full border border-white/10">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                            <span className="text-[10px] text-white font-black uppercase tracking-widest">Video Review</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 pb-0 flex items-start justify-between">
                                        <div className="w-10 h-10 rounded-xl bg-amber flex items-center justify-center text-black font-black text-lg">
                                            {t.name.charAt(0).toUpperCase()}
                                        </div>
                                        <i className="fa-solid fa-quote-right text-2xl text-white/20" />
                                    </div>
                                )}

                                <div className="p-6 pt-4 flex-1 flex flex-col">
                                    <StarRating rating={t.rating} />
                                    <p className={`text-white/90 text-sm leading-relaxed mt-3 mb-4 ${t.video_url ? 'line-clamp-2' : 'line-clamp-4'}`}>
                                        "{t.description}"
                                    </p>
                                    <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                                        <div>
                                            <p className="text-white font-bold text-sm">{t.name}</p>
                                            <p className="text-white/50 text-xs mt-0.5">{t.city}, {t.state}</p>
                                        </div>
                                        {t.video_url && (
                                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/40">
                                                <i className="fa-solid fa-video text-[10px]"></i>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-white/50">
                        <i className="fa-regular fa-comment-dots text-5xl mb-4 block" />
                        <p className="font-medium">No reviews yet — be the first to share!</p>
                    </div>
                )}

                {/* Video Modal */}
                {selectedVideo && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedVideo(null)}>
                        <div className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center" onClick={e => e.stopPropagation()}>
                            <video 
                                src={selectedVideo} 
                                controls 
                                autoPlay 
                                className="w-full h-full"
                            />
                            <button 
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/10"
                            >
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>
                    </div>
                )}

                {/* Submit Form */}
                {formOpen && (
                    <div className="mt-10 bg-white rounded-3xl p-6 md:p-10 max-w-2xl mx-auto shadow-2xl animate-fade-in-up">
                        <h3 className="text-xl font-bold text-primary mb-5">Share Your Experience</h3>

                        {submitStatus === 'success' ? (
                            <div className="text-center py-8">
                                <i className="fa-solid fa-circle-check text-5xl text-green-500 mb-3 block" />
                                <p className="font-bold text-lg text-gray-800">Thank you!</p>
                                <p className="text-gray-500 text-sm mt-1">Your review is under review and will appear shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-2">Your Rating</label>
                                    <StarPicker value={formData.rating} onChange={v => setFormData(f => ({ ...f, rating: v }))} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {(['name', 'city', 'state'] as const).map(field => (
                                        <div key={field}>
                                            <label className="text-sm font-bold text-gray-700 block mb-1.5 capitalize">{field}</label>
                                            <input required type="text" value={formData[field]}
                                                onChange={e => setFormData(f => ({ ...f, [field]: e.target.value }))}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1.5">Your Review</label>
                                    <textarea required rows={4} value={formData.description}
                                        onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                                        placeholder="Tell us about your experience..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none" />
                                </div>
                                <div className="bg-amber/5 p-5 rounded-2xl border border-amber/10">
                                    <label className="text-sm font-bold text-amber-700 block mb-3 flex items-center gap-2">
                                        <i className="fa-solid fa-cloud-arrow-up"></i> Upload Video Review (Optional)
                                    </label>
                                    
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="video/*"
                                        className="hidden"
                                    />

                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`relative aspect-video bg-black rounded-xl overflow-hidden mb-4 border-2 border-dashed transition-all cursor-pointer ${videoPreview ? 'border-amber/40' : 'border-amber/20 hover:border-amber/40'}`}
                                    >
                                        {videoPreview ? (
                                            <video src={videoPreview} controls className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-600/40">
                                                <i className="fa-solid fa-file-video text-4xl mb-3"></i>
                                                <p className="text-xs font-bold uppercase tracking-widest text-center px-4">Click to select video</p>
                                                <p className="text-[10px] mt-2 italic font-medium">MP4, WebM, or MOV (Min. 30s)</p>
                                            </div>
                                        )}
                                    </div>

                                    {durationError && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 animate-shake">
                                            <i className="fa-solid fa-circle-exclamation text-red-500 mt-0.5 text-xs"></i>
                                            <p className="text-red-600 text-[11px] font-bold leading-tight">{durationError}</p>
                                        </div>
                                    )}

                                    {videoFile && !durationError && (
                                        <div className="flex gap-3">
                                            <button type="button" onClick={() => fileInputRef.current?.click()}
                                                className="flex-1 bg-white border border-amber/30 text-amber-700 font-bold py-3 rounded-xl hover:bg-amber/5 transition flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                                                <i className="fa-solid fa-file-export"></i> Change File
                                            </button>
                                            <button type="button" onClick={() => { setVideoFile(null); setVideoPreview(null); setDurationError(null); }}
                                                className="w-12 bg-gray-100 text-gray-400 hover:text-red-500 rounded-xl transition flex items-center justify-center">
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        </div>
                                    )}
                                    
                                    {!videoFile && !durationError && (
                                        <button type="button" onClick={() => fileInputRef.current?.click()}
                                            className="w-full bg-amber text-black font-black py-4 rounded-xl hover:bg-amber/90 transition flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-lg shadow-amber/10">
                                            <i className="fa-solid fa-plus"></i> Select Video File
                                        </button>
                                    )}
                                    
                                    <p className="text-[10px] text-amber-600/70 mt-3 font-medium italic text-center">* Video testimonial must be at least 30 seconds long.</p>
                                </div>
                                {submitStatus === 'error' && <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>}
                                <button type="submit" disabled={submitStatus === 'loading'}
                                    className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-green-800 transition text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                                    {submitStatus === 'loading' ? <><i className="fa-solid fa-spinner animate-spin" /> Submitting...</> : <><i className="fa-solid fa-paper-plane" /> Submit Review</>}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
