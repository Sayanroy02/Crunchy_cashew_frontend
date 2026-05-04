'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { API } from '@/constants/api';
import { COLORS } from '@/constants/styles';
import SectionHeading from '@/components/ui/SectionHeading';

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
  { url: 'https://res.cloudinary.com/da1acfqsn/image/upload/v1741088656/11_vst0e1.png', alt: 'Factory Process', span: 'col-span-2 row-span-2' },
  { url: 'https://res.cloudinary.com/da1acfqsn/image/upload/v1741088656/10_ivq7i7.png', alt: 'Premium Cashews', span: 'col-span-1 row-span-1' },
  { url: 'https://res.cloudinary.com/da1acfqsn/image/upload/v1741088656/9_f8f8f8.png', alt: 'Quality Control', span: 'col-span-1 row-span-2' },
  { url: 'https://res.cloudinary.com/da1acfqsn/image/upload/v1741088655/8_g7g7g7.png', alt: 'Packaging', span: 'col-span-1 row-span-1' },
  { url: 'https://res.cloudinary.com/da1acfqsn/image/upload/v1741088655/7_h8h8h8.png', alt: 'Storage', span: 'col-span-2 row-span-1' },
  { url: 'https://res.cloudinary.com/da1acfqsn/image/upload/v1741088655/6_j9j9j9.png', alt: 'Expert Workforce', span: 'col-span-1 row-span-1' },
  { url: 'https://res.cloudinary.com/da1acfqsn/image/upload/v1741088654/5_k0k0k0.png', alt: 'Modern Machinery', span: 'col-span-1 row-span-2' },
  { url: 'https://res.cloudinary.com/da1acfqsn/image/upload/v1741088654/4_l1l1l1.png', alt: 'African Origins', span: 'col-span-1 row-span-1' },
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
function Gallery() {
  return (
    <div className="about-animate">
      <div className="mb-10">
        <SectionHeading
          text="Our Factory"
          highlight="Gallery"
          textColor="#000000"
          className="text-3xl md:text-4xl"
        />
        <p className="text-gray-500 mt-4 max-w-2xl">
          A glimpse into our state-of-the-art processing facility in Siliguri, where technology meets tradition.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
        {GALLERY_IMAGES.map((img, i) => (
          <div
            key={i}
            className={`${img.span} rounded-2xl overflow-hidden group relative shadow-lg hover:shadow-2xl transition-all duration-500`}
          >
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <p className="text-white font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
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
                textColor="#000000"
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
                <source src="/videos/cashew-grading-transcode.mp4" type="video/mp4" />
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
              <source src="/videos/cashew-grading-transcode.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* 3. Supply Chain & Sourcing: The Origin Story */}
        <div className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
            {/* Desktop Image: On the left */}
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
                  textColor="#000000"
                  className="text-3xl md:text-5xl"
                />
              </div>

              {/* Mobile Image: After heading on mobile */}
              <div className="md:hidden w-full rounded-3xl overflow-hidden aspect-video shadow-xl">
                <img
                  src="/images/Rectangle-112.jpg"
                  alt="Global Sourcing Map"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Great cashews start long before they reach our facility. We ethically source our raw materials directly from top cashew-producing regions in Africa, including Tanzania, Ghana, and Benin. By working closely with origin markets, we ensure high crop yields and maintain complete transparency and traceability from the African soil directly to our Siliguri plant.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Processing & Scale: Proof of Capability */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <SectionHeading
                text="Precision Manufacturing"
                highlight="at Scale."
                textColor="#000000"
                className="text-3xl md:text-5xl"
              />
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-4">
                Our 28,800 sq. ft. facility is equipped to handle high-volume demands without compromising on grade or quality.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-black text-[#F6B000] px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl h-fit">
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
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-black mb-6 group-hover:bg-[#F6B000] group-hover:rotate-6 transition-all shadow-sm">
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
              text="A Commitment to"
              highlight="Uncompromising Quality."
              textColor="#000000"
              className="text-3xl md:text-5xl"
            />

            <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-6">
              <p className="italic text-lg text-gray-800 border-l-4 border-[#F6B000] pl-6 py-2">
                "When I established Yu Nut Processing Industry in Siliguri, my goal wasn't just to enter the cashew market—it was to elevate it."
              </p>
              <p>
                Today, from personally overseeing our raw material sourcing from Africa to implementing data-driven production standards on our factory floor, my focus remains the same: ensuring that every batch of Crunchy Cashews that leaves our facility represents the pinnacle of taste, nutrition, and reliability.
              </p>
              <p className="font-medium text-gray-800">
                When you partner with us, you aren't just buying cashews; you are trusting my team's dedication to your business's success.
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
              textColor="#000000"
              className="text-3xl md:text-5xl"
            />

            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Our workforce is the backbone of Crunchy Cashews. We employ over 150+ skilled workers, primarily from the local community in Siliguri, West Bengal. Every individual is trained in rigorous food safety standards and precise processing techniques, ensuring that every kernel is handled with the utmost care.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-[2rem] shadow-sm">
                <p className="text-3xl font-black text-black mb-1">150+</p>
                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Skilled Artisans</p>
              </div>
              <div className="p-6 bg-white rounded-[2rem] shadow-sm">
                <p className="text-3xl font-black text-black mb-1">90%</p>
                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Local Employment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    if (activeTab === 'gallery') return <Gallery />;

    if (activeTab === 'visit') return (
      <div className="about-animate max-w-4xl mx-auto">
        <div className="mb-12">
          <span className="inline-block font-bold uppercase tracking-widest text-[10px] px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: '#F6B000', color: '#000000' }}>Exclusive Factory Tour</span>
          <SectionHeading
            text="Witness the"
            highlight="Magic Firsthand."
            textColor="#000000"
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
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name *</label>
                  <input required type="text" value={visitForm.name}
                    onChange={e => setVisitForm({ ...visitForm, name: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#F6B000]/50 transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address *</label>
                  <input required type="email" value={visitForm.email}
                    onChange={e => setVisitForm({ ...visitForm, email: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#F6B000]/50 transition-all shadow-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Company Name</label>
                  <input type="text" value={visitForm.company}
                    onChange={e => setVisitForm({ ...visitForm, company: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#F6B000]/50 transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Requested Date *</label>
                  <input required type="date" value={visitForm.date}
                    onChange={e => setVisitForm({ ...visitForm, date: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#F6B000]/50 transition-all shadow-sm" />
                </div>
              </div>
              {submitStatus === 'error' && <p className="text-red-500 text-xs font-medium text-center">Failed to submit. Please try again.</p>}
              <button type="submit" disabled={submitStatus === 'loading'}
                className="w-full font-black py-5 rounded-[2rem] transition-all shadow-2xl flex items-center justify-center gap-3 text-sm disabled:opacity-60 active:scale-[0.98]"
                style={{ backgroundColor: '#000000', color: '#F6B000' }}>
                {submitStatus === 'loading'
                  ? <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Processing...</>
                  : <><i className="fa-solid fa-paper-plane" /> Submit Visit Request</>}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-16 bg-[#FFF9E7]`}>

      {/* VIDEO HERO */}
      <section className="relative h-[80vh] min-h-[550px] max-h-[850px] overflow-hidden">
        <video autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/Rectangle-112.jpg">
          <source src="https://res.cloudinary.com/da1acfqsn/video/upload/v1777747446/VN20260503_001215_u2yinn.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="max-w-5xl mx-auto w-full flex flex-col items-center md:items-start">
            <div className="max-w-3xl text-center md:text-left flex flex-col items-center md:items-start">
              <span className="inline-block font-bold tracking-[0.25em] uppercase text-[10px] md:text-xs mb-4 px-3 py-1 bg-[#F6B000] text-black rounded-sm shadow-lg">
                Industry Leaders
              </span>
              <h1 className="text-[24px] md:text-[36px] font-heading font-black text-white leading-[1.2] mb-6 drop-shadow-2xl">
                Redefining Quality in<br />
                <span style={{ color: '#F6B000' }}>Cashew Manufacturing.</span>
              </h1>
              <p className="text-white/90 text-sm md:text-lg max-w-2xl mb-10 leading-relaxed font-medium drop-shadow-md">
                Welcome to Yu Nut Processing Industry. From ethical sourcing to advanced processing, we deliver farm-fresh, premium cashews tailored for businesses across India.
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link
                  href="/bulk"
                  className="bg-[#F6B000] text-black font-black px-8 py-3.5 rounded-xl text-sm md:text-base hover:scale-105 transition-transform shadow-2xl flex items-center gap-2"
                >
                  <i className="fa-solid fa-handshake" />
                  Partner With Us
                </Link>
                <button
                  onClick={() => {
                    setActiveTab('gallery');
                    document.getElementById('about-tabs')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white/10 backdrop-blur-md border border-white/30 text-white font-black px-8 py-3.5 rounded-xl text-sm md:text-base hover:bg-white/20 transition-all shadow-xl flex items-center gap-2"
                >
                  <i className="fa-solid fa-industry" />
                  Explore Our Facility
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STICKY TABS ── */}
      <div id="about-tabs" className="sticky top-0 z-40 bg-[#FFF9E7]/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-start gap-6 md:gap-10 overflow-x-auto no-scrollbar py-1">
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 py-5 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap ${isActive
                    ? 'text-black'
                    : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <span className={`transition-colors duration-300 ${isActive ? 'text-[#F6B000]' : 'text-gray-300'}`}>
                    {Icons[tab.id]}
                  </span>
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F6B000] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        {renderContent()}
      </main>

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