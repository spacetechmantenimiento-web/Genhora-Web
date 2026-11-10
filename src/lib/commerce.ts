import type { Metadata } from 'next';
import { siteConfig } from './config';

export const editorProducts: Record<string, 'playera' | 'sudadera' | 'tote'> = {
  playeras: 'playera',
  sudaderas: 'sudadera',
  'tote-bags': 'tote',
};
export function personalizationHref(slug: string) {
  const id = editorProducts[slug];
  return id ? `/personaliza?producto=${id}` : null;
}
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'es_MX',
      siteName: 'GENHORA',
      title: `${title} | GENHORA`,
      description,
      url: path,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'GENHORA: productos personalizados. Es hora de crear.',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | GENHORA`,
      description,
      images: ['/og-image.png'],
    },
  };
}
export const kits = [
  {
    id: 'esencial',
    name: 'Kit Esencial',
    slugs: ['libretas', 'tote-bags'],
    extra: 'Bolígrafo, sujeto a confirmación.',
    text: 'Un comienzo para escribir ideas y llevarlas contigo.',
  },
  {
    id: 'creativo',
    name: 'Kit Creativo',
    slugs: ['playeras', 'termos', 'libretas'],
    extra: '',
    text: 'Para acompañar a tu equipo dentro y fuera de la oficina.',
  },
  {
    id: 'premium',
    name: 'Kit Premium',
    slugs: ['sudaderas', 'termos', 'libretas'],
    extra: 'Empaque personalizado, sujeto a disponibilidad.',
    text: 'Una propuesta de reconocimiento con la identidad de tu marca.',
  },
] as const;

// Unconfirmed commercial facts stay out of public promises and structured data.
export const commercialPending = {
  prices: null,
  minimumQuantity: null,
  productionDays: null,
  deliveryCoverage: null,
  materialsAndVariants: null,
  corporatePackaging: null,
  privacyOwnerDetails: null,
  photography: [
    'producto individual',
    'sobre modelo',
    'textura',
    'personalización',
    'regalo',
    'kit empresarial',
  ],
};
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/brand/wordmark.svg`,
  description: 'Productos personalizados y propuestas de regalos y kits para empresas en México.',
};
