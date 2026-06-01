import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'B2B Supply and White Label Services | Crunchy Cashews | Best cashew distributer in India',
  description: 'Leading cashew distributor and factory in India. Partner with Crunchy Cashews for reliable B2B bulk supply, white label contract manufacturing, and private labeling services.',
  keywords: ['B2B Cashew Supply', 'White Label Cashews', 'Cashew Distributor India', 'Cashew Factory India', 'Bulk Cashew wholesale', 'Yunut Processing Industry', 'Cashew exporter India'],
  openGraph: {
    title: 'B2B Supply & White Label Services | Crunchy Cashews',
    description: 'Leading cashew distributor and factory in India. Partner with Crunchy Cashews for B2B bulk supply and private labeling.',
    url: 'https://crunchycashews.com/bulk',
    siteName: 'Crunchy Cashews',
    images: [{ url: '/images/cc-Logo-01-1.png', width: 800, height: 600 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B2B Supply & White Label Services | Crunchy Cashews',
    description: 'Leading cashew distributor and factory in India.',
    images: ['/images/cc-Logo-01-1.png'],
  },
};

export default function BulkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
