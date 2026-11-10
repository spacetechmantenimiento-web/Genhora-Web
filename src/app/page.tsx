import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/hero';
import { Arrow, ClosingCTA, Eyebrow, ImageNote, ProductCard, TextLink } from '@/components/ui';
import { BusinessSection, Collections, PersonalizeSection } from '@/components/sections';
import { FAQ } from '@/components/faq';
import { pageMetadata } from '@/lib/commerce';
import { products } from '@/lib/catalog';
const featured = [
  ['playeras', 'ROPA PARA PERSONALIZAR'],
  ['sudaderas', 'ROPA PARA PERSONALIZAR'],
  ['tote-bags', 'ACCESORIOS PARA PERSONALIZAR'],
  ['tazas', 'TAZAS Y TERMOS'],
  ['libretas', 'PAPELERÍA PERSONALIZADA'],
  ['llaveros', 'DETALLES PARA EVENTOS'],
] as const;
export const metadata: Metadata = pageMetadata(
  'Productos personalizados en México',
  'Personaliza playeras, sudaderas, tote bags y regalos. Crea tu diseño o prepara una cotización de kits corporativos con GENHORA.',
  '/',
);
export default function Home() {
  return (
    <>
      <Hero />
      <section className="featured section-wrap reveal">
        <div className="section-heading">
          <div>
            <Eyebrow>ELIGE TU PRODUCTO</Eyebrow>
            <h2>
              Hazlo tuyo.
              <br />
              <em>Empieza por aquí.</em>
            </h2>
          </div>
          <TextLink href="/productos">Explora el catálogo</TextLink>
        </div>
        <div className="product-grid featured-grid">
          {featured.map(([slug, collection]) => (
            <ProductCard
              product={products.find((p) => p.slug === slug)!}
              collection={collection}
              key={slug}
            />
          ))}
        </div>
        <div className="more-products">
          <span className="eyebrow">TAMBIÉN PUEDES CREAR CON</span>
          <div>
            {products
              .filter((p) => !featured.some(([slug]) => slug === p.slug))
              .map((p) => (
                <Link href={`/productos/${p.slug}`} key={p.slug}>
                  {p.name}
                  <Arrow diagonal />
                </Link>
              ))}
          </div>
        </div>
        <ImageNote />
      </section>
      <PersonalizeSection />
      <BusinessSection />
      <Collections />
      <FAQ />
      <ClosingCTA />
    </>
  );
}
