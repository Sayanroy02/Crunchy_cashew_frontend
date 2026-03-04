'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function FloatingBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Create a deterministic array of elements to map over
    const activeAssets = [
        { id: '1', size: 80, delay: 0, src: '/images/cashews/1.jpg', left: '5%', top: '10%' },
        { id: '2', size: 150, delay: 2, src: '/images/cashews/2.jpg', left: '85%', top: '30%' },
        { id: '3', size: 100, delay: 5, src: '/images/cashews/3.webp', left: '20%', top: '60%' },
        { id: '4', size: 60, delay: 1.5, src: '/images/cashews/1.jpg', left: '75%', top: '75%' },
        { id: '5', size: 200, delay: 4, src: '/images/cashews/2.jpg', left: '10%', top: '90%' },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none z-[-40] overflow-hidden opacity-20">
            {activeAssets.map((asset) => (
                <motion.div
                    key={asset.id}
                    initial={{ y: 0, rotate: 0 }}
                    animate={{
                        y: [0, -40, 0, 40, 0],
                        rotate: [0, 10, -10, 5, 0],
                        x: [0, 20, 0, -20, 0]
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: asset.delay
                    }}
                    style={{
                        position: 'absolute',
                        left: asset.left,
                        top: asset.top,
                        width: asset.size,
                        height: asset.size,
                    }}
                >
                    <img
                        src={asset.src}
                        alt="floating cashew"
                        className="w-full h-full object-cover rounded-full filter blur-[1px] mix-blend-multiply"
                    />
                </motion.div>
            ))}
        </div>
    );
}
