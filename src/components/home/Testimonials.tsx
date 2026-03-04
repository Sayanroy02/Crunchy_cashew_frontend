'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Testimonial {
    _id: string;
    name: string;
    city: string;
    state: string;
    description: string;
    rating?: number;
}

function StarRating({ rating = 5 }: { rating?: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <i
                    key={star}
                    className={`text-sm ${star <= rating ? 'fa-solid fa-star text-[#FBB21B]' : 'fa-regular fa-star text-gray-300'}`}
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
                    <i className={`${(hover || value) >= star ? 'fa-solid fa-star text-[#FBB21B]' : 'fa-regular fa-star text-gray-300'}`} />
                </button>
            ))}
        </div>
    );
}

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', city: '', state: '', description: '', rating: 5 });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/cms/testimonials')
            .then(res => res.json())
            .then(data => { if (Array.isArray(data) && data.length > 0) setTestimonials(data); })
            .catch(err => console.error('Failed to fetch testimonials', err));
    }, []);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus('loading');
        try {
            const res = await fetch('http://localhost:8000/api/cms/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setSubmitStatus('success');
                setTimeout(() => {
                    setFormOpen(false);
                    setFormData({ name: '', city: '', state: '', description: '', rating: 5 });
                    setSubmitStatus('idle');
                }, 3000);
            } else setSubmitStatus('error');
        } catch { setSubmitStatus('error'); }
    };

    const scroll = (dir: 'left' | 'right') => {
        if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
    };

    return (
        <section className="py-16 md:py-24 bg-[#0c5c2b] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                    <div>
                        <span className="text-[#FBB21B] font-bold tracking-[4px] uppercase text-xs mb-2 block">What Our Customers Say</span>
                        <h2 className="text-3xl md:text-4xl font-black text-white">Voices of Our Community</h2>
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
                            className="border-2 border-[#FBB21B] text-[#FBB21B] hover:bg-[#FBB21B] hover:text-black px-5 py-2  rounded-full text-sm font-bold transition-all"
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
                                className="flex-shrink-0 w-72 md:w-80 bg-white/10 backdrop-blur rounded-2xl p-6 snap-start border border-white/10 hover:bg-white/15 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#FBB21B] flex items-center justify-center text-black font-black text-lg">
                                        {t.name.charAt(0).toUpperCase()}
                                    </div>
                                    <i className="fa-solid fa-quote-right text-2xl text-white/20" />
                                </div>
                                <StarRating rating={t.rating} />
                                <p className="text-white/90 text-sm leading-relaxed mt-3 mb-4 line-clamp-4">
                                    "{t.description}"
                                </p>
                                <div className="border-t border-white/10 pt-3">
                                    <p className="text-white font-bold text-sm">{t.name}</p>
                                    <p className="text-white/50 text-xs mt-0.5">{t.city}, {t.state}</p>
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

                {/* Submit Form */}
                {formOpen && (
                    <div className="mt-10 bg-white rounded-3xl p-6 md:p-10 max-w-2xl mx-auto shadow-2xl animate-fade-in-up">
                        <h3 className="text-xl font-bold text-[#0c5c2b] mb-5">Share Your Experience</h3>

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
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0c5c2b]" />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1.5">Your Review</label>
                                    <textarea required rows={4} value={formData.description}
                                        onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                                        placeholder="Tell us about your experience..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0c5c2b] resize-none" />
                                </div>
                                {submitStatus === 'error' && <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>}
                                <button type="submit" disabled={submitStatus === 'loading'}
                                    className="w-full bg-[#0c5c2b] text-white font-bold py-3 rounded-xl hover:bg-green-800 transition text-sm flex items-center justify-center gap-2 disabled:opacity-60">
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
