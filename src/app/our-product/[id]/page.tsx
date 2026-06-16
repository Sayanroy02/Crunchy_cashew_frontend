import React, { Suspense } from 'react';
import Link from 'next/link';
import { API } from '@/constants/api';
import ProductDetailsClient from './ProductDetailsClient';
import ProductCard from '@/components/products/ProductCard';
import SectionHeading from '@/components/ui/SectionHeading';
import FAQAccordion from '@/components/home/FAQAccordion';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [res, productsRes] = await Promise.all([
        fetch(API.PRODUCT_DETAIL(id), { next: { revalidate: 60 } }),
        fetch(API.PRODUCTS, { next: { revalidate: 60 } }),
    ]);

    if (!res.ok) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-bg-cream text-center px-6">
                <i className="fa-solid fa-cookie-bite text-6xl text-gray-400 mb-6"></i>
                <h1 className="text-4xl font-heading font-black text-text-dark mb-4">Product Not Found</h1>
                <p className="text-gray-500 mb-8">Oops! We couldn't find the cashew variety you're looking for.</p>
                <a href="/our-product" className="bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-black transition-colors">
                    Return to Shop
                </a>
            </div>
        );
    }

    const product = await res.json();
    const allProducts = productsRes.ok ? await productsRes.json() : [];
    const relatedProducts = allProducts.filter((p: any) => (p._id || p.id) !== id).slice(0, 8);

    return (
        <div className="bg-[#FFF9E7] min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-transparent">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-primary">Home</Link>
                    <span>/</span>
                    <Link href="/our-product" className="hover:text-primary">Shop</Link>
                    <span>/</span>
                    <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                {/* Client Side Product Details & Gallery */}
                <ProductDetailsClient product={product} />

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-14">
                        <div className="flex items-center justify-between mb-6">
                            <SectionHeading 
                                text="You May Also"
                                highlight="Love"
                                className="text-2xl md:text-3xl"
                            />
                            <Link href="/our-product" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                                View All <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {relatedProducts.map((p: any) => (
                                <ProductCard key={p._id || p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
                
                {/* FAQ Section */}
                <div className="mt-14">
                    <FAQAccordion />
                </div>
            </div>
        </div>
    );
}
