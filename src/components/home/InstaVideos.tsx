"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
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

    if (videos.length === 0) return null;

    return (
        <section className="py-4 md:py-6 bg-bg-cream overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 md:px-6">

                <div className="text-center mb-8 flex flex-col items-center">
                    <span className="text-primary font-bold tracking-[4px] uppercase text-[10px] mb-1.5 block">
                        Latest Reels
                    </span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-[#0A5246] tracking-tight mb-3"
                    >
                        Crunchy on <span className="relative inline-block">
                            <span className="relative z-10">Insta</span>
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: '100%' }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="absolute bottom-1 md:bottom-2 left-0 h-3 md:h-4 bg-[#f6d70f] -z-0 opacity-80"
                            />
                        </span>
                    </motion.h2>
                </div>

                {/* Scrollable / grid row */}
                <div
                    ref={scrollRef}
                    className="flex md:grid md:grid-cols-4 gap-3 overflow-x-auto pb-3 snap-x snap-mandatory"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {videos.map((video) => (
                        <div
                            key={video._id}
                            className="flex-shrink-0 w-[200px] md:w-auto h-[340px] md:h-[380px] relative rounded-2xl overflow-hidden snap-center group cursor-pointer bg-black"
                            style={{
                                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                            }}
                            onClick={() => setSelectedVideo(video)}
                        >
                            <video
                                src={video.video_url}
                                poster={video.thumbnail_url}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105 transform transition-transform duration-700"
                            />

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />

                            {/* Play icon on hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/30">
                                    <i className="fa-solid fa-play text-lg ml-0.5"></i>
                                </div>
                            </div>

                            {/* Bottom info */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
                                <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 drop-shadow">
                                    {video.title}
                                </h3>

                                {video.link && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(video.link, "_blank");
                                        }}
                                        className="bg-white/10 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider w-max transition-colors flex items-center gap-1.5"
                                    >
                                        <i className="fa-brands fa-instagram text-xs"></i>
                                        View on Insta
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                {selectedVideo && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-5 right-5 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/10 backdrop-blur-sm"
                        >
                            <i className="fa-solid fa-xmark text-lg"></i>
                        </button>

                        <div
                            className="relative w-full max-w-[380px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
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

                            {/* Title overlay */}
                            <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/75 to-transparent pointer-events-none">
                                <h3 className="text-white font-semibold text-sm drop-shadow">
                                    {selectedVideo.title}
                                </h3>
                            </div>

                            {/* Instagram link */}
                            {selectedVideo.link && (
                                <a
                                    href={selectedVideo.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute bottom-[72px] right-3 bg-white/10 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg"
                                >
                                    <i className="fa-brands fa-instagram text-lg"></i>
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}