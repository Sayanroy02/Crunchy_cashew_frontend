"use client";

import React, { useEffect, useState, useRef } from "react";
import { API } from "@/constants/api";
import { COLORS } from "@/constants/styles";

interface InstaVideo {
    _id: string;
    title: string;
    link?: string;
    video_url: string;
    thumbnail_url: string;
}

function InstaHeading() {
    const ref = useRef<HTMLHeadingElement>(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold: 0.3 });
        ob.observe(el);
        return () => ob.disconnect();
    }, []);
    return (
        <h2
            ref={ref}
            className="text-4xl md:text-5xl font-black tracking-tight mb-3"
            style={{
                color: COLORS.heading,
                opacity: vis ? 1 : 0,
                transform: vis ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 0.6s 0.1s ease, transform 0.6s 0.1s ease',
            }}
        >
            Crunchy on <span className="relative inline-block">
                <span className="relative z-10">Insta</span>
                <span
                    className="absolute bottom-1 md:bottom-2 left-0 h-3 md:h-4 -z-0 opacity-80"
                    style={{
                        backgroundColor: COLORS.highlight,
                        width: vis ? '100%' : '0%',
                        transition: 'width 0.8s 0.5s ease',
                    }}
                />
            </span>
        </h2>
    );
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
            videoRef.current.play().catch(() => {});
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
                    <span 
                        className="font-bold tracking-[4px] uppercase text-[10px] mb-1.5 block"
                        style={{ color: COLORS.primary }}
                    >
                        Latest Reels
                    </span>
                    <InstaHeading />
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

                            <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/75 to-transparent pointer-events-none">
                                <h3 className="text-white font-semibold text-sm drop-shadow">
                                    {selectedVideo.title}
                                </h3>
                            </div>

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