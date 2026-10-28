# GENHORA — Rediseño del inicio, revisión 02

23 de octubre de 2026 · Implementación local, sin push ni deploy.

## Dirección de arte

Se conserva la firma manuscrita, la paleta original, Cormorant Garamond y el titular «Tu idea, nuestro próximo gran diseño.». La composición pasa de mostrar objetos neutros a presentar una escena conceptual de personalización: ilustración de sol y olas en una tote bag, motivo de estrella en una sudadera y el nombre de ejemplo «ana» en una taza.

La estrategia elegida es **B: detalles de autor**. Tres anotaciones editoriales numeradas relacionan el objeto con su posibilidad: «Tu diseño», «Tu historia» y «Tu nombre». Son contenido estático, sin botones ni apariencia de editor. La escena se identifica expresamente como conceptual y no representa un pedido ni un trabajo realizado para una clienta real.

El arco mantiene el carácter de la primera versión, pero ahora respeta el encuadre vertical completo. No corta el diseño de la tote bag, el bordado ilustrativo ni el nombre de la taza. El sello utiliza el isotipo original y el eslogan; se sitúa en una zona de fondo, sin tapar las personalizaciones.

## Cambios visuales

- Firma a 196 px en escritorio, 185 px en tablet y 174 px en móvil. Archivo vectorial original conservado.
- Barra superior eliminada para dar espacio al header y evitar una segunda línea de texto diminuto.
- Navegación de escritorio de 12 px, controles de al menos 46 px de alto, indicador activo y feedback de hover/focus. El menú desplegable se utiliza hasta 1150 px para evitar comprimir los enlaces.
- Menú accesible: estado expandido, Escape, devolución del foco y cierre al navegar. La navegación móvil emplea enlaces de 16 px y filas de 52 px.
- Titular en tres líneas intencionadas, con «gran diseño» en cursiva; sin cortes accidentales a 360 o 390 px.
- Descripción de 13–15 px, frente a los textos más pequeños de la versión anterior. Botón principal de 54–56 px de alto.
- Ambos CTA del hero conducen a `/productos`. «Cotiza tu idea» mantiene `/contacto`.
- Entrada finita y suave de titular, descripción, botones y fotografía; sin bucles ni parallax. Movimiento reducido elimina las animaciones. El contenido esencial no parte de opacidad cero.
- Franja estática con cuatro mensajes completos, separadores y cierre tipográfico con el eslogan. En móvil se convierte en una composición 2 × 2; ningún mensaje desaparece.
- En móvil cambian el tamaño y proporción del arco, ubicación del sello, presentación de las anotaciones, ancho de CTA y ritmo de espacios. El producto completo se conserva en el encuadre.

## Archivos

Modificados:

- `src/app/page.tsx`: sustituye únicamente hero y franja por `<Hero />`.
- `src/components/header.tsx`: elimina barra superior, aplica estilos propios y conserva comportamiento de navegación.
- `src/app/globals.css`: retira 89 reglas del header/hero anterior y su animación; conserva las reglas de las secciones posteriores.

Nuevos:

- `src/components/hero.tsx`: escena, anotaciones, sello, CTA y franja.
- `src/components/hero.module.css`: diseño y responsive exclusivos del inicio.
- `src/components/header.module.css`: estilos encapsulados del header.
- `public/images/hero-personalized-02.webp`: nueva imagen final, 1122 × 1402 px, 288,306 bytes.
- `assets/source/images/hero-personalized-02.png`: original conservado.
- `scripts/verify-redesign.mjs`: auditoría reproducible del alcance solicitado.
- `docs/qa/redesign-02/`: capturas, estado inicial de hashes y reporte JSON.
- Este documento y `docs/ASSET_HERO_02.md`: decisiones y procedencia del recurso.

No se cambió ninguna dependencia. Se reutilizan Next Image, los componentes de botones, el logotipo, el isotipo y los tokens. Los nuevos CSS Modules evitan que las modificaciones de tamaño afecten al catálogo o a otras secciones.

## Validación

| Prueba                   | Resultado                                                                                |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| `npm run lint`           | Sin errores ni advertencias                                                              |
| `npm run typecheck`      | Aprobado                                                                                 |
| `npm run build`          | Aprobado; 19 páginas estáticas generadas                                                 |
| Viewports                | 360, 390, 768, 1024, 1440 y 1920 px                                                      |
| Overflow horizontal      | Ninguno en los seis tamaños                                                              |
| Cortes del titular       | Las tres líneas caben en todos los tamaños                                               |
| Imágenes                 | Carga correcta; proporción original conservada                                           |
| Accesibilidad automática | Axe WCAG 2 A/AA y 2.1 AA: sin incidencias en los seis tamaños                            |
| Navegación               | Los seis destinos del menú devuelven HTTP 200                                            |
| CTA                      | Ambos CTA abren Productos; Cotiza mantiene Contacto                                      |
| Menú                     | Apertura, navegación, cierre con Escape y devolución de foco correctos                   |
| Teclado                  | Enlace «Saltar al contenido» accesible en primer lugar                                   |
| Movimiento               | Entradas finitas completan; contenido visible con movimiento reducido                    |
| Layout                   | CLS observado 0 en la sesión local, sin limitación artificial de red                     |
| Runtime                  | Sin errores JavaScript registrados                                                       |
| Alcance                  | 32 archivos originales protegidos sin cambios; solo tres archivos existentes modificados |

Se revisaron las capturas de escritorio, móvil y tablet, además del resultado en el navegador integrado. El contenido de `page.tsx` desde `<Collections />` hasta el final se comparó con una copia previa y es idéntico. Los componentes, datos y recursos preexistentes ajenos al alcance conservan sus hashes.

Evidencia: `docs/qa/redesign-02/report.json`. Las capturas `preview-*.png` muestran el primer viewport y `home-*.png` la página completa. `menu-390.png`, `hover-1440.png` y `focus-1440.png` documentan estados de interacción.

Las métricas de red del reporte proceden de una sesión local, con caché compartida; no son una medición de rendimiento en internet. No se certifican 60 FPS ni conformidad completa de accesibilidad solo a partir de axe. No se probaron dispositivos físicos ni todos los motores de navegador.

## Revisar en localhost

La vista previa sigue en **http://127.0.0.1:3002/**. Recargar la pestaña para ver la revisión nueva.

Si en otra sesión el servidor está detenido:

```sh
cd "/Users/macbookpro/Documents/ChatGPT/GENHORA"
npm run dev -- --port 3002
```

Si el puerto ya está ocupado por GENHORA, reutilizar ese servidor. Para repetir la auditoría, con la vista previa activa:

```sh
node scripts/verify-redesign.mjs
```

## Límites de esta revisión

La fotografía es un recurso generado para demostración. Los acabados, modelos y personalizaciones definitivas deben confirmarse con el negocio; no se ofrecen como especificaciones de producción. El recurso está listo para sustituirse por una sesión fotográfica real manteniendo el encuadre.

No se implementaron editor, carga de archivos, pedidos, pagos o backend. El resto de la etapa 1 y sus pendientes comerciales se mantienen sin cambios. No se realizaron operaciones remotas.
