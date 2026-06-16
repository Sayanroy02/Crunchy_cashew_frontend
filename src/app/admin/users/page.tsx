'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/constants/api';

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
}

export default function AdminUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchUsers = async () => {
        try {
            const token = getToken();
            const res = await fetch(API.ADMIN_USERS, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setUsers(await res.json());
            else console.error('Failed to fetch users:', res.status);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const downloadCSV = () => {
        const headers = ['User ID', 'Name', 'Email', 'Phone', 'Address', 'Total Orders', 'Role'];
        
        const filtered = users.filter(u => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            const username = (u.username || '').toLowerCase();
            const email = (u.email || '').toLowerCase();
            const phone = (u.phone || '').toLowerCase();
            const address = (u.address || '').toLowerCase();
            const uid = (u._id || '').toLowerCase();
            return username.includes(q) || email.includes(q) || phone.includes(q) || address.includes(q) || uid.includes(q);
        });

        const rows = filtered.map(u => {
            return [
                u._id,
                u.username || '',
                u.email || '',
                u.phone || '',
                u.address || '',
                u.orders ? u.orders.length : 0,
                u.role || 'user'
            ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `users_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Helper to highlight matching text
    const highlightText = (text: string, query: string) => {
        if (!query.trim()) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) => 
            regex.test(part) ? <span key={i} className="bg-yellow/40 text-black px-0.5 rounded">{part}</span> : part
        );
    };

    if (loading) return <div className="text-gray-400">Loading Users...</div>;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Registered Users</h1>
                
                <div className="flex items-center gap-2">
                    <button onClick={downloadCSV} className="py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:border-gray-900 transition-all shadow-sm active:scale-95 text-green-700 hover:text-green-800">
                        <i className="fa-solid fa-file-excel" /> Download Excel
                    </button>
                    <div className="relative group min-w-[300px]">
                        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-colors group-focus-within:text-primary"></i>
                        <input 
                            type="text" 
                            placeholder="Search by User, Email, Phone, UID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">User</th>
                                <th className="p-4 font-semibold">Contact Info</th>
                                <th className="p-4 font-semibold">Address</th>
                                <th className="p-4 font-semibold">Total Orders</th>
                                <th className="p-4 font-semibold text-center">Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700">
                            {users.filter(u => {
                                if (!searchQuery) return true;
                                const q = searchQuery.toLowerCase();
                                const username = (u.username || '').toLowerCase();
                                const email = (u.email || '').toLowerCase();
                                const phone = (u.phone || '').toLowerCase();
                                const address = (u.address || '').toLowerCase();
                                const uid = (u._id || '').toLowerCase();
                                
                                return username.includes(q) || email.includes(q) || phone.includes(q) || address.includes(q) || uid.includes(q);
                            }).map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <p className="font-black text-lg text-gray-900">{highlightText(u.username || '', searchQuery)}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">UID: {highlightText(u._id || '', searchQuery)}</p>
                                    </td>
                                    <td className="p-4 text-base font-medium">
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center gap-2"><i className="fa-solid fa-envelope text-primary text-xs" /> {highlightText(u.email || '', searchQuery)}</span>
                                            <span className="flex items-center gap-2 text-gray-500"><i className="fa-solid fa-phone text-gray-400 text-xs" /> {highlightText(u.phone || '', searchQuery)}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm max-w-[250px]">
                                        {u.address ? (
                                            <p className="line-clamp-2 italic text-gray-600 leading-relaxed">{highlightText(u.address, searchQuery)}</p>
                                        ) : (
                                            <span className="text-gray-300 italic">Not provided</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="inline-flex flex-col items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 min-w-[80px]">
                                            <span className="text-xl font-black text-primary">{u.orders ? u.orders.length : 0}</span>
                                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Orders</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full ${u.role === 'admin' ? 'bg-primary text-black shadow-sm' : 'bg-gray-100 text-gray-400'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-400">No users found in the database.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
