'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function MainContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin') ?? false;

    return (
        <main className={isAdmin ? "min-h-screen" : "min-h-screen pt-[56px] md:pt-[72px]"}>
            {children}
        </main>
    );
}
