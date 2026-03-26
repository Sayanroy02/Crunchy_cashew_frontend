'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const orbs = [
    { id: '1', size: 500, left: '-8%', top: '-10%', color: 'radial-gradient(circle, rgba(167,210,180,0.55) 0%, transparent 70%)', delay: 0, duration: 18 },
    { id: '2', size: 420, left: '70%', top: '5%', color: 'radial-gradient(circle, rgba(200,230,210,0.45) 0%, transparent 70%)', delay: 3, duration: 22 },
    { id: '3', size: 380, left: '15%', top: '55%', color: 'radial-gradient(circle, rgba(220,240,225,0.5) 0%, transparent 70%)', delay: 6, duration: 20 },
    { id: '4', size: 460, left: '60%', top: '60%', color: 'radial-gradient(circle, rgba(180,220,195,0.4) 0%, transparent 70%)', delay: 1.5, duration: 25 },
    { id: '5', size: 300, left: '40%', top: '25%', color: 'radial-gradient(circle, rgba(210,235,218,0.35) 0%, transparent 70%)', delay: 8, duration: 17 },
];

export default function FloatingBackground() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[-40] overflow-hidden" style={{ background: 'var(--color-bg-cream, #eef6f2)' }}>
            {orbs.map((orb) => (
                <motion.div
                    key={orb.id}
                    initial={{ x: 0, y: 0 }}
                    animate={{
                        x: [0, 30, -20, 15, 0],
                        y: [0, -25, 20, -10, 0],
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
                        filter: 'blur(40px)',
                        willChange: 'transform',
                    }}
                />
            ))}
        </div>
    );
}