import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products, lines } from '@/lib/catalog';
import { quoteHref } from '@/lib/config';
import { ButtonLink, Eyebrow, ProductCard, ProductImage } from '@/components/ui';
import { pageMetadata, personalizationHref } from '@/lib/commerce';
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = products.find((p) => p.slug === slug);
  return pageMetadata(
    p ? `${p.name} para personalizar` : 'Producto no encontrado',
    p
      ? `Personaliza ${p.name.toLowerCase()} con tu diseño o identidad de marca. Prepara tu proyecto y solicita una cotización en GENHORA.`
      : 'Explora los productos personalizados de GENHORA.',
    `/productos/${slug}`,
  );
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = products.find((p) => p.slug === slug);
  if (!p) notFound();
  return (
    <>
      <section className="product-detail section-wrap" data-product-page={p.slug}>
        <nav className="breadcrumbs" aria-label="Ruta de navegación">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <Link href="/productos">Productos</Link>
          <span>/</span>
          <span aria-current="page">{p.name}</span>
        </nav>
        <div className="product-detail-grid">
          <div>
            <ProductImage product={p} />
            <p className="image-note">Imagen conceptual. El modelo final se confirma al cotizar.</p>
          </div>
          <div className="product-detail-copy">
            <Eyebrow>UN OBJETO. TU HISTORIA.</Eyebrow>
            <h1>{p.name}</h1>
            <h2>{p.singular}</h2>
            <p>{p.detail}</p>
            <div className="product-ideas">
              <h3>Una idea puede empezar con…</h3>
              <ul>
                {p.ideas.map((idea) => (
                  <li key={idea}>{idea}</li>
                ))}
              </ul>
            </div>
            <ButtonLink href={personalizationHref(p.slug) ?? quoteHref(p.slug)}>
              {personalizationHref(p.slug) ? 'Personalizar ahora' : 'Cotizar personalización'}
            </ButtonLink>
            {personalizationHref(p.slug) && (
              <Link className="text-link" href={quoteHref(p.slug)}>
                Prefiero cotizar mi idea
              </Link>
            )}
            <p className="muted">
              Cuéntanos tu diseño y la cantidad que imaginas. Precio, características y tiempo de
              entrega se definirán para tu proyecto.
            </p>
            <div className="product-line-tags">
              {lines
                .filter((l) => p.lines.includes(l.id))
                .map((l) => (
                  <Link key={l.id} href={`/productos?linea=${l.id}`}>
                    {l.name}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
      <section className="related section-wrap">
        <Eyebrow>OTRAS FORMAS DE CREAR</Eyebrow>
        <h2>
          La inspiración <em>continúa.</em>
        </h2>
        <div className="product-grid featured-grid">
          {products
            .filter((other) => other.slug !== p.slug)
            .sort((a, b) => Number(b.category === p.category) - Number(a.category === p.category))
            .slice(0, 4)
            .map((other) => (
              <ProductCard key={other.slug} product={other} />
            ))}
        </div>
      </section>
    </>
  );
}
