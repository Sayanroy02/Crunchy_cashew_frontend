"use client";

import React, { useEffect, useState, useRef } from "react";
import { API } from "@/constants/api";
import { COLORS } from "@/constants/styles";
import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

interface InstaVideo {
    _id: string;
    title: string;
    link?: string;
    video_url: string;
    thumbnail_url: string;
}


const VideoItem = ({ video, onClick }: { video: InstaVideo; onClick: () => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0.5 }
        );
        if (videoRef.current) observer.observe(videoRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!videoRef.current) return;
        if (isInView) {
            videoRef.current.play().catch(() => { });
        } else {
            videoRef.current.pause();
        }
    }, [isInView]);

    return (
        <div
            className="flex-shrink-0 w-[200px] md:w-auto h-[340px] md:h-[380px] relative rounded-2xl overflow-hidden snap-center group cursor-pointer bg-black"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
            onClick={onClick}
        >
            <video
                ref={videoRef}
                src={video.video_url}
                poster={video.thumbnail_url}
                muted
                loop
                playsInline
                preload="none"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105 transform transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/30">
                    <i className="fa-solid fa-play text-lg ml-0.5"></i>
                </div>
            </div>
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
    );
};

export default function InstaVideos() {
    const [videos, setVideos] = useState<InstaVideo[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<InstaVideo | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetch(API.INSTA_VIDEOS)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) setVideos(data);
            })
            .catch((err) => console.error("Failed to fetch insta videos", err));
    }, []);

    useEffect(() => {
        if (selectedVideo) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [selectedVideo]);

    if (videos.length === 0) return null;

    const VideoPopup = () => {
        if (!selectedVideo || !mounted) return null;

        const content = (
            <div
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
                onClick={() => setSelectedVideo(null)}
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            >
                {/* Fixed Close Button - Pinned to Viewport Corner */}
                <button
                    onClick={() => setSelectedVideo(null)}
                    className="fixed top-6 right-6 md:top-10 md:right-10 z-[10000] w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all border border-white/30 backdrop-blur-md shadow-2xl group"
                >
                    <i className="fa-solid fa-xmark text-2xl group-hover:rotate-90 transition-transform duration-300"></i>
                </button>

                <div
                    className="relative w-full max-w-[400px] h-full max-h-[85vh] md:max-h-[90vh] bg-black rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.9)] border border-white/10 flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative flex-1 bg-black">
                        <video
                            src={selectedVideo.video_url}
                            poster={selectedVideo.thumbnail_url}
                            controls
                            autoPlay
                            playsInline
                            className="w-full h-full object-contain"
                        />

                        {/* Top Overlay */}
                        <div className="absolute top-0 inset-x-0 p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
                            <h3 className="text-white font-bold text-base md:text-lg drop-shadow-lg tracking-wide">
                                {selectedVideo.title}
                            </h3>
                        </div>

                        {/* Shop Now Button (Centered) */}
                        <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
                            <Link
                                href="/shop"
                                className="bg-white/15 hover:bg-white/25 backdrop-blur-lg text-white border border-white/30 px-8 py-3.5 rounded-full font-bold text-sm shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2.5 whitespace-nowrap"
                            >
                                <i className="fa-solid fa-cart-shopping text-xs"></i>
                                Shop Now
                            </Link>
                        </div>

                        {/* Instagram Link Button */}
                        {selectedVideo.link && (
                            <a
                                href={selectedVideo.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute bottom-8 right-6 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white border border-white/25 w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-110 active:scale-95"
                            >
                                <i className="fa-brands fa-instagram text-2xl"></i>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );

        return typeof document !== 'undefined'
            ? require('react-dom').createPortal(content, document.body)
            : null;
    };

    return (
        <section className="py-10 md:py-12 bg-bg-cream overflow-hidden relative">

            {/* Flying Parachute Decoration */}
            <motion.div
                initial={{ y: 0, x: 0 }}
                animate={{
                    y: [0, -10, 0],
                    x: [0, 5, 0],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -left-4 lg:left-[1%] xl:left-[3%] top-[8%] w-[120px] md:w-[140px] lg:w-[160px] h-auto pointer-events-none z-0 hidden lg:block"
            >
                <img
                    src="/images/Cashew-parachute-03.png"
                    alt=""
                    className="w-full h-auto drop-shadow-2xl opacity-90"
                />
            </motion.div>

            <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-8 flex flex-col items-center">
                    <span
                        className="font-bold tracking-[4px] uppercase text-[10px] mb-1.5 block"
                        style={{ color: COLORS.black }}
                    >
                        Join The Community
                    </span>
                    <SectionHeading text="Follow" highlight="The Crunch" />
                </div>

                <div
                    ref={scrollRef}
                    className="flex md:grid md:grid-cols-4 gap-3 overflow-x-auto pb-3 snap-x snap-mandatory no-scrollbar"
                >
                    {videos.map((video) => (
                        <VideoItem
                            key={video._id}
                            video={video}
                            onClick={() => setSelectedVideo(video)}
                        />
                    ))}
                </div>

                {selectedVideo && <VideoPopup />}
            </div>
        </section>
    );
}