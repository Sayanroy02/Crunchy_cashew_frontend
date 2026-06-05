'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { API } from '@/constants/api';
import { COLORS } from '@/constants/styles';

interface Blog {
    _id: string;
    title: string;
    image_url?: string;
    content: string;
    created_at: string;
    author?: string;
    category?: string;
    tags?: string[] | string;
}

function formatBlogContent(content: string): string {
    if (!content) return "";

    // If it already looks like formatted HTML, return as is
    if (/<[a-z][\s\S]*>/i.test(content)) {
        return content;
    }

    // Step 1: Clean duplicate title & "Introduction"
    let cleanText = content.trim();

    // Remove duplicate starting title (starts with 🥜 and ends with "Introduction")
    cleanText = cleanText.replace(/^🥜[^\n]+?Introduction/i, "Introduction");

    // Step 2: Separate sections with newlines using emojis and headings as boundaries
    cleanText = cleanText
        .replace(/(Introduction)/gi, "\n\n$1\n\n")
        .replace(/(🌿\s*What\s+Are\s+Cashews\??)/gi, "\n\n$1\n\n")
        .replace(/(💪\s*Nutritional\s+Value\s+of\s+Cashews)/gi, "\n\n$1\n\n")
        .replace(/(Key\s+Nutrients\s+in\s+Cashews:)/gi, "\n\n$1\n\n")
        .replace(/(🌟\s*Health\s+Benefits\s+of\s+Cashews)/gi, "\n\n$1\n\n")
        .replace(/(1\.\s*❤️\s*Good\s+for\s+Heart\s+Health)/gi, "\n\n$1\n\n")
        .replace(/(2\.\s*⚡\s*Boosts\s+Energy)/gi, "\n\n$1\n\n")
        .replace(/(3\.\s*🧠\s*Supports\s+Brain\s+Function)/gi, "\n\n$1\n\n")
        .replace(/(4\.\s*🦴\s*Strengthens\s+Bones)/gi, "\n\n$1\n\n")
        .replace(/(5\.\s*✨\s*Improves\s+Skin\s+&\s+Hair)/gi, "\n\n$1\n\n")
        .replace(/(Perfect\s+for:)/gi, "\n\n$1 ")
        .replace(/(Office\s+snacks\s+Gym\s+diets\s+Travel\s+food)/gi, "\n\n$1\n\n")
        .replace(/(These\s+nutrients\s+help)/gi, "\n\n$1")
        .replace(/(Unlike\s+many\s+other\s+nuts)/gi, "\n\n$1")
        .replace(/(They\s+are\s+widely\s+loved)/gi, "\n\n$1")
        .replace(/(Whether\s+you\s+enjoy)/gi, "\n\n$1")
        .replace(/(In\s+this\s+blog)/gi, "\n\n$1");

    // Clean up multiple sequential newlines
    cleanText = cleanText.replace(/\n{3,}/g, "\n\n");

    const segments = cleanText.split(/\n\n+/);

    const htmlSegments = segments.map(segment => {
        segment = segment.trim();
        if (!segment) return "";

        // Introduction header
        if (/^Introduction$/i.test(segment)) {
            return `<h2 class="text-2xl font-bold text-[#006C35] mt-6 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                <i class="fa-solid fa-book-open text-[#F6B000] text-lg"></i> Introduction
            </h2>`;
        }

        // Section headers
        if (/^(🌿|💪|🌟)/.test(segment)) {
            return `<h2 class="text-2xl font-bold text-[#006C35] mt-10 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                ${segment}
            </h2>`;
        }

        // Subsection headers
        if (/^\d\./.test(segment)) {
            return `<h3 class="text-xl font-bold text-text-dark mt-8 mb-3 flex items-center gap-2">
                ${segment}
            </h3>`;
        }

        // Key Nutrients
        if (/^Key\s+Nutrients/i.test(segment)) {
            return `<h3 class="text-lg font-extrabold text-[#006C35] mt-6 mb-2 uppercase tracking-wide">
                ${segment}
            </h3>`;
        }

        // Nutrients Bullet points
        if (segment.includes("Protein") && segment.includes("Healthy fats") && segment.includes("Fiber")) {
            const items = [
                "Protein (for muscle repair and growth)",
                "Healthy fats (monounsaturated and polyunsaturated fats)",
                "Fiber (for healthy digestion)",
                "Vitamins (Vitamin E, Vitamin K, Vitamin B6)",
                "Minerals (Magnesium, Zinc, Iron, Copper)"
            ];
            return `<ul class="list-disc pl-6 space-y-2.5 my-4 text-gray-700">
                ${items.map(item => {
                const parts = item.split(" (");
                return `<li><strong class="text-text-dark">${parts[0]}</strong>${parts[1] ? " (" + parts[1] : ""}</li>`;
            }).join("")}
            </ul>`;
        }

        // Bullet point parsing for "Perfect for:" list
        if (/^Perfect\s+for:/i.test(segment)) {
            return `<p class="font-bold text-[#006C35] mt-4 mb-1">${segment}</p>`;
        }

        if (segment.includes("Office snacks") && segment.includes("Gym diets") && segment.includes("Travel food")) {
            const items = ["Office Snacks", "Gym Diets & Post-Workout", "Travel Food & Healthy Snacking"];
            return `<ul class="list-disc pl-6 space-y-2 my-3 text-gray-700">
                ${items.map(item => `<li><strong class="text-text-dark">${item}</strong></li>`).join("")}
            </ul>`;
        }

        // Default Paragraph styling
        return `<p class="text-gray-700 leading-relaxed mb-5 text-base md:text-lg font-body">${segment}</p>`;
    });

    return htmlSegments.filter(s => s !== "").join("\n");
}

export default function BlogDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!id) return;

        fetch(API.BLOG_DETAIL(id))
            .then(res => {
                if (!res.ok) throw new Error('Blog not found');
                return res.json();
            })
            .then(data => {
                setBlog(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load blog", err);
                setError(true);
                setLoading(false);
            });
    }, [id]);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 3000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-cream pt-32 pb-24 px-6 flex justify-center">
                <div className="max-w-3xl w-full">
                    <div className="h-12 bg-gray-200 rounded-lg w-3/4 animate-pulse mb-6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse mb-12"></div>
                    <div className="h-96 bg-gray-200 rounded-3xl w-full animate-pulse mb-12"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-bg-cream pt-32 pb-24 flex items-center justify-center px-6">
                <div className="text-center max-w-lg">
                    <i className="fa-solid fa-triangle-exclamation text-6xl text-highlight mb-6"></i>
                    <h1 className="text-4xl font-heading font-bold text-text-dark mb-4">Article Not Found</h1>
                    <p className="text-gray-600 font-body mb-8 text-lg">
                        The blog post you're looking for doesn't exist or has been removed.
                    </p>
                    <Link href="/blogs" className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-black transition-colors">
                        Back to Blogs <i className="fa-solid fa-arrow-left ml-2"></i>
                    </Link>
                </div>
            </div>
        );
    }

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const plainText = (blog.content || '').replace(/<[^>]*>?/gm, '');
    const previewText = plainText.slice(0, 120) + (plainText.length > 120 ? '...' : '');

    const shareOnWhatsApp = () => {
        let message = `Check out this article: *${blog.title}*\n\n${previewText}\n\n`;
        if (blog.image_url) {
            message += `Image: ${blog.image_url}\n\n`;
        }
        message += `Read more here: ${shareUrl}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
    };

    const shareOnInstagram = async () => {
        const text = `Check out this article: ${blog.title}\n\n${previewText}`;
        let fullShareString = `${text}\n\n`;
        if (blog.image_url) {
            fullShareString += `Image: ${blog.image_url}\n\n`;
        }
        fullShareString += `Read here: ${shareUrl}`;

        // Attempt Native Sharing first
        if (navigator.share) {
            try {
                await navigator.share({
                    title: blog.title,
                    text: text,
                    url: shareUrl,
                });
                return;
            } catch (err) {
                console.log('Native share failed/cancelled:', err);
            }
        }

        // Fallback: Copy to clipboard and display premium Toast
        try {
            await navigator.clipboard.writeText(fullShareString);
            showToast("Copied to clipboard! Paste it to share on Instagram.");
        } catch (err) {
            showToast("Failed to copy link. Please copy the URL from browser address bar.");
        }
    };

    // Extract hashtags from blog tags correctly (supporting both string and array)
    let hashtags: string[] = [];
    if (blog.tags) {
        if (Array.isArray(blog.tags)) {
            hashtags = blog.tags;
        } else if (typeof blog.tags === 'string') {
            hashtags = (blog.tags as string).split(',').map(t => t.trim()).filter(Boolean);
        }
    }

    return (
        <article className={`min-h-screen bg-[#FFF9E7] pb-24 relative`}>
            {/* Elegant Floating Notification Toast */}
            {toastMsg && (
                <div className="fixed bottom-10 right-10 z-[999] bg-[#006C35] border border-white/20 text-[#FFF9E7] font-bold py-3 px-6 rounded-2xl shadow-[0_15px_40px_rgba(0,108,53,0.35)] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <i className="fa-solid fa-circle-check text-[#FFC72C] text-lg"></i>
                    <span>{toastMsg}</span>
                </div>
            )}

            {/* Top Spacer for the fixed main navbar */}
            <div className="h-20 w-full" />

            {/* Sticky Header Container */}
            <div className="lg:sticky lg:top-[80px] relative z-30 bg-[#FFF9E7]/95 backdrop-blur-md border-b border-gray-200/60 shadow-sm pt-8 pb-4 mb-10 transition-all duration-300">
                {/* Back Button and Title on top */}
                <div className="px-6 max-w-7xl mx-auto mb-4">
                    <div className="flex items-center gap-4 md:gap-6 relative z-10 text-left">
                        <Link href="/blogs" className="flex-shrink-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-gray-200 text-[#006C35] hover:bg-[#006C35] hover:text-white transition-all shadow-sm active:scale-90" aria-label="Back to all articles">
                            <i className="fa-solid fa-arrow-left text-sm md:text-base"></i>
                        </Link>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-extrabold text-[#006C35] leading-tight">
                            {blog.title}
                        </h1>
                    </div>
                </div>

                {/* Mobile-only Sticky Image (visible on mobile only, sticks under the header) */}
                <div className="px-6 max-w-7xl mx-auto mb-4 md:hidden">
                    <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-xl bg-yellow-100/50 border-2 border-[#006C35] transition-all">
                        {blog.image_url ? (
                            <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <i className="fa-solid fa-image text-5xl"></i>
                            </div>
                        )}
                    </div>
                </div>

                {/* Metadata & Share Row (collapses when scrolled) */}
                <div className={`px-6 max-w-7xl mx-auto overflow-hidden transition-all duration-300 ${scrolled ? 'max-h-0 opacity-0 pointer-events-none mt-0' : 'max-h-40 opacity-100 mt-2'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Left: Category tag, date, minutes read */}
                        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-500 font-medium font-body">
                            {blog.category && (
                                <span className="bg-[#006C35]/10 text-[#006C35] font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider border border-[#006C35]/15 flex items-center gap-1.5">
                                    <i className="fa-solid fa-tags text-[#F6B000]"></i>
                                    {blog.category}
                                </span>
                            )}
                            <span><i className="fa-regular fa-calendar mr-1.5"></i>{new Date(blog.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            <span>•</span>
                            <span><i className="fa-regular fa-clock mr-1.5"></i>{Math.max(1, Math.ceil(blog.content.length / 1000))} min read</span>
                        </div>

                        {/* Right: WhatsApp Share Button */}
                        <button
                            onClick={shareOnWhatsApp}
                            className="hidden sm:inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap self-start sm:self-auto"
                        >
                            <i className="fa-brands fa-whatsapp text-sm"></i> Share on WhatsApp
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
                {/* Left Column (Sticky Image on Desktop, hidden on Mobile because it's in the sticky header) */}
                <div className="hidden md:block md:sticky md:top-[260px] z-20 w-full">
                    <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-yellow-100/50 border-4 border-[#006C35] transition-all">
                        {blog.image_url ? (
                            <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <i className="fa-solid fa-image text-8xl"></i>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column (Scrollable Content) */}
                <div className="w-full">
                    <div
                        className="prose prose-lg prose-green max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-text-dark prose-p:font-body prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl"
                        dangerouslySetInnerHTML={{ __html: formatBlogContent(blog.content) }}
                    />

                {/* Hashtags and Share Row */}
                <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    {/* Hashtags on the Left */}
                    <div className="flex flex-wrap gap-2">
                        {hashtags.length > 0 ? (
                            hashtags.map((tag, idx) => {
                                const cleanTag = tag.trim();
                                const displayTag = cleanTag.startsWith('#') ? cleanTag : `#${cleanTag}`;
                                return (
                                    <span key={idx} className="bg-gray-100 text-gray-600 font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                                        {displayTag}
                                    </span>
                                );
                            })
                        ) : (
                            <>
                                <span className="bg-gray-100 text-gray-600 font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">#cashews</span>
                                {blog.category && (
                                    <span className="bg-gray-100 text-gray-600 font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                                        #{blog.category.toLowerCase()}
                                    </span>
                                )}
                            </>
                        )}
                    </div>

                    {/* Share buttons on the Right */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest mr-1 hidden sm:inline">Share:</span>
                        <button
                            onClick={shareOnWhatsApp}
                            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap"
                        >
                            <i className="fa-brands fa-whatsapp text-sm"></i> WhatsApp
                        </button>
                        <button
                            onClick={shareOnInstagram}
                            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap"
                        >
                            <i className="fa-brands fa-instagram text-sm"></i> Instagram
                        </button>
                    </div>
                </div>
            </div>
            </div>

            {/* CTA */}
            <div className={`max-w-7xl mx-auto px-6 mt-16`}>
                <div className="relative bg-[#006C35] rounded-3xl p-6 md:py-4 md:px-10 shadow-[0_20px_50px_rgba(0,108,53,0.25)] border border-[#008744]/20 overflow-hidden flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4 md:gap-6">
                    {/* Dotted Grid Background */}
                    <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.8) 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}></div>

                    {/* Glowing background circles for modern premium aesthetic */}
                    <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#FFC72C]/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-[#008744]/30 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Content Column */}
                    <div className="relative z-10 flex flex-col items-center md:items-start">
                        {/* Premium Badge */}
                        <div className="flex items-center justify-center md:justify-start gap-3 text-[#FFC72C] text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-2">
                            <div className="h-[1px] w-4 md:w-6 bg-[#FFC72C]/50" />
                            <span>Premium Quality • Factory Direct</span>
                            <div className="h-[1px] w-4 md:w-6 bg-[#FFC72C]/50" />
                        </div>

                        <h2 className="text-xl md:text-2xl font-heading font-extrabold text-white mb-1 leading-tight">
                            Taste the <span className="text-[#FFC72C]">Quality Yourself</span>
                        </h2>

                        <p className="text-white/80 font-body font-medium text-xs">
                            Buy Export-Quality Cashews Direct from Factory
                        </p>
                    </div>

                    <div className="relative z-10 flex-shrink-0">
                        <Link href="/shop" className="inline-flex items-center gap-2 bg-[#FFC72C] hover:bg-[#FFD15C] text-black font-extrabold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_8px_20px_rgba(255,199,44,0.25)] group text-xs">
                            <i className="fa-solid fa-cart-shopping transition-transform duration-300 group-hover:-translate-y-0.5 mr-1"></i>
                            Shop Now
                            <i className="fa-solid fa-chevron-right text-[9px] font-black transition-transform duration-300 group-hover:translate-x-1 ml-1"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
