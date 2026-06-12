'use client';

import React, { useEffect, useState } from 'react';
import { API } from '@/constants/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function AdminDashboard() {
    const [stats, setStats] = useState({ 
        total_orders: 0, 
        pending_orders: 0, 
        todays_collection: 0, 
        total_revenue: 0,
        last_5_days_orders: [] as {date: string, count: number}[] 
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
            if (!token) return;
            try {
                const headers = { 'Authorization': `Bearer ${token}` };

                // Dashboard Stats
                const statsRes = await fetch(API.ADMIN_DASHBOARD, { headers });
                if (statsRes.ok) {
                    setStats(await statsRes.json());
                }

                setLoading(false);
            } catch (err) {
                console.error("Dashboard Load Error", err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const pieData = {
        labels: ["Today's Revenue", 'Previous Revenue'],
        datasets: [
            {
                data: [
                    stats.todays_collection,
                    Math.max(0, stats.total_revenue - stats.todays_collection)
                ],
                backgroundColor: ['rgba(12, 92, 43, 0.8)', 'rgba(246, 215, 15, 0.8)'],
                borderColor: ['rgba(12, 92, 43, 1)', 'rgba(246, 215, 15, 1)'],
                borderWidth: 1,
            }
        ]
    };

    const barData = {
        labels: stats.last_5_days_orders.map(d => {
            const date = new Date(d.date);
            return date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
        }),
        datasets: [
            {
                label: 'Orders',
                data: stats.last_5_days_orders.map(d => d.count),
                backgroundColor: 'rgba(246, 215, 15, 0.8)',
                borderColor: 'rgba(246, 215, 15, 1)',
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
            <h1 className="text-3xl font-heading font-black text-primary">System Analytics</h1>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
                    <h2 className="text-4xl font-bold text-primary mt-2">₹{stats.todays_collection.toLocaleString('en-IN')}</h2>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Paid orders today</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-bl-full"></div>
                    <p className="text-gray-500 font-medium text-sm relative z-10">Total Revenue</p>
                    <h2 className="text-4xl font-bold text-emerald-600 mt-2 relative z-10">₹{(stats.total_revenue || 0).toLocaleString('en-IN')}</h2>
                    <p className="text-xs text-gray-400 mt-1 font-medium relative z-10">All-time paid orders</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow/20 rounded-bl-full"></div>
                    <p className="text-gray-500 font-medium text-sm relative z-10">Live Unique Visitors</p>
                    <h2 className="text-4xl font-bold text-primary mt-2 relative z-10">--</h2>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Pie Chart */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <i className="fa-solid fa-chart-pie text-primary"></i> Revenue Overview
                    </h3>
                    <div className="h-[300px] w-full relative flex justify-center">
                        <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                </div>

                {/* Orders Bar Chart */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <i className="fa-solid fa-chart-column text-primary"></i> Orders (Last 5 Days)
                    </h3>
                    <div className="h-[300px] w-full relative">
                        {stats.last_5_days_orders.length > 0 ? (
                            <Bar data={barData} options={chartOptions} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No recent orders.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
