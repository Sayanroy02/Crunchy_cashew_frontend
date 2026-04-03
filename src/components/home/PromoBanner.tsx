import React from 'react';
import Link from 'next/link';
import SectionHeading from '@/components/ui/SectionHeading';
import { COLORS } from '@/constants/styles';

export default function PromoBanner() {
    return (
        <section className="py-12 bg-bg-cream">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Promo Banner Core */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-[#D82A2A] to-[#F14646]">

                    {/* Background Patterns */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #fff 0%, transparent 50%), radial-gradient(circle at 80% 50%, #fff 0%, transparent 50%)' }} />
                    <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-10 md:p-14 gap-8">

                        {/* Text Content */}
                        <div className="flex-1 text-center md:text-left">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/30 mb-4">
                                <i className="fa-solid fa-gift mr-2"></i> Monthly Contest
                            </span>
                            <SectionHeading 
                                text="Share Your Story &" 
                                highlight="Win a Hamper!" 
                                textColor="#ffffff" 
                            />
                            <p className="text-white/90 text-sm md:text-base max-w-xl leading-relaxed">
                                Made a delicious recipe using our cashews? Or have a unique Crunchy Cashews story to share?
                                Submit your blog post today. If you get featured on our website, you win an exclusive premium
                                cashew gift hamper directly delivered to your door.
                            </p>
                        </div>

                        {/* CTA / Image Side */}
                        <div className="flex-shrink-0 flex flex-col items-center gap-4">
                            {/* Hamper Icon/Decoration */}
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#FDC700] mb-2 animate-bounce flex-shrink-0">
                                <i className="fa-solid fa-box-open text-4xl text-[#D82A2A]"></i>
                            </div>

                            <Link
                                href="/blogs/submit"
                                className="group bg-[#FDC700] text-[#D82A2A] font-extrabold px-8 py-4 rounded-xl hover:bg-yellow-400 transition-all duration-300 shadow-xl shadow-black/20 transform hover:scale-105"
                            >
                                Submit Your Blog <i className="fa-solid fa-pen-nib ml-2 group-hover:rotate-12 transition-transform"></i>
                            </Link>
                            <p className="text-white/60 text-xs font-medium">Terms and Conditions apply.</p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
