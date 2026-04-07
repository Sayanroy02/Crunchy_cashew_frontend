'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/constants/api';

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
}

export default function UnregisteredVisitors() {
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        try {
            const token = getToken();
            const res = await fetch(API.TRAFFIC_STATS, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data.sessions || data || []);
            } else {
                setError('Failed to fetch visitor statistics');
            }
        } catch (e) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">
                    Unregistered Visitors <span className="text-sm font-normal text-gray-400 ml-2">(Last 100 sessions)</span>
                </h1>
                <button onClick={fetchStats} className="text-primary hover:bg-green-50 px-4 py-2 rounded-xl transition font-bold flex items-center gap-2">
                    <i className="fa-solid fa-rotate"></i> Refresh
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-2">
                    <i className="fa-solid fa-circle-exclamation"></i> {error}
                </div>
            )}

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-16 bg-white animate-pulse rounded-xl border border-gray-100"></div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-semibold">IP Address</th>
                                    <th className="p-4 font-semibold">Page Visited</th>
                                    <th className="p-4 font-semibold">Device / Browser</th>
                                    <th className="p-4 font-semibold text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {stats.length > 0 ? stats.map((visit, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-mono text-xs">{visit.ip_address}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                                {visit.path === '/' ? 'Home' : visit.path}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-gray-500 max-w-xs truncate" title={visit.user_agent}>
                                            {visit.user_agent}
                                        </td>
                                        <td className="p-4 text-right text-xs font-semibold text-gray-400">
                                            {formatDate(visit.timestamp)}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-gray-400 italic">
                                            No tracking data found yet. Data is recorded after users accept the cookie consent.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
