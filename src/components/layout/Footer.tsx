import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-black text-white pt-16 pb-8 mx-auto w-full mt-24">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold font-heading text-bg-cream">Crunchy Cashews</h2>
                    <p className="text-gray-400 text-sm">Premium cashew manufacturer & supplier based in Siliguri, India. Quality delivered fresh.</p>
                </div>

                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-highlight">Quick Links</h3>
                    <ul className="flex flex-col gap-2">
                        <li><Link href="/" className="text-gray-400 hover:text-white transition-colors duration-300">Home</Link></li>
                        <li><Link href="/shop" className="text-gray-400 hover:text-white transition-colors duration-300">Shop</Link></li>
                        <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</Link></li>
                        <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">Contact</Link></li>
                    </ul>
                </div>

                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-highlight">Contact Us</h3>
                    <ul className="flex flex-col gap-2 text-gray-400 text-sm">
                        <li><a href="tel:+919876543210" className="hover:text-white"><i className="fa-solid fa-phone mr-2"></i> +91 98765 43210</a></li>
                        <li><a href="mailto:info@crunchycashews.in" className="hover:text-white"><i className="fa-solid fa-envelope mr-2"></i> info@crunchycashews.in</a></li>
                        <li><i className="fa-solid fa-location-dot mr-2"></i> Siliguri, West Bengal, India</li>
                    </ul>
                </div>

                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-highlight">For Bulk Orders</h3>
                    <p className="text-gray-400 text-sm mb-2">Looking for B2B supply? Contact us directly for special bulk pricing.</p>
                    <Link href="/contact" className="inline-block bg-primary text-white text-center py-2 px-4 rounded-full font-medium hover:bg-green-800 transition-colors w-max">
                        Request Quote
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Crunchy Cashews. All rights reserved.</p>
                <div className="flex gap-4">
                    <Link href="/terms" className="text-sm text-gray-500 hover:text-white">Terms of Service</Link>
                    <Link href="/privacy" className="text-sm text-gray-500 hover:text-white">Privacy Policy</Link>
                </div>
            </div>
        </footer>
    );
}
