import type { Metadata } from 'next';
import Link from 'next/link';
import { categories, filterProducts, lines } from '@/lib/catalog';
import { ClosingCTA, Eyebrow, ImageNote, ProductCard } from '@/components/ui';
export const metadata: Metadata = {
  title: 'Productos para hacer tuyos',
  description:
    'Explora playeras, sudaderas, tote bags, tazas, termos, papelería y artículos corporativos para personalizar.',
};
type Params = { categoria?: string; linea?: string };
export default async function Catalog({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const category = categories.some((c) => c.id === params.categoria) ? params.categoria : undefined;
  const line = lines.find((l) => l.id === params.linea);
  const filtered = filterProducts(category, line?.id);
  const href = (cat?: string, ln?: string) => {
    const qs = new URLSearchParams();
    if (cat) qs.set('categoria', cat);
    if (ln) qs.set('linea', ln);
    return `/productos${qs.size ? '?' + qs : ''}`;
  };
  return (
    <>
      <section className="page-intro section-wrap">
        <Eyebrow>EL CATÁLOGO GENHORA</Eyebrow>
        <h1>
          {line ? (
            <>
              {line.name.includes('GENHORA') ? 'GENHORA ' : ''}
              <em>{line.name.replace('GENHORA ', '')}</em>
            </>
          ) : (
            <>
              Encuentra tu
              <br />
              <em>punto de partida.</em>
            </>
          )}
        </h1>
        <p>
          {line?.description ??
            'Elige un objeto. Imagina lo que puede llegar a ser. Nosotros te acompañamos a darle identidad.'}
        </p>
      </section>
      <section className="catalog section-wrap">
        <nav className="line-filters" aria-label="Línea comercial">
          <Link href={href(category)} aria-current={!line ? 'page' : undefined}>
            Todas las líneas
          </Link>
          {lines.map((l) => (
            <Link
              key={l.id}
              href={href(category, l.id)}
              aria-current={line?.id === l.id ? 'page' : undefined}
            >
              {l.short}
            </Link>
          ))}
        </nav>
        <div className="catalog-toolbar">
          <nav className="category-filters" aria-label="Tipo de producto">
            <Link href={href(undefined, line?.id)} aria-current={!category ? 'page' : undefined}>
              Todos
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={href(c.id, line?.id)}
                aria-current={category === c.id ? 'page' : undefined}
              >
                {c.name}
              </Link>
            ))}
          </nav>
          <p aria-live="polite">
            {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>
        {filtered.length ? (
          <div className="product-grid catalog-grid">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Una nueva posibilidad.</h2>
            <p>
              Aún no hay productos en esta combinación. Explora las otras categorías para encontrar
              tu idea.
            </p>
            <Link href="/productos" className="text-link">
              Ver todos los productos
            </Link>
          </div>
        )}
        <ImageNote />
        <p className="catalog-disclaimer">
          Sin precios predefinidos: cada cotización depende del producto, el diseño y la cantidad.
          Modelos, materiales, colores y disponibilidad se confirman al cotizar.
        </p>
      </section>
      <ClosingCTA />
    </>
  );
}
