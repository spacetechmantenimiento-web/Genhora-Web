import Link from 'next/link';
import { Arrow, ButtonLink, Eyebrow, Photo, TextLink } from './ui';
import { lines } from '@/lib/catalog';
export function Collections() {
  return (
    <section className="collections section-wrap reveal" id="explora">
      <div className="section-heading">
        <div>
          <Eyebrow>UN UNIVERSO DE POSIBILIDADES</Eyebrow>
          <h2>
            Hay una idea para
            <br />
            <em>cada historia.</em>
          </h2>
        </div>
        <p>
          Para ti, para alguien especial o para
          <br className="desktop-break" /> eso que quieres construir con otros.
          <br />
          Encuentra tu forma de crear.
        </p>
      </div>
      <div className="collection-grid">
        <Link className="collection-large" href="/productos?linea=estilo">
          <Photo
            src="style-editorial"
            alt="Concepto de sudadera verde y tote bag natural, sin personalizar"
          />
          <div className="collection-label">
            <span className="eyebrow">01 / PERSONALIZA TU ESTILO</span>
            <h3>
              Tan único
              <br />
              como tú.
            </h3>
            <span className="collection-action">
              Hazlo tuyo <Arrow />
            </span>
          </div>
        </Link>
        <div className="collection-right">
          <Link className="collection-gifts" href="/productos?linea=regalos">
            <div className="collection-card-copy">
              <Eyebrow>02 / REGALOS CON SIGNIFICADO</Eyebrow>
              <h3>
                Un detalle.
                <br />
                <em>Todo un mundo.</em>
              </h3>
              <span className="collection-action">
                Encuentra inspiración <Arrow />
              </span>
            </div>
            <Photo src="hero-studio" alt="Concepto de taza de cerámica y accesorios sobre piedra" />
          </Link>
          <Link className="collection-events" href="/productos?linea=eventos">
            <Photo src="paper-editorial" alt="Concepto de invitación, sobre salvia y libreta" />
            <div className="event-caption">
              <div>
                <Eyebrow>03 / EVENTOS QUE DEJAN HUELLA</Eyebrow>
                <h3>Momentos que se quedan.</h3>
              </div>
              <Arrow diagonal />
            </div>
          </Link>
        </div>
      </div>
      <div className="collection-bottom">
        {lines.slice(3).map((line, i) => (
          <Link href={`/productos?linea=${line.id}`} key={line.id}>
            <span className="line-number">0{i + 4}</span>
            <div>
              <h3>{line.name}</h3>
              <p>{line.description}</p>
            </div>
            <Arrow diagonal />
          </Link>
        ))}
      </div>
    </section>
  );
}
export const steps = [
  'Elige tu producto.',
  'Selecciona sus características.',
  'Agrega texto, imágenes o logotipos.',
  'Previsualiza tu diseño.',
  'Solicita una cotización.',
];
export function PersonalizeSection({ full = false }: { full?: boolean }) {
  return (
    <section className={`personalize-section ${full ? 'personalize-full' : ''}`}>
      <div className="personalize-inner section-wrap reveal">
        <div className="personalize-art">
          <div className="concept-label">EL LIENZO ES TUYO</div>
          <div
            className="concept-tote"
            role="img"
            aria-label="Concepto ilustrativo de tote bag natural"
          />
          <span className="concept-script">
            una idea
            <br />
            <i>muy tuya.</i>
          </span>
          <span className="concept-footnote">Un vistazo a lo que viene.</span>
          <span className="concept-dot" aria-hidden="true" />
        </div>
        <div className="personalize-copy">
          <Eyebrow>PERSONALIZAR ES DARLE IDENTIDAD</Eyebrow>
          {full ? (
            <h1>
              Tu idea.
              <br />
              <em>Tus reglas.</em>
            </h1>
          ) : (
            <h2>
              Tu idea.
              <br />
              <em>Tus reglas.</em>
            </h2>
          )}
          <p>El comienzo es un producto. Lo que lo hace especial lo pones tú.</p>
          <p className="coming-soon">Próximamente: tu estudio de creación en línea.</p>
          <ol className="steps">
            {steps.map((step, i) => (
              <li key={step}>
                <span>0{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <p className="muted">
            El personalizador está en camino. Por ahora, prepara tu idea y la exploraremos contigo
            al habilitar el contacto.
          </p>
          <TextLink href="/contacto">Empecemos con tu idea</TextLink>
        </div>
      </div>
    </section>
  );
}
export function BusinessSection() {
  return (
    <section className="business-section section-wrap reveal">
      <div className="business-copy">
        <Eyebrow>GENHORA BUSINESS & EVENTOS</Eyebrow>
        <h2>
          Tu esencia,
          <br />
          <em>a otra escala.</em>
        </h2>
        <p>
          Una marca que se siente. Un equipo que se identifica. Una celebración que se recuerda.
        </p>
        <p>
          Exploremos artículos promocionales, pedidos por volumen y detalles que hablan de lo que te
          importa.
        </p>
        <ButtonLink href="/empresas-y-eventos" secondary>
          Creemos algo juntos
        </ButtonLink>
      </div>
      <Photo src="paper-editorial" alt="Propuesta conceptual de papelería y detalles de marca" />
      <span className="vertical-caption">DISEÑADO PARA REPRESENTARTE</span>
    </section>
  );
}
export function Story({ full = false }: { full?: boolean }) {
  return (
    <section className={`story section-wrap reveal ${full ? 'story-full' : ''}`}>
      <div className="story-mark" aria-hidden="true">
        <svg viewBox="0 0 72 72">
          <path
            d="M47 18C27 8 13 25 17 42C21 59 45 58 51 41L37 41M51 41L55 28"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="52" cy="17" r="1" fill="currentColor" />
        </svg>
      </div>
      <Eyebrow>EL ORIGEN DE TODO</Eyebrow>
      {full ? (
        <h1>
          Toda gran idea
          <br />
          tiene <em>un comienzo.</em>
        </h1>
      ) : (
        <h2>
          Toda gran idea
          <br />
          tiene <em>un comienzo.</em>
        </h2>
      )}
      <div className="story-body">
        <p>
          En GENHORA creemos que las mejores creaciones comienzan con algo sencillo: una idea, un
          recuerdo, una emoción o el deseo de hacer algo diferente.
        </p>
        <p>
          Nacemos de la pasión por transformar ideas en objetos que cuentan historias. Desde un
          regalo pensado para alguien especial hasta los artículos que dan identidad a una marca,
          queremos que cada creación tenga un significado propio.
        </p>
        <p>
          Para nosotros, personalizar no es solamente colocar un nombre o un diseño. Es darle
          identidad a algo cotidiano y convertirlo en algo extraordinario.
        </p>
      </div>
      <p className="story-signature">GENHORA. Es hora de crear.</p>
      {!full && <TextLink href="/nosotros">Conoce nuestro estudio</TextLink>}
    </section>
  );
}
