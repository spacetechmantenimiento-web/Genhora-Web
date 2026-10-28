import type { Metadata } from 'next';
import { Story } from '@/components/sections';
import { ClosingCTA, Eyebrow, Photo } from '@/components/ui';
export const metadata: Metadata = {
  title: 'Un estudio hecho de ideas',
  description:
    'Creemos en transformar ideas en objetos que cuentan historias. Conoce la esencia de GENHORA.',
};
export default function About() {
  return (
    <>
      <Story full />
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
