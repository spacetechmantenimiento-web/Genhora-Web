import type { MetadataRoute } from 'next';
import { products } from '@/lib/catalog';
import { siteConfig } from '@/lib/config';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '/',
    '/productos',
    '/personaliza',
    '/empresas-y-eventos',
    '/nosotros',
    '/contacto',
    '/privacidad',
    ...products.map((p) => `/productos/${p.slug}`),
  ].map((path) => ({ url: `${siteConfig.url}${path}`, changeFrequency: 'monthly' }));
}
