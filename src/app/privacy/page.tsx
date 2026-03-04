import React from 'react';
import Link from 'next/link';

export const metadata = { title: 'Privacy Policy | Crunchy Cashews', description: 'Read our Privacy Policy to understand how we handle your data.' };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-8">
        <h2 className="text-xl font-bold text-[#0c5c2b] mb-3 font-heading">{title}</h2>
        <div className="text-gray-600 leading-relaxed space-y-2">{children}</div>
    </div>
);

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#fffdf5]">
            <div className="bg-[#0c5c2b] py-14 px-6 text-center">
                <p className="text-[#FBB21B] text-xs font-bold uppercase tracking-widest mb-2">Legal</p>
                <h1 className="text-4xl md:text-5xl font-heading font-black text-white">Privacy Policy</h1>
                <p className="text-white/60 mt-2 text-sm">Last updated: March 2025</p>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-14">
                <Section title="1. Information We Collect">
                    <p>When you use Crunchy Cashews, we may collect the following information:</p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>Name, email address, phone number, and delivery address</li>
                        <li>Order history and product preferences</li>
                        <li>Device information and browsing data (via cookies)</li>
                        <li>Information provided during Google Sign-In (name, email, profile picture)</li>
                    </ul>
                </Section>

                <Section title="2. How We Use Your Data">
                    <p>We use your information to:</p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>Process and fulfil your orders</li>
                        <li>Communicate shipping status and support queries</li>
                        <li>Improve our products and website experience</li>
                        <li>Send promotional offers (only if opted in)</li>
                    </ul>
                </Section>

                <Section title="3. Data Sharing">
                    <p>We do not sell your personal data. We may share your information with:</p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>Courier/logistics partners — to fulfil deliveries</li>
                        <li>Payment gateways — to process transactions securely</li>
                        <li>Legal authorities — if required by law</li>
                    </ul>
                </Section>

                <Section title="4. Cookies">
                    <p>We use cookies to enhance your browsing experience, remember your cart, and analyse site traffic. You can disable cookies in your browser settings, but this may affect site functionality.</p>
                </Section>

                <Section title="5. Google Sign-In">
                    <p>If you sign in using Google, we receive your basic profile information (name, email, and profile picture) from Google. We do not receive your Google password. This data is stored securely and used only to create your account.</p>
                </Section>

                <Section title="6. Data Security">
                    <p>We use industry-standard SSL encryption for data transmission. User passwords are hashed and never stored in plain text. Access to your data is restricted to authorised personnel only.</p>
                </Section>

                <Section title="7. Your Rights">
                    <p>You have the right to:</p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>Access and update your personal information from your Profile page</li>
                        <li>Request deletion of your account and associated data</li>
                        <li>Opt out of marketing communications at any time</li>
                    </ul>
                </Section>

                <Section title="8. Contact">
                    <p>For privacy-related concerns, contact us at <a href="mailto:privacy@crunchycashews.com" className="text-[#0c5c2b] font-semibold hover:underline">privacy@crunchycashews.com</a></p>
                </Section>

                <div className="mt-10 pt-6 border-t border-gray-200 flex gap-4 text-sm">
                    <Link href="/terms" className="text-[#0c5c2b] hover:underline font-medium">→ Terms & Conditions</Link>
                    <Link href="/" className="text-gray-400 hover:underline">← Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
