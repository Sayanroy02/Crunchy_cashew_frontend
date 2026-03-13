'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import Lottie from 'lottie-react';
import { API } from '@/constants/api';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [visitForm, setVisitForm] = useState({
        name: '',
        email: '',
        date: '',
        company: ''
    });

    const [activeTab, setActiveTab] = useState<'general' | 'visit'>('general');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [lottieData, setLottieData] = useState(null);

    React.useEffect(() => {
        // Fetch a public mail/contact Lottie JSON animation
        fetch('https://assets10.lottiefiles.com/packages/lf20_u25cckyh.json')
            .then(res => res.json())
            .then(data => setLottieData(data))
            .catch(() => { });
    }, []);

    // Pre-fill if logged in
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            // In the original app, contact goes to /api/contact or similar
            const res = await fetch(API.CONTACT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to send message');

            setStatus('success');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); // reset
        } catch (err: any) {
            setStatus('error');
            setErrorMsg(err.message || 'Something went wrong. Please try again.');
        }
    };

    const handleVisitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVisitForm({ ...visitForm, [e.target.name]: e.target.value });
    };

    const handleVisitSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch(API.CONTACT_VISIT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(visitForm)
            });

            if (!res.ok) throw new Error('Failed to request visit');

            setStatus('success');
            setVisitForm({ name: '', email: '', date: '', company: '' }); // reset
        } catch (err: any) {
            setStatus('error');
            setErrorMsg(err.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="bg-bg-cream min-h-screen">
            {/* Header */}
            <section className="bg-black text-white pt-24 pb-16 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -tr-32 -mr-32 pointer-events-none"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-heading font-black mb-6 text-highlight">Get in Touch</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Whether you need a bulk wholesale order or just have a question about our cashews, we'd love to hear from you.
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row -mt-32 relative z-20">

                    {/* Contact Info Sidebar */}
                    <div className="lg:w-1/3 bg-primary text-white p-10 md:p-14 flex flex-col justify-between">
                        <div>
                            <h2 className="text-3xl font-heading font-bold mb-8">Contact Information</h2>

                            <div className="flex flex-col gap-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                                        <i className="fa-solid fa-location-dot text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-highlight mb-1">Our Factory</h3>
                                        <p className="text-green-50 leading-relaxed">
                                            123 Cashew Lane, Industrial Area,<br />
                                            Siliguri, West Bengal,<br />
                                            India 734001
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                                        <i className="fa-solid fa-phone text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-highlight mb-1">Phone Number</h3>
                                        <p className="text-green-50">+91 98765 43210</p>
                                        <p className="text-green-50 text-sm mt-1 opacity-80">Mon-Fri 9am to 6pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                                        <i className="fa-solid fa-envelope text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-highlight mb-1">Email Address</h3>
                                        <p className="text-green-50 break-all">info@crunchycashews.in</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 relative z-10">
                            <h3 className="font-bold mb-4 text-highlight">Follow Us</h3>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-highlight hover:text-black transition-colors"><i className="fa-brands fa-facebook-f"></i></a>
                                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-highlight hover:text-black transition-colors"><i className="fa-brands fa-instagram"></i></a>
                                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-highlight hover:text-black transition-colors"><i className="fa-brands fa-twitter"></i></a>
                            </div>
                        </div>

                        {lottieData && (
                            <div className="absolute right-[-40px] bottom-[-40px] w-64 h-64 opacity-30 pointer-events-none mix-blend-screen overflow-hidden">
                                <Lottie animationData={lottieData} loop={true} />
                            </div>
                        )}
                    </div>

                    {/* Contact Form Area */}
                    <div className="lg:w-2/3 p-10 md:p-14">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                            <div>
                                <h2 className="text-3xl font-heading font-bold text-text-dark mb-2">
                                    {activeTab === 'general' ? 'Send us a Message' : 'Request a Factory Visit'}
                                </h2>
                                <p className="text-gray-500">
                                    {activeTab === 'general' ? 'Fill out the form below and our team will get back to you within 24 hours.' : 'Book a guided tour to see our meticulous roasting process firsthand.'}
                                </p>
                            </div>

                            <div className="bg-gray-100 p-1 rounded-full flex shrink-0 border border-gray-200 shadow-inner">
                                <button
                                    onClick={() => { setActiveTab('general'); setStatus('idle'); }}
                                    className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'general' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    General
                                </button>
                                <button
                                    onClick={() => { setActiveTab('visit'); setStatus('idle'); }}
                                    className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'visit' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Factory Visit
                                </button>
                            </div>
                        </div>

                        {status === 'success' && (
                            <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-6 mb-8 flex items-center gap-4">
                                <i className="fa-solid fa-circle-check text-3xl text-primary"></i>
                                <div>
                                    <h4 className="font-bold text-lg">Message Sent Successfully!</h4>
                                    <p>Thank you for reaching out. We will contact you soon.</p>
                                </div>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 mb-8 text-sm font-medium flex items-center gap-3">
                                <i className="fa-solid fa-circle-exclamation w-8 flex-shrink-0 text-xl"></i> {errorMsg}
                            </div>
                        )}

                        {activeTab === 'general' ? (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-fade-in-up">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-700 ml-2">Full Name <span className="text-red-500">*</span></label>
                                        <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 focus:border-primary focus:ring-2 outline-none transition-all text-text-dark" placeholder="John Doe" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-700 ml-2">Email Address <span className="text-red-500">*</span></label>
                                        <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 focus:border-primary focus:ring-2 outline-none transition-all text-text-dark" placeholder="john@example.com" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-700 ml-2">Phone Number</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 focus:border-primary focus:ring-2 outline-none transition-all text-text-dark" placeholder="+91 98765 43210" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-700 ml-2">Subject <span className="text-red-500">*</span></label>
                                        <select name="subject" required value={formData.subject} onChange={(e: any) => handleChange(e)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 focus:border-primary focus:ring-2 outline-none transition-all text-text-dark appearance-none">
                                            <option value="" disabled>Select a subject</option>
                                            <option value="General Inquiry">General Inquiry</option>
                                            <option value="Bulk Order">Bulk Order Request</option>
                                            <option value="Support">Order Support</option>
                                            <option value="Feedback">Feedback</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-700 ml-2">Your Message <span className="text-red-500">*</span></label>
                                    <textarea name="message" required value={formData.message} onChange={handleChange} rows={5} className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 focus:border-primary focus:ring-2 outline-none transition-all resize-none text-text-dark" placeholder="How can we help you today?"></textarea>
                                </div>

                                <button type="submit" disabled={status === 'loading'} className="mt-4 bg-text-dark text-highlight font-bold text-lg py-4 px-8 rounded-full shadow-lg hover:-translate-y-1 hover:shadow-black/20 transition-all disabled:opacity-70 disabled:hover:translate-y-0 w-max min-w-[200px]">
                                    {status === 'loading' ? (
                                        <div className="w-6 h-6 border-2 border-highlight border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    ) : (
                                        <>Send Message <i className="fa-solid fa-paper-plane ml-2"></i></>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVisitSubmit} className="flex flex-col gap-6 animate-fade-in-up">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-700 ml-2">Full Name <span className="text-red-500">*</span></label>
                                        <input type="text" name="name" required value={visitForm.name} onChange={handleVisitChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 focus:border-primary focus:ring-2 outline-none transition-all text-text-dark" placeholder="John Doe" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-700 ml-2">Email Address <span className="text-red-500">*</span></label>
                                        <input type="email" name="email" required value={visitForm.email} onChange={handleVisitChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 focus:border-primary focus:ring-2 outline-none transition-all text-text-dark" placeholder="john@example.com" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-700 ml-2">Company Name</label>
                                        <input type="text" name="company" value={visitForm.company} onChange={handleVisitChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 focus:border-primary focus:ring-2 outline-none transition-all text-text-dark" placeholder="Cashew Traders LLC" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-gray-700 ml-2">Requested Date <span className="text-red-500">*</span></label>
                                        <input type="date" name="date" required value={visitForm.date} onChange={handleVisitChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 focus:border-primary focus:ring-2 outline-none transition-all text-text-dark" />
                                    </div>
                                </div>

                                <button type="submit" disabled={status === 'loading'} className="mt-4 bg-primary text-white font-bold text-lg py-4 px-8 rounded-full shadow-lg hover:-translate-y-1 hover:bg-green-800 transition-all disabled:opacity-70 disabled:hover:translate-y-0 w-max min-w-[200px]">
                                    {status === 'loading' ? (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    ) : (
                                        <>Request Visit <i className="fa-solid fa-calendar-check ml-2"></i></>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </section>
        </div>
    );
}
