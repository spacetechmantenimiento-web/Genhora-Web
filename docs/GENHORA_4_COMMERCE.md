# GENHORA 4.0 · Experiencia comercial

## Auditoría antes de editar

Se revisó el commit `f07883c`: seis páginas principales, diez fichas de catálogo, editor Canvas para tres productos, formulario general y enlace comercial a WhatsApp. Se abrió el build original a 390 y 1440 px y se guardaron [las capturas y observaciones](qa/commerce-4/before/). El Inicio público respondió HTTP 200 y su HTML coincidió con los dos hallazgos de Inicio indicados abajo. El build 4.0 se probó localmente; no se publicó.

| Área                 | Evidencia inicial                                                                                                                                                               | Efecto comercial                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Inicio               | El hero decía «Tu idea, nuestro próximo gran diseño» y ambos CTA llevaban a Productos. Más abajo el estudio activo se anunciaba como «Próximamente».                            | Hacía falta inferir qué se vendía y cómo empezar a diseñar.                                  |
| Catálogo             | Diez fichas con filtros, imágenes conceptuales, datos de precio nulos y enlaces de detalle; **0** accesos contextuales al editor desde las tarjetas.                            | El recorrido B2C se interrumpía al buscar cómo diseñar una sudadera.                         |
| Personaliza          | La URL `?producto=sudadera` dejó la sudadera sin seleccionar. El editor ofrecía selección manual, color, carga de imagen, texto, ambas caras, exportación y enlace de WhatsApp. | El cliente tenía que repetir la selección y buscar el bloque de cotización al final.         |
| Empresas             | **0** formularios y **0** botones de kit. El CTA llevaba al formulario general, de un solo producto y sin campo de ciudad o datos de empresa.                                   | No se podía configurar ni resumir una propuesta de 40 kits de libreta, termo y tote.         |
| Contacto y confianza | El contacto preparaba un resumen local; faltaban preguntas frecuentes y una explicación vinculada sobre el uso de los datos.                                                    | No quedaba clara la diferencia entre preparar una solicitud y enviarla.                      |
| SEO y recursos       | Existían OG, Twitter, metadatos y recursos WebP locales; no había sitemap ni robots propios. Algunas rutas heredaban el OG de Inicio.                                           | Faltaba distinguir las páginas principales y ofrecer a buscadores un mapa de URLs canónicas. |

## Estrategia implementada

- **Inicio:** «Personalizar ahora» abre el estudio y «Explorar productos» abre el catálogo. La franja explica las tres acciones y el acceso empresarial se distingue en el hero. Seis tarjetas destacan ropa, tote, tazas y termos, papelería y detalles para eventos. «Ideas que inspiran» conserva las composiciones editoriales, identificadas como conceptos.
- **Productos y fichas:** los filtros de categoría y línea siguen disponibles. El CTA abre el editor cuando existe, y los demás artículos abren un resumen de cotización con el producto elegido. Se conservan diez productos y el campo de precio aprobado, vacío en todo el catálogo. Modelos, materiales y cantidades se acuerdan al cotizar.
- **Personaliza:** la URL admite `playera`, `sudadera` y `tote`; una selección inválida o repetida vuelve a playera. «Cotizar mi diseño» se mantiene visible bajo el encabezado. El resumen presenta producto, color, talla, cantidad, caras y observaciones; exporta PNG de ambas caras y prepara el mensaje sin borrar el diseño ni subir archivos. El editor y su dibujo Canvas se conservaron.
- **Empresas:** una landing separa kits, regalos, eventos y merchandising. Esencial, Creativo y Premium son propuestas configurables con composiciones hechas con el atlas conceptual existente. El formulario admite varios artículos, cantidad, empresa/contacto, fecha, ciudad, presupuesto y comentarios; valida artículos y cantidad y permite elegir un logotipo local como referencia. WhatsApp recibe solo el resumen que el usuario decide compartir; el archivo se adjunta manualmente.
- **Confianza:** preguntas frecuentes, pasos de cotización, contenido comercial en Nosotros y página «Privacidad y datos» enlazada desde formularios y footer. Describe el comportamiento actual; queda pendiente un aviso formal aprobado con los datos del responsable y sus condiciones.
- **SEO:** títulos, descripciones, canonical y OG/Twitter específicos por ruta, sitemap generado a partir del catálogo y `robots.txt`. El esquema `Organization` usa datos públicos de GENHORA. No contiene ofertas, reseñas, inventario ni precios inventados.

## Medición preparada

Los eventos `genhora:commerce` se emiten en el navegador. No se instalan cookies de seguimiento, proveedor externo ni persistencia. La carga útil tiene únicamente evento, identificador de producto y origen de interfaz cuando corresponde. No incluye archivos, nombres, teléfonos, presupuestos, texto de diseño, comentarios ni URL del mensaje.

| Indicador                | Señales                                                                       |
| ------------------------ | ----------------------------------------------------------------------------- |
| Interés en productos     | `view_product`, `select_product`                                              |
| Inicio y uso del estudio | `start_personalization`, `add_custom_text`, `upload_design`, `preview_design` |
| Intención de cotizar     | `download_preview`, `click_quote`, `open_whatsapp_quote`                      |
| Embudo empresarial       | `view_business_kits`, `start_business_quote`, `open_business_whatsapp`        |

Si se aprueba una herramienta, medir la proporción de inicios con interacción, clics de cotización por inicio y solicitudes B2B preparadas frente a iniciadas. Para estimar abandono, acordar una ventana de sesión y distinguir cambio de pestaña de cierre; no inferir una compra ni un envío a partir de abrir WhatsApp. La instrumentación local no genera un tablero ni métricas históricas.

## Páginas y componentes

| Superficie                     | Archivos principales                                                                                                                                                                                                                                 |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inicio y navegación            | `src/app/page.tsx`, `src/components/hero.tsx`, `hero.module.css`, `sections.tsx`, `header.tsx`, `header.module.css`                                                                                                                                  |
| Catálogo y fichas              | `src/app/productos/page.tsx`, `src/app/productos/[slug]/page.tsx`, `src/components/ui.tsx`, `src/lib/catalog.ts`                                                                                                                                     |
| Editor y cotización individual | `src/app/personaliza/page.tsx`, `src/components/studio/studio.tsx`, `studio.module.css`                                                                                                                                                              |
| Empresas y cotizador           | `src/app/empresas-y-eventos/page.tsx`, `src/components/business-experience.tsx`, `src/lib/commerce.ts`, `src/app/commerce.css`                                                                                                                       |
| Confianza, SEO y señales       | `src/app/contacto/page.tsx`, `src/app/nosotros/page.tsx`, `src/app/privacidad/page.tsx`, `src/components/contact-brief.tsx`, `faq.tsx`, `commerce-signals.tsx`, `src/app/layout.tsx`, `robots.ts`, `sitemap.ts`, `src/lib/analytics.ts`, `config.ts` |

## Evidencia visual y pruebas

Resultado final: **5/5 bloques de comercio, 9/9 de regresión del editor y 4/4 pruebas unitarias aprobados.** TypeScript, ESLint, Prettier y `git diff --check` sin errores. `npm run build` compiló correctamente con Next.js 16.4.2 y generó 22 páginas estáticas en el paso de prerenderizado. [Regresión del editor](qa/commerce-4/studio-regression.json).

| Página      | Escritorio 1440 px                                  | Móvil 390 px                                       |
| ----------- | --------------------------------------------------- | -------------------------------------------------- |
| Inicio      | [Captura](qa/commerce-4/after/inicio-1440.png)      | [Captura](qa/commerce-4/after/inicio-390.png)      |
| Productos   | [Captura](qa/commerce-4/after/productos-1440.png)   | [Captura](qa/commerce-4/after/productos-390.png)   |
| Personaliza | [Captura](qa/commerce-4/after/personaliza-1440.png) | [Captura](qa/commerce-4/after/personaliza-390.png) |
| Empresas    | [Captura](qa/commerce-4/after/empresas-1440.png)    | [Captura](qa/commerce-4/after/empresas-390.png)    |

- **B2C:** Inicio → tarjeta Sudaderas → editor con sudadera seleccionada → negro, PNG frontal y texto posterior → talla G, 2 piezas y nota → descarga de dos PNG de 1600 × 1600 → enlace de WhatsApp decodificado. El diseño sigue disponible al volver de la vista previa. [Resumen](qa/commerce-4/after/b2c-resumen.png) · [frente](qa/commerce-4/b2c-frente.png) · [espalda](qa/commerce-4/b2c-espalda.png).
- **B2B:** Inicio → Empresas → Kit Creativo → 40 unidades, empresa ficticia, fecha, ciudad y comentario → resumen → enlace de WhatsApp decodificado. Se comprobó la composición alternativa de libreta, termo y tote, y se rechazaron cantidad cero y lista vacía. [Resumen](qa/commerce-4/after/b2b-resumen.png).
- La suite verifica las seis páginas a 375, 390, 768 y 1440 px, menú móvil con Escape, acceso por teclado, imágenes y fuentes, una jerarquía de título principal por página, y auditoría automática WCAG A/AA en 390 y 1440. [Resultados reproducibles](qa/commerce-4/tests.json). `node scripts/audit-commerce-4.mjs` usa la compilación local en `3014`.
- **Rendimiento:** [mediciones locales](qa/commerce-4/tests.json) de carga, bytes transferidos y cambios de disposición en Chrome con caché reutilizada y movimiento reducido. Los WebP originales pesan 91–323 kB cada uno; las fotografías usan `next/image` y las miniaturas comparten un atlas. No son métricas de visitantes reales ni un informe Lighthouse.
- **No ejecutado:** Lighthouse no estaba instalado; no se hicieron pruebas en teléfonos físicos, Safari ni envío real de mensajes. Se verificó el destino y el contenido del enlace sin abrir WhatsApp durante las pruebas. La nueva versión no se desplegó, por lo que no se verificó indexación real de 4.0.

## Datos pendientes y próxima fase

Confirmar materiales y variantes, precios, cantidades mínimas, modelos e inventario, tiempos y cobertura de entrega, bolígrafo y empaque para kits, pasos de confirmación comercial y aviso formal de privacidad. La configuración documenta esas incógnitas sin publicar compromisos. Para sustituir los conceptos: fotografía individual, producto sobre modelo, detalle de textura, pieza personalizada, composición de regalo y kit empresarial. Publicar trabajos entregados solo con imágenes propias y autorización. Una vez aprobada la medición, conectar un solo proveedor y validar su consentimiento, eventos y embudo con tráfico real.
