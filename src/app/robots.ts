import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/api/',
        '/login',
        '/newUser',
        '/user',
        '/cart',
        '/check-out',
        '/order-success',
        '/article/new',
        '/article/edit/',
        '/product/new',
        '/product/edit/',
        '/meme/new',
        '/meme/edit/',
        '/resource/new',
        '/resource/edit/',
      ],
    },
    sitemap: 'https://moon-math.online/sitemap.xml',
  };
}
