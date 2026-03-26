import React from 'react';

export default function SectionDivider() {
    return (
        <div className="w-full flex justify-center items-center py-0 md:py-0 pointer-events-none">
            <div className="flex items-center gap-4 opacity-70">
                <div className="w-16 md:w-32 h-px bg-gradient-to-r from-transparent to-primary/40"></div>
                <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 rotate-45 transform"></div>
                    <div className="w-2 h-2 rounded-full bg-primary/60 rotate-45 transform"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 rotate-45 transform"></div>
                </div>
                <div className="w-16 md:w-32 h-px bg-gradient-to-l from-transparent to-primary/40"></div>
            </div>
        </div>
    );
}
