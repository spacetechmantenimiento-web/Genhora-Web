# GENHORA — Identidad visual inicial

Etapa 1 · 22 de octubre de 2026

## Idea rectora

**Es hora de crear.** GENHORA se presenta como un estudio creativo mexicano de personalización. La marca parte del momento anterior a una creación: una idea todavía abierta que puede convertirse en algo cotidiano y significativo. El sitio evita atribuir años de experiencia, clientes, testimonios o capacidades productivas no confirmadas.

La dirección editorial combina marfil, tipografía con contraste, fotografía de materiales y composición asimétrica. La referencia al universo de la moda se traduce en proporciones y ritmo, sin copiar signos ni composiciones de otra marca. La portada avanza de inspiración → líneas comerciales → objetos → proceso futuro → empresas → origen → contacto.

## Firma y exploración

Se consideraron tres direcciones: wordmark serif (claro pero demasiado institucional), script de catálogo (fluido, con riesgo de parecer caligrafía de invitación) y firma de trazo propio. Se eligió la tercera. Se investigó **Italianno** como referencia script, cuya licencia SIL OFL 1.1 se conserva en `docs/licenses/Italianno-OFL-reference.txt`; no se usa ni se convierte a contornos en la identidad final.

La firma final «genhora» está dibujada con siete recorridos Bézier originales en `scripts/brand.mjs`. No depende de una fuente comercial, no contiene imágenes rasterizadas y no reproduce el lettering de una marca de referencia. La «g» abre el gesto con un descendente, la «h» introduce el ascendente y la «a» termina con una salida contenida. El trazo monolineal conserva un tono artesanal sin pincel grueso ni ornamentos añadidos.

El isotipo utiliza una **G abierta y un punto separado**: una forma que sigue construyéndose y el punto donde una idea comienza. No representa una taza, una hoja o un reloj literal. La firma y el símbolo son propuestas originales de esta entrega; no implican un registro de marca ni una búsqueda de disponibilidad registral.

### Recursos

Todos se encuentran en `public/brand/`:

| Archivo                   | Uso                                                                       |
| ------------------------- | ------------------------------------------------------------------------- |
| `wordmark.svg`            | Firma principal verde bosque; mínimo recomendado 140 px                   |
| `wordmark-compact.svg`    | Terminal corto, marco más ajustado y trazo de 3.7 unidades; mínimo 120 px |
| `wordmark-monochrome.svg` | Una tinta negra                                                           |
| `wordmark-ivory.svg`      | Firma marfil para fondos oscuros                                          |
| `wordmark-forest.svg`     | Composición completa sobre verde bosque                                   |
| `wordmark-tagline.svg`    | Firma con «Es hora de crear.»; mínimo 220 px                              |
| `isotype.svg`             | G abierta para aplicaciones pequeñas                                      |
| `favicon.svg`             | Isotipo marfil sobre bosque; navegador                                    |
| `brand-board.html`        | Lámina de identidad y prueba de tamaños                                   |

`src/app/icon.svg` es el favicon que sirve Next.js. Los SVG de firma e isotipo son trazos editables. La versión con eslogan conserva el eslogan como texto SVG en Arial/sans-serif para mantenerlo editable; antes de imprenta deberá convertirse a contornos en la herramienta editorial final. El lettering de «genhora» sí es vector independiente en todas las variantes.

Regeneración: `npm run brand:generate`. Después de modificar el dibujo maestro, revisar nuevamente compacta, favicon y todos los tamaños.

### Reglas de uso

- Mantener una zona libre de al menos la altura de la «o» alrededor de la firma.
- Usar el isotipo por debajo de 120 px de ancho disponible. El favicon se revisó a 16 y 32 px.
- No deformar, inclinar adicionalmente, añadir sombras, rellenar los espacios internos ni alterar conexiones individuales.
- En fotografía, colocar sobre una superficie limpia con contraste suficiente.
- Usar la firma solo como marca; nunca para párrafos o navegación.

## Color y tokens

Los tokens se declaran en `src/app/globals.css` y se exponen a Tailwind 4 mediante `@theme inline`.

| Token      | Color     | Función                                                |
| ---------- | --------- | ------------------------------------------------------ |
| `--ivory`  | `#F9F7F0` | Fondo predominante                                     |
| `--forest` | `#294D3A` | Texto, botones, pie de página                          |
| `--mint`   | `#DCEADB` | Cierre e invitación a crear                            |
| `--sage`   | `#ADC8B3` | Acentos, identidad                                     |
| `--green`  | `#648D74` | Acentos gráficos; evitar en texto pequeño sobre marfil |
| `--muted`  | `#59675C` | Texto secundario legible                               |
| `--stone`  | `#E8E4DA` | Fondos fotográficos y estados de carga                 |
| `--line`   | `#D7DCD1` | Separadores decorativos                                |
| `--cream`  | `#F0EEE5` | Superficies secundarias                                |

El bosque sobre marfil y los textos secundarios se verifican mediante axe en el sitio. Los verdes pastel son superficies, no texto claro sobre blanco. El degradado oscuro de la colección fotográfica sirve exclusivamente para asegurar lectura sobre la imagen.

## Tipografía

| Nivel     | Elección                                      | Uso                                      |
| --------- | --------------------------------------------- | ---------------------------------------- |
| Firma     | Dibujo vectorial propio                       | Marca exclusivamente                     |
| Editorial | Cormorant Garamond variable, regular e italic | Titulares y frases breves                |
| Funcional | Manrope variable                              | Cuerpo, navegación, botones, formularios |

Las fuentes se cargan con `next/font/local`, `display: swap`, en WOFF2 latin (incluye ñ, acentos y signos del español). Los archivos completos de referencia se conservan en `assets/source/fonts/`; no se solicitan a Google durante la visita ni al compilar.

Los titulares usan `clamp()` con ajustes de composición por breakpoint. H1 base 52–84 px, H2 42–62 px, interlineado 1.02–1.06 y tracking negativo moderado. Manrope utiliza pesos 400–600, interlineado de lectura 1.75–1.9 y espaciado amplio solo en etiquetas. Los campos móviles usan 16 px para evitar zoom involuntario en iOS.

### Licencias verificadas

Cormorant Garamond y Manrope se distribuyen bajo **SIL Open Font License 1.1**, que permite uso comercial e incorporación web respetando sus condiciones. Se conservan los avisos íntegros de copyright y licencia. No vender los archivos de fuente por sí solos ni atribuir autoría de las fuentes a GENHORA.

Fuentes primarias consultadas y descargadas:

- [Cormorant: proyecto original](https://github.com/CatharsisFonts/Cormorant).
- [Licencia Cormorant Garamond](https://github.com/google/fonts/blob/main/ofl/cormorantgaramond/OFL.txt).
- [Licencia Manrope](https://github.com/google/fonts/blob/main/ofl/manrope/OFL.txt).
- [Licencia Italianno, referencia no utilizada](https://github.com/google/fonts/blob/main/ofl/italianno/OFL.txt).
- Los WOFF2 provienen del CSS oficial de [Google Fonts](https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Manrope:wght@200..800&display=swap).

Copias locales: `docs/licenses/`.

## Fotografía

Se generaron cuatro imágenes con la herramienta integrada Imagegen, sin fotografía de stock, marcas ajenas ni textos generados sobre los objetos. Son **conceptos ilustrativos**, no fotos de inventario confirmado ni trabajos realizados para clientes. Las páginas lo indican junto al catálogo y las fichas. Modelos, materiales y colores se confirman al cotizar.

| Recurso web                          | Función                                    |
| ------------------------------------ | ------------------------------------------ |
| `public/images/hero-studio.webp`     | Sudadera, tote bag y taza sobre piedra     |
| `public/images/style-editorial.webp` | Textiles en un contexto editorial          |
| `public/images/paper-editorial.webp` | Invitaciones y papelería                   |
| `public/images/catalog-atlas.webp`   | Diez conceptos de producto, retícula 5 × 2 |

Los PNG originales están en `assets/source/images/`. Se exportaron WebP sin modificar la composición. El catálogo muestra cada celda del atlas mediante posición CSS: no hay diez descargas repetidas. Para fotos reales por producto, establecer `product.image.src` en `src/lib/catalog.ts`; `ProductImage` ya soporta esta sustitución sin cambiar las rutas. Antes de ampliar significativamente las fichas visuales, sustituir el atlas (aprox. 396 px por celda) por imágenes individuales de mayor resolución.

Los prompts y el método están documentados en `docs/ASSETS.md`. El texto del concepto «una idea muy tuya» se superpone con HTML sobre la tote bag y se identifica como una vista conceptual de lo que viene. No es un editor ni una herramienta interactiva.

## Interacciones y accesibilidad

Navegación semántica, enlace para saltar al contenido, labels, `aria-current`, estado de menú y Escape con devolución de foco. El sitio conserva contenido y navegación esenciales sin animación; el menú y el resumen requieren JavaScript. Las apariciones se aplican progresivamente al contenido fuera del viewport; `prefers-reduced-motion` elimina animaciones, transiciones y scroll suave. Hover de producto usa transformaciones pequeñas. No hay carrusel automático, vídeo pesado ni dependencia Motion.

## Voz de marca

Español de México, cálido y directo. Hablar de posibilidades sin afirmar características técnicas o plazos no confirmados. Usar «cotiza», «cuéntanos» y «hagámoslo tuyo». No inventar precios «desde», teléfonos, testimonios, políticas o redes. No mostrar WhatsApp si su número no es válido. Las frases de origen expresan propósito, no trayectoria.
