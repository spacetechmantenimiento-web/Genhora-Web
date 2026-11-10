import { Eyebrow } from './ui';
export function FAQ() {
  const questions = [
    [
      '¿Cómo puedo personalizar mi producto?',
      'Elige playera, sudadera o tote bag y abre el estudio para agregar texto o imágenes. Para otros artículos, prepara tu idea desde la ficha del producto.',
    ],
    [
      '¿Puedo enviar mi propio logotipo?',
      'Sí. En el estudio puedes cargar PNG, JPG o WebP. Para cotizar, descarga la vista previa y adjunta tu archivo manualmente en WhatsApp.',
    ],
    [
      '¿Puedo solicitar varias piezas?',
      'Indica la cantidad que necesitas. GENHORA revisará las opciones y disponibilidad al preparar tu cotización.',
    ],
    [
      '¿Cómo se calcula el precio?',
      'La propuesta depende del producto, la cantidad y la personalización. El precio y las características se confirman durante la cotización.',
    ],
    [
      '¿La vista previa representa el resultado definitivo?',
      'Es una referencia ilustrativa. Modelo, tonos, materiales, tamaño de impresión y acabado final deben confirmarse con GENHORA antes de realizar el pedido.',
    ],
    [
      '¿Cómo conozco los tiempos y las opciones de entrega?',
      'Comparte la fecha deseada y la ciudad de entrega. Consulta los tiempos y condiciones en tu cotización; la fecha indicada en el sitio es una referencia.',
    ],
    [
      '¿Puedo pedir kits para mi empresa?',
      'Sí. Explora las composiciones sugeridas en Empresas y eventos y prepara una solicitud con artículos, cantidad y necesidades de tu marca.',
    ],
  ];
  return (
    <section className="faq section-wrap">
      <Eyebrow>ANTES DE EMPEZAR</Eyebrow>
      <h2>
        Tu idea, <em>con claridad.</em>
      </h2>
      <div>
        {questions.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
