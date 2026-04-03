'use client';

import React, { useEffect, useState, useRef } from 'react';
import { COLORS } from '@/constants/styles';

interface SectionHeadingProps {
    text: string;
    highlight: string;
    className?: string;
    textColor?: string;
    highlightColor?: string;
}

export default function SectionHeading({ 
    text, 
    highlight, 
    className = "mb-3",
    textColor,
    highlightColor
}: SectionHeadingProps) {
    const ref = useRef<HTMLHeadingElement>(null);
    const [vis, setVis] = useState(false);

    const finalTextColor = textColor || COLORS.heading;
    const finalHighlightColor = highlightColor || COLORS.highlight;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVis(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <h2
            ref={ref}
            className={`text-3xl md:text-5xl font-black tracking-tight ${className}`}
            style={{
                color: finalTextColor,
                opacity: vis ? 1 : 0,
                transform: vis ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 0.6s 0.1s ease, transform 0.6s 0.1s ease',
            }}
        >
            {text}{' '}
            <span
                style={{
                    color: vis ? finalHighlightColor : finalTextColor,
                    transition: 'color 0.8s 0.5s ease',
                }}
            >
                {highlight}
            </span>
        </h2>
    );
}
