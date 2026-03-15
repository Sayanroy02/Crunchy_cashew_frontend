import React from 'react';
import Link from 'next/link';

export const metadata = { title: 'Terms & Conditions | Crunchy Cashews', description: 'Read the Terms & Conditions for Crunchy Cashews.' };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-8">
        <h2 className="text-xl font-bold text-primary mb-3 font-heading">{title}</h2>
        <div className="text-gray-600 leading-relaxed space-y-2">{children}</div>
    </div>
);

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#fffdf5]">
            {/* Header */}
            <div className="bg-primary py-14 px-6 text-center">
                <p className="text-amber text-xs font-bold uppercase tracking-widest mb-2">Legal</p>
                <h1 className="text-4xl md:text-5xl font-heading font-black text-white">Terms &amp; Conditions</h1>
                <p className="text-white/60 mt-2 text-sm">Last updated: March 2025</p>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-14">
                <Section title="1. Acceptance of Terms">
                    <p>By accessing and using the Crunchy Cashews website and placing orders, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.</p>
                </Section>

                <Section title="2. Products & Pricing">
                    <p>All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to change pricing without prior notice. Product images are for representation purposes only — actual product may vary slightly.</p>
                </Section>

                <Section title="3. Orders & Payments">
                    <p>Orders are confirmed only after successful payment. We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery (where available). In case of payment failure, the order will not be processed.</p>
                </Section>

                <Section title="4. Shipping & Delivery">
                    <p>We deliver across India. Delivery timelines are 5–7 business days. Crunchy Cashews is not responsible for delays caused by courier partners or force majeure events. Pincode availability is checked at checkout.</p>
                </Section>

                <Section title="5. Returns & Refunds">
                    <p>We have a 7-day return policy. Products must be returned in original, unopened condition. Refunds are processed within 5–7 business days to the original payment method. For damaged goods, please contact us within 48 hours of delivery with photographic evidence.</p>
                </Section>

                <Section title="6. Wholesale & Bulk Orders">
                    <p>Bulk orders are subject to separate wholesale pricing. Factory visits require prior approval. Crunchy Cashews reserves the right to accept or decline any bulk order request.</p>
                </Section>

                <Section title="7. Intellectual Property">
                    <p>All content on this website including text, images, logos, and designs are the intellectual property of Crunchy Cashews. Unauthorized reproduction or use is strictly prohibited.</p>
                </Section>

                <Section title="8. Limitation of Liability">
                    <p>Crunchy Cashews shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services beyond the value of the purchase made.</p>
                </Section>

                <Section title="9. Contact Us">
                    <p>For any queries regarding these terms, please reach out to us at <a href="mailto:support@crunchycashews.com" className="text-primary font-semibold hover:underline">support@crunchycashews.com</a> or visit our <Link href="/contact" className="text-primary font-semibold hover:underline">Contact page</Link>.</p>
                </Section>

                <div className="mt-10 pt-6 border-t border-gray-200 flex gap-4 text-sm">
                    <Link href="/privacy" className="text-primary hover:underline font-medium">→ Privacy Policy</Link>
                    <Link href="/" className="text-gray-400 hover:underline">← Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
