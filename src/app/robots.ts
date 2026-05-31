import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://crunchycashews.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/profile/',
        '/checkout/',
        '/cart/',
        '/order-confirmation/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
