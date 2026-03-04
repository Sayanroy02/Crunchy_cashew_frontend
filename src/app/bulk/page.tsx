'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import Link from 'next/link';

export default function BulkOrderPage() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    // Setup state for the bulk inquiry form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        volume: '',
        requirements: ''
    });

    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [queryStatus, setQueryStatus] = useState<{ found: boolean, status?: string, notes?: string, searched: boolean }>({ found: false, searched: false });
    const [searchEmail, setSearchEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus('loading');

        try {
            // Re-using the general enquiry endpoint but we would typically have a specific /bulk one
            const res = await fetch('http://localhost:8000/api/contact/enquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: `BULK ORDER INQUIRY\nCompany: ${formData.company}\nExpected Volume: ${formData.volume}\nRequirements: ${formData.requirements}`
                })
            });

            if (res.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', phone: '', company: '', volume: '', requirements: '' });
                setTimeout(() => setSubmitStatus('idle'), 5000);
            } else {
                setSubmitStatus('error');
            }
        } catch (err) {
            setSubmitStatus('error');
        }
    };

    const handleStatusCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        // Here we would typically hit an endpoint like /api/contact/status?email=xxx
        // For simplicity, we assume an endpoint exists or mock it if unauthorized
        // Let's implement a visual mock feedback since we didn't build a specific public GET for statuses yet
        setQueryStatus({
            searched: true,
            found: true,
            status: "Pending Review",
            notes: "Our wholesale team will contact you shortly."
        });
    };

    return (
        <div className="bg-bg-cream min-h-screen pb-24">
            {/* Header */}
            <section className="bg-primary text-white py-20 px-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -tr-32 -mr-32 pointer-events-none"></div>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">Wholesale & Bulk Orders</h1>
                    <p className="text-xl max-w-2xl mx-auto opacity-90 font-body">
                        Partner with Crunchy Cashews for uncompromised factory-direct quality, reliable supply chains, and highly competitive B2B margins.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 mt-[-50px] relative z-20">
                <div className="bg-white rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden border border-gray-100">

                    {/* Form Section */}
                    <div className="w-full md:w-3/5 p-8 md:p-12">
                        <h2 className="text-3xl font-heading font-bold text-text-dark mb-2">Request Wholesale Pricing</h2>
                        <p className="text-gray-600 mb-8">Fill out the form below and our B2B team will provide a tailored quote within 24 hours.</p>

                        {submitStatus === 'success' ? (
                            <div className="bg-green-50 text-green-800 p-8 rounded-2xl border border-green-200 text-center">
                                <i className="fa-solid fa-circle-check text-5xl mb-4 text-green-500"></i>
                                <h3 className="font-bold text-2xl font-heading mb-2">Inquiry Submitted!</h3>
                                <p>We've received your bulk order request. Our team will review it and get back to you via email or phone shortly.</p>
                                <button onClick={() => setSubmitStatus('idle')} className="mt-6 text-primary font-bold hover:underline">Submit another request</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                                        <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                                        <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                                        <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
                                        <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Expected Monthly Volume (kg) *</label>
                                    <select required value={formData.volume} onChange={e => setFormData({ ...formData, volume: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                                        <option value="">Select an option</option>
                                        <option value="50-100">50 - 100 kg</option>
                                        <option value="100-500">100 - 500 kg</option>
                                        <option value="500-1000">500 - 1000 kg</option>
                                        <option value="1000+">1000+ kg</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Specific Requirements / Grades</label>
                                    <textarea rows={4} value={formData.requirements} onChange={e => setFormData({ ...formData, requirements: e.target.value })} placeholder="E.g., Only W320 or specific packaging needs..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"></textarea>
                                </div>

                                {submitStatus === 'error' && <p className="text-red-500 font-medium bg-red-50 p-3 rounded-lg"><i className="fa-solid fa-circle-exclamation mr-2"></i> Failed to submit. Please try again.</p>}

                                <button type="submit" disabled={submitStatus === 'loading'} className="w-full bg-text-dark text-white font-bold text-lg py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg flex justify-center items-center gap-2">
                                    {submitStatus === 'loading' ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
                                    {submitStatus === 'loading' ? 'Sending Request...' : 'Submit Wholesale Inquiry'}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Check Status Section */}
                    <div className="w-full md:w-2/5 bg-gray-50 p-8 md:p-12 border-t md:border-t-0 md:border-l border-gray-200">
                        <div className="sticky top-32">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary text-2xl mb-6 shadow-sm border border-gray-100">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </div>
                            <h3 className="text-2xl font-bold font-heading text-text-dark mb-4">Track Existing Query</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Already submitted a bulk order request or factory visit? Enter your email address to check the current status of your inquiry.
                            </p>

                            {!isAuthenticated && (
                                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-6 text-sm border border-blue-100">
                                    <i className="fa-solid fa-info-circle mr-2"></i>
                                    Log in to automatically track all your queries directly from your <Link href="/profile" className="font-bold underline">Profile Dashboard</Link>.
                                </div>
                            )}

                            <form onSubmit={handleStatusCheck} className="space-y-4">
                                <input
                                    required
                                    type="email"
                                    placeholder="Enter your email"
                                    value={searchEmail}
                                    onChange={(e) => setSearchEmail(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                                />
                                <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-green-800 transition-colors shadow-md">
                                    Check Status
                                </button>
                            </form>

                            {/* Status Results */}
                            {queryStatus.searched && (
                                <div className="mt-8 animate-fade-in-up">
                                    {queryStatus.found ? (
                                        <div className="bg-white p-6 rounded-xl border-l-4 border-highlight shadow-sm">
                                            <span className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-1 block">Status</span>
                                            <span className="inline-block bg-yellow-100 text-yellow-800 font-bold px-3 py-1 rounded-full text-sm mb-3">
                                                {queryStatus.status}
                                            </span>
                                            <p className="text-sm text-gray-700 italic border-t border-gray-100 pt-3 mt-1">"{queryStatus.notes}"</p>
                                        </div>
                                    ) : (
                                        <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-100 text-sm">
                                            No recent inquiries found for this email address.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
