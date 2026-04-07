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


    if (loading) return <div className="text-gray-400">Loading Users...</div>;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Registered Users</h1>
                
                {/* Search Bar */}
                <div className="relative group min-w-[300px]">
                    <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-colors group-focus-within:text-primary"></i>
                    <input 
                        type="text" 
                        placeholder="Search by User, Email, Phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">User</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Phone</th>
                                <th className="p-4 font-semibold">Total Orders</th>
                                <th className="p-4 font-semibold">Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700">
                            {users.filter(u => {
                                if (!searchQuery) return true;
                                const q = searchQuery.toLowerCase();
                                const username = (u.username || '').toLowerCase();
                                const email = (u.email || '').toLowerCase();
                                const phone = (u.phone || '').toLowerCase();
                                
                                return username.includes(q) || email.includes(q) || phone.includes(q);
                            }).map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold">{u.username}</td>
                                    <td className="p-4">{u.email}</td>
                                    <td className="p-4">{u.phone || 'N/A'}</td>
                                    <td className="p-4 font-semibold text-primary">{u.orders ? u.orders.length : 0}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${u.role === 'admin' ? 'bg-yellow/20 text-[#be9e00]' : 'bg-gray-100 text-gray-600'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400">No users found in the database.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
