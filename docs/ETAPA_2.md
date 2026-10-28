# Reservado para la etapa 2

No se ha implementado anticipadamente ninguno de los siguientes sistemas:

- Personalizador 2D: editor real, atributos, tipografías, capas, texto, imágenes, logotipos, límites de impresión, preview y exportación. Elegir Konva u otra tecnología al definir el alcance.
- Subida de archivos de clientes, validación, almacenamiento y tratamiento de archivos.
- Backend de cotizaciones, persistencia de solicitudes, seguimiento y confirmaciones.
- Precios y variantes reales: materiales, tallas, colores, cantidades mínimas, disponibilidad y tiempos validados por GENHORA.
- Fotografías individuales de productos y muestras reales con sus permisos.
- Autenticación, roles y panel administrativo.
- Carrito transaccional, checkout y procesamiento de pagos. Su inclusión futura requiere una decisión comercial; el flujo inicial sigue siendo catálogo → selección → cotización por WhatsApp.

## Pendientes comerciales para habilitar el contacto

Número real de WhatsApp; información institucional; redes sociales autorizadas; avisos legales reales; dominio definitivo cuando se solicite publicación. No se generaron sustitutos ficticios.

## Puntos de extensión existentes

`Product` mantiene `category` y `lines` separados; `fromPrice` admite null; `currency` es MXN. `image.src` permite sustituir cada concepto por foto real. El catálogo y las fichas utilizan el mismo origen de datos. `siteConfig` centraliza contacto y mensajes. Las rutas de contacto reciben `producto` y `tipo` sin crear pedidos. El área Personaliza describe el proceso futuro con contenido estático, sin controles falsos.
