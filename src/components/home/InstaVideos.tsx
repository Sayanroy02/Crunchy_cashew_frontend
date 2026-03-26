"use client";

import React, { useEffect, useState, useRef } from "react";
import { API } from "@/constants/api";

interface InstaVideo {
    _id: string;
    title: string;
    link?: string;
    video_url: string;
    thumbnail_url: string;
}

export default function InstaVideos() {
    const [videos, setVideos] = useState<InstaVideo[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<InstaVideo | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch(API.INSTA_VIDEOS)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) setVideos(data);
            })
            .catch((err) => console.error("Failed to fetch insta videos", err));
    }, []);

    if (videos.length === 0) return null; // Don't show section if no videos exist

    return (
        <section className="py-16 md:py-24 bg-bg-cream overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <span className="text-primary font-bold tracking-[4px] uppercase text-xs mb-2 block">
                            Latest Reels
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-black tracking-tight">
                            Insta Videos
                        </h2>
                    </div>
                    {/* Optional: Add "Follow us on Instagram" button here in the future */}
                </div>

                {/* Video Grid / Swipeable Row */}
                <div
                    ref={scrollRef}
                    className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                    style={{ scrollbarWidth: "none" }}
                >
                    {videos.map((video) => (
                        <div
                            key={video._id}
                            className="flex-shrink-0 w-[280px] md:w-auto h-[500px] md:h-[550px] relative rounded-3xl overflow-hidden snap-center group cursor-pointer shadow-lg bg-black"
                            onClick={() => setSelectedVideo(video)}
                        >
                            <video
                                src={video.video_url}
                                poster={video.thumbnail_url}
                                muted
                                loop
                                playsInline
                                onMouseEnter={(e) => {
                                    // Play with promise handling to avoid uncaught exceptions
                                    const playPromise = e.currentTarget.play();
                                    if (playPromise !== undefined) {
                                        playPromise.catch(() => { });
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.pause();
                                }}
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                            />

                            {/* Overlay Gradient for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                            {/* Play Icon - Appears on hover for desktop, always center for mobile? */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/40 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                    <i className="fa-solid fa-play text-2xl ml-1"></i>
                                </div>
                            </div>

                            {/* Video Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-3">
                                <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-lg">
                                    {video.title}
                                </h3>

                                {video.link && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(video.link, "_blank");
                                        }}
                                        className="bg-white/10 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider w-max transition-colors flex items-center gap-2"
                                    >
                                        <i className="fa-brands fa-instagram text-sm"></i>
                                        View on Insta
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Full Screen Video Modal */}
                {selectedVideo && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/10 backdrop-blur-sm"
                        >
                            <i className="fa-solid fa-xmark text-xl"></i>
                        </button>

                        <div
                            className="relative w-full max-w-[450px] aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <video
                                src={selectedVideo.video_url}
                                poster={selectedVideo.thumbnail_url}
                                controls
                                autoPlay
                                playsInline
                                className="w-full h-full object-contain bg-black"
                            />

                            {/* Overlay Title when playing */}
                            <div className="absolute top-0 inset-x-0 p-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                                <h3 className="text-white font-bold text-lg drop-shadow-md">
                                    {selectedVideo.title}
                                </h3>
                            </div>

                            {/* Insta Link floating button */}
                            {selectedVideo.link && (
                                <a
                                    href={selectedVideo.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute bottom-[80px] right-4 bg-white/10 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg"
                                >
                                    <i className="fa-brands fa-instagram text-xl"></i>
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
