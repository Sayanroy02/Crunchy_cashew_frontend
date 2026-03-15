'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/constants/api';

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
}

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        'Pending': 'bg-orange-100 text-orange-700',
        'Accepted': 'bg-green-100 text-green-700',
        'Rejected': 'bg-red-100 text-red-600',
        'Rescheduled': 'bg-blue-100 text-blue-600',
    };
    const s = status || 'Pending';
    return <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${styles[s] || 'bg-gray-100 text-gray-600'}`}>{s}</span>;
};

const RESOLVED = ['Accepted', 'Rejected'];

export default function AdminQueries() {
    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [visits, setVisits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<{ type: 'enquiries' | 'visits'; item: any } | null>(null);
    const [statusChoice, setStatusChoice] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        const token = getToken();
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            const [eRes, vRes] = await Promise.all([
                fetch(API.CONTACT_ENQUIRY, { headers }),
                fetch(API.CONTACT_VISIT, { headers })
            ]);
            if (eRes.ok) setEnquiries(await eRes.json());
            if (vRes.ok) setVisits(await vRes.json());
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const openModal = (type: 'enquiries' | 'visits', item: any) => {
        setModal({ type, item });
        setStatusChoice(item.status || 'Accepted');
        setAdminNotes(item.admin_notes || '');
    };

    const handleSave = async () => {
        if (!modal) return;
        setSaving(true);
        const token = getToken();
        try {
            const res = await fetch(API.CONTACT_STATUS(modal.type, modal.item._id), {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: statusChoice, admin_notes: adminNotes })
            });
            if (res.ok) { setModal(null); fetchData(); }
        } catch (e) { console.error(e); } finally { setSaving(false); }
    };

    if (loading) return (
        <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-xl h-16 animate-pulse border border-gray-100"></div>)}
        </div>
    );

    return (
        <div className="flex flex-col gap-10">
            {/* Enquiries */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">General Enquiries <span className="text-sm font-normal text-gray-400 ml-2">({enquiries.length})</span></h1>
                {enquiries.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">No enquiries yet.</div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {enquiries.map((q) => (
                            <div key={q._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col md:flex-row md:items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap mb-2">
                                        <span className="font-bold text-gray-800">{q.name}</span>
                                        <StatusBadge status={q.status} />
                                    </div>
                                    <div className="text-xs text-gray-500 flex flex-wrap gap-3 mb-2">
                                        <span><i className="fa-solid fa-envelope mr-1 text-amber"></i>{q.email}</span>
                                        <span><i className="fa-solid fa-phone mr-1 text-amber"></i>{q.phone}</span>
                                        {q.created_at && <span><i className="fa-regular fa-calendar mr-1"></i>{new Date(q.created_at).toLocaleDateString()}</span>}
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-3">{q.message}</p>
                                    {q.admin_notes && (
                                        <div className="mt-2 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2 text-xs text-gray-600">
                                            <strong>Admin reply:</strong> {q.admin_notes}
                                        </div>
                                    )}
                                </div>
                                {!RESOLVED.includes(q.status) && (
                                    <div className="flex gap-2 flex-shrink-0 flex-wrap">
                                        <button onClick={() => { setModal({ type: 'enquiries', item: q }); setStatusChoice('Accepted'); setAdminNotes(q.admin_notes || ''); }}
                                            className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                                            ✅ Accept
                                        </button>
                                        <button onClick={() => { setModal({ type: 'enquiries', item: q }); setStatusChoice('Rejected'); setAdminNotes(q.admin_notes || ''); }}
                                            className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                                            ❌ Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Factory Visits */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Factory Visit Requests <span className="text-sm font-normal text-gray-400 ml-2">({visits.length})</span></h1>
                {visits.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">No visit requests yet.</div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {visits.map((v) => (
                            <div key={v._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col md:flex-row md:items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap mb-2">
                                        <span className="font-bold text-gray-800">{v.name}</span>
                                        {v.company_name && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{v.company_name}</span>}
                                        <StatusBadge status={v.status} />
                                    </div>
                                    <div className="text-xs text-gray-500 flex flex-wrap gap-3 mb-2">
                                        <span><i className="fa-solid fa-envelope mr-1 text-amber"></i>{v.email}</span>
                                        <span><i className="fa-solid fa-phone mr-1 text-amber"></i>{v.phone}</span>
                                        <span className="text-primary font-semibold"><i className="fa-regular fa-calendar mr-1"></i>Requested: {v.desired_date ? new Date(v.desired_date).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">{v.purpose}</p>
                                    {v.admin_notes && (
                                        <div className="mt-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2 text-xs text-gray-600">
                                            <strong>Admin action:</strong> {v.admin_notes}
                                        </div>
                                    )}
                                </div>
                                {!RESOLVED.includes(v.status) && (
                                    <div className="flex gap-2 flex-shrink-0 flex-wrap">
                                        <button onClick={() => { setModal({ type: 'visits', item: v }); setStatusChoice('Accepted'); setAdminNotes(v.admin_notes || ''); }}
                                            className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                                            ✅ Accept
                                        </button>
                                        <button onClick={() => { setModal({ type: 'visits', item: v }); setStatusChoice('Rejected'); setAdminNotes(v.admin_notes || ''); }}
                                            className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                                            ❌ Reject
                                        </button>
                                        <button onClick={() => { setModal({ type: 'visits', item: v }); setStatusChoice('Rescheduled'); setAdminNotes(v.admin_notes || ''); }}
                                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                                            🗓 Reschedule
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Status Update Modal */}
            {modal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-800">Update Request Status</h3>
                            <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
                        </div>
                        <div className="p-5 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                                <select value={statusChoice} onChange={e => setStatusChoice(e.target.value)}
                                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-amber">
                                    <option>Pending</option>
                                    <option>Accepted</option>
                                    <option>Rejected</option>
                                    <option>Rescheduled</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Reply / Notes</label>
                                <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={3}
                                    placeholder="Optional message to the user..."
                                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-amber resize-none" />
                            </div>
                            <button onClick={handleSave} disabled={saving}
                                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-green-800 transition disabled:opacity-50 flex items-center justify-center gap-2">
                                {saving ? <><i className="fa-solid fa-spinner animate-spin"></i> Saving...</> : 'Save & Notify'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
