import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blogs on Recipie, health and sustainability | Best Cashew In India',
  description: 'Explore Crunchy Cashews articles on delicious cashew recipes, health benefits of cashew nuts, and sustainable cashew farming practices. Get the best food journals in India.',
  keywords: ['Cashew Recipes', 'Cashew Health Benefits', 'Sustainable Farming', 'Best Cashews in India', 'Kaju Recipe', 'Healthy Snacks Blogs'],
  openGraph: {
    title: 'Blogs on Recipie, health and sustainability | Best Cashew In India',
    description: 'Explore Crunchy Cashews articles on delicious cashew recipes, health benefits of cashew nuts, and sustainable cashew farming.',
    url: 'https://crunchycashews.com/blogs',
    siteName: 'Crunchy Cashews',
    images: [{ url: '/images/cc-Logo-01-1.png', width: 800, height: 600 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blogs on Recipie, health and sustainability',
    description: 'Read the latest cashew recipes, health tips, and sustainability blogs.',
    images: ['/images/cc-Logo-01-1.png'],
  },
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
