const fs = require('fs');
const file = 'e:/Clients/Crunchy-Cashew-Web/frontend-next/src/app/bulk/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add imports
const importTarget = "    ChevronRight\n} from 'lucide-react';";
const newImports = "    ChevronRight,\n    Target,\n    Leaf,\n    ShieldCheck,\n    CalendarDays\n} from 'lucide-react';";
content = content.replace(importTarget, newImports);

// 2. Add the component before `export default function BulkOrderPage()`
const componentCode = `
// ─── Why Partner With Us ──────────────────────────────────────────────────────
function WhyPartnerWithUsSection() {
    const pillars = [
        {
            icon: <Target className="w-8 h-8 text-[#138808]" />,
            title: "Precision Optical Grading",
            pain: "Inconsistent sizing and mixed batches ruining packaging lines.",
            copy: "Utilizing advanced automated cutting machinery, we ensure strict uniformity across every batch. A WW 320 from us is exactly a WW 320, every single time."
        },
        {
            icon: <Leaf className="w-8 h-8 text-[#138808]" />,
            title: "Pristine Processing",
            pain: "Bitter taste and residue.",
            copy: "Our Siliguri facility utilizes specialized technical processes to completely remove CNSL oil deposits, guaranteeing a flawlessly clean profile and a farm-fresh crunch."
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-[#138808]" />,
            title: "Zero-Compromise Integrity",
            pain: "High breakage rates and wasted product.",
            copy: "From raw sourcing to final packing, our automated handling processes are optimized to protect the nut, delivering a maximum yield of perfectly intact wholes."
        },
        {
            icon: <CalendarDays className="w-8 h-8 text-[#138808]" />,
            title: "Uninterrupted Supply",
            pain: "Festival season stockouts and unreliable vendors.",
            copy: "By directly sourcing raw materials from Africa and leveraging our massive in-house processing capacity, we guarantee reliable volume and timely delivery, even during peak market demand."
        }
    ];

    return (
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
            <div className="text-center mb-16">
                <SectionHeading
                    text="Why Partner"
                    highlight="With Us?"
                    className="mb-4 !text-[28px] md:!text-4xl"
                />
                <p className="text-gray-600 text-sm md:text-lg max-w-3xl mx-auto leading-relaxed font-medium">
                    We solve the most common B2B cashew supply chain headaches so you can focus on growing your brand.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                {pillars.map((pillar, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col group"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-[#138808]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            {pillar.icon}
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-3 leading-snug">{pillar.title}</h3>
                        <div className="mb-4 pb-4 border-b border-gray-100">
                            <span className="text-xs font-bold text-red-500 uppercase tracking-wider block mb-1">The Pain Solved</span>
                            <p className="text-sm font-semibold text-gray-700 italic">"{pillar.pain}"</p>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed flex-grow">
                            {pillar.copy}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
`;

content = content.replace('// ─── Main Page ────────────────────────────────────────────────────────────────', componentCode);

// 3. Add to the layout
const injectTarget = `            <div className="w-full h-px bg-gray-100 mx-auto max-w-4xl" />

            {/* ── Our Grades ── */}`;
const injection = `            <div className="w-full h-px bg-gray-100 mx-auto max-w-4xl" />

            {/* ── Why Partner With Us ── */}
            <div className={COLORS.bg}>
                <WhyPartnerWithUsSection />
            </div>

            <div className="w-full h-px bg-gray-100 mx-auto max-w-4xl" />

            {/* ── Our Grades ── */}`;

content = content.replace(injectTarget, injection);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully injected new section!');
