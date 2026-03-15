import React from 'react';
import AddToCartButton from '@/app/shop/[id]/AddToCartButton';
import Link from 'next/link';
import PincodeWidget from '@/components/PincodeWidget';
import { API } from '@/constants/api';

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
                <a href="/shop" className="bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-green-800 transition-colors">
                    Return to Shop
                </a>
            </div>
        );
    }

    const product = await res.json();
    const allProducts = productsRes.ok ? await productsRes.json() : [];
    const relatedProducts = allProducts.filter((p: any) => (p._id || p.id) !== id).slice(0, 8);

    const discountedPrice = product.discount
        ? product.price - (product.price * product.discount) / 100
        : null;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-primary">Home</Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-primary">Shop</Link>
                    <span>/</span>
                    <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                {/* Main Product */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col lg:flex-row">
                    {/* Image */}
                    <div className="lg:w-[45%] bg-gray-50 p-8 md:p-16 flex justify-center items-center min-h-[320px]">
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full max-w-[360px] h-auto object-contain drop-shadow-2xl"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-300 gap-4">
                                <span className="text-8xl">🥜</span>
                                <p className="text-sm font-medium text-gray-400">No image available</p>
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="lg:w-[55%] p-8 md:p-12 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xs font-bold tracking-widest text-primary uppercase bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                    {product.category}
                                </span>
                                {product.stock > 0 ? (
                                    <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">In Stock</span>
                                ) : (
                                    <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Out of Stock</span>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-4xl font-heading font-black text-gray-900 mb-4 leading-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-baseline gap-3 mb-5">
                                <span className="text-3xl md:text-4xl font-black text-gray-900">
                                    ₹{discountedPrice ? discountedPrice.toFixed(2) : product.price.toFixed(2)}
                                </span>
                                {discountedPrice && (
                                    <>
                                        <span className="text-lg text-gray-400 line-through">₹{product.price.toFixed(2)}</span>
                                        <span className="bg-yellow text-gray-900 text-xs font-black px-2 py-1 rounded">{product.discount}% OFF</span>
                                    </>
                                )}
                            </div>

                            <p className="text-gray-600 text-base leading-relaxed mb-6">
                                {product.description}
                            </p>

                            {/* Key Features */}
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {[
                                    { icon: '🏭', label: 'Direct from factory' },
                                    { icon: '🌱', label: '100% Natural' },
                                    { icon: '📦', label: 'Hygienic packaging' },
                                    { icon: '🚚', label: 'Free ship on ₹999+' },
                                ].map(f => (
                                    <div key={f.label} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2">
                                        <span>{f.icon}</span>
                                        {f.label}
                                    </div>
                                ))}
                            </div>

                            <AddToCartButton product={product} />

                            {/* Pincode delivery check */}
                            <div className="mt-5">
                                <p className="text-sm font-semibold text-gray-700 mb-2">🚚 Check Delivery at Your Pincode</p>
                                <PincodeWidget />
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><i className="fa-solid fa-shield-halved text-primary"></i> Secure Checkout</span>
                            <span className="flex items-center gap-1"><i className="fa-solid fa-rotate-left text-primary"></i> Easy Returns</span>
                            <span className="flex items-center gap-1"><i className="fa-brands fa-whatsapp text-primary"></i> WhatsApp Support</span>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-14">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl md:text-3xl font-heading font-black text-gray-900">
                                You May Also Love 🥜
                            </h2>
                            <Link href="/shop" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                                View All <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {relatedProducts.map((p: any) => {
                                const pid = p._id || p.id;
                                const discounted = p.discount ? p.price - (p.price * p.discount) / 100 : null;
                                return (
                                    <Link key={pid} href={`/shop/${pid}`}
                                        className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group flex flex-col"
                                    >
                                        <div className="relative bg-gray-50 h-40 flex items-center justify-center overflow-hidden">
                                            {p.discount > 0 && (
                                                <span className="absolute top-2 left-2 bg-yellow text-gray-900 text-[10px] font-black px-2 py-0.5 rounded z-10">
                                                    {p.discount}% OFF
                                                </span>
                                            )}
                                            <img
                                                src={p.image_url || '/images/products/placeholder.jpg'}
                                                alt={p.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-3 flex flex-col flex-1">
                                            <h3 className="font-bold text-sm text-gray-800 mb-1 line-clamp-2">{p.name}</h3>
                                            <div className="flex items-center gap-2 mt-auto">
                                                <span className="font-black text-gray-900 text-sm">₹{discounted ? discounted.toFixed(0) : p.price}</span>
                                                {discounted && <span className="text-xs text-gray-400 line-through">₹{p.price}</span>}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
