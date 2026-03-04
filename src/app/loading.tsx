import React from 'react';

export default function Loading() {
    return (
        <div className="w-full min-h-screen bg-bg-cream flex flex-col pt-[80px]">
            {/* Generic Skeleton Header Area */}
            <div className="w-full h-[60vh] bg-gray-200 animate-pulse"></div>

            {/* Generic Content Area */}
            <div className="container mx-auto px-6 py-12 flex flex-col gap-8">
                <div className="h-10 bg-gray-300 rounded w-1/3 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm h-80 flex flex-col">
                            <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                            <div className="p-4 flex flex-col gap-4">
                                <div className="h-6 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                                <div className="h-10 bg-gray-200 rounded w-full mt-auto animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
