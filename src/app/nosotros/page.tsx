import type { Metadata } from 'next';
import { Story } from '@/components/sections';
import { ClosingCTA, Eyebrow, Photo } from '@/components/ui';
import { pageMetadata } from '@/lib/commerce';
export const metadata: Metadata = pageMetadata(
  'Productos con identidad, hechos contigo',
  'GENHORA es un estudio mexicano de productos personalizados para ti, tus regalos y tu empresa. Conoce cómo dar forma a tu idea.',
  '/nosotros',
);
export default function About() {
  return (
    <>
      <Story full />
      <section className="about-commerce section-wrap">
        <Eyebrow>PERSONALIZA LO QUE IMAGINAS</Eyebrow>
        <h2>
          Diseño que puedes <em>hacer tuyo.</em>
        </h2>
        <p>
          En GENHORA creamos propuestas de ropa, accesorios, papelería y regalos personalizados.
          Puedes empezar en el estudio con una playera, sudadera o tote bag, o compartir tu idea
          para otros artículos y proyectos empresariales.
        </p>
        <p>
          Una cotización permite definir producto, diseño, cantidad y condiciones. Consulta
          materiales, tiempos y entrega, y confirma los detalles de tu pedido en la conversación con
          GENHORA.
        </p>
        <a className="text-link" href="/personaliza">
          Personalizar ahora ↗
        </a>
      </section>
      <div className="about-photo section-wrap">
        <Photo src="hero-studio" alt="Propuesta editorial de productos en materiales naturales" />
      </div>
      <section className="values section-wrap">
        <Eyebrow>LO QUE DA FORMA A GENHORA</Eyebrow>
        <div>
          {[
            {
              title: 'Crear con intención.',
              text: 'Cada idea merece una mirada propia. Buscamos originalidad y significado en lo que imaginamos contigo.',
            },
            {
              title: 'Cuidar cada detalle.',
              text: 'La calidad comienza en las decisiones: el diseño, los materiales y la manera en que todo se relaciona.',
            },
            {
              title: 'Hacerlo contigo.',
              text: 'Escuchar es parte de crear. Queremos entender lo que te importa para darle una forma que se sienta tuya.',
            },
          ].map((v, i) => (
            <article key={v.title}>
              <span className="eyebrow">0{i + 1}</span>
              <h2>{v.title}</h2>
              <p>{v.text}</p>
            </article>
          ))}
        </div>
      </section>
      <ClosingCTA />
    </>
  );
}
