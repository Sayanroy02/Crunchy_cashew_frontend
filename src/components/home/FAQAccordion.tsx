'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SectionHeading from '@/components/ui/SectionHeading';

const faqs = [
    {
        question: "Are your cashews organic?",
        answer: "Yes. All our cashews are naturally sourced without the use of pesticides or harmful chemicals. We follow strict quality guidelines from farm to package."
    },
    {
        question: "Do you ship across India?",
        answer: "We ship wholesale and retail quantities across India using reliable courier services. Delivery typically takes 5–7 business days depending on your location."
    },
    {
        question: "Can I visit your factory?",
        answer: "Yes! We welcome wholesale buyers. You can request a factory visit by filling out the 'Factory Visit Request' form on our Contact page. Visits are strictly for B2B and wholesale clients."
    },
    {
        question: "Do you offer bulk discounts?",
        answer: "Absolutely. Wholesale pricing automatically applies when you request a quote via our Bulk Order page. The higher the volume, the better the margin we can offer."
    },
    {
        question: "How do you ensure freshness?",
        answer: "Since you're buying directly from the manufacturer, our cashews bypass the traditional retail chain. They go from roasting to vacuum packaging to shipping — preserving natural oils and crunch."
    },
    {
        question: "Are your products gluten-free?",
        answer: "Yes. Cashews are naturally gluten-free. Our processing facility is also dedicated to nut products, minimising any cross-contamination risk."
    },
];

export default function FAQAccordion({ minimal = false }: { minimal?: boolean }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const accordionContent = (
        <div className="flex flex-col gap-3">
            {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                    <div key={index} className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
                        <button
                            className={`w-full text-left px-5 py-4 flex items-center justify-between font-bold text-sm md:text-base transition-colors ${isOpen ? 'bg-white text-[#2c1a0e]' : 'bg-white/90 text-[#2c1a0e] hover:bg-white'}`}
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                        >
                            <span className="pr-4 font-heading">{faq.question}</span>
                            <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#00863D] text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                                <i className="fa-solid fa-chevron-down text-xs"></i>
                            </span>
                        </button>
                        <div className={`overflow-hidden transition-all duration-400 ease-in-out ${isOpen ? 'max-h-48' : 'max-h-0'}`}>
                            <div className="bg-white px-5 py-4 text-sm text-[#2c1a0e]/80 leading-relaxed border-t border-gray-50">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    if (minimal) {
        return accordionContent;
    }

    return (
        <section className="relative bg-amber py-16 md:py-24 overflow-hidden">
            {/* Decorative plants */}
            <div className="absolute bottom-0 left-4 opacity-20 pointer-events-none text-[#2c1a0e] text-8xl select-none">🌿</div>
            <div className="absolute bottom-0 right-4 opacity-20 pointer-events-none text-[#2c1a0e] text-8xl select-none">🌿</div>

            <div className="max-w-3xl mx-auto px-4 md:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <SectionHeading text="Frequently Asked" highlight="Questions" />
                    <p className="text-[#2c1a0e]/60 mt-3 text-sm font-medium">Everything you need to know about Crunchy Cashews</p>
                </div>

                {/* Accordion */}
                {accordionContent}

                {/* Money back guarantee card */}
                <div className="mt-12 bg-[#2c1a0e] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl">
                    <div className="text-6xl flex-shrink-0">💯</div>
                    <div className="text-center md:text-left">
                        <h3 className="text-white font-black text-xl md:text-2xl font-heading uppercase">100% Satisfaction Guarantee</h3>
                        <p className="text-white/60 text-sm mt-1 mb-4">If you're not happy with your purchase, contact us within 30 days and we'll assist you fully — no questions asked.</p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <Link href="/our-product" className="bg-amber text-[#2c1a0e] font-black px-5 py-2.5 rounded-full text-sm hover:bg-yellow transition uppercase tracking-wider">
                                Order Now
                            </Link>
                            <a href="tel:+919876543210" className="flex items-center gap-2 text-white border border-white/20 px-5 py-2.5 rounded-full text-sm hover:bg-white/10 transition">
                                <i className="fa-solid fa-phone"></i> Call Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
