'use client';

import React, { useState, useEffect } from 'react';
import { API } from '@/constants/api';

export default function CookieConsent() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setShow(true);
        } else if (consent === 'true') {
            recordVisit();
        }
    }, []);

    const recordVisit = async () => {
        try {
            const deviceType = window.innerWidth < 768 ? 'Mobile' : 'Desktop';
            await fetch(API.TRAFFIC_VISIT || '/api/traffic/visit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    path: window.location.pathname,
                    device_type: deviceType,
                    consent_given: true
                })
            });
        } catch (e) { /* ignore */ }
    };

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true');
        setShow(false);
        recordVisit();
    };

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'false');
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9000] p-4 animate-slide-in-up">
            <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border border-primary/10 p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                    <h4 className="text-lg font-bold text-primary mb-1 flex items-center gap-2">
                        <i className="fa-solid fa-cookie-bite"></i> We use cookies
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        We use cookies to improve your experience and track site traffic. By clicking "Accept", you consent to our use of cookies.
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button 
                        onClick={handleDecline}
                        className="flex-1 md:flex-none px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition"
                    >
                        Decline
                    </button>
                    <button 
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-8 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
