import React from 'react';
import Link from 'next/link';
import { COLORS } from '@/constants/styles';

export const metadata = {
    title: 'Refund Policy | Crunchy Cashews',
    description: 'Read our Refund Policy for information on cancellations, returns, and refunds.'
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-8 font-body">
        <h2 className="text-xl font-bold text-[#000000] mb-3 font-heading uppercase tracking-tight" style={{ color: '#F6B000' }}>{title}</h2>
        <div className="text-gray-600 leading-relaxed space-y-3 text-sm font-medium">{children}</div>
    </div>
);

export default function RefundPolicyPage() {
    return (
        <div className={`min-h-screen bg-[#FFF9E7]`}>
            {/* Header */}
            <div className="bg-[#00863D] py-16 px-6 text-center border-b-4" style={{ borderColor: '#F6B000' }}>
                <p className="text-[#F6B000] text-xs font-black uppercase tracking-[0.2em] mb-3">Customer Care</p>
                <h1 className="text-4xl md:text-5xl font-heading font-black text-white">Refund Policy</h1>
                <p className="text-white/40 mt-4 text-xs font-bold uppercase tracking-widest">Last updated: April 2025</p>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-16">
                <Section title="1. Cancellation Policy">
                    <p>Orders once placed can only be cancelled within <strong>2 hours</strong> of placement or before the status is updated to 'Accepted' by our team, whichever is earlier.</p>
                    <p>Once the product has been dispatched, we cannot accept any cancellations.</p>
                </Section>

                <Section title="2. Returns & Replacements">
                    <p>As we deal in perishable food items (Cashews & Nuts), we follow a strict <strong>No-Return</strong> policy for health and hygiene reasons.</p>
                    <p>However, we offer replacements in the following cases:</p>
                    <ul className="list-disc list-inside space-y-2 mt-2">
                        <li>The package was received in a damaged condition.</li>
                        <li>The seal was broken upon arrival.</li>
                        <li>An incorrect item was delivered to you.</li>
                    </ul>
                    <p className="border-l-4 border-amber-300 pl-4 py-2 bg-amber-50 rounded-r-lg">
                        <strong>Note:</strong> You must provide an <strong>Unboxing Video</strong> to claim replacements for damage or incorrect items.
                    </p>
                </Section>

                <Section title="3. Refund Process">
                    <p>If a cancellation is requested and approved, the refund will be processed within 5-7 working days to the original payment source.</p>
                    <p>For COD orders, no refund is applicable as the payment is only made upon delivery. In case of issues with COD orders, we will provide store credit or replacements.</p>
                </Section>

                <Section title="4. Issues with Quality">
                    <p>If you have any concerns regarding the quality of the product, please reach out to us within 24 hours of delivery. Our quality control team will investigate the batch and provide a resolution.</p>
                </Section>

                <Section title="5. Contact Us">
                    <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm">
                        <p className="font-bold text-gray-800 mb-2">For any disputes or queries, reach us at:</p>
                        <ul className="space-y-1">
                            <li><strong>Email:</strong> <a href="mailto:crunchycashews18@gmail.com" className="hover:underline" style={{ color: '#F6B000' }}>crunchycashews18@gmail.com</a></li>
                            <li><strong>Phone:</strong> +91 7847996343</li>
                            <li><strong>Address:</strong> YU NUT PROCESSING INDUSTRY, Siliguri (W.B)</li>
                        </ul>
                    </div>
                </Section>

                <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap gap-6 items-center justify-between">
                    <div className="flex gap-4 text-xs font-black uppercase tracking-widest">
                        <Link href="/terms" className="hover:opacity-70 transition-opacity" style={{ color: '#F6B000' }}>Terms & Conditions</Link>
                        <Link href="/privacy" className="hover:opacity-70 transition-opacity" style={{ color: '#F6B000' }}>Privacy Policy</Link>
                    </div>
                    <Link href="/" className="text-gray-400 hover:text-black transition-colors text-xs font-black uppercase tracking-widest">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
