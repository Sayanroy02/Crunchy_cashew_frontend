const fs = require('fs');
const file = 'e:/Clients/Crunchy-Cashew-Web/frontend-next/src/app/bulk/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const startStr = '{/* ── Hero ── */}';
const endStr = '</section>';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const newHero = `{/* ── Hero ── */}
            <section className="relative w-full pt-12 pb-12 md:pt-20 md:pb-20 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-white opacity-60 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#F6B000] opacity-[0.05] rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full mb-6 border border-gray-100 shadow-sm"
                    >
                        <span className="text-[9px] md:text-[10px] font-black tracking-[0.15em] text-[#00863D] uppercase">
                            Premium Cashew Processing
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-[20px] md:text-[28px] font-black text-black leading-[1.4] md:leading-[1.4] mb-4 max-w-3xl mx-auto"
                    >
                        Premium <span className="text-[#F6B000]">Factory-Direct</span> Cashews for <span className="bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#138808] text-transparent bg-clip-text">India's</span> Top Businesses.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[14px] md:text-[16px] text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto font-medium"
                    >
                        Processed in our state-of-the-art Siliguri facility. We combine premium raw material sourcing with advanced automated grading to deliver consistent, export-quality cashews at wholesale volume.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 w-full sm:w-auto"
                    >
                        <button
                            onClick={() => scrollTo(formRef)}
                            className="group w-full sm:w-auto h-12 flex items-center justify-center gap-3 bg-[#F6B000] text-black font-bold px-8 rounded-xl shadow-[0_4px_14px_rgba(246,176,0,0.3)] transition-all duration-300 hover:scale-105 active:scale-95 text-sm"
                        >
                            Request Bulk Pricing
                        </button>
                        <button
                            onClick={() => {
                                const gradesSec = document.getElementById('our-grades-section');
                                if (gradesSec) gradesSec.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="group w-full sm:w-auto h-12 flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-800 font-bold px-8 rounded-xl transition-all duration-300 hover:border-[#F6B000] hover:text-black active:scale-95 text-sm shadow-sm"
                        >
                            Explore Our Grades
                        </button>
                    </motion.div>

                    {/* Video Embed */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="w-full relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white border-[6px] md:border-8 border-white aspect-[4/3] sm:aspect-video md:aspect-[21/9]"
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
                    </motion.div>

                    {/* Trust badges below video */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap items-center justify-center gap-6 mt-8 text-[12px] md:text-sm font-bold text-gray-600"
                    >
                        <span className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#F6B000]/10 flex items-center justify-center">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#F6B000]" />
                            </div>
                            ISO Certified Facility
                        </span>
                        <span className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#F6B000]/10 flex items-center justify-center">
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
