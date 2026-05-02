const fs = require('fs');
const file = 'e:/Clients/Crunchy-Cashew-Web/frontend-next/src/app/bulk/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const startStr = '{/* ── Hero ── */}';
const endStr = '</section>';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const newHero = `{/* ── Hero ── */}
            <section className="relative w-full h-[85vh] min-h-[600px] max-h-[800px] flex flex-col items-center justify-center overflow-hidden">
                {/* Background Video */}
                <div className="absolute inset-0 z-0 w-full h-full">
                    <video
                        src="https://res.cloudinary.com/da1acfqsn/video/upload/v1777747446/VN20260503_001215_u2yinn.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover"
                    />
                    {/* Dark overlay for text legibility */}
                    <div className="absolute inset-0 bg-black/60 pointer-events-none" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[36px] md:text-5xl lg:text-7xl font-black text-white leading-tight mb-6"
                    >
                        Premium <span className="text-[#F6B000]">Factory-Direct</span> Cashews for <span className="bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] text-transparent bg-clip-text">India's</span> Top Businesses.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-[16px] md:text-xl text-white/90 leading-relaxed mb-10 max-w-3xl mx-auto font-medium"
                    >
                        Processed in our state-of-the-art Siliguri facility. We combine premium raw material sourcing with advanced automated grading to deliver consistent, export-quality cashews at wholesale volume.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-10 w-full sm:w-auto"
                    >
                        <button
                            onClick={() => scrollTo(formRef)}
                            className="group w-full sm:w-auto h-14 flex items-center justify-center gap-3 bg-[#F6B000] text-black font-bold px-10 rounded-xl shadow-[0_0_30px_rgba(246,176,0,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            Request Bulk Pricing
                        </button>
                        <button
                            onClick={() => {
                                const gradesSec = document.getElementById('our-grades-section');
                                if (gradesSec) gradesSec.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="group w-full sm:w-auto h-14 flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md border-2 border-white/80 text-white font-bold px-10 rounded-xl transition-all duration-300 hover:bg-white hover:text-black active:scale-95"
                        >
                            Explore Our Grades
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap items-center justify-center gap-6 text-[12px] md:text-sm font-bold text-white/80"
                    >
                        <span className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#F6B000]" />
                            </div>
                            ISO Certified Facility
                        </span>
                        <span className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#F6B000]" />
                            </div>
                            Pan-India Delivery
                        </span>
                    </motion.div>
                </div>
            </section>`;
  
  content = content.substring(0, startIndex) + newHero + content.substring(endIndex + endStr.length);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Replaced successfully');
} else {
  console.log('Could not find start or end index', startIndex, endIndex);
}
