'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function AdminDashboard() {
    const { token } = useSelector((state: RootState) => state.auth);
    const [stats, setStats] = useState({ total_orders: 0, pending_orders: 0, todays_collection: 0 });
    const [traffic, setTraffic] = useState({ unique_visitors: 0, popular_pages: [] as any[] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                const headers = { 'Authorization': `Bearer ${token}` };

                // Dashboard Stats
                const statsRes = await fetch('http://localhost:8000/api/admin/dashboard', { headers });
                if (statsRes.ok) {
                    setStats(await statsRes.json());
                }

                // Traffic Stats
                const trafficRes = await fetch('http://localhost:8000/api/traffic/stats', { headers });
                if (trafficRes.ok) {
                    setTraffic(await trafficRes.json());
                }

                setLoading(false);
            } catch (err) {
                console.error("Dashboard Load Error", err);
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const chartData = {
        labels: traffic.popular_pages.map(p => p.path),
        datasets: [
            {
                label: 'Page Hits',
                data: traffic.popular_pages.map(p => p.hits),
                backgroundColor: traffic.popular_pages.map((_, i) => i % 2 === 0 ? 'rgba(246, 215, 15, 0.8)' : 'rgba(12, 92, 43, 0.8)'),
                borderColor: traffic.popular_pages.map((_, i) => i % 2 === 0 ? 'rgba(246, 215, 15, 1)' : 'rgba(12, 92, 43, 1)'),
                borderWidth: 1,
                borderRadius: 4
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
            x: { grid: { display: false } }
        }
    };

    if (loading) return <div className="text-center mt-20 text-gray-400 font-medium">Loading Dashboard Data...</div>;

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-heading font-black text-[#0c5c2b]">System Analytics</h1>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                    <p className="text-gray-500 font-medium text-sm">Total Orders</p>
                    <h2 className="text-4xl font-bold text-gray-800 mt-2">{stats.total_orders}</h2>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                    <p className="text-gray-500 font-medium text-sm">Pending Orders</p>
                    <h2 className="text-4xl font-bold text-orange-500 mt-2">{stats.pending_orders}</h2>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                    <p className="text-gray-500 font-medium text-sm">Today's Revenue</p>
                    <h2 className="text-4xl font-bold text-[#0c5c2b] mt-2">₹{stats.todays_collection}</h2>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#f6d70f]/20 rounded-bl-full"></div>
                    <p className="text-gray-500 font-medium text-sm relative z-10">Live Unique Visitors</p>
                    <h2 className="text-4xl font-bold text-[#0c5c2b] mt-2 relative z-10">{traffic.unique_visitors}</h2>
                </div>
            </div>

            {/* Traffic Chart */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 w-full">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Live Site Traffic Routes</h3>
                <div className="h-[400px] w-full relative">
                    {traffic.popular_pages.length > 0 ? (
                        <Bar data={chartData} options={chartOptions} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">Not enough traffic data available.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
