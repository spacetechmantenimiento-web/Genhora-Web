import { ButtonLink, Eyebrow } from '@/components/ui';
export default function NotFound() {
  return (
    <section className="not-found section-wrap">
      <Eyebrow>404 · UN CAMINO POR CREAR</Eyebrow>
      <h1>
        Tu idea tiene lugar.
        <br />
        <em>Esta página, todavía no.</em>
      </h1>
      <p>Sigamos explorando las posibilidades de GENHORA.</p>
      <ButtonLink href="/productos">Ir a productos</ButtonLink>
    </section>
  );
}
