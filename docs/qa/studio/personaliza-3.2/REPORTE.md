# GENHORA · Personaliza 3.2

Se realizaron solo los dos ajustes solicitados. Las capturas anunciadas en el brief no venían adjuntas; se comparó con las capturas locales de 3.1. No se hizo push ni despliegue.

## Capucha frontal

El borde inferior de la capucha ahora se curva y se une al cuello sin puntas que bajen al pecho. La abertura interior es redondeada; las costuras laterales siguen esa curva y los cordones nacen junto al cuello. Se conservaron mangas, torso, puños, cintura, bolsillo, color, sombras y coordenadas de personalización. La vista posterior no se modificó.

| Referencia 3.1 | Resultado 3.2 |
| --- | --- |
| [Frente anterior](../personaliza-3.1/after/sudadera-frente-1440.png) | [Frente corregido](after/sudadera-frente-1440.png) |
| [Espalda anterior](../personaliza-3.1/after/sudadera-espalda-1440.png) | [Espalda sin cambios](after/sudadera-espalda-1440.png) |

También se guardaron [negro](after/sudadera-negro.png), [HEX personalizado](after/sudadera-hex.png), [página móvil](after/sudadera-mobile-page.png) y [vista previa de escritorio](after/sudadera-preview-desktop.png).

## Presentación de colores

La etiqueta principal muestra **Marfil**, **Negro** y los demás nombres comerciales sin código. Un tono manual muestra **Color personalizado** junto a su muestra visual. El HEX sigue editable dentro de la paleta avanzada y se conserva en el estado, Canvas, PNG y mensaje comercial.

## Verificación

- [Suite Playwright](tests.json): 9/9 bloques aprobados, incluyendo etiquetas Marfil/Negro/personalizado, recoloración clara y oscura, texto e imagen en ambas caras, exportación, cotización, playera y tote, y pantalla móvil de 390 px.
- El PNG de ambas caras se comparó con la vista limpia; el área imprimible y la posición de las capas no cambiaron.
- TypeScript, ESLint, Prettier y build de producción terminaron sin errores. No se observaron errores de consola, hidratación ni recursos 404 en la suite.

La prenda sigue siendo una ilustración editorial; el resultado físico y Safari en un teléfono real no se verificaron.
