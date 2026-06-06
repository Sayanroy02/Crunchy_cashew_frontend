import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us & Factory Visit | Crunchy Cashews | Best Cashews in India',
  description: 'Get in touch with Crunchy Cashews (Yu Nut Processing Industry) in Siliguri, West Bengal. Contact us for bulk sales, retail distribution, or schedule a factory visit.',
  keywords: ['Contact Crunchy Cashews', 'Factory Visit Siliguri', 'Cashew wholesale contact', 'Buy wholesale cashews', 'Yunut Processing Industry contact'],
  openGraph: {
    title: 'Contact Us & Factory Visit | Crunchy Cashews',
    description: 'Get in touch with Crunchy Cashews. Contact us for bulk sales, retail distribution, or schedule a factory visit.',
    url: 'https://crunchycashews.com/contact-us',
    siteName: 'Crunchy Cashews',
    images: [{ url: '/images/cc-Logo-01-1.png', width: 800, height: 600 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us & Factory Visit | Crunchy Cashews',
    description: 'Contact us for bulk sales, retail distribution, or schedule a factory visit.',
    images: ['/images/cc-Logo-01-1.png'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
