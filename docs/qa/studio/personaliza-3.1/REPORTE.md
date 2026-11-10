# GENHORA · Personaliza 3.1

Refinamiento incremental sobre Personaliza 3.0. Las capturas que el brief anunciaba no estaban adjuntas a esta entrega; se usaron las capturas locales de 3.0 como referencia. Sin push ni despliegue.

## Cambios

- Se suavizó la silueta del torso y los brazos, se hizo menos simétrica la caída y se añadieron pliegues pequeños en los codos.
- Se ajustaron los contornos frontal y posterior de la capucha, su unión con los hombros y la costura posterior. El bolsillo tiene menos contraste y costuras parciales para integrarse mejor con la tela. El acanalado de puños y cintura usa menos líneas.
- **Vista previa** ahora es un estado distinto: se ocultan el panel de edición y la cotización; solo quedan el producto, los controles frente/espalda y **Volver a editar**. La edición y sus datos se conservan al regresar.
- Las áreas imprimibles y coordenadas relativas de 3.0 permanecen iguales: la corrección de contorno no necesitó migración. Canvas y exportación comparten el mismo dibujo.

## Comparación y capturas

| Vista | 3.0 antes | 3.1 después |
| --- | --- | --- |
| Frente marfil | [PNG](../personaliza-3/after/sudadera-frente-1440.png) | [PNG](after/sudadera-frente-1440.png) |
| Espalda marfil | [PNG](../personaliza-3/after/sudadera-espalda-1440.png) | [PNG](after/sudadera-espalda-1440.png) |
| Página móvil | [PNG](../personaliza-3/after/sudadera-mobile-page.png) | [PNG](after/sudadera-mobile-page.png) |
| Vista previa escritorio | — | [Frente](after/sudadera-preview-desktop.png) · [Espalda](after/sudadera-preview-espalda-desktop.png) |

Las capturas adicionales incluyen [negro](after/sudadera-negro.png), [HEX](after/sudadera-hex.png) y playera/tote en ambas caras a 390 y 1440 px.

## Pruebas

- Suite Playwright: **9/9 bloques aprobados**, [resultados JSON](tests.json). Comprende sudadera frente/espalda, negro, cinco colores incluido HEX, texto y PNG, carga de fuentes, edición/vista previa, exportación PNG de ambas caras, comparación de píxeles entre Canvas limpio y PNG, historial, imágenes, cotización, arrastre táctil, playera y tote.
- Responsive sin desbordamiento a 375, 390, 768 y 1440 px; auditoría automática de accesibilidad sin infracciones en 390 y 1440 px.
- Sin errores de consola, hidratación ni recursos 404 durante la suite. `npm run typecheck`, `npm run lint` y `npm run build` terminaron sin errores.

## Límites

El mockup continúa siendo una ilustración editorial, no una fotografía ni una representación física exacta de una prenda fabricada. La validación táctil se hizo con Chrome emulado, no con Safari en un teléfono real. WhatsApp se validó como enlace y mensaje, sin enviar una cotización real.
