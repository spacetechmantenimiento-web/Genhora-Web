import type { Metadata } from 'next';
import { ContactBrief } from '@/components/contact-brief';
import { Eyebrow } from '@/components/ui';
import { siteConfig, whatsappUrl } from '@/lib/config';
import { products } from '@/lib/catalog';
export const metadata: Metadata = {
  title: 'Démosle forma a tu idea',
  description:
    'Prepara un resumen de tu proyecto de personalización. Productos, cantidades y detalles para una futura cotización.',
};
export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<{ producto?: string; tipo?: string }>;
}) {
  const params = await searchParams;
  const selected = products.find((p) => p.slug === params.producto)?.slug ?? '';
  const configured = !!whatsappUrl(siteConfig.whatsappNumber, siteConfig.defaultMessage);
  return (
    <section className="contact-page section-wrap">
      <div className="contact-copy">
        <Eyebrow>ESTE PUEDE SER EL COMIENZO</Eyebrow>
        <h1>
          Tu próxima
          <br />
          gran idea
          <br />
          <em>empieza aquí.</em>
        </h1>
        <p>
          No necesitas tenerlo todo resuelto.
          <br />
          Un producto, una intención o un pequeño
          <br className="desktop-break" /> boceto mental son un buen inicio.
        </p>
        <div className="contact-status">
          <span className="status-dot" />
          <div>
            <h2>
              {configured ? 'Conversemos en WhatsApp' : 'Estamos preparando nuestro contacto.'}
            </h2>
            <p>
              {configured
                ? 'Prepara tu resumen y continúa la conversación por WhatsApp.'
                : 'WhatsApp estará disponible próximamente. Mientras tanto, puedes preparar y copiar el resumen de tu idea.'}
            </p>
          </div>
        </div>
        <p className="contact-signoff">Es hora de crear.</p>
      </div>
      <ContactBrief
        key={`${selected}-${params.tipo ?? ''}`}
        initialProduct={selected}
        volume={params.tipo === 'volumen'}
      />
    </section>
  );
}
