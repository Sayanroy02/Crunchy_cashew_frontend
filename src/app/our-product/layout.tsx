import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Now | Crunchy Cashews | Best Cashews in India',
  description: 'Buy premium, farm-fresh cashews online in India. Crunchy Cashews offers the highest quality raw, roasted, salted, and flavored cashews at wholesale prices.',
  keywords: ['Buy Cashews Online', 'Best Cashews in India', 'Crunchy Cashews', 'Premium Cashew Nuts', 'Flavored Cashews', 'Kaju Online', 'Cashew wholesales'],
  openGraph: {
    title: 'Shop Now | Crunchy Cashews | Best Cashews in India',
    description: 'Buy premium, farm-fresh cashews online in India. Highest quality raw, roasted, salted, and flavored cashews.',
    url: 'https://crunchycashews.com/our-product',
    siteName: 'Crunchy Cashews',
    images: [{ url: '/images/cc-Logo-01-1.png', width: 800, height: 600 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Now | Crunchy Cashews | Best Cashews in India',
    description: 'Buy premium, farm-fresh cashews online in India.',
    images: ['/images/cc-Logo-01-1.png'],
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
