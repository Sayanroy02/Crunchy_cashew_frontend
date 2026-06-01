import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Nitesh Jindal - MD | Crunchy Cashew | Best Cashew Factory in India',
  description: 'Discover Crunchy Cashews (Yu Nut Processing Industry) in Siliguri, West Bengal. Led by Managing Director Nitesh Jindal, we are India\'s leading state-of-the-art cashew processing factory.',
  keywords: ['About Crunchy Cashews', 'Nitesh Jindal MD', 'Cashew Factory in India', 'Yu Nut Processing Industry', 'Siliguri Cashew Factory', 'Quality Cashews', 'Cashew Sourcing'],
  openGraph: {
    title: 'About Us | Nitesh Jindal - MD | Crunchy Cashew',
    description: 'Discover Crunchy Cashews (Yu Nut Processing Industry) in Siliguri. Led by MD Nitesh Jindal.',
    url: 'https://crunchycashews.com/about',
    siteName: 'Crunchy Cashews',
    images: [{ url: '/images/cc-Logo-01-1.png', width: 800, height: 600 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Nitesh Jindal - MD | Crunchy Cashew',
    description: 'Discover Crunchy Cashews factory and team led by Nitesh Jindal.',
    images: ['/images/cc-Logo-01-1.png'],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
