'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SplashScreen component that displays a full-screen video on the first visit of a session.
 * Features:
 * - Full-screen responsive video
 * - Smooth fade-out transition
 * - Session-based persistence
 * - Scroll locking
 * - Skip button with micro-interaction
 */
const SplashScreen = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Check if user has seen splash screen in this session
        const hasSeen = sessionStorage.getItem('has-seen-splash');
        if (!hasSeen) {
            setIsVisible(true);
            // Lock background scrolling while splash is active
            document.body.style.overflow = 'hidden';
        }

        return () => {
            // Ensure scroll is restored if component unmounts unexpectedly
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem('has-seen-splash', 'true');
        // Restore background scrolling after a slight delay to match fade animation
        setTimeout(() => {
            document.body.style.overflow = 'unset';
        }, 800);
    };

    if (!isMounted) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="splash-screen"
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        filter: 'blur(10px)',
                        scale: 1.1
                    }}
                    transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
                    className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden"
                >
                    {/* Background overlay */}
                    <div className="absolute inset-0 bg-white z-[-1]" />

                    <div className="relative w-full max-w-2xl px-4 flex items-center justify-center">
                        <video
                            autoPlay
                            muted
                            playsInline
                            onEnded={handleClose}
                            className="w-full h-auto max-h-[70vh] object-contain"
                        >
                            <source src="/videos/min_1_1-transcode.webm" type="video/webm" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    {/* Skip Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClose}
                        className="absolute bottom-12 right-12 z-10 px-6 py-2.5 bg-black/5 hover:bg-black/10 backdrop-blur-sm border border-black/10 text-gray-800 rounded-xl font-semibold transition-all flex items-center gap-2 group"
                    >
                        <span className="text-sm">Skip</span>
                        <i className="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                    </motion.button>

                    {/* Bottom Indicator (Progress hint) */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 5, ease: "linear" }} // Approximation of video length if known, or just a hint
                        className="absolute bottom-0 left-0 right-0 h-1 bg-[#FBB21B]/30 origin-left"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;
