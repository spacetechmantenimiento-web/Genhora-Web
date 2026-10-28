import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Reveal } from '@/components/reveal';
import './globals.css';
import { siteConfig } from '@/lib/config';
const sans = localFont({
  src: '../../public/fonts/manrope-latin-variable.woff2',
  variable: '--font-manrope',
  weight: '200 800',
  display: 'swap',
});
const serif = localFont({
  src: [
    {
      path: '../../public/fonts/cormorant-garamond-latin-variable.woff2',
      style: 'normal',
      weight: '300 700',
    },
    {
      path: '../../public/fonts/cormorant-garamond-italic-latin-variable.woff2',
      style: 'italic',
      weight: '300 700',
    },
  ],
  variable: '--font-cormorant',
  display: 'swap',
});
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: 'GENHORA — Es hora de crear.', template: '%s | GENHORA' },
  description:
    'Estudio creativo de personalización en México. Productos, regalos y detalles para dar vida a tus ideas, tu marca y tus momentos.',
  applicationName: 'GENHORA',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: 'GENHORA',
    title: 'GENHORA — Es hora de crear.',
    description: 'Ideas con identidad. Objetos con significado.',
    images: [
      {
        url: '/images/hero-studio.webp',
        width: 1536,
        height: 1024,
        alt: 'Concepto editorial GENHORA: textil, tote bag y cerámica',
      },
    ],
  },
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <Reveal />
      </body>
    </html>
  );
}
