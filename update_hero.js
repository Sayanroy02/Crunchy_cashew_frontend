const fs = require('fs');
const file = 'e:/Clients/Crunchy-Cashew-Web/frontend-next/src/app/bulk/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// The hero section is commented out right now
const startStr = '{/* ── Hero ── */}';
const endStr = '</section> */}';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const newHero = `{/* ── Hero ── */}
            <section className="relative overflow-hidden pt-12 pb-12 md:pt-20 md:pb-20">
                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                        {/* Text Content (Left 50%) */}
                        <div className="w-full lg:w-1/2 text-center lg:text-left">
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-[32px] md:text-5xl lg:text-6xl font-black text-black leading-tight mb-6"
                            >
                                Premium Factory-Direct Cashews for India's Top Businesses.
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-[15px] md:text-lg text-black/70 leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0"
                            >
                                Processed in our state-of-the-art Siliguri facility. We combine premium raw material sourcing with advanced automated grading to deliver consistent, export-quality cashews at wholesale volume.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8"
                            >
                                <button
                                    onClick={() => scrollTo(formRef)}
                                    className="group w-full sm:w-auto h-14 flex items-center justify-center gap-3 bg-[#F6B000] text-black font-bold px-8 rounded-xl shadow-lg shadow-[#F6B000]/20 transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                    Request Bulk Pricing
                                </button>
                                <button
                                    onClick={() => {
                                        const gradesSec = document.getElementById('our-grades-section');
                                        if (gradesSec) gradesSec.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="group w-full sm:w-auto h-14 flex items-center justify-center gap-3 bg-transparent border-2 border-gray-200 text-gray-600 font-bold px-8 rounded-xl transition-all duration-300 hover:border-black hover:text-black active:scale-95"
                                >
                                    Explore Our Grades
                                </button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center justify-center lg:justify-start gap-6 text-[11px] md:text-xs font-bold text-gray-500"
                            >
                                <span className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-[#F6B000]/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-3 h-3 text-[#F6B000]" />
                                    </div>
                                    ✓ ISO Certified Facility
                                </span>
                                <span className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-[#F6B000]/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-3 h-3 text-[#F6B000]" />
                                    </div>
                                    ✓ Pan-India Delivery
                                </span>
                            </motion.div>
                        </div>

                        {/* Visual Content (Right 50%) */}
                        <div className="w-full lg:w-1/2 relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-square bg-gray-100 border-8 border-white"
                            >
                                <video
                                    src="https://res.cloudinary.com/da1acfqsn/video/upload/v1777747446/VN20260503_001215_u2yinn.mp4"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="auto"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>`;
  
  content = content.substring(0, startIndex) + newHero + content.substring(endIndex + endStr.length);
  
  // Also add id to our grades section
  content = content.replace(
    '            {/* ── Our Grades ── */}\r\n            <div className="COLORS.bg">\r\n                <OurGradesSection',
    '            {/* ── Our Grades ── */}\r\n            <div id="our-grades-section" className="COLORS.bg">\r\n                <OurGradesSection'
  );
  content = content.replace(
    '            {/* ── Our Grades ── */}\n            <div className="COLORS.bg">\n                <OurGradesSection',
    '            {/* ── Our Grades ── */}\n            <div id="our-grades-section" className="COLORS.bg">\n                <OurGradesSection'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log('Replaced successfully');
} else {
  console.log('Could not find start or end index', startIndex, endIndex);
}
