'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { API } from '@/constants/api';
import { COLORS } from '@/constants/styles';
import SectionHeading from '@/components/ui/SectionHeading';

type Tab = 'story' | 'team' | 'process' | 'visit';

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
  process: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93l-1.41 1.41M16.24 7.76A6 6 0 015.76 18.24M4.93 4.93l1.41 1.41M7.76 7.76A6 6 0 0118.24 18.24M12 2v2M12 20v2M2 12h2M20 12h2" />
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
  { id: 'team', label: 'Founder\'s Note' },
  { id: 'process', label: 'Our Process' },
  { id: 'visit', label: 'Visit Factory' },
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
const PROCESS_STEPS = [
  {
    id: 1, title: 'Procurement', tag: 'Origin',
    image: '/images/Rectangle-112.jpg', video: null as string | null, noMedia: false,
    body: `We procure the highest-quality raw cashew nuts from farmers at the origin. At least 90% of the raw cashews processed are acquired directly from the farm-gate and the remaining from certified raw cashew trading companies. We acquire only the finest quality raw cashew nuts from esteemed origins in Africa to manufacture prime cashew kernels for customers worldwide.`,
    fact: 'Sourced from Tanzania, Ghana & Benin',
  },
  {
    id: 2, title: 'Drying', tag: 'Preservation',
    image: '/images/cashew-drying.jpg', video: null, noMedia: false,
    body: `After procuring high-quality raw cashew nuts from farm-gate, they are dried to reduce moisture content, preventing deterioration during storage and greatly increasing shelf-life. We use modern drying methods and machinery which keeps the nuts healthy and reduces processing time required.`,
    fact: 'Moisture reduced for maximum shelf-life',
  },
  {
    id: 3, title: 'Roasting', tag: 'Processing',
    image: null, video: null, noMedia: true,
    body: `Raw cashew nuts are steamed to make shells brittle and easy to cut. Once the steaming process is complete, nuts are spread evenly on a clean surface for air drying. We employ technically designed steam roasting boilers that help remove the shell with minimal effort.`,
    fact: 'Steam boilers designed for precision',
  },
  {
    id: 4, title: 'Shelling', tag: 'Extraction',
    image: null, video: '/videos/cashew_shelling (1)-transcode.mp4', noMedia: false,
    body: `Due to the unique kidney shape of the raw cashew nut, it has an outer shell that is very hard to crack. The shell contains an oil called CNSL with several industrial applications. We use highly developed shelling technology to separate cashew shell and kernels.`,
    fact: 'Highest % of unbroken whole kernels',
  },
  {
    id: 5, title: 'Peeling', tag: 'Refinement',
    image: null, video: '/videos/Cashew-Process-Peeling-transcode.mp4', noMedia: false,
    body: `Peeling removes the testa/skin from the kernel using friction and air pressure. We have an integrated system of machines and skilled workforce that enables us to continuously improve our peeling process and minimize the occurrence of broken kernels.`,
    fact: 'Integrated machine + skilled labour system',
  },
  {
    id: 6, title: 'Grading', tag: 'Quality',
    image: null, video: '/videos/cashew-grading-transcode.mp4', noMedia: false,
    body: `Cashew Kernels are graded into white / scorched wholes, splits, butts and more. Depending on shape, size and colour there are more than 25 grades of cashew kernels. We achieve accuracy and consistency in grading by using specially designed machines paired with highly-trained skilled labour.`,
    fact: '25+ grades sorted with precision',
  },
  {
    id: 7, title: 'Packaging', tag: 'Delivery',
    image: '/images/packaging.jpg', video: null, noMedia: false,
    body: `At the last stage, cashew kernels pass through Infra-red heating and a dust cleaner to remove any foreign particles. Our 3-layered packaging includes tin, plastic and nitrogen gas sealing that makes it moisture-free and highly durable.`,
    fact: '3-layer nitrogen-sealed for freshness',
  },
];

const TEAM = [
  {
    name: 'Suresh Jindal', initial: 'SJ', color: '#000000',
    role: 'Mentor & Investor',
    bio: 'With his rich experience of more than 40 years, Suresh has been an involved mentor, investor and a profound leader for the company. He is a fitness freak and always aims for perfection in every task that he does.',
  },
  {
    name: 'Naveen Jindal', initial: 'NJ', color: '#F6B000',
    role: 'Head of Procurement & Sales',
    bio: 'Naveen is the head of the procurement and sales department. He has a vast experience of 10+ years of procurement. He did his graduation and masters from Bangalore. He is an active sportsperson who has played state level cricket.',
  },
  {
    name: 'Nitesh Jindal', initial: 'NT', color: '#000000',
    role: 'Finance & Technology',
    bio: 'Nitesh brings a modern perspective to the team with his 2+ years of experience in a cashew manufacturing company in South India. He handles finances and explores technology adoptions for the company.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PROCESS MEDIA
// ─────────────────────────────────────────────────────────────────────────────
function ProcessMedia({ step, active }: { step: typeof PROCESS_STEPS[0]; active: boolean }) {
  if (step.noMedia) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-stone-800 via-amber-800 to-amber-600 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 22px,rgba(255,255,255,0.025) 22px,rgba(255,255,255,0.025) 44px)'
        }} />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="flex gap-5 mb-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-0.5 bg-white/50 rounded-full"
                style={{ height: 52, animation: active ? `steamRise 2.4s ease-in-out ${i * 0.6}s infinite` : 'none' }} />
            ))}
          </div>
          <div className="w-24 h-14 rounded-xl bg-stone-900/50 border border-amber-600/30 flex items-center justify-center">
            <span className="text-4xl text-amber-300/80">♨</span>
          </div>
          <p className="text-white/50 text-xs tracking-[0.2em] uppercase mt-2">Steam Roasting</p>
        </div>
      </div>
    );
  }
  if (step.video) {
    return (
      <video key={step.video} autoPlay={active} loop muted playsInline className="w-full h-full object-cover">
        <source src={step.video} type="video/mp4" />
      </video>
    );
  }
  if (step.image) {
    return <img src={step.image} alt={step.title} className="w-full h-full object-cover" />;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOK PROCESS (Desktop)
// ─────────────────────────────────────────────────────────────────────────────
function BookProcess() {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState<'next' | 'prev'>('next');
  const [animKey, setAnimKey] = useState(0);
  const total = PROCESS_STEPS.length;
  const step = PROCESS_STEPS[page];

  const go = (direction: 'next' | 'prev') => {
    if (direction === 'next' && page >= total - 1) return;
    if (direction === 'prev' && page <= 0) return;
    setDir(direction);
    setAnimKey(k => k + 1);
    setPage(p => direction === 'next' ? p + 1 : p - 1);
  };

  return (
    <div className="about-animate select-none">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-black text-black">Our Process</h2>
          <p className="text-black/40 text-sm mt-0.5">From farm-gate in Africa to your table — 7 steps of care</p>
        </div>
        <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">{page + 1} / {total}</span>
      </div>

      <div className="book-wrapper relative rounded-2xl overflow-hidden border border-amber-100"
        style={{ background: '#fdf8f0', boxShadow: '0 8px 40px rgba(120,80,20,0.10), 0 2px 8px rgba(0,0,0,0.04)' }}>
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-amber-200/60 z-10 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-8 flex items-center px-6 gap-3 z-10" style={{ background: '#f5ede0' }}>
          <div className="flex gap-1.5">
            {PROCESS_STEPS.map((_, i) => (
              <button key={i} onClick={() => { setDir(i > page ? 'next' : 'prev'); setAnimKey(k => k + 1); setPage(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === page ? 'w-5' : 'bg-amber-300/50 w-1.5 hover:bg-amber-400/70'}`}
                style={i === page ? { backgroundColor: '#F6B000' } : {}} />
            ))}
          </div>
          <div className="ml-auto">
            <span className="text-[10px] font-bold text-amber-700/50 uppercase tracking-widest">Crunchy Cashews</span>
          </div>
        </div>

        <div key={animKey} className={`flex h-[420px] pt-8 page-turn-${dir}`}>
          <div className="w-1/2 relative overflow-hidden" style={{ background: '#f0e8d8' }}>
            <div className="absolute bottom-0 right-0 w-8 h-8 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(225deg, #fdf8f0 50%, transparent 50%)' }} />
            <div className="absolute bottom-3 left-5 text-[10px] font-bold text-amber-700/40 z-10">pg. {(page + 1) * 2 - 1}</div>
            <div className="absolute inset-0 top-0">
              <ProcessMedia step={step} active={true} />
              <div className="absolute inset-0 mix-blend-multiply opacity-20"
                style={{ background: 'linear-gradient(180deg, #c8a06e 0%, transparent 60%)' }} />
            </div>
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-black text-xs font-black shadow-lg" style={{ backgroundColor: '#F6B000' }}>
                {step.id}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/90 drop-shadow-sm bg-black/20 px-2 py-0.5 rounded-full">
                {step.tag}
              </span>
            </div>
          </div>

          <div className="w-1/2 flex flex-col justify-between px-8 py-5 relative" style={{ background: '#fdf8f0' }}>
            <div className="absolute inset-0 top-8"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #e8dcc8 27px, #e8dcc8 28px)',
                backgroundPosition: '0 16px',
              }} />
            <div className="absolute bottom-3 right-5 text-[10px] font-bold text-amber-700/40 z-10">pg. {(page + 1) * 2}</div>

            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700/60 mb-1">Step {step.id} — {step.tag}</p>
              <h3 className="font-heading font-black text-2xl text-gray-800 mb-4 leading-tight" style={{ fontStyle: 'italic' }}>{step.title}</h3>
              <p className="text-gray-600 text-sm leading-[1.85] mb-5">{step.body}</p>
              <div className="inline-block px-3 py-2 rounded"
                style={{ background: '#fffbe8', boxShadow: '2px 2px 6px rgba(0,0,0,0.08)', transform: 'rotate(-0.5deg)' }}>
                <p className="text-xs font-semibold text-amber-800">✦ {step.fact}</p>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between mt-4">
              <button onClick={() => go('prev')} disabled={page === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${page === 0
                  ? 'opacity-25 cursor-not-allowed border-gray-200 text-gray-300'
                  : 'border-amber-200 text-amber-800 hover:bg-amber-50 active:scale-95'}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                <span className="hidden sm:inline">Previous</span>
              </button>
              <div className="flex gap-1">
                {PROCESS_STEPS.map((_, i) => (
                  <button key={i} onClick={() => { setDir(i > page ? 'next' : 'prev'); setAnimKey(k => k + 1); setPage(i); }}
                    className={`rounded-full transition-all duration-300 ${i === page ? 'w-5 h-1.5' : 'bg-amber-300/50 w-1.5 h-1.5 hover:bg-amber-500/50'}`}
                    style={i === page ? { backgroundColor: '#F6B000' } : {}} />
                ))}
              </div>
              <button onClick={() => go('next')} disabled={page === total - 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${page === total - 1
                  ? 'opacity-25 cursor-not-allowed border-gray-200 text-gray-300'
                  : 'border-black text-black hover:bg-black hover:text-white active:scale-95'}`}>
                <span className="hidden sm:inline">Next</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <a href="/document/Guide-Book-on-Crunchy-Cashew-Processing-Process.pdf"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold hover:underline" style={{ color: COLORS.primary }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
          Download Full Process Guide
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE PROCESS
// ─────────────────────────────────────────────────────────────────────────────
function MobileProcess() {
  const [visible, setVisible] = useState<Set<number>>(new Set());
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          const idx = Number((e.target as HTMLElement).dataset.idx);
          if (e.isIntersecting) setVisible(v => new Set([...v, idx]));
        });
      },
      { threshold: 0.2 }
    );
    refs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="about-animate">
      <h2 className="text-2xl font-heading font-black text-black mb-1">Our Process</h2>
      <p className="text-black/40 text-sm mb-6">7 steps from farm-gate to your table</p>
      <div className="space-y-5">
        {PROCESS_STEPS.map((step, idx) => (
          <div key={step.id} ref={el => { refs.current[idx] = el; }} data-idx={idx}
            className="mobile-card rounded-xl overflow-hidden border border-amber-100/80"
            style={{
              background: '#fdf8f0',
              boxShadow: '0 2px 12px rgba(120,80,20,0.07)',
              opacity: visible.has(idx) ? 1 : 0,
              transform: visible.has(idx) ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.5s ease ${idx * 0.05}s, transform 0.5s ease ${idx * 0.05}s`,
            }}>
            <div className="aspect-video w-full overflow-hidden relative">
              <ProcessMedia step={step} active={visible.has(idx)} />
              <div className="absolute inset-0 mix-blend-multiply opacity-15"
                style={{ background: 'linear-gradient(180deg, #c8a06e 0%, transparent 70%)' }} />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-black text-xs font-black shadow" style={{ backgroundColor: '#F6B000' }}>
                  {step.id}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/90 bg-black/20 px-2 py-0.5 rounded-full">
                  {step.tag}
                </span>
              </div>
            </div>
            <div className="px-5 pt-4 pb-5 relative">
              <div className="absolute inset-0"
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, #e8dcc8 23px, #e8dcc8 24px)',
                  backgroundPosition: '0 12px',
                  opacity: 0.4,
                }} />
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700/60 mb-0.5">Step {step.id}</p>
                <h3 className="font-heading font-black text-lg text-gray-800 mb-2" style={{ fontStyle: 'italic' }}>{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{step.body}</p>
                <div className="inline-block px-3 py-1.5 rounded text-xs font-semibold text-amber-800"
                  style={{ background: '#fffbe8', boxShadow: '1px 1px 4px rgba(0,0,0,0.07)' }}>
                  ✦ {step.fact}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <a href="/documents/Guide-Book-on-Crunchy-Cashew-Processing-Process.pdf"
        target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-6 font-semibold px-5 py-2.5 rounded-lg transition-all shadow-md text-sm active:scale-95"
        style={{ backgroundColor: '#000000', color: '#F6B000' }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
        Download Full Process Guide
      </a>
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
      <div className="about-animate space-y-16">
        {/* 2. The Core Mission: Who You Are */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.2em] text-amber-700 uppercase">The Core Mission</span>
            </div>
            <SectionHeading
              text="Modern Infrastructure,"
              highlight="Rooted in Tradition."
              textColor="#000000"
              className="text-3xl md:text-4xl"
            />
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Located in the industrial hub of Siliguri, West Bengal, Yu Nut Processing Industry was built on a singular vision: to bridge the gap between premium global agriculture and domestic B2B demands. We operate a highly advanced, end-to-end processing facility dedicated to producing the finest cashew kernels. By combining rigorous food safety standards with scalable production methods, we ensure that every batch meets the precise specifications of our wholesale and retail partners.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] md:aspect-square relative group">
            <img
              src="/images/Rectangle-112.jpg"
              alt="Yu Nut Processing Facility Exterior"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* 3. Supply Chain & Sourcing: The Origin Story */}
        <div className="bg-gray-50 rounded-[2.5rem] p-8 md:p-14 border border-gray-100">
          <div className="max-w-3xl mx-auto text-center mb-12 flex flex-col items-center">
            <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Global Supply Chain</span>
            <SectionHeading
              text="Ethically Sourced from the"
              highlight="World’s Best."
              textColor="#000000"
              className="text-2xl md:text-4xl"
            />
            <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-4">
              Great cashews start long before they reach our facility. We ethically source our raw materials directly from top cashew-producing regions in Africa, including Tanzania, Ghana, and Benin. By working closely with origin markets, we ensure high crop yields and maintain complete transparency and traceability from the African soil directly to our Siliguri plant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'fa-earth-africa', title: 'African Origins', desc: 'Tanzania, Ghana & Benin' },
              { icon: 'fa-hand-holding-heart', title: 'Ethical Trade', desc: 'Direct Farm-gate Sourcing' },
              { icon: 'fa-route', title: 'Complete Traceability', desc: 'Soil to Factory Tracking' },
            ].map(item => (
              <div key={item.title} className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-5 text-[#F6B000] text-2xl">
                  <i className={`fa-solid ${item.icon}`} />
                </div>
                <h4 className="font-black text-gray-900 mb-2 uppercase tracking-tight text-sm">{item.title}</h4>
                <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Processing & Scale: Proof of Capability */}
        <div className="space-y-12 py-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <SectionHeading
                text="Precision Manufacturing"
                highlight="at Scale."
                textColor="#000000"
                className="text-3xl md:text-4xl"
              />
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-4">
                Our 28,800 sq. ft. facility is equipped to handle high-volume demands without compromising on grade or quality.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-black text-[#F6B000] px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl h-fit">
              <i className="fa-solid fa-industry text-base" /> 28,800 Sq. Ft.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div key={point.title} className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-amber-400 hover:shadow-2xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-black mb-6 group-hover:bg-amber-400 group-hover:rotate-6 transition-all">
                  <i className={`fa-solid ${point.icon} text-xl`} />
                </div>
                <h3 className="font-black text-gray-900 mb-3 text-lg">{point.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery Divider */}
        <div className="pt-8 border-t border-gray-100">
          <AboutImageGrid />
        </div>
      </div>
    );

    if (activeTab === 'team') return (
      <div className="about-animate">
        <div className="block w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 mb-6 w-fit">
            <span className="w-2 h-2 rounded-full bg-black"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">The Owner's Note</span>
          </div>

          <SectionHeading
            text="A Commitment to"
            highlight="Uncompromising Quality."
            textColor="#000000"
            className="text-3xl md:text-4xl mb-8"
          />

          <div className="text-gray-600 text-sm md:text-base leading-relaxed mb-10 relative block">
            {/* Floated Image */}
            <div className="float-none md:float-right w-full md:w-1/2 lg:w-[45%] md:ml-8 mb-6 mt-2 relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="/images/nitesh.png"
                alt="Nitesh Jindal - Founder"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Text Content */}
            <p className="mb-5">
              "When I established Yu Nut Processing Industry in Siliguri, my goal wasn't just to enter the cashew market—it was to elevate it. I saw an opportunity to bring better technology, stricter quality controls, and a more ethical supply chain to the Indian B2B landscape.
            </p>
            <p className="mb-5">
              Today, from personally overseeing our raw material sourcing from Africa to implementing data-driven production standards on our factory floor, my focus remains the same: ensuring that every batch of Crunchy Cashews that leaves our facility represents the pinnacle of taste, nutrition, and reliability.
            </p>
            <p className="font-medium text-gray-800 mb-5">
              When you partner with us, you aren't just buying cashews; you are trusting my team's dedication to your business's success."
            </p>

            <div className="clear-both"></div>
          </div>

          <div className="pt-8 border-t border-gray-100 max-w-lg">
            <div className="mb-1" style={{ fontFamily: "'Brush Script MT', 'Great Vibes', cursive", fontSize: '2.5rem', color: '#111' }}>
              Nitesh Jindal
            </div>
            <p className="font-black text-gray-900 text-sm uppercase tracking-widest mb-1">
              Nitesh Jindal
            </p>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#F6B000' }}>
              Managing Director & Proprietor,
              <br />Yu Nut Processing Industry
            </p>
          </div>
        </div>
      </div>
    );

    if (activeTab === 'process') return (
      <>
        <div className="hidden md:block"><BookProcess /></div>
        <div className="md:hidden"><MobileProcess /></div>
      </>
    );

    if (activeTab === 'visit') return (
      <div className="about-animate">
        <div className="mb-6">
          <span className="inline-block font-bold uppercase tracking-widest text-xs px-3 py-1 rounded-full mb-3"
            style={{ backgroundColor: '#F6B000', color: '#000000' }}>Exclusive Tour</span>
          <SectionHeading
            text="See the"
            highlight="Magic Happen"
            textColor="#000000"
            className="text-2xl md:text-3xl mb-4"
          />
          <p className="text-black/50 text-sm leading-relaxed max-w-lg">
            We invite bulk buyers, B2B partners, and food industry professionals to visit our Siliguri processing
            facility and witness our state-of-the-art roasting lines firsthand.
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-5 md:p-6 border border-gray-100">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">Request a Factory Visit</h3>
          {submitStatus === 'success' ? (
            <div className="bg-amber-50 text-black p-6 rounded-xl border border-amber-100 text-center">
              <svg className="w-8 h-8 mx-auto mb-3 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M9 16l2 2 4-4" /></svg>
              <p className="font-bold text-lg mb-1">Request Received!</p>
              <p className="text-sm text-black/60">Our tour coordinator will contact you shortly to confirm.</p>
            </div>
          ) : (
            <form onSubmit={handleVisitSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Full Name *</label>
                  <input required type="text" value={visitForm.name}
                    onChange={e => setVisitForm({ ...visitForm, name: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-400 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Email Address *</label>
                  <input required type="email" value={visitForm.email}
                    onChange={e => setVisitForm({ ...visitForm, email: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-400 transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Company Name</label>
                  <input type="text" value={visitForm.company}
                    onChange={e => setVisitForm({ ...visitForm, company: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-400 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Requested Date *</label>
                  <input required type="date" value={visitForm.date}
                    onChange={e => setVisitForm({ ...visitForm, date: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-400 transition-all" />
                </div>
              </div>
              {submitStatus === 'error' && <p className="text-red-500 text-xs font-medium">Failed to submit. Please try again.</p>}
              <button type="submit" disabled={submitStatus === 'loading'}
                className="w-full font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-60 active:scale-95"
                style={{ backgroundColor: '#000000', color: '#F6B000' }}>
                {submitStatus === 'loading'
                  ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Sending...</>
                  : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg> Submit Request</>}
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
                    setActiveTab('process');
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
      <div id="about-tabs" className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-6">

          {/* DESKTOP: normal horizontal tabs */}
          <div className="hidden md:flex">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-200'}`}>
                <span className={activeTab === tab.id ? 'text-black' : 'text-gray-400'}>
                  {Icons[tab.id]}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* MOBILE: accordion tab bar — selected shows text, others collapse to icon */}
          <div className="flex md:hidden items-stretch">
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center justify-center gap-2 py-3.5 transition-all duration-300 border-b-2 font-bold text-sm ${isActive
                    ? 'border-black text-black flex-[3]'
                    : 'border-transparent text-gray-400 flex-1'
                    }`}
                  style={{ minWidth: 0 }}
                >
                  {/* Icon always visible */}
                  <span
                    className="flex-shrink-0 transition-all duration-300"
                    style={{ color: isActive ? '#000' : '#9ca3af' }}
                  >
                    {Icons[tab.id]}
                  </span>
                  {/* Label — only visible when active, animates in */}
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isActive ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0'}`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTENT CARD */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-10">
          {renderContent()}
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes about-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .about-animate { animation: about-in 0.28s ease both; }

        @keyframes steamRise {
          0%,100% { transform: translateY(0) scaleX(1); opacity: 0.5; }
          50%     { transform: translateY(-20px) scaleX(1.6); opacity: 0.1; }
        }

        @keyframes pageTurnNext {
          0%   { opacity: 0; transform: translateX(32px) rotateY(-6deg); }
          100% { opacity: 1; transform: translateX(0) rotateY(0deg); }
        }
        @keyframes pageTurnPrev {
          0%   { opacity: 0; transform: translateX(-32px) rotateY(6deg); }
          100% { opacity: 1; transform: translateX(0) rotateY(0deg); }
        }

        .page-turn-next {
          animation: pageTurnNext 0.38s cubic-bezier(0.22, 0.61, 0.36, 1) both;
          transform-origin: left center;
          perspective: 900px;
        }
        .page-turn-prev {
          animation: pageTurnPrev 0.38s cubic-bezier(0.22, 0.61, 0.36, 1) both;
          transform-origin: right center;
          perspective: 900px;
        }

        .book-wrapper { perspective: 1200px; }
      `}</style>
    </div>
  );
}