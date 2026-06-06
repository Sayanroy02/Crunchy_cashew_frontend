import React from 'react';

export default function Loading() {
    return (
        <div className="bg-bg-cream min-h-screen py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="w-32 h-6 bg-gray-300 rounded-md mb-10 animate-pulse"></div>

                <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                    {/* Image Section Skeleton */}
                    <div className="md:w-1/2 bg-gray-100 p-12 flex justify-center items-center h-[500px]">
                        <div className="w-full max-w-sm h-full bg-gray-200 animate-pulse rounded-2xl"></div>
                    </div>

                    {/* Details Section Skeleton */}
                    <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                        <div className="w-24 h-4 bg-gray-300 rounded-md mb-4 animate-pulse"></div>
                        <div className="w-2/3 h-10 bg-gray-300 rounded-md mb-6 animate-pulse"></div>
                        <div className="w-3/4 h-10 bg-gray-300 rounded-md mb-8 animate-pulse"></div>

                        <div className="flex flex-col gap-3 mb-8">
                            <div className="w-full h-4 bg-gray-200 rounded-md animate-pulse"></div>
                            <div className="w-full h-4 bg-gray-200 rounded-md animate-pulse"></div>
                            <div className="w-4/5 h-4 bg-gray-200 rounded-md animate-pulse"></div>
                        </div>

                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-24 h-10 bg-gray-300 rounded-md animate-pulse"></div>
                            <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>

                        {/* Add to Cart Skeleton */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-200 rounded-full w-32 h-12 bg-gray-100 animate-pulse"></div>
                            <div className="flex-1 bg-gray-300 rounded-full h-12 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
