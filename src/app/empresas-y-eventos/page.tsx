import type { Metadata } from 'next';
import { ButtonLink, Eyebrow, Photo } from '@/components/ui';
import { BusinessExperience } from '@/components/business-experience';
import { pageMetadata } from '@/lib/commerce';
export const metadata: Metadata = pageMetadata(
  'Kits corporativos y regalos para empresas',
  'Prepara una propuesta de kits de bienvenida, regalos corporativos y merchandising con la identidad de tu empresa en México.',
  '/empresas-y-eventos',
);
export default function Business() {
  return (
    <>
      <section className="business-hero section-wrap">
        <div>
          <Eyebrow>GENHORA PARA EMPRESAS Y EVENTOS</Eyebrow>
          <h1>
            Tu marca,
            <br />
            <em>en cada detalle.</em>
          </h1>
          <p>
            Creamos artículos personalizados y kits corporativos que hacen memorable la bienvenida,
            el reconocimiento y cada encuentro de tu equipo.
          </p>
          <div className="commerce-actions">
            <ButtonLink href="#business-quote">Cotizar kits empresariales</ButtonLink>
            <ButtonLink href="#soluciones" secondary>
              Explorar soluciones
            </ButtonLink>
          </div>
        </div>
        <div>
          <Photo
            priority
            src="paper-editorial"
            alt="Composición conceptual de libreta, papelería y detalles en verde y marfil"
          />
          <p className="image-note">
            Referencia conceptual. Tu propuesta se define con los artículos elegidos.
          </p>
        </div>
      </section>
      <section id="soluciones" className="business-solutions section-wrap">
        <Eyebrow>OBJETOS QUE REPRESENTAN A TU MARCA</Eyebrow>
        <h2>
          Una intención.
          <br />
          <em>Muchas posibilidades.</em>
        </h2>
        <div>
          {[
            [
              'Kits de bienvenida',
              'Para recibir a nuevos colaboradores con artículos que acompañen su día.',
            ],
            [
              'Regalos corporativos',
              'Para clientes, equipos y ocasiones que merecen un detalle personal.',
            ],
            [
              'Eventos y congresos',
              'Tote bags, libretas y artículos con la identidad de tu encuentro.',
            ],
            [
              'Merchandising de marca',
              'Playeras, sudaderas, termos y accesorios que hablan de tu proyecto.',
            ],
          ].map(([title, text], i) => (
            <article key={title}>
              <span className="eyebrow">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <BusinessExperience />
      <section className="commerce-process section-wrap">
        <Eyebrow>DEL PROYECTO A LA PROPUESTA</Eyebrow>
        <h2>
          Lo definimos <em>contigo.</em>
        </h2>
        <ol>
          <li>
            <span>01</span>
            <h3>Cuéntanos tu proyecto</h3>
            <p>Artículos, cantidad, marca, ciudad y fecha deseada.</p>
          </li>
          <li>
            <span>02</span>
            <h3>Revisamos y cotizamos</h3>
            <p>Consulta opciones, características y disponibilidad.</p>
          </li>
          <li>
            <span>03</span>
            <h3>Confirma los detalles</h3>
            <p>Acuerda diseño, condiciones de producción y entrega antes de realizar tu pedido.</p>
          </li>
        </ol>
      </section>
    </>
  );
}
