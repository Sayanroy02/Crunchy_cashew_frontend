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

    return (
        <article className={`min-h-screen bg-[#FFF9E7] pb-24`}>
            {/* Header / Hero */}
            <div className="bg-bg-cream pt-32 pb-16 px-6 relative">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <Link href="/blogs" className="inline-flex items-center text-primary font-bold uppercase tracking-wider text-sm mb-8 hover:underline">
                        <i className="fa-solid fa-arrow-left mr-2"></i> Back to all articles
                    </Link>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[#006C35] mb-6 leading-tight">
                        {blog.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-gray-500 font-body text-sm font-medium">
                        <span><i className="fa-regular fa-calendar mr-2"></i>{new Date(blog.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <span>•</span>
                        <span><i className="fa-regular fa-clock mr-2"></i>{Math.max(1, Math.ceil(blog.content.length / 1000))} min read</span>
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-20 mb-6">
                <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-yellow-100 backdrop-blur-sm border-4 border-green-700">
                    {blog.image_url ? (
                        <img src={blog.image_url} alt={blog.title} className="w-full h-full object-contain" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <i className="fa-solid fa-image text-8xl"></i>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6">
                <div
                    className="prose prose-lg prose-green max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-text-dark prose-p:font-body prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl"
                    dangerouslySetInnerHTML={{ __html: formatBlogContent(blog.content) }}
                />

                {/* Tags/Share (Optional placeholder) */}
                <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex gap-3">
                        <span className="bg-gray-100 text-gray-600 font-bold text-xs px-4 py-2 rounded-full uppercase tracking-wider">Cashews</span>
                        <span className="bg-gray-100 text-gray-600 font-bold text-xs px-4 py-2 rounded-full uppercase tracking-wider">Health</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-500 uppercase">Share:</span>
                        <button className="w-10 h-10 rounded-full bg-gray-100 text-text-dark hover:bg-primary hover:text-white transition-colors flex items-center justify-center"><i className="fa-brands fa-facebook-f"></i></button>
                        <button className="w-10 h-10 rounded-full bg-gray-100 text-text-dark hover:bg-primary hover:text-white transition-colors flex items-center justify-center"><i className="fa-brands fa-twitter"></i></button>
                        <button className="w-10 h-10 rounded-full bg-gray-100 text-text-dark hover:bg-primary hover:text-white transition-colors flex items-center justify-center"><i className="fa-brands fa-linkedin-in"></i></button>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className={`max-w-4xl mx-auto px-6 mt-24`}>
                <div className="relative bg-[#006C35] rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,108,53,0.25)] border border-[#008744]/20 overflow-hidden flex flex-col items-center text-center">
                    {/* Dotted Grid Background */}
                    <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.8) 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}></div>

                    {/* Glowing background circles for modern premium aesthetic */}
                    <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#FFC72C]/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-[#008744]/30 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Content Column */}
                    <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                        {/* Premium Badge */}
                        <div className="inline-flex items-center gap-2 bg-[#004d26]/80 border border-[#FFC72C]/40 text-[#FFC72C] text-[10px] md:text-xs px-3.5 py-1 rounded-full font-bold uppercase tracking-widest mb-4">
                            <i className="fa-solid fa-award text-amber-400"></i> Premium Quality • Factory Direct
                        </div>

                        <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white mb-2 leading-tight">
                            Taste the <span className="text-[#FFC72C]">Quality Yourself</span>
                        </h2>

                        <p className="text-white/80 font-body font-medium text-xs md:text-sm max-w-md mb-6">
                            Order our premium, freshly roasted cashews direct from the factory.
                        </p>

                        <Link href="/shop" className="inline-flex items-center gap-2 bg-[#FFC72C] hover:bg-[#FFD15C] text-black font-extrabold uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_8px_20px_rgba(255,199,44,0.25)] group text-xs md:text-sm">
                            <i className="fa-solid fa-cart-shopping transition-transform duration-300 group-hover:-translate-y-0.5 mr-1"></i>
                            Shop Now
                            <i className="fa-solid fa-chevron-right text-[10px] font-black transition-transform duration-300 group-hover:translate-x-1 ml-1"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
