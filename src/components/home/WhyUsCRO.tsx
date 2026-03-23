'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

// ─── Icons ────────────────────────────────────────────────────────────────────
const si = { fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const IcoFactory = () => <svg width="19" height="19" viewBox="0 0 24 24" {...si} stroke="currentColor"><rect x="2" y="12" width="20" height="10" rx="2" /><path d="M2 12l5-6h10l5 6" /><line x1="12" y1="12" x2="12" y2="22" /><line x1="7" y1="22" x2="7" y2="16" /><line x1="17" y1="22" x2="17" y2="16" /></svg>;
const IcoWomen = () => <svg width="19" height="19" viewBox="0 0 24 24" {...si} stroke="currentColor"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-3.5 3.58-6 8-6s8 2.5 8 6" /><path d="M12 14v6M9 17h6" /></svg>;
const IcoMiddleman = () => <svg width="19" height="19" viewBox="0 0 24 24" {...si} stroke="currentColor"><circle cx="5" cy="12" r="3" /><circle cx="19" cy="12" r="3" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="12" y1="9" x2="12" y2="15" strokeDasharray="2 2" /></svg>;
const IcoLayers = () => <svg width="19" height="19" viewBox="0 0 24 24" {...si} stroke="currentColor"><ellipse cx="12" cy="5" rx="9" ry="2.5" /><path d="M3 5v3c0 1.38 4.03 2.5 9 2.5s9-1.12 9-2.5V5" /><path d="M3 11v3c0 1.38 4.03 2.5 9 2.5s9-1.12 9-2.5v-3" /><path d="M3 17v3c0 1.38 4.03 2.5 9 2.5s9-1.12 9-2.5v-3" /></svg>;
const IcoShield = () => <svg width="19" height="19" viewBox="0 0 24 24" {...si} stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" strokeWidth={2} /></svg>;
const IcoLeft = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>;
const IcoRight = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>;

// ─── Shared atoms ─────────────────────────────────────────────────────────────
const CardIcon = ({ children }: { children: React.ReactNode }) => (
    <div className="w-10 h-10 rounded-[10px] bg-yellow/10 border border-yellow/40 flex items-center justify-center text-[#b89800] flex-shrink-0">{children}</div>
);
const Badge = ({ label }: { label: string }) => (
    <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/7 border border-primary/14 px-2 py-0.5 rounded-full w-fit">{label}</span>
);
const Divider = () => <div className="w-6 h-0.5 bg-yellow rounded-full" />;
const Stat = ({ num, label }: { num: string; label: string }) => (
    <div className="flex items-baseline gap-1">
        <span className="text-[20px] font-black text-primary leading-none">{num}</span>
        <span className="text-[9.5px] font-semibold text-primary/50 uppercase tracking-wide">{label}</span>
    </div>
);
const Hearts = () => (
    <div className="flex gap-1">
        {[true, true, true, false].map((f, i) => (
            <svg key={i} width="14" height="14" viewBox="0 0 24 24"
                fill={f ? '#0A5246' : 'rgba(10,82,70,0.15)'}
                stroke="#0A5246" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
        ))}
    </div>
);
const StepList = () => (
    <div className="flex flex-col gap-1.5">
        {['Steam & shell', 'Grade & sort', 'Roast & seal'].map(s => (
            <div key={s} className="flex items-center gap-1.5 text-[10.5px] font-semibold text-primary/80">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow border border-[#b89800] flex-shrink-0" />{s}
            </div>
        ))}
    </div>
);
const PBar = ({ label, pct }: { label: string; pct: number }) => (
    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-primary/80">
        <span className="w-14 flex-shrink-0">{label}</span>
        <div className="flex-1 h-[3px] bg-primary/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <span className="w-6 text-right text-[9.5px] font-bold text-primary">{pct}%</span>
    </div>
);
const ChatMsg = ({ text, reverse = false }: { text: string; reverse?: boolean }) => (
    <div className={`flex items-end gap-1.5 ${reverse ? 'flex-row-reverse' : ''}`}>
        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[7px] font-black flex-shrink-0 ${reverse ? 'bg-gradient-to-br from-yellow to-amber' : 'bg-gradient-to-br from-primary to-[#1e7a65]'}`}>
            {reverse ? <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg> : 'CC'}
        </div>
        <div className={`px-2.5 py-1.5 rounded-[10px] text-[10px] font-semibold leading-snug max-w-[75%] ${reverse ? 'bg-primary text-white rounded-br-[2px]' : 'bg-white border border-primary/10 text-gray-800 rounded-bl-[2px]'}`}>
            {text}
        </div>
    </div>
);

// ─── Desktop card base ────────────────────────────────────────────────────────
const dc = [
    'relative overflow-hidden rounded-[18px] border border-primary/9',
    'bg-gradient-to-br from-white via-[#f5faf8] to-[#ecf5f1]',
    'p-5 flex flex-col gap-2.5',
    'shadow-[0_2px_8px_rgba(10,82,70,0.06),0_6px_24px_rgba(10,82,70,0.08),0_0_32px_rgba(10,82,70,0.05)]',
    'hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(10,82,70,0.10),0_14px_40px_rgba(10,82,70,0.13)]',
    'transition-all duration-200',
].join(' ');

// ─── Desktop cards (rich content) ────────────────────────────────────────────
const DesktopFactory = () => (
    <div className={dc}>
        <div className="flex items-center gap-2.5"><CardIcon><IcoFactory /></CardIcon><Badge label="Zero transit waste" /></div>
        <h3 className="text-[15px] font-heading font-black text-[#1a2e28] leading-snug">Straight from Our Factory</h3>
        <p className="text-[11.5px] text-[#4a6b62] font-medium leading-relaxed flex-1">Packed and sealed at source — no warehousing detours, no quality compromise. What leaves our factory is exactly what reaches your door.</p>
        <div className="bg-primary/5 border border-primary/9 rounded-xl p-2.5 flex flex-col gap-1.5">
            <ChatMsg text="Your order has been packed fresh today!" />
            <ChatMsg text="Ships directly from factory?" reverse />
            <ChatMsg text="Always. Zero stops in between." />
        </div>
        <div className="flex gap-4 flex-wrap">
            <Stat num="100%" label="Direct to you" /><Stat num="0" label="Middlemen" /><Stat num="48h" label="Avg. dispatch" />
        </div>
    </div>
);
const DesktopWomen = () => (
    <div className={dc}>
        <div className="flex items-center gap-2.5"><CardIcon><IcoWomen /></CardIcon><Badge label="Women-led workforce" /></div>
        <h3 className="text-[15px] font-heading font-black text-[#1a2e28] leading-snug">Empowering Women, Every Batch</h3>
        <p className="text-[11.5px] text-[#4a6b62] font-medium leading-relaxed flex-1">70% of our processing team are women — skilled, trained, and fairly compensated. Every pack supports a livelihood and a family.</p>
        <Hearts /><Stat num="70%" label="Women workers" />
    </div>
);
const DesktopMiddleman = () => (
    <div className={dc}>
        <div className="flex items-center gap-2.5"><CardIcon><IcoMiddleman /></CardIcon><Badge label="Best price promise" /></div>
        <h3 className="text-[15px] font-heading font-black text-[#1a2e28] leading-snug">No Middleman. No Markup.</h3>
        <p className="text-[11.5px] text-[#4a6b62] font-medium leading-relaxed flex-1">Cut out every distributor — fresher cashews, honest pricing, savings passed straight to you.</p>
        <Divider /><Stat num="30%" label="Avg. savings vs retail" />
    </div>
);
const DesktopLayers = () => (
    <div className={dc}>
        <div className="flex items-center gap-2.5"><CardIcon><IcoLayers /></CardIcon><Badge label="Precision graded" /></div>
        <h3 className="text-[15px] font-heading font-black text-[#1a2e28] leading-snug">7 Layers of Perfection</h3>
        <p className="text-[11.5px] text-[#4a6b62] font-medium leading-relaxed flex-1">Shelling, steaming, peeling, grading, sorting, roasting, sealing — only the finest makes the cut.</p>
        <StepList /><Stat num="7" label="Quality stages" />
    </div>
);
const DesktopCare = () => (
    <div className={dc}>
        <div className="flex items-center gap-2.5"><CardIcon><IcoShield /></CardIcon><Badge label="Certified hygienic" /></div>
        <h3 className="text-[15px] font-heading font-black text-[#1a2e28] leading-snug">Handled with Motherly Care</h3>
        <p className="text-[11.5px] text-[#4a6b62] font-medium leading-relaxed flex-1">Hospital-grade hygiene. Every cashew treated as if it's meant for someone you love.</p>
        <div className="flex flex-col gap-1.5">
            <PBar label="Hygiene" pct={98} /><PBar label="Freshness" pct={95} /><PBar label="Safety" pct={100} />
        </div>
    </div>
);

// ─── Mobile cards (trimmed, fixed equal height) ───────────────────────────────
// Fixed height h-[220px] set on wrapper. Content: icon+badge, title, short body, stat only.
const mc = [
    'relative overflow-hidden rounded-[18px] border border-primary/9',
    'bg-gradient-to-br from-white via-[#f5faf8] to-[#ecf5f1]',
    'p-[18px] flex flex-col gap-2',
    'h-[220px]', // ← fixed equal height for all mobile cards
    'shadow-[0_2px_8px_rgba(10,82,70,0.06),0_6px_24px_rgba(10,82,70,0.08)]',
].join(' ');

const MOBILE_CARDS = [
    { icon: <IcoFactory />, badge: 'Zero transit waste', title: 'Straight from Our Factory', body: 'Packed and sealed at source. Direct from our floor to your door — zero stops.', bottom: <Stat num="100%" label="Direct to you" /> },
    { icon: <IcoWomen />, badge: 'Women-led workforce', title: 'Empowering Women, Every Batch', body: '70% of our team are women — skilled, trained, fairly paid. Every pack supports a family.', bottom: <Hearts /> },
    { icon: <IcoMiddleman />, badge: 'Best price promise', title: 'No Middleman. No Markup.', body: 'Every distributor cut out. Fresher cashews, honest pricing, savings passed to you.', bottom: <Stat num="30%" label="Avg. savings vs retail" /> },
    { icon: <IcoLayers />, badge: 'Precision graded', title: '7 Layers of Perfection', body: 'Steam, peel, grade, sort, roast, seal — 7 stages so only the finest cashew makes the cut.', bottom: <Stat num="7" label="Quality stages" /> },
    { icon: <IcoShield />, badge: 'Certified hygienic', title: 'Handled with Motherly Care', body: 'Hospital-grade hygiene every batch. Each cashew treated as if meant for someone you love.', bottom: <Stat num="100%" label="Safety assured" /> },
];

// ─── Mobile carousel ──────────────────────────────────────────────────────────
function MobileCarousel() {
    const trackRef = useRef<HTMLDivElement>(null);
    const [cur, setCur] = useState(0);
    const total = MOBILE_CARDS.length;

    const goTo = useCallback((idx: number) => {
        const i = Math.max(0, Math.min(total - 1, idx));
        const track = trackRef.current;
        if (!track) return;
        const card = track.children[i] as HTMLElement;
        track.scrollTo({ left: card.offsetLeft - 20, behavior: 'smooth' });
        setCur(i);
    }, [total]);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        const onScroll = () => {
            let cl = 0, mn = Infinity;
            Array.from(track.children).forEach((c, i) => {
                const d = Math.abs((c as HTMLElement).offsetLeft - track.scrollLeft - 20);
                if (d < mn) { mn = d; cl = i; }
            });
            setCur(cl);
        };
        track.addEventListener('scroll', onScroll, { passive: true });
        return () => track.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div>
            <div className="relative">
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-bg to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-bg to-transparent" />
                <div
                    ref={trackRef}
                    className="flex items-stretch gap-3 px-5 pb-2 overflow-x-auto [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {MOBILE_CARDS.map((card, i) => (
                        <div key={i} className={`flex-none w-[250px] [scroll-snap-align:start] ${mc}`}>
                            <div className="flex items-center gap-2.5">
                                <CardIcon>{card.icon}</CardIcon>
                                <Badge label={card.badge} />
                            </div>
                            <h3 className="text-[14px] font-heading font-black text-[#1a2e28] leading-snug">{card.title}</h3>
                            <p className="text-[11.5px] text-[#4a6b62] font-medium leading-relaxed flex-1 overflow-hidden">{card.body}</p>
                            <div className="mt-auto pt-1">{card.bottom}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-4">
                <button
                    onClick={() => goTo(cur - 1)}
                    disabled={cur === 0}
                    className="w-9 h-9 rounded-full bg-white border border-primary/15 flex items-center justify-center text-primary transition-colors hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:pointer-events-none"
                ><IcoLeft /></button>

                <div className="flex gap-1.5 items-center">
                    {Array.from({ length: total }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`rounded-full h-1.5 transition-all duration-200 ${i === cur ? 'w-5 bg-primary' : 'w-1.5 bg-primary/20'}`}
                        />
                    ))}
                </div>

                <button
                    onClick={() => goTo(cur + 1)}
                    disabled={cur === total - 1}
                    className="w-9 h-9 rounded-full bg-white border border-primary/15 flex items-center justify-center text-primary transition-colors hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:pointer-events-none"
                ><IcoRight /></button>
            </div>
        </div>
    );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function WhyUsCRO() {
    return (
        <section className="bg-bg-cream py-10 md:py-8 overflow-hidden">
            <div className="text-center px-5 mb-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-2">Handpicked for you</p>
                <h2 className="font-heading font-black text-[26px] md:text-[32px] text-[#1a2e28] leading-tight mb-2">
                    Why Choose Us?
                </h2>
                <p className="text-[13px] text-[#4a6b62] font-medium max-w-sm mx-auto leading-relaxed">
                    Experience the crunch. Premium, sustainably packaged, straight from our factory.
                </p>
            </div>

            {/* Desktop: 2 top + 3 bottom */}
            <div className="hidden md:flex flex-col gap-3 px-7 max-w-screen-xl mx-auto">
                <div className="grid grid-cols-2 gap-3">
                    <DesktopFactory /><DesktopWomen />
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <DesktopMiddleman /><DesktopLayers /><DesktopCare />
                </div>
            </div>

            {/* Mobile: fixed-height arrow carousel */}
            <div className="md:hidden">
                <MobileCarousel />
            </div>
        </section>
    );
}