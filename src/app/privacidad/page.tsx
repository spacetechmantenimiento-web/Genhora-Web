import { pageMetadata } from '@/lib/commerce';
import { Eyebrow, ButtonLink } from '@/components/ui';
export const metadata = pageMetadata(
  'Privacidad y uso de datos',
  'Conoce qué ocurre con tu diseño y la información de tu solicitud al usar el sitio de GENHORA.',
  '/privacidad',
);
export default function Privacy() {
  return (
    <section className="privacy-page section-wrap">
      <Eyebrow>TU INFORMACIÓN</Eyebrow>
      <h1>
        Privacidad
        <br />
        <em>y uso de datos.</em>
      </h1>
      <h2>Tu diseño en este sitio</h2>
      <p>
        El personalizador procesa las imágenes y textos en tu navegador. Los archivos no se suben a
        un almacenamiento de GENHORA. El diseño y los formularios se mantienen en la pestaña actual;
        al cerrarla o recargarla puedes perder su contenido.
      </p>
      <h2>Solicitudes de cotización</h2>
      <p>
        Los formularios preparan un resumen local. No envían una solicitud a GENHORA. Si eliges
        continuar por WhatsApp, el resumen pasa a ese servicio para que puedas revisarlo y enviarlo.
        Comparte únicamente los datos necesarios para tu proyecto. Los logotipos y vistas previas
        deben adjuntarse manualmente.
      </p>
      <h2>Medición de uso</h2>
      <p>
        Esta versión no incorpora una plataforma externa de analítica ni cookies de seguimiento. Sus
        señales de interacción locales no incluyen imágenes, nombres, comentarios ni el contenido de
        tus diseños.
      </p>
      <h2>Al continuar en WhatsApp</h2>
      <p>
        La conversación se rige también por las condiciones y prácticas de privacidad de WhatsApp.
        Puedes consultar a GENHORA sobre el uso de la información de tu proyecto a través del canal
        de contacto.
      </p>
      <ButtonLink href="/contacto">Consultar con GENHORA</ButtonLink>
    </section>
  );
}
