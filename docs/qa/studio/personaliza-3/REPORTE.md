# GENHORA · Personaliza 3.0

Auditoría local del personalizador `/personaliza`. Base: commit `90155e9` (mejora del editor); versión previa: `1cebe33` (MVP). No se hizo push ni despliegue.

## Hallazgos antes de editar

- El MVP ya tenía Canvas interactivo, productos, dos caras, texto, imágenes, exportación y cotización. La última actualización añadió fuentes locales, controles de color y tamaño, historial y pruebas de referencia. La arquitectura y la identidad de marca estaban operativas.
- **Visual:** la sudadera anterior tenía una capucha circular separada, mangas rígidas, puños sin acanalado y un bolsillo trapezoidal. La espalda era demasiado semejante al frente. Las zonas imprimibles no seguían bien el nuevo pecho y la caída posterior.
- **Funcional/usabilidad:** faltaban acciones directas para centrar y ajustar una capa. La selección y los controles seguían visibles al intentar contemplar el producto. La carga de fuentes e imágenes podía provocar redibujos o retener recursos ya fuera del historial.
- Se inspeccionaron los recursos del catálogo: no hay una fotografía frontal y posterior de una hoodie adecuada para recoloración y superposición. Se mantuvo Canvas y se dibujó una ilustración vectorial original con volumen, costuras y textura.

## Cambios realizados

- Nueva sudadera frontal y posterior en `src/lib/studio-hoodie.ts`: capucha, cuello y cordones solo en frente; capucha y costuras posteriores sin bolsillo ni cordones; mangas con caída, puños y cintura acanalados, bolsillo canguro, luces y sombras y textura sutil. La tela se recolorea sin aplicar filtros al diseño del cliente.
- Zonas imprimibles de la sudadera ajustadas al pecho y a la espalda, en coordenadas de producto 800 × 800 independientes de la pantalla. No se atribuyen medidas físicas comerciales.
- Acciones contextuales **Centrar diseño** y **Ajustar al área**, guías centrales discretas durante el arrastre y **Ver sin guías** para ocultar guías, selección y controles. Los PNG se renderizan sin auxiliares.
- Redibujo y cachés de imágenes acotados al historial activo; carga de fuentes dependiente de las familias usadas y reintento ante fallo.
- Se conservó el diseño de Inicio, Productos, la navegación, el logotipo, la paleta, los mockups de playera y tote, las tipografías, los controles comerciales y la exportación interactiva.

## Antes y después

| Vista | Antes | Después |
| --- | --- | --- |
| Sudadera frente | [PNG](before/sudadera-frente-1440.png) | [PNG](after/sudadera-frente-1440.png) |
| Sudadera espalda | [PNG](before/sudadera-espalda-1440.png) | [PNG](after/sudadera-espalda-1440.png) |
| Móvil 390 px | [Página](before/sudadera-mobile-page.png) | [Página](after/sudadera-mobile-page.png) |
| Escritorio 1440 px | [Canvas](before/sudadera-frente-1440.png) | [Página completa](after/sudadera-desktop-page.png) |

También se guardaron las vistas antes/después de playera y tote, ambas caras, a 1440 y 390 px, y las variantes de la sudadera en [blanco](after/sudadera-blanco.png), [negro](after/sudadera-negro.png), [verde bosque](after/sudadera-verde-bosque.png), [rosa pastel](after/sudadera-rosa-pastel.png) y [HEX personalizado](after/sudadera-hex.png).

## Resultado de verificación

### Aprobado mediante prueba

- Playera y tote, frente y espalda: capturas de Canvas antes/después en escritorio y móvil. Su representación no se modificó.
- Sin desbordamiento horizontal a 375, 390, 768 y 1440 px; controles accesibles por teclado y auditoría automática WCAG 2 A/AA y 2.1 AA sin infracciones en 390 y 1440 px.
- Sin errores de consola, hidratación o respuestas 404 durante la suite. Carga inicial acotada de fuentes locales.
- Build de producción Next.js 16.4.2, TypeScript, ESLint y Prettier completados sin errores.

### Corregido y probado

- Escenario A: sudadera negra, texto y PNG transparente en frente, centrado/ajuste, texto en espalda, persistencia de ambas caras, HEX personalizado y exportación de 1600 × 1600 PNG de cada cara.
- Escenario B: cambio visual de Playfair Display a Great Vibes, carga completa de fuente local y comparación píxel a píxel entre vista limpia y PNG exportado.
- Escenario C: carga PNG/JPG/WebP, rechazo de SVG y archivo mayor de 10 MB, escala, rotación y eliminación.
- Escenario D: deshacer, rehacer, restablecer, cambio de producto/cara/color y preservación de capas.
- Escenario E: cinco colores sobre la sudadera, diferencias de iluminación entre torso y manga, dos exportaciones distintas y correspondencia de la vista limpia con el PNG frontal que contiene texto e imagen.
- Escenario F: enlace de WhatsApp con producto, color/HEX, cantidad, talla, caras y notas; el mensaje no afirma que se adjuntó un archivo.
- Arrastre táctil de un texto a 390 px mediante eventos de contacto y activación de vista limpia.

La evidencia reproducible está en [tests.json](tests.json). Para repetir: `STUDIO_URL=http://127.0.0.1:3010 node scripts/audit-studio-3.mjs` tras `npm run build && npm run start -- --port 3010`.

### No verificable aquí

- Envío real por WhatsApp, disponibilidad de colores o producto físico final. Solo se verificó el enlace y su contenido.
- Comportamiento en Safari/iOS o dispositivos físicos. Las pruebas táctiles se hicieron en Chrome emulado.
- Consumo de memoria a largo plazo con archivos de clientes reales; se revisó el ciclo de caché y se probó el flujo, sin perfil de horas.

### Pendiente

- Si GENHORA dispone de fotografías frontales y posteriores de la misma hoodie, reemplazar esta ilustración por un mockup fotográfico calibrado. La versión actual es una ilustración original, no una foto ni una promesa de medidas físicas de impresión.
