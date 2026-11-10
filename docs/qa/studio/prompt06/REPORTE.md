# GENHORA · Auditoría del estudio de personalización

## Implementado

- Se conservaron el estado y el motor Canvas existentes. Se corrigió la representación de playera, hoodie pullover y tote bag con dibujo vectorial propio, sombras de tela, costuras y detalles propios de cada cara. La sudadera tiene mangas largas, puños, capucha, pretina y bolsillo canguro solo al frente.
- Cada producto tiene un área imprimible relativa distinta para frente y espalda. El cambio de cara conserva sus capas independientes y el exportador usa el área y el mockup correspondientes.
- La paleta muestra 25 colores ilustrativos, accesos rápidos a blanco y negro, selector nativo y entrada HEX validada. El mensaje de WhatsApp incluye nombre del color y código HEX. Cambiar la prenda de color no recolorea las capas.
- El selector ofrece 16 opciones tipográficas agrupadas en Elegantes, Modernas, Impactantes y Manuscritas. Incluye las 13 familias pedidas y tres opciones adicionales. Las nuevas fuentes WOFF2 están alojadas localmente con sus licencias SIL OFL. Solo se cargan las opciones de la categoría visible y las fuentes usadas por el diseño; el exportador espera su carga. Las familias que ofrecen peso 700 usan el archivo correspondiente.
- Se añadieron alineación y grosor de texto cuando la familia lo permite. El movimiento, rotación y escala ajustan la capa al área disponible. “Traer al frente” ahora lleva la capa a la última posición, sobre las demás.
- Se agrandaron textos auxiliares, muestras y controles táctiles. Las guías se pueden ocultar y nunca aparecen en el PNG final.

## Auditoría y defectos corregidos

La versión anterior tenía siluetas planas, mangas de hoodie poco reconocibles, un bolsillo representado como rectángulo simple, cuatro colores por producto, tipografías genéricas sin vista previa real y el mismo área de impresión en ambas caras. Al cambiar de color se modificaba también el texto. “Traer al frente” avanzaba solo una posición. El deslizador de tamaño quedó con un paso incompatible al ampliar su rango y se corrigió durante la auditoría.

## Probado y aprobado

Se ejecutó `STUDIO_URL=http://127.0.0.1:3007 node scripts/audit-studio.mjs` contra `next start` después de un build de producción correcto. Los 12 escenarios pasaron:

| N.º | Escenario | Resultado |
| --- | --- | --- |
| 1 | Playera, HEX, texto, Playfair 700 y PNG | Aprobado |
| 2 | Sudadera, mockup frontal y posterior distintos | Aprobado |
| 3 | Texto frontal e imagen posterior con cambios repetidos | Aprobado |
| 4 | PNG transparente, arrastre, escala, rotación y exportación | Aprobado |
| 5 | Blanco, negro, HEX y conservación del color del texto | Aprobado |
| 6 | Serif y manuscrita cargadas antes de exportar | Aprobado |
| 7 | Formato, tamaño, HEX inválidos y límite de posición | Aprobado |
| 8 | Enlace y parámetros de WhatsApp, descarga disponible | Aprobado |
| 9 | 375, 390, 768 y 1440 px sin scroll horizontal | Aprobado |
| 10 | Cambios repetidos, consola, hidratación y recursos 404 | Aprobado |
| 11 | Cinco motivos, deshacer, rehacer, ordenar, duplicar, eliminar y restablecer | Aprobado |
| 12 | Importación JPG y WebP, sustitución de imagen | Aprobado |

También pasaron `npm run lint`, `npm run typecheck`, `npm test` (4 pruebas) y `npm run build`. La auditoría Playwright final reportó cero errores de consola, cero errores de página y cero respuestas 404. La auditoría anterior con axe no encontró violaciones WCAG 2 A/AA ni 2.1 AA en las vistas ensayadas.

Se inspeccionaron visualmente las capturas de [sudadera frontal](./sudadera-frente.png), [sudadera posterior](./sudadera-espalda.png), [playera exportada](./playera-hex-playfair.png), [tote exportada](./tote-logo-transparente.png) y [móvil 375 px](./responsive-375.png). Los PNG exportados se validaron como archivos de 1600 × 1600 píxeles.

## Pendiente de probar y limitaciones conocidas

- Los mockups son ilustraciones 2D propias dibujadas con trazos Canvas, no fotografías del producto físico ni archivos SVG independientes. El tono, inventario, tallas y medidas de impresión deben confirmarse con GENHORA antes de vender o producir.
- El diseño vive en la pestaña actual. Cerrar o recargar la página lo elimina; el navegador muestra una advertencia cuando hay capas, pero no hay guardado persistente.
- WhatsApp recibe el mensaje preparado. El PNG se descarga o comparte mediante la función del dispositivo y no se adjunta automáticamente al enlace de WhatsApp.
- No se verificó el envío real en WhatsApp, la impresión física ni la experiencia en Safari y dispositivos físicos. Para revisar manualmente: abrir la URL local, diseñar ambas caras, descargar ambos PNG y probar “Compartir imagen” en un teléfono compatible.

## Revisión local

La vista de producción está disponible en `http://127.0.0.1:3007/personaliza` mientras el servidor siga encendido. Para iniciarla de nuevo:

```bash
npm run build
npm run start -- --port 3007
```

En otra terminal, repetir la auditoría:

```bash
STUDIO_URL=http://127.0.0.1:3007 node scripts/audit-studio.mjs
```

No se hizo push ni despliegue.
