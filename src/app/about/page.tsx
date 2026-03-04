'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState<'founder' | 'journey' | 'story'>('story');
    const [visitForm, setVisitForm] = useState({ name: '', email: '', date: '', company: '' });
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleVisitSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus('loading');
        try {
            const res = await fetch('http://localhost:8000/api/contact/visit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(visitForm)
            });
            if (res.ok) {
                setSubmitStatus('success');
                setVisitForm({ name: '', email: '', date: '', company: '' });
                setTimeout(() => setSubmitStatus('idle'), 5000);
            } else {
                setSubmitStatus('error');
            }
        } catch (err) {
            setSubmitStatus('error');
        }
    };

    return (
        <div className="bg-bg-cream min-h-screen pb-24">
            {/* Header */}
            <section className="bg-primary text-white py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <span className="text-highlight font-bold tracking-widest uppercase text-sm mb-4 block">About Us</span>
                    <h1 className="text-4xl md:text-6xl font-heading font-black mb-6 leading-tight">Harvesting Perfection Since 2010</h1>
                    <p className="text-xl max-w-2xl mx-auto opacity-90 font-body">
                        Discover the passion, people, and processes behind every successfully roasted Crunchy Cashew.
                    </p>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 mt-[-40px] relative z-20">
                <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 min-h-[600px] flex flex-col md:flex-row">

                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-1/4 bg-gray-50 p-8 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col gap-4">
                        <button
                            onClick={() => setActiveTab('story')}
                            className={`text-left px-6 py-4 rounded-2xl font-bold transition-all text-lg font-heading ${activeTab === 'story' ? 'bg-primary text-white shadow-lg' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            Our Story
                        </button>
                        <button
                            onClick={() => setActiveTab('founder')}
                            className={`text-left px-6 py-4 rounded-2xl font-bold transition-all text-lg font-heading ${activeTab === 'founder' ? 'bg-primary text-white shadow-lg' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            The Founder
                        </button>
                        <button
                            onClick={() => setActiveTab('journey')}
                            className={`text-left px-6 py-4 rounded-2xl font-bold transition-all text-lg font-heading ${activeTab === 'journey' ? 'bg-primary text-white shadow-lg' : 'text-gray-600 hover:bg-gray-200'}`}
                        >
                            Visit Factory
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="w-full md:w-3/4 p-8 md:p-14">
                        {activeTab === 'story' && (
                            <div className="animate-fade-in-up">
                                <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-dark mb-6 text-primary">From Forest to Flavor</h2>
                                <div className="prose prose-lg text-gray-600 font-body leading-relaxed">
                                    <p className="mb-6">
                                        Crunchy Cashews started with a simple belief: the world's most premium nuts shouldn't spend months sitting in retail warehouses losing their crunch. We set out to disrupt the traditional supply chain by establishing a direct farm-to-factory-to-consumer model.
                                    </p>
                                    <p className="mb-6">
                                        Over the past decade, we have built relationships with the finest cashew cultivators across the globe, bringing raw, wild-harvested nuts to our state-of-the-art facility in Siliguri, India. Here, they undergo a meticulous grading, roasting, and flavor-infusion process.
                                    </p>
                                    <div className="grid grid-cols-2 gap-6 my-10">
                                        <div className="bg-bg-cream p-6 rounded-2xl border border-gray-100">
                                            <h4 className="font-bold text-xl text-primary mb-2">1M+</h4>
                                            <p className="text-sm">Kilograms roasted</p>
                                        </div>
                                        <div className="bg-bg-cream p-6 rounded-2xl border border-gray-100">
                                            <h4 className="font-bold text-xl text-primary mb-2">5,000+</h4>
                                            <p className="text-sm">B2B Partners globally</p>
                                        </div>
                                    </div>
                                    <p>
                                        Today, we are proud to be one of the leading wholesale distributors and consumer lifestyle brands in the cashew industry, known relentlessly for quality, ethics, and unbeatable flavor.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'founder' && (
                            <div className="animate-fade-in-up flex flex-col md:flex-row gap-10 items-start">
                                <div className="w-full md:w-1/3 shrink-0">
                                    <div className="aspect-[3/4] rounded-3xl bg-gray-200 overflow-hidden shadow-lg border-4 border-white mb-6">
                                        {/* Placeholder for founder image */}
                                        <div className="w-full h-full flex items-center justify-center bg-primary text-white text-6xl opacity-80">
                                            <i className="fa-solid fa-user-tie"></i>
                                        </div>
                                    </div>
                                    <h3 className="font-heading font-bold text-2xl text-center text-text-dark">Rohit Agarwal</h3>
                                    <p className="text-center text-primary font-bold uppercase tracking-widest text-xs mt-1">Founder & CEO</p>
                                </div>
                                <div className="w-full md:w-2/3 prose prose-lg text-gray-600 font-body leading-relaxed">
                                    <h2 className="text-3xl font-heading font-bold text-text-dark mb-6 text-primary">Visionary Leadership</h2>
                                    <p className="mb-6">
                                        Rohit Agarwal founded Crunchy Cashews with a passion for quality agriculture and sustainable business practices. Coming from a family with deep roots in commodity trading, Rohit saw an opportunity to bring transparency to the opaque nut processing industry.
                                    </p>
                                    <p className="mb-6">
                                        "My goal was never to just sell a snack," says Rohit. "I wanted to build an institution that respects the farmer, perfects the manufacturing process, and honors the consumer with unparalleled freshness."
                                    </p>
                                    <p>
                                        Under his leadership, the company has expanded its manufacturing footprint significantly, pioneering eco-friendly packaging and fair-trade sourcing policies that set a new standard in the sector.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'journey' && (
                            <div className="animate-fade-in-up">
                                <div className="mb-10 text-center md:text-left">
                                    <span className="inline-block bg-highlight text-black font-bold uppercase tracking-widest text-xs px-3 py-1 rounded-full mb-4">Exclusive Tour</span>
                                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-dark mb-4 text-primary">See the Magic Happen</h2>
                                    <p className="text-gray-600 font-body text-lg">
                                        We invite bulk buyers, B2B partners, and food industry professionals to visit our Siliguri processing facility. Witness our rigorous grading processes and state-of-the-art roasting lines firsthand.
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
                                    <h3 className="text-2xl font-bold font-heading mb-6 text-text-dark">Request a Factory Visit</h3>

                                    {submitStatus === 'success' ? (
                                        <div className="bg-green-100 text-green-800 p-6 rounded-2xl border border-green-300 text-center">
                                            <i className="fa-solid fa-calendar-check text-4xl mb-4 text-green-600"></i>
                                            <p className="font-bold text-xl mb-2">Request Received!</p>
                                            <p>Our guided tour coordinator will contact you shortly to confirm your schedule.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleVisitSubmit} className="space-y-5">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                                                    <input required type="text" value={visitForm.name} onChange={e => setVisitForm({ ...visitForm, name: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                                                    <input required type="email" value={visitForm.email} onChange={e => setVisitForm({ ...visitForm, email: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
                                                    <input type="text" value={visitForm.company} onChange={e => setVisitForm({ ...visitForm, company: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Requested Date *</label>
                                                    <input required type="date" value={visitForm.date} onChange={e => setVisitForm({ ...visitForm, date: e.target.value })} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                                                </div>
                                            </div>

                                            {submitStatus === 'error' && <p className="text-red-500 font-medium text-sm pt-2">Failed to submit request. Please try again.</p>}

                                            <button type="submit" disabled={submitStatus === 'loading'} className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl hover:bg-green-800 transition-colors shadow-lg mt-6 flex justify-center items-center gap-2">
                                                {submitStatus === 'loading' ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
                                                {submitStatus === 'loading' ? 'Sending...' : 'Submit Request'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
