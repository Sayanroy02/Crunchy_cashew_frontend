'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API } from '@/constants/api';

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
}

export default function AdminProfile() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    
    const [formData, setFormData] = useState({
        username: '',
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetch(API.AUTH_ME, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        .then(res => res.json())
        .then(data => {
            setUser(data);
            setFormData(prev => ({ ...prev, username: data.username }));
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.new_password && formData.new_password !== formData.confirm_password) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setUpdating(true);
        try {
            const res = await fetch(API.ADMIN_UPDATE_PROFILE, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    current_password: formData.new_password ? formData.current_password : undefined,
                    new_password: formData.new_password || undefined
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                if (data.username_changed) {
                    setMessage({ type: 'success', text: 'Username changed. Please login again.' });
                    setTimeout(() => {
                        localStorage.removeItem('token');
                        router.push('/admin/login');
                    }, 2000);
                }
                setFormData(prev => ({ ...prev, current_password: '', new_password: '', confirm_password: '' }));
            } else {
                setMessage({ type: 'error', text: data.detail || 'Failed to update profile' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-800 tracking-tight">Admin Profile</h1>
                <p className="text-gray-500 font-medium">Manage your administrator credentials</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {message.text && (
                            <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 ${
                                message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                            }`}>
                                <i className={`fa-solid ${message.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
                                {message.text}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Username</label>
                            <div className="relative">
                                <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium ml-1 italic">* You will be logged out if you change your username.</p>
                        </div>

                        <hr className="border-gray-50" />

                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Change Password</h3>
                            
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Current Password</label>
                                <div className="relative">
                                    <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                    <input
                                        type="password"
                                        name="current_password"
                                        value={formData.current_password}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="Required for password change"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">New Password</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-key absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                        <input
                                            type="password"
                                            name="new_password"
                                            value={formData.new_password}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            placeholder="Min 6 chars"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Confirm New Password</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-shield-check absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                        <input
                                            type="password"
                                            name="confirm_password"
                                            value={formData.confirm_password}
                                            onChange={handleChange}                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            placeholder="Confirm password"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={updating}
                                className="w-full bg-primary text-white font-black py-4 rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 uppercase tracking-widest disabled:opacity-50"
                            >
                                {updating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-floppy-disk"></i>
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="bg-gray-50 p-6 border-t border-gray-100">
                    <div className="flex items-start gap-4 text-gray-500">
                        <i className="fa-solid fa-circle-info mt-1"></i>
                        <p className="text-xs font-medium leading-relaxed">
                            For security purposes, you should choose a strong password. If you change your username, your active session will expire, and you will need to log in again with your new credentials.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
