# GENHORA — QA final de Inicio (Prompt 03)

## Hallazgos y ajustes

- Varias descripciones, etiquetas y enlaces secundarios de Inicio quedaban demasiado pequeños. Se aumentó ligeramente su tamaño, con reglas limitadas a Inicio. Los cinco pasos del personalizador tienen ahora 13 px y más separación vertical; la historia y los textos de productos y líneas también ganan legibilidad.
- Los indicadores 01/02/03 del hero parecían botones circulares. Se conservó su posición y numeración, pero se presentaron como pequeñas etiquetas rectangulares. Siguen ocultos a tecnologías de asistencia y no aceptan interacción (`pointer-events: none`).
- El sello circular superior está alineado con la fotografía arqueada. No requirió modificación.
- La navegación, la descripción del hero, el isotipo de la historia y la composición general ya cumplían su función; no se modificaron.

## Imágenes

El repositorio contiene una escena personalizada compuesta para el hero y fotografías conceptuales de productos sin personalización para las demás secciones. La escena del hero no sirve como imagen individual de catálogo, evento o Business. Se conservaron las fotografías actuales por no haber alternativas adecuadas y verificadas en el repositorio.

Para una etapa posterior convendría incorporar fotografías con derechos de uso de productos destacados personalizados, papelería de eventos personalizada y artículos corporativos personalizados. Hasta entonces, el sitio identifica las imágenes existentes como conceptuales.

## Verificación

- Capturas y reporte automatizado: [`qa/home-final/`](qa/home-final/), anchos 360, 390, 768, 1024 y 1440 px.
- Sin desplazamiento horizontal, imágenes rotas después de completar la carga diferida, errores de página ni infracciones detectadas por axe-core WCAG 2 A/AA y 2.1 AA en esos anchos.
- Menú móvil abre y cierra con Escape. Los 19 destinos internos de Inicio responden HTTP 200. Se probó navegación real de los CTA hacia catálogo, historia y Empresas y eventos.
- `npm run lint`, `npm run typecheck` y `npm run build`: correctos.
- Se inspeccionó visualmente Inicio en el navegador. El build de producción generó todas las rutas correctamente.

La identidad, estructura, fotografía principal, títulos, paleta, tipografías, logotipo y contenido de las otras páginas permanecen intactos. No se añadieron dependencias, ni se realizó push o despliegue.
