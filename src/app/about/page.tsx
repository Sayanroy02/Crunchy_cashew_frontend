'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { API } from '@/constants/api';
import { COLORS } from '@/constants/styles';
import SectionHeading from '@/components/ui/SectionHeading';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'story' | 'team' | 'gallery' | 'visit';

// ─────────────────────────────────────────────────────────────────────────────
// LINE SVG ICONS
// ─────────────────────────────────────────────────────────────────────────────
const Icons = {
  story: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  team: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  gallery: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  visit: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
};

const TABS: { id: Tab; label: string }[] = [
  { id: 'story', label: 'Our Story' },
  { id: 'team', label: 'Our Team' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'visit', label: 'Visit Factory' },
];

const GALLERY_IMAGES = [
  { url: 'https://res.cloudinary.com/da1acfqsn/image/upload/q_auto,f_auto/v1780056001/1.jpg_tts2nh.jpg', alt: 'women empowerment', span: 'col-span-2 md:col-span-2 row-span-2' },
  { url: 'https://res.cloudinary.com/da1acfqsn/image/upload/q_auto,f_auto/v1780056001/2.jpg_t4fbgm.jpg', alt: 'cashews W210', span: 'col-span-1 md:col-span-1 row-span-1' },
  { url: 'https://res.cloudinary.com/da1acfqsn/image/upload/q_auto,f_auto/v1780056006/3.jpg_h0kocm.jpg', alt: 'cashew in maching', span: 'col-span-1 md:col-span-1 row-span-2' },
  { url: 'https://res.cloudinary.com/da1acfqsn/image/upload/q_auto,f_auto/v1780056000/4.jpg_blds0t.jpg', alt: 'cashew peeling', span: 'col-span-1 md:col-span-1 row-span-1' },
  { url: 'https://res.cloudinary.com/da1acfqsn/image/upload/q_auto,f_auto/v1780056000/5.jpg_aid2k6.jpg', alt: 'clean cashew processing', span: 'col-span-2 md:col-span-2 row-span-1' },
  { url: 'https://res.cloudinary.com/da1acfqsn/image/upload/q_auto,f_auto/v1780056001/6.jpg_h5bkrw.jpg', alt: 'cashew packaging crunchy cashew', span: 'col-span-2 md:col-span-2 row-span-1' },
];

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE CAROUSEL (5-col staggered grid with autoplay)
// ─────────────────────────────────────────────────────────────────────────────
// Staggered heights: first & last tallest, inner ones vary, center is largest
const ABOUT_IMAGES = [
  { src: '/images/About/1.png', h: 260 },
  { src: '/images/About/2.png', h: 220 },
  { src: '/images/About/3.png', h: 300 },
  { src: '/images/About/4.png', h: 220 },
  { src: '/images/About/5.png', h: 260 },
  { src: '/images/About/6.png', h: 200 },
];

function AboutImageGrid() {
  return (
    <div className="w-full">
      {/* Desktop: single staggered row aligned to bottom */}
      <div className="hidden md:flex items-end gap-3">
        {ABOUT_IMAGES.map((img, i) => (
          <div
            key={img.src}
            className="flex-1 rounded-2xl overflow-hidden flex-shrink-0"
            style={{ height: img.h }}
          >
            <img
              src={img.src}
              alt={`Factory image ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Mobile: 2-col grid */}
      <div className="grid md:hidden grid-cols-2 gap-2.5">
        {ABOUT_IMAGES.map((img, i) => (
          <div
            key={img.src}
            className={`rounded-xl overflow-hidden ${i === 0 ? 'col-span-2' : ''}`}
            style={{ height: i === 0 ? 180 : 140 }}
          >
            <img src={img.src} alt={`Factory ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
function Gallery({ onSelectImage }: { onSelectImage: (idx: number) => void }) {
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  return (
    <div className="about-animate">
      <div className="mb-10">
        <SectionHeading
          text="Our Factory"
          highlight="Gallery"
          textColor={COLORS.heading}
          className="text-3xl md:text-4xl"
        />
        <p className="text-gray-500 mt-4 max-w-2xl">
          A glimpse into our state-of-the-art processing facility in Siliguri, where technology meets tradition.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[160px] md:auto-rows-[220px] gap-4">
        {GALLERY_IMAGES.map((img, i) => (
          <div
            key={i}
            onClick={() => onSelectImage(i)}
            className={`${img.span} rounded-2xl overflow-hidden group relative shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-gray-100 border border-gray-200/50`}
          >
            {/* Shimmer loading spinner */}
            {!loaded[i] && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center z-10">
                <div className="w-8 h-8 border-4 border-amber-400/80 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                loaded[i] ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-md'
              }`}
              onLoadingComplete={() => setLoaded(prev => ({ ...prev, [i]: true }))}
              priority={i < 3}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
              <p className="text-white font-bold text-sm transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 capitalize">
                {img.alt}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<Tab>('story');
  const [isLoading, setIsLoading] = useState(true);
  const [visitForm, setVisitForm] = useState({ name: '', email: '', date: '', company: '' });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 380);
    return () => clearTimeout(t);
  }, [activeTab]);

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (activeIdx === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIdx(null);
      if (e.key === 'ArrowRight') setActiveIdx(prev => (prev !== null ? (prev + 1) % GALLERY_IMAGES.length : null));
      if (e.key === 'ArrowLeft') setActiveIdx(prev => (prev !== null ? (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length : null));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx]);

  // Reset zoom scale when changing images
  useEffect(() => {
    setZoomScale(1);
  }, [activeIdx]);

  const handleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    try {
      const res = await fetch(API.CONTACT_VISIT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitForm),
      });
      if (res.ok) {
        setSubmitStatus('success');
        setVisitForm({ name: '', email: '', date: '', company: '' });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else { setSubmitStatus('error'); }
    } catch { setSubmitStatus('error'); }
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://crunchycashews.in';
    const message = `source- ${currentOrigin}/about [From about page bottom banner]\n\nI would like to know more about bulk or white label services that you provide.`;
    window.open(`https://wa.me/917847996343?text=${encodeURIComponent(message)}`, '_blank');
  };

  function renderContent() {
    if (isLoading) {
      return (
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-52 bg-gray-100 rounded-lg" />
          <div className="h-4 w-full bg-gray-100 rounded-lg" />
          <div className="h-4 w-5/6 bg-gray-100 rounded-lg" />
          <div className="h-4 w-full bg-gray-100 rounded-lg" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
            {[0, 1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl" />)}
          </div>
        </div>
      );
    }

    if (activeTab === 'story') return (
      <div className="about-animate space-y-20">
        {/* 2. The Core Mission: Who You Are */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          <div className="flex flex-col space-y-6 md:space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-100/30 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.2em] text-amber-700 uppercase">The Core Mission</span>
              </div>
              <SectionHeading
                text="Modern Infrastructure,"
                highlight="Rooted in Tradition."
                textColor={COLORS.heading}
                className="text-3xl md:text-5xl"
              />
            </div>

            {/* Mobile Video: After heading, before content */}
            <div className="md:hidden w-full rounded-3xl overflow-hidden aspect-video shadow-xl">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="https://res.cloudinary.com/da1acfqsn/video/upload/v1777965573/cashew-grading-transcode_ebhjkf.mp4" type="video/mp4" />
              </video>
            </div>

            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Located in the industrial hub of Siliguri, West Bengal, Yu Nut Processing Industry was built on a singular vision: to bridge the gap between premium global agriculture and domestic B2B demands. We operate a highly advanced, end-to-end processing facility dedicated to producing the finest cashew kernels. By combining rigorous food safety standards with scalable production methods, we ensure that every batch meets the precise specifications of our wholesale and retail partners.
            </p>
          </div>

          {/* Desktop Video: On the right */}
          <div className="hidden md:block rounded-[2rem] overflow-hidden h-full relative group shadow-2xl">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            >
              <source src="https://res.cloudinary.com/da1acfqsn/video/upload/v1777965573/cashew-grading-transcode_ebhjkf.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* 3. Sourcing & Supply */}
        <div className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
            <div className="hidden md:block order-1 rounded-[2rem] overflow-hidden h-full relative group shadow-2xl">
              <img
                src="/images/Rectangle-112.jpg"
                alt="Global Sourcing Map"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="flex flex-col space-y-6 md:space-y-8 order-2">
              <div className="space-y-6">
                <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.3em] block">Global Supply Chain</span>
                <SectionHeading
                  text="Ethically Sourced from the"
                  highlight="World’s Best."
                  textColor={COLORS.heading}
                  className="text-3xl md:text-5xl"
                />
              </div>

              <div className="md:hidden w-full rounded-3xl overflow-hidden aspect-video shadow-xl">
                <img
                  src="/images/Rectangle-112.jpg"
                  alt="Global Sourcing Map"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Great cashews start long before they reach our facility. We ethically source our raw materials directly from top cashew-producing regions in Africa, including Tanzania, Ghana, and Benin. Sourcing directly ensures complete transparency and traceability from the African soil directly to our Siliguri plant.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Infrastructure & Scale */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <SectionHeading
                text="Precision Manufacturing"
                highlight="at Scale."
                textColor={COLORS.heading}
                className="text-3xl md:text-5xl"
              />
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-4">
                Our 28,800 sq. ft. facility is equipped to handle high-volume demands without compromising on grade or quality.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-green-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl h-fit">
              <i className="fa-solid fa-industry text-base" /> 28,800 Sq. Ft.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'fa-microchip',
                title: 'Advanced Technology',
                desc: 'Utilizing state-of-the-art automated machinery for perfect yields.'
              },
              {
                icon: 'fa-chart-line',
                title: 'Data-Driven Quality',
                desc: 'We utilize rigorous production reporting to maintain strict quality control.'
              },
              {
                icon: 'fa-award',
                title: 'Grade Perfection',
                desc: 'Capable of producing over 25 precise cashew grades.'
              },
            ].map(point => (
              <div key={point.title} className="p-8 rounded-3xl hover:bg-white/60 transition-all duration-300 group">
                <div className="w-14 h-14 bg-green-700 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#F6B000] group-hover:rotate-6 transition-all shadow-sm">
                  <i className={`fa-solid ${point.icon} text-xl`} />
                </div>
                <h3 className="font-black text-gray-900 mb-3 text-lg">{point.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    if (activeTab === 'team') return (
      <div className="about-animate space-y-24">
        {/* Founder Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-black"></span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">Founder's Vision</span>
            </div>

            <SectionHeading
              text="Quality,"
              highlight="Uncompromised."
              textColor={COLORS.heading}
              className="text-3xl md:text-5xl"
            />

            <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-6">
              <p className="italic text-lg text-gray-800 border-l-4 border-[#F6B000] pl-6 py-2">
                "When I established Yu Nut Processing Industry in Siliguri, my goal wasn't just to enter the cashew market—it was to elevate it."
              </p>
              <p>
                Today, from personally overseeing our raw material sourcing from Africa to implementing data-driven production standards on our factory floor, my focus remains the same: ensuring that every batch of Crunchy Cashews that leaves our facility represents the pinnacle of taste, nutrition, and reliability.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="mb-1" style={{ fontFamily: "'Brush Script MT', 'Great Vibes', cursive", fontSize: '2.5rem', color: '#111' }}>
                Nitesh Jindal
              </div>
              <p className="font-black text-gray-900 text-sm uppercase tracking-widest">
                Nitesh Jindal
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-[#F6B000]">
                Managing Director & Proprietor
              </p>
            </div>
          </div>

          <div className="order-1 md:order-2 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <img
              src="/images/nitesh.png"
              alt="Nitesh Jindal - Founder"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Workforce Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-10">
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl">
            <img
              src="https://res.cloudinary.com/da1acfqsn/image/upload/v1741088655/6_j9j9j9.png"
              alt="Our Skilled Workforce"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#F6B000]"></span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">Our Workforce</span>
            </div>

            <SectionHeading
              text="The Heart of"
              highlight="Our Industry."
              textColor={COLORS.heading}
              className="text-3xl md:text-5xl"
            />

            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Our workforce is the backbone of Crunchy Cashews. We employ over 150+ skilled workers, primarily from the local community in Siliguri, West Bengal.
            </p>
          </div>
        </div>
      </div>
    );

    if (activeTab === 'gallery') return <Gallery onSelectImage={(idx) => setActiveIdx(idx)} />;

    if (activeTab === 'visit') return (
      <div className="about-animate max-w-4xl mx-auto">
        <div className="mb-12">
          <span className="inline-block font-bold uppercase tracking-widest text-[10px] px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: '#F6B000', color: '#000000' }}>Exclusive Factory Tour</span>
          <SectionHeading
            text="Witness the"
            highlight="Magic Firsthand."
            textColor={COLORS.heading}
            className="text-3xl md:text-4xl mb-6"
          />
          <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl">
            We invite bulk buyers, B2B partners, and food industry professionals to visit our Siliguri facility and see our precision processing lines in action.
          </p>
        </div>

        <div className="bg-gray-50 rounded-[2.5rem] p-8 md:p-14 border border-gray-100 shadow-sm">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-10">Request a Factory Visit</h3>
          {submitStatus === 'success' ? (
            <div className="bg-white/60 backdrop-blur-sm text-black p-12 rounded-[2rem] text-center border border-amber-100 shadow-xl">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <p className="font-black text-2xl mb-2">Request Received!</p>
              <p className="text-gray-500">Our visit coordinator will contact you shortly to confirm the schedule.</p>
            </div>
          ) : (
            <form onSubmit={handleVisitSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="visit-name" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name *</label>
                  <input id="visit-name" required type="text" value={visitForm.name}
                    onChange={e => setVisitForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#F6B000]/50 transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="visit-email" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address *</label>
                  <input id="visit-email" required type="email" value={visitForm.email}
                    onChange={e => setVisitForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#F6B000]/50 transition-all shadow-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="visit-company" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Company Name</label>
                  <input id="visit-company" type="text" value={visitForm.company}
                    onChange={e => setVisitForm(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#F6B000]/50 transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="visit-date" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Requested Date *</label>
                  <input id="visit-date" required type="date" value={visitForm.date}
                    onChange={e => setVisitForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#F6B000]/50 transition-all shadow-sm" />
                </div>
              </div>
              {submitStatus === 'error' && <p className="text-red-500 text-xs font-medium text-center">Failed to submit. Please try again.</p>}
              <button type="submit" disabled={submitStatus === 'loading'}
                className="w-full bg-green-700 text-white p-4 md:px-8 md:py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:scale-100 disabled:active:scale-100">
                {submitStatus === 'loading'
                  ? <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Processing...</>
                  : <><i className="fa-solid fa-paper-plane text-xs" /> Submit Visit Request</>}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-16 bg-[#FFF9E7] relative`}>

      {/* Seamless Background Image (like bulk/shop page) */}
      <div className="absolute top-0 left-0 z-0 w-full h-[70vh]">
        <img
          src="https://res.cloudinary.com/da1acfqsn/image/upload/v1779214005/ChatGPT_Image_May_19_2026_11_31_49_PM_x5vgjt.png"
          alt="About Background"
          className="w-full h-full object-cover object-[center_20%] opacity-80"
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-[#FFF9E7] to-transparent pointer-events-none" />
      </div>

      {/* Floating Cashew Decoration */}
      {/* <div className="absolute top-[15%] left-0 w-[140px] pointer-events-none z-[5] hidden xl:block rotate-[-15deg]">
        <img
          src="/images/Fruit-3-1.png"
          alt=""
          className="w-full h-auto drop-shadow-2xl brightness-110"
        />
      </div> */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-16 lg:pt-20 flex flex-col items-center text-center">

        {/* Eyebrow tag */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="inline-flex items-center gap-2 bg-[#F6B000]/10 border border-[#F6B000]/30 text-[#c48a00] text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#F6B000] animate-pulse" />
          Industry Leaders
        </motion.div>

        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-sm max-w-3xl mb-6 text-center"
          style={{ color: COLORS.heading }}
        >
          Redefining Quality in{' '}
          <span
            className="inline-block md:whitespace-nowrap"
            style={{ color: COLORS.highlight }}
          >
            Cashew Manufacturing.
          </span>
        </h1>

        <p className="text-gray-700 text-sm md:text-lg max-w-2xl mb-10 leading-relaxed font-medium drop-shadow-sm">
          Welcome to Yu Nut Processing Industry. From ethical sourcing to advanced processing, we deliver farm-fresh, premium cashews tailored for businesses across India.
        </p>

        {/* <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 w-full sm:w-auto px-2">
          <Link
            href="/bulk"
            className="w-full sm:w-auto justify-center bg-[#F6B000] text-black font-black px-8 py-3.5 rounded-xl text-sm md:text-base hover:scale-105 transition-transform shadow-md flex items-center gap-2"
          >
            <i className="fa-solid fa-handshake" />
            Partner With Us
          </Link>
          <button
            onClick={() => {
              setActiveTab('gallery');
              document.getElementById('about-tabs')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto justify-center bg-white border-2 border-gray-200 text-gray-800 font-black px-8 py-3.5 rounded-xl text-sm md:text-base hover:border-[#F6B000] hover:text-black transition-all shadow-sm flex items-center gap-2"
          >
            <i className="fa-solid fa-industry text-[#F6B000]" />
            Explore Our Facility
          </button>
        </div> */}

        {/* ── TABS BELOW CTA (Segmented Control) ── */}
        <div id="about-tabs" className="w-full max-w-4xl px-2 pb-6" style={{ scrollMarginTop: '100px' }}>
          <div className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm p-1.5 md:p-2 rounded-[10px] md:rounded-2xl flex items-center justify-between overflow-x-auto no-scrollbar relative w-full gap-1">
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center justify-center gap-2 py-3 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-[0.1em] transition-all duration-300 z-10
                    ${isActive 
                      ? 'text-white px-4 md:px-5 flex-grow min-w-[120px] md:min-w-0 md:flex-1' 
                      : 'text-gray-500 hover:text-gray-800 px-3 md:px-5 flex-shrink-0 min-w-[50px] md:min-w-0 md:flex-1'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeAboutTab"
                      className="absolute inset-0 bg-[#00863D] rounded-lg md:rounded-xl z-[-1] shadow-sm"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {Icons[tab.id]}
                  </span>
                  <span className={`relative z-10 ${isActive ? 'inline' : 'hidden md:inline'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-12 md:gap-16">
        {renderContent()}

        {/* ── COMMON BANNER: Ready to Elevate Your Supply Chain? ── */}
        {activeTab !== 'visit' && (
          <section className="w-full animate-fade-in" aria-label="Bulk Supply CTA Banner">
            <div
              className="relative flex flex-col md:flex-row items-center justify-between gap-8 rounded-[32px] overflow-hidden px-8 md:px-12 py-8 md:py-10 shadow-2xl border border-white/10"
              style={{
                background: `linear-gradient(135deg, ${COLORS.heading} 0%, #006b31 100%)`,
                boxShadow: `0 12px 40px rgba(0, 134, 61, 0.15), 0 4px 12px rgba(0,0,0,0.1)`,
              }}
            >
              {/* Background dot pattern */}
              <div
                className="absolute inset-0 pointer-events-none opacity-45"
                style={{
                  backgroundImage: 'radial-gradient(circle, #ffffff0d 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />

              {/* Gold accent glow */}
              <div
                className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, #FDC7001A 0%, transparent 70%)' }}
              />

              {/* LEFT side content */}
              <div className="relative z-10 flex-1 text-center md:text-left flex flex-col items-center md:items-start">
                <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
                  Ready to Elevate <span style={{ color: COLORS.primary }}>Your Supply Chain</span>?
                </h2>
                <p className="text-white/80 text-sm md:text-base max-w-xl mt-3 mb-6 leading-relaxed font-medium">
                  Whether you need consistent bulk orders of premium grades or white-label solutions for your brand, we have the capacity and the quality to be your trusted manufacturing partner.
                </p>
                <div className="relative z-10 flex-shrink-0">
                  <a
                    id="bulk-quote-banner-cta"
                    onClick={handleWhatsAppClick}
                    href="#"
                    className="group font-black px-6 py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 whitespace-nowrap transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.primary} 0%, #FFD54F 100%)`,
                      color: '#000',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                    </svg>
                    Request a Bulk Quote
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="group-hover:translate-x-0.5 transition-transform">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* RIGHT side illustration */}
              <div className="relative z-10 flex-shrink-0 hidden md:block">
                <img
                  src="/images/iLLUSTARTION-1.png"
                  alt="Bulk quote illustration"
                  className="w-36 h-auto object-contain drop-shadow-2xl animate-pulse-subtle"
                  style={{ filter: 'drop-shadow(0 12px 24px rgba(253,199,0,0.2))' }}
                />
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Lightbox Pop-up Modal (Rendered at root level of AboutPage to avoid stacking context issues) */}
      <AnimatePresence>
        {activeIdx !== null && (
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/35 backdrop-blur-2xl p-4 transition-all duration-300"
            onClick={() => setActiveIdx(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-full max-w-4xl rounded-[28px] md:rounded-[36px] overflow-hidden p-5 md:p-7 flex flex-col z-[10000]"
              style={{
                  background: COLORS.heading,
                  boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Right Decorative Pattern — Stylized Grid */}
              <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-[0.08] translate-x-1/4 -translate-y-1/4 select-none"
                  style={{
                      backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                  }} />

              {/* Bottom Left Decorative Pattern — Concentric Circles */}
              <div className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none opacity-[0.06] -translate-x-1/3 translate-y-1/3 select-none">
                  {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="absolute inset-0 rounded-full border border-white"
                          style={{ transform: `scale(${0.2 * i})` }} />
                  ))}
              </div>

              {/* Subtle Gradient Overlay for Depth */}
              <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)' }} />

              {/* Close button */}
              <button 
                onClick={() => setActiveIdx(null)}
                className="absolute top-4 right-4 z-[10001] text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all text-base border border-white/10 shadow-lg active:scale-95"
                aria-label="Close Lightbox"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              {/* Main Image Container */}
              <div className="relative w-full h-[40vh] md:h-[50vh] rounded-2xl overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center">
                <div 
                  className="relative w-full h-full transition-transform duration-200 ease-out"
                  style={{ transform: `scale(${zoomScale})` }}
                >
                  <Image 
                    src={GALLERY_IMAGES[activeIdx].url}
                    alt={GALLERY_IMAGES[activeIdx].alt}
                    fill
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Mobile Caption */}
              <div className="mt-4 text-center md:hidden relative z-10">
                <h4 className="text-white text-base font-bold tracking-wide capitalize">
                  {GALLERY_IMAGES[activeIdx].alt}
                </h4>
              </div>

              {/* Bottom Controls Bar */}
              <div className="relative z-10 flex items-center justify-between gap-4 mt-4 w-full bg-white/5 border border-white/10 px-4 py-3 md:px-5 md:py-3.5 rounded-2xl backdrop-blur-md">
                {/* Navigation controls */}
                <div className="flex items-center gap-1.5 md:gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIdx(prev => (prev !== null ? (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length : null));
                    }}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all border border-white/15"
                    aria-label="Previous image"
                  >
                    <i className="fa-solid fa-chevron-left text-xs md:text-sm" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIdx(prev => (prev !== null ? (prev + 1) % GALLERY_IMAGES.length : null));
                    }}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all border border-white/15"
                    aria-label="Next image"
                  >
                    <i className="fa-solid fa-chevron-right text-xs md:text-sm" />
                  </button>
                  <span className="text-white/60 text-[11px] md:text-xs font-bold px-2 select-none">
                    {activeIdx + 1} / {GALLERY_IMAGES.length}
                  </span>
                </div>

                {/* Desktop Caption */}
                <div className="hidden md:block flex-1 text-center truncate px-2">
                  <h4 className="text-white font-bold text-sm tracking-wide capitalize">
                    {GALLERY_IMAGES[activeIdx].alt}
                  </h4>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1.5 md:gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomScale(prev => Math.max(prev - 0.25, 0.5));
                    }}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all border border-white/15 disabled:opacity-40"
                    aria-label="Zoom Out"
                    disabled={zoomScale <= 0.5}
                  >
                    <i className="fa-solid fa-magnifying-glass-minus text-xs md:text-sm" />
                  </button>
                  <span className="text-white text-[11px] md:text-xs font-bold w-12 text-center select-none bg-white/5 py-1.5 rounded-lg border border-white/5 hidden sm:inline-block">
                    {Math.round(zoomScale * 100)}%
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomScale(prev => Math.min(prev + 0.25, 3));
                    }}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all border border-white/15 disabled:opacity-40"
                    aria-label="Zoom In"
                    disabled={zoomScale >= 3}
                  >
                    <i className="fa-solid fa-magnifying-glass-plus text-xs md:text-sm" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes about-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .about-animate { animation: about-in 0.28s ease both; }
      `}</style>
    </div>
  );
}