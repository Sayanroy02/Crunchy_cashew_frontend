import React from 'react';
import Link from 'next/link';

export interface BlogCardData {
    _id: string;
    title: string;
    image_url?: string;
    content: string;
    created_at: string;
    author?: string;
    featured?: boolean;
    category?: string;
    tags?: string[];
}

interface BlogCardProps {
    blog: BlogCardData;
    /** Extra classes applied to the root <Link> (e.g. 'hidden md:flex' for preview grid) */
    className?: string;
    searchTerm?: string;
}

const CATEGORY_ICONS: Record<string, string> = {
    'All': 'fa-solid fa-border-all',
    'Health': 'fa-solid fa-heart-pulse',
    'Health Articles': 'fa-solid fa-heart-pulse',
    'Recipes': 'fa-solid fa-utensils',
    'Recipes Blog': 'fa-solid fa-utensils',
    'Sustainability': 'fa-solid fa-leaf',
    'Newsroom': 'fa-solid fa-newspaper',
};

const CATEGORY_COLORS: Record<string, string> = {
    'Health': 'bg-green-600 text-white',
    'Health Articles': 'bg-green-600 text-white',
    'Recipes': 'bg-[#bb3e00] text-white',
    'Recipes Blog': 'bg-[#bb3e00] text-white',
    'Sustainability': 'bg-sky-400 text-white',
    'Newsroom': 'bg-indigo-600 text-white',
    'Uncategorised': 'bg-gray-100 text-gray-600',
};

const getCategoryStyle = (category: string) => {
    const key = Object.keys(CATEGORY_COLORS).find(
        k => k.toLowerCase() === category.toLowerCase()
    );
    return key ? CATEGORY_COLORS[key] : CATEGORY_COLORS['Uncategorised'];
};

const getCategoryIcon = (category: string) => {
    const key = Object.keys(CATEGORY_ICONS).find(
        k => k.toLowerCase() === category.toLowerCase()
    );
    return key ? CATEGORY_ICONS[key] : 'fa-solid fa-tag';
};

export default function BlogCard({ blog, className = '', searchTerm = '' }: BlogCardProps) {
    const highlightText = (text: string, highlight: string) => {
        if (!highlight.trim()) return text;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === highlight.toLowerCase() ? (
                        <span key={i} className="bg-[#F6B000] text-black px-1 rounded-sm">{part}</span>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    };

    const plainContent = (blog.content || '').replace(/<[^>]*>?/gm, '');

    return (
        <Link
            href={`/blogs/${blog._id}`}
            className={`bg-white rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 shadow-md hover:shadow-xl flex flex-col border border-gray-100 ${className}`}
        >
            {/* ── Cover Image ── */}
            <div className="w-full h-56 relative overflow-hidden bg-gray-50 flex-shrink-0">
                {blog.image_url ? (
                    <img
                        src={blog.image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <i className={`${CATEGORY_ICONS[blog.category || 'All'] || 'fa-solid fa-image'} text-5xl text-gray-200`} />
                    </div>
                )}

                {/* Featured Badge — top left */}
                {blog.featured && (
                    <span className="absolute top-4 left-4 bg-green-700 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-10">
                        <i className="fa-solid fa-star" /> Featured
                    </span>
                )}

                {/* Date — bottom right */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    {new Date(blog.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
            </div>

            {/* ── Content ── */}
            <div className="p-7 flex flex-col flex-grow">
                {(blog.author || blog.category) && (
                    <div className="flex items-center justify-between gap-2.5 mb-3">
                        {blog.author ? (
                            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                <i className="fa-solid fa-user-pen text-primary" />
                                {blog.author}
                            </span>
                        ) : (
                            <div />
                        )}
                        {blog.category && (
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm ${getCategoryStyle(blog.category)}`}>
                                <i className={`${getCategoryIcon(blog.category)} mr-1`} />
                                {blog.category}
                            </span>
                        )}
                    </div>
                )}

                <h3 className="text-xl font-bold font-heading text-gray-900 mb-3 line-clamp-2 group-hover:text-black transition-colors">
                    {highlightText(blog.title, searchTerm)}
                </h3>

                <p className="text-gray-500 line-clamp-3 mb-5 flex-grow leading-relaxed text-sm">
                    {highlightText(plainContent, searchTerm)}
                </p>

                <span className="font-bold flex items-center gap-2 text-sm mt-auto group-hover:gap-3 transition-all" style={{ color: '#000000' }}>
                    Read Article <i className="fa-solid fa-arrow-right-long" style={{ color: '#F6B000' }} />
                </span>
            </div>
        </Link>
    );
}
