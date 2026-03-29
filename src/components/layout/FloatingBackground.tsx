'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const orbs = [
    { id: '1', size: 500, left: '-8%', top: '-10%', color: 'radial-gradient(circle, rgba(246,176,0,0.15) 0%, transparent 70%)', delay: 0, duration: 25 },
    { id: '2', size: 420, left: '70%', top: '5%', color: 'radial-gradient(circle, rgba(255,254,113,0.2) 0%, transparent 70%)', delay: 5, duration: 30 },
    { id: '3', size: 380, left: '20%', top: '55%', color: 'radial-gradient(circle, rgba(251,178,27,0.12) 0%, transparent 70%)', delay: 10, duration: 22 },
];

export default function FloatingBackground() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[-40] overflow-hidden" style={{ background: '#FFF9E7' }}>
            {orbs.map((orb) => (
                <motion.div
                    key={orb.id}
                    initial={{ x: 0, y: 0 }}
                    animate={{
                        x: [0, 20, -15, 10, 0],
                        y: [0, -15, 15, -5, 0],
                    }}
                    transition={{
                        duration: orb.duration,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut',
                        delay: orb.delay,
                    }}
                    style={{
                        position: 'absolute',
                        left: orb.left,
                        top: orb.top,
                        width: orb.size,
                        height: orb.size,
                        background: orb.color,
                        borderRadius: '50%',
                        filter: 'blur(20px)',
                        willChange: 'transform',
                    }}
                />
            ))}
        </div>
    );
}