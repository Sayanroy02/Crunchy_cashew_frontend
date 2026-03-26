"use client";

import React, { useState, useEffect } from "react";
import { API } from "@/constants/api";

function getToken() {
    return typeof window !== "undefined"
        ? localStorage.getItem("token") || ""
        : "";
}

interface InstaVideo {
    _id: string;
    title: string;
    link?: string;
    video_url: string;
    thumbnail_url: string;
    public_id: string;
    created_at: string;
}

export default function AdminInstaVideos() {
    const [videos, setVideos] = useState<InstaVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

    // Form State
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchVideos = async () => {
        try {
            const token = getToken();
            const res = await fetch(API.ADMIN_INSTA_VIDEOS, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) setVideos(await res.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this video?")) return;
        try {
            const token = getToken();
            const res = await fetch(API.ADMIN_INSTA_VIDEO_DELETE(id), {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) fetchVideos();
            else alert("Failed to delete video");
        } catch (e) {
            console.error(e);
        }
    };

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return alert("Please select a video file (MP4).");

        setIsSubmitting(true);
        const fd = new FormData();
        fd.append("title", title);
        if (link) fd.append("link", link);
        fd.append("video", file);

        try {
            const token = getToken();
            const res = await fetch(API.ADMIN_INSTA_VIDEOS, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            if (res.ok) {
                setIsUploadModalOpen(false);
                setTitle("");
                setLink("");
                setFile(null);
                fetchVideos();
            } else {
                let errDetail = "Failed to upload video";
                try {
                    const err = await res.json();
                    if (err.detail) errDetail = err.detail;
                } catch (parseError) {
                    console.error("Non-JSON error response from backend");
                }
                alert(errDetail);
            }
        } catch (e) {
            console.error(e);
            alert("Upload error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (video: InstaVideo) => {
        setCurrentVideoId(video._id);
        setTitle(video.title);
        setLink(video.link || "");
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentVideoId) return;

        setIsSubmitting(true);
        try {
            const token = getToken();
            const res = await fetch(API.ADMIN_INSTA_VIDEO_UPDATE(currentVideoId), {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, link }),
            });
            if (res.ok) {
                setIsEditModalOpen(false);
                setTitle("");
                setLink("");
                setCurrentVideoId(null);
                fetchVideos();
            } else {
                let errDetail = "Failed to update video";
                try {
                    const err = await res.json();
                    if (err.detail) errDetail = err.detail;
                } catch (parseError) {
                    console.error("Non-JSON error response from backend");
                }
                alert(errDetail);
            }
        } catch (e) {
            console.error(e);
            alert("Update error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="text-gray-400">Loading Insta Videos...</div>;

    const maxSlots = 4;
    const slots = Array.from({ length: maxSlots }, (_, i) => videos[i] || null);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight">
                        Insta Videos
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage Instagram-style video blocks shown on the homepage. (Max 4 slots)
                    </p>
                </div>
                {videos.length < 4 && (
                    <button
                        onClick={() => {
                            setTitle("");
                            setLink("");
                            setFile(null);
                            setIsUploadModalOpen(true);
                        }}
                        className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2"
                    >
                        <i className="fa-solid fa-cloud-arrow-up"></i> Upload Video
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {slots.map((video, index) => {
                    if (video) {
                        return (
                            <div
                                key={video._id}
                                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group relative"
                            >
                                <div className="relative aspect-[9/16] bg-black">
                                    <video
                                        src={video.video_url}
                                        poster={video.thumbnail_url}
                                        muted
                                        loop
                                        playsInline
                                        onMouseEnter={(e) => {
                                            const playPromise = e.currentTarget.play();
                                            if (playPromise !== undefined) {
                                                playPromise.catch(() => {});
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.pause();
                                        }}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur border border-white/20">
                                        Slot {index + 1}
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-12 text-white">
                                        <h3
                                            className="font-bold text-lg mb-1 truncate drop-shadow-md"
                                            title={video.title}
                                        >
                                            {video.title}
                                        </h3>
                                        <a
                                            href={video.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white/80 hover:text-white text-xs flex items-center gap-1 transition-colors w-fit underline underline-offset-2"
                                        >
                                            {video.link ? "External Link" : ""}
                                        </a>
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 flex gap-2 border-t border-gray-100">
                                    <button
                                        onClick={() => openEditModal(video)}
                                        className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition text-sm"
                                    >
                                        <i className="fa-solid fa-pen-to-square mr-2"></i>Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(video._id)}
                                        className="py-2.5 px-4 bg-red-50 text-red-600 border border-red-100 font-semibold rounded-xl hover:bg-red-100 transition"
                                        title="Delete Video"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div
                                key={`empty-${index}`}
                                onClick={() => {
                                    setTitle("");
                                    setLink("");
                                    setFile(null);
                                    setIsUploadModalOpen(true);
                                }}
                                className="bg-white border-2 border-dashed border-gray-200 rounded-3xl aspect-[9/16] flex flex-col items-center justify-center text-gray-400 hover:text-primary hover:border-primary hover:bg-green-50/20 transition cursor-pointer group p-6 text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-gray-50 group-hover:bg-green-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <i className="fa-solid fa-plus text-2xl group-hover:rotate-90 transition-transform"></i>
                                </div>
                                <span className="font-bold text-gray-600">
                                    Upload to Slot {index + 1}
                                </span>
                                <span className="text-xs mt-2 w-max">Click to Browse File</span>
                            </div>
                        );
                    }
                })}
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl scale-100 animate-fade-in-up">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                            <div>
                                <h2 className="text-xl font-bold font-heading text-gray-800">
                                    Upload Insta Video
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">MP4 format recommended</p>
                            </div>
                            <button
                                onClick={() => setIsUploadModalOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <form onSubmit={handleUploadSubmit} className="p-6 flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                    Video Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm"
                                    placeholder="e.g. Behind the Scenes at Crunchy Cashews"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                    Link / URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm"
                                    placeholder="https://instagram.com/p/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                    Video File (MP4)
                                </label>
                                <input
                                    type="file"
                                    required
                                    accept="video/mp4,video/x-m4v,video/*"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer border border-gray-200 rounded-xl bg-gray-50"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-2 bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-green-800 disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                                        Uploading to Cloudinary...
                                    </>
                                ) : (
                                    "Upload Video"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl scale-100 animate-fade-in-up">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                            <div>
                                <h2 className="text-xl font-bold font-heading text-gray-800">
                                    Edit Video Details
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                    Video Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm"
                                    placeholder="Enter title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                    Link / URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm"
                                    placeholder="https://..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-2 bg-amber text-black py-3.5 rounded-xl font-bold hover:bg-amber/90 disabled:opacity-50 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-amber/20"
                            >
                                {isSubmitting ? (
                                    <>
                                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                                        Saving Changes...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
