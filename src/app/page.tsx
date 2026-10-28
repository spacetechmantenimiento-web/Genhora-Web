import Link from 'next/link';
import { Hero } from '@/components/hero';
import { Arrow, ClosingCTA, Eyebrow, ImageNote, ProductCard, TextLink } from '@/components/ui';
import { BusinessSection, Collections, PersonalizeSection, Story } from '@/components/sections';
import { products } from '@/lib/catalog';
export default function Home() {
  return (
    <>
      <Hero />
      <Collections />
      <section className="featured section-wrap reveal">
        <div className="section-heading">
          <div>
            <Eyebrow>EL COMIENZO DE ALGO TUYO</Eyebrow>
            <h2>
              Objetos simples.
              <br />
              <em>Posibilidades infinitas.</em>
            </h2>
          </div>
          <TextLink href="/productos">Explora el catálogo</TextLink>
        </div>
        <div className="product-grid featured-grid">
          {[products[0], products[2], products[3], products[8]].map((product) => (
            <ProductCard product={product} key={product.slug} />
          ))}
        </div>
        <div className="more-products">
          <span className="eyebrow">TAMBIÉN PUEDES CREAR CON</span>
          <div>
            {[products[1], products[4], products[5], products[6], products[7], products[9]].map(
              (p) => (
                <Link href={`/productos/${p.slug}`} key={p.slug}>
                  {p.name}
                  <Arrow diagonal />
                </Link>
              ),
            )}
          </div>
        </div>
        <ImageNote />
      </section>
      <PersonalizeSection />
      <BusinessSection />
      <Story />
      <ClosingCTA />
    </>
  );
}
