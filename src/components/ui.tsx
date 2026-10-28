import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { productPrice, type Product } from '@/lib/catalog';

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      className="arrow"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h15m-6-6 6 6-6 6'}
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}
export function ButtonLink({
  href,
  children,
  secondary = false,
  className = '',
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
  className?: string;
}) {
  return (
    <Link className={`button ${secondary ? 'button-outline' : ''} ${className}`} href={href}>
      {children}
      <Arrow />
    </Link>
  );
}
export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="text-link" href={href}>
      {children}
      <Arrow />
    </Link>
  );
}
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
export function Logo({ light = false, className = '' }: { light?: boolean; className?: string }) {
  return (
    <Image
      src={`/brand/wordmark${light ? '-ivory' : ''}.svg`}
      width={189}
      height={63}
      alt="genhora"
      className={`wordmark ${className}`}
      loading="eager"
    />
  );
}
export function ProductImage({
  product,
  className = '',
}: {
  product: Product;
  className?: string;
}) {
  if (product.image.src)
    return (
      <div className={`product-image ${className}`}>
        <Image
          src={product.image.src}
          alt={`Propuesta ilustrativa de ${product.name.toLowerCase()}`}
          fill
          sizes="(max-width: 600px) 50vw, 33vw"
        />
      </div>
    );
  const index = product.image.atlasIndex;
  return (
    <div
      role="img"
      aria-label={`Propuesta ilustrativa de ${product.name.toLowerCase()}`}
      className={`product-image product-atlas ${className}`}
      style={
        {
          '--atlas-x': `${(index % 5) * 25}%`,
          '--atlas-y': index < 5 ? '0%' : '100%',
        } as CSSProperties
      }
    />
  );
}
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link href={`/productos/${product.slug}`} aria-label={`Ver ${product.name.toLowerCase()}`}>
        <div className="product-frame">
          <ProductImage product={product} />
          <span className="product-open">
            <Arrow diagonal />
          </span>
        </div>
        <div className="product-info">
          <h3>{product.name}</h3>
          <span className="product-price">{productPrice(product)}</span>
        </div>
      </Link>
      <p>{product.description}</p>
    </article>
  );
}
export function Photo({
  src,
  alt,
  className = '',
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`photo ${className}`}>
      <Image
        src={`/images/${src}.webp`}
        alt={alt}
        fill
        sizes="(max-width: 767px) 100vw, 60vw"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
      />
    </div>
  );
}
export function ImageNote() {
  return (
    <p className="image-note">
      Imágenes conceptuales para inspirarte. Cada proyecto se define contigo.
    </p>
  );
}
export function ClosingCTA() {
  return (
    <section className="closing section-wrap reveal">
      <Eyebrow>EL SIGUIENTE PASO ES TUYO</Eyebrow>
      <h2>
        Las grandes ideas merecen
        <br className="desktop-break" /> <em>hacerse realidad.</em>
      </h2>
      <ButtonLink href="/contacto">Hagamos realidad tu idea</ButtonLink>
      <span className="closing-star" aria-hidden="true">
        ✳
      </span>
    </section>
  );
}
