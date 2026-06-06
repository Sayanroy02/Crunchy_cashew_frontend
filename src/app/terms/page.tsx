import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'Terms & Conditions | Crunchy Cashews',
    description: 'Read the Terms & Conditions for Crunchy Cashews.',
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-8">
        <h2 className="text-xl font-bold text-[#00863D] mb-3 font-heading">{title}</h2>
        <div className="text-gray-600 leading-relaxed space-y-2">{children}</div>
    </div>
);

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#FFF9E7]">
            {/* Header */}
            <div className="bg-[#00863D] py-14 px-6 text-center border-b-4 border-[#F6B000]">
                <p className="text-amber text-xs font-bold uppercase tracking-widest mb-2">Legal</p>
                <h1 className="text-4xl md:text-5xl font-heading font-black text-white">Terms &amp; Conditions</h1>
                <p className="text-white/60 mt-2 text-sm">Last updated: June 2026</p>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-14">
                <p className="text-gray-600 mb-8 italic">
                    Welcome to Crunchy Cashews (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). By accessing, browsing, or purchasing products from our website, you agree to be bound by these Terms &amp; Conditions. If you do not agree with any part of these Terms, please refrain from using our website.
                </p>

                <Section title="1. Eligibility">
                    <p>By using this website, you confirm that:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>You are at least 18 years of age, or</li>
                        <li>You are using the website under the supervision of a parent or legal guardian.</li>
                    </ul>
                </Section>

                <Section title="2. Products &amp; Pricing">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>All prices displayed on the website are in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise.</li>
                        <li>Product images are for illustrative purposes only. Actual packaging, appearance, or colour may vary slightly.</li>
                        <li>We reserve the right to modify product specifications, availability, pricing, offers, or promotions without prior notice.</li>
                        <li>Errors in pricing or product information may result in cancellation of an order, even after payment has been made.</li>
                    </ul>
                </Section>

                <Section title="3. Orders &amp; Payments">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Orders are confirmed only after successful payment and acceptance by Crunchy Cashews.</li>
                        <li>We reserve the right to refuse, cancel, or limit any order at our sole discretion.</li>
                        <li>Payment methods may include UPI, Credit Cards, Debit Cards, Net Banking, Wallets, and Cash on Delivery (where available).</li>
                        <li>In case of payment failure, the order will not be processed.</li>
                    </ul>
                </Section>

                <Section title="4. Shipping &amp; Delivery">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>We currently deliver to serviceable locations across India.</li>
                        <li>Estimated delivery timelines are indicative and not guaranteed.</li>
                        <li>Delivery delays caused by courier partners, weather conditions, strikes, government actions, natural disasters, or other events beyond our control shall not result in liability on our part.</li>
                        <li>Delivery availability depends on pincode serviceability.</li>
                    </ul>
                </Section>

                <Section title="5. Product Storage &amp; Consumption">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Our products are food items and should be stored according to the instructions provided on the packaging.</li>
                        <li>Customers are responsible for ensuring proper storage after delivery.</li>
                        <li>Individuals with nut allergies or food sensitivities should carefully review product ingredients before consumption.</li>
                        <li>Crunchy Cashews shall not be responsible for issues arising due to improper storage, handling, or consumption after delivery.</li>
                    </ul>
                </Section>

                <Section title="6. User Accounts">
                    <p>If you create an account on our website:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                        <li>You agree to provide accurate, complete, and updated information.</li>
                        <li>You are responsible for all activities conducted through your account.</li>
                    </ul>
                </Section>

                <Section title="7. Intellectual Property">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>All content available on this website, including but not limited to text, images, graphics, product descriptions, logos, trademarks, packaging designs, videos, and website content, is the exclusive property of Crunchy Cashews and is protected under applicable intellectual property laws.</li>
                        <li>Unauthorized copying, reproduction, distribution, modification, or commercial use is strictly prohibited.</li>
                    </ul>
                </Section>

                <Section title="8. Refund, Replacement &amp; Claims">
                    <p className="mb-2">Due to the nature of food products and hygiene regulations, all sales are final and products cannot be returned once delivered.</p>
                    <p className="font-semibold text-gray-700 mt-3 mb-1">Replacement requests may be considered only for:</p>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                        <li>Damaged products</li>
                        <li>Broken seals</li>
                        <li>Incorrect items delivered</li>
                        <li>Products received in unusable condition</li>
                    </ul>
                    
                    <div className="bg-amber-50 border-l-4 border-[#F6B000] p-4 my-4 rounded">
                        <p className="font-bold text-gray-800 mb-1">Mandatory Unboxing Video Requirement</p>
                        <p className="text-sm text-gray-700 mb-2">A complete and unedited unboxing video is mandatory for all claims relating to:</p>
                        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                            <li>Damage</li>
                            <li>Shortage</li>
                            <li>Missing items</li>
                            <li>Wrong products</li>
                            <li>Packaging issues</li>
                            <li>Replacement requests</li>
                        </ul>
                        <p className="text-sm font-semibold text-gray-800 mt-2">Claims submitted without a valid unboxing video will not be eligible for replacement, refund, or compensation.</p>
                    </div>

                    <p className="mt-2 font-medium text-gray-700">All claims must be reported within 24 hours of delivery.</p>
                </Section>

                <Section title="9. Limitation of Liability">
                    <p className="font-semibold text-gray-700 mb-1">To the maximum extent permitted by law:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Crunchy Cashews shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use of our products or website.</li>
                        <li>Our total liability for any claim shall not exceed the amount paid by the customer for the specific order giving rise to the claim.</li>
                    </ul>
                </Section>

                <Section title="10. Prohibited Activities">
                    <p className="font-semibold text-gray-700 mb-1">Users shall not:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Use the website for unlawful purposes.</li>
                        <li>Attempt to gain unauthorized access to website systems.</li>
                        <li>Copy, scrape, or misuse website content.</li>
                        <li>Interfere with the proper functioning of the website.</li>
                    </ul>
                </Section>

                <Section title="11. Governing Law &amp; Jurisdiction">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of India.</li>
                        <li>Any dispute arising from these Terms or the use of this website shall be subject to the exclusive jurisdiction of the courts located in Siliguri, West Bengal.</li>
                    </ul>
                </Section>

                <Section title="12. Changes to Terms">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Crunchy Cashews reserves the right to modify these Terms &amp; Conditions at any time without prior notice.</li>
                        <li>Continued use of the website following any updates constitutes acceptance of the revised Terms.</li>
                    </ul>
                </Section>

                <Section title="13. Contact Us">
                    <p className="font-semibold text-gray-800">For any questions, complaints, or support requests:</p>
                    <div className="mt-2 text-gray-700 space-y-1">
                        <p className="font-bold text-[#00863D]">Crunchy Cashews</p>
                        <p>Email: <a href="mailto:crunchycashews18@gmail.com" className="text-[#00863D] hover:underline font-medium">crunchycashews18@gmail.com</a></p>
                        <div className="pt-2">
                            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Manufactured, Packed and Marketed By:</p>
                            <p className="font-medium">YU Nut Processing Industry</p>
                            <p className="text-sm">Siliguri, West Bengal, India</p>
                        </div>
                    </div>
                </Section>

                <div className="mt-10 pt-6 border-t border-gray-200 flex gap-4 text-sm">
                    <Link href="/privacy" className="text-[#00863D] hover:underline font-medium">→ Privacy Policy</Link>
                    <Link href="/" className="text-gray-400 hover:underline">← Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
