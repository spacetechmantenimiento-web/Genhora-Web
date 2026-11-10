# Estudio de personalización — MVP

`/personaliza` utiliza Canvas 2D en un componente cliente. Los datos comerciales provisionales están en `src/lib/studio.ts`; el dibujo y la exportación comparten `src/lib/studio-canvas.ts`. El estado de edición es serializable y conserva, durante la vida de la pestaña, diseños separados por producto y por frente/espalda.

## Uso

Elige playera, sudadera o tote bag; selecciona un color y, para prendas, frente o espalda. Agrega texto, una imagen PNG/JPG/WebP de hasta 10 MB o un motivo original. Selecciona la capa en el lienzo o en la lista; arrástrala o usa los controles de posición, tamaño y rotación. Descarga cada vista como PNG de 1600 × 1600 px. Para cotizar, indica cantidad y talla de referencia cuando corresponda, descarga la imagen y usa el enlace de WhatsApp. Adjunta tú mismo la vista previa en la conversación. En dispositivos compatibles, «Compartir imagen» abre la hoja nativa de compartir con el PNG.

Los archivos cargados se procesan en el navegador. No se envían al servidor ni se guardan de forma permanente. Al salir o recargar con capas añadidas, el navegador advierte que se perderá el trabajo; descarga las vistas antes de cerrar la pestaña.

## Límites y datos pendientes

- Los mockups son ilustraciones frontales planas. No son fotografías del producto real ni simulaciones exactas de impresión.
- Colores, tallas, disponibilidad y áreas de personalización son referencias configurables. Hay que confirmar variantes, medidas físicas, márgenes técnicos, método de impresión y stock antes de presentar ofertas comerciales.
- La tote bag solo ofrece frente, porque no existe un mockup adecuado del reverso.
- La fuente «Manuscrita» utiliza la fuente cursiva disponible en el dispositivo; el logotipo original del sitio no se altera.
- Un aviso de baja resolución orienta al cliente, pero no sustituye la revisión profesional del archivo.
- El número oficial de WhatsApp fue facilitado por la persona propietaria del proyecto. El enlace prepara el texto; WhatsApp no adjunta automáticamente el PNG local.

## Verificación

`scripts/verify-studio.mjs` comprueba edición de texto, cambio de color, preservación de ambas vistas y productos, carga y transformación de PNG, rechazo de SVG y archivos mayores de 10 MB, descarga, enlace de cotización, accesibilidad y ancho móvil de 390 px. Las capturas y una exportación de ejemplo están en `docs/qa/studio/`.
