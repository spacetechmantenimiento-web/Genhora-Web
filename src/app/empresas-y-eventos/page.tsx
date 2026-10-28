import type { Metadata } from 'next';
import { ButtonLink, ClosingCTA, Eyebrow, Photo, TextLink } from '@/components/ui';
export const metadata: Metadata = {
  title: 'Empresas, eventos y comunidades',
  description:
    'Explora artículos promocionales, merchandising y detalles para celebraciones. Proyectos de personalización a tu medida.',
};
export default function Business() {
  return (
    <>
      <section className="business-hero section-wrap">
        <div>
          <Eyebrow>EMPRESAS · EVENTOS · COMUNIDADES</Eyebrow>
          <h1>
            Hay ideas que
            <br />
            se hacen <em>en grande.</em>
          </h1>
          <p>Cuando un objeto lleva tu identidad, también lleva una parte de lo que representas.</p>
          <ButtonLink href="/contacto?tipo=volumen">Planeemos tu proyecto</ButtonLink>
        </div>
        <Photo
          priority
          src="paper-editorial"
          alt="Concepto de papelería y objetos coordinados en crema y verde"
        />
      </section>
      <section className="business-options section-wrap">
        {[
          {
            number: '01',
            title: 'Una marca que se siente.',
            label: 'GENHORA BUSINESS',
            text: 'Artículos corporativos, kits de bienvenida y productos promocionales. Pensemos en detalles coherentes con tu marca y relevantes para quienes los reciben.',
            href: '/productos?linea=business',
          },
          {
            number: '02',
            title: 'Momentos para recordar.',
            label: 'EVENTOS CON IDENTIDAD',
            text: 'Invitaciones, recuerdos y pequeños detalles que conectan con tu celebración. Una misma idea, presente en cada parte de la experiencia.',
            href: '/productos?linea=eventos',
          },
          {
            number: '03',
            title: 'Algo que nos representa.',
            label: 'COMUNIDADES Y CREADORES',
            text: 'Merchandising para artistas, colectivos, instituciones y creadores de contenido. Da a tu comunidad una nueva manera de reconocerse.',
            href: '/productos?linea=comunidades',
          },
        ].map((item) => (
          <article key={item.number}>
            <span className="business-number">{item.number}</span>
            <div>
              <Eyebrow>{item.label}</Eyebrow>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
              <TextLink href={item.href}>Explora las posibilidades</TextLink>
            </div>
          </article>
        ))}
      </section>
      <section className="project-brief section-wrap">
        <Eyebrow>PARA EMPEZAR A IMAGINARLO</Eyebrow>
        <h2>
          Un buen proyecto
          <br />
          comienza con <em>una conversación.</em>
        </h2>
        <p>
          Ten a la mano el tipo de producto, una cantidad estimada, la fecha que tienes en mente y
          una descripción de tu idea. Los materiales, precios y tiempos se confirman en la
          cotización.
        </p>
        <ButtonLink href="/contacto?tipo=volumen" secondary>
          Prepara tu proyecto
        </ButtonLink>
      </section>
      <ClosingCTA />
    </>
  );
}
