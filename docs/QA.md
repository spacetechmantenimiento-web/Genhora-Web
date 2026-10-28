# Verificación — GENHORA etapa 1

Fecha: 22 de octubre de 2026. Entorno local: macOS, Node 24.14.0, npm 11.9.0, Next.js 16.4.2, React 19.3.1. Pruebas automatizadas con Chrome, Playwright y axe; revisión visual adicional en el navegador integrado de Codex.

## Resultado

| Comprobación                       | Resultado                                                             |
| ---------------------------------- | --------------------------------------------------------------------- |
| ESLint                             | Sin errores ni advertencias                                           |
| TypeScript                         | Correcto, modo estricto                                               |
| Pruebas de datos y contacto        | 4 de 4 aprobadas                                                      |
| Compilación de producción          | Correcta; 19 páginas estáticas generadas, catálogo/contacto dinámicos |
| Arranque de producción             | `npm start -- --port 3001`: listo; Inicio, ficha y Contacto HTTP 200  |
| Responsive                         | 35 combinaciones de ruta/ancho sin overflow horizontal                |
| Anchos                             | 360, 390, 768, 1024 y 1440 px                                         |
| Accesibilidad automática           | 7 páginas, sin incidencias en reglas axe WCAG 2 A/AA y 2.1 AA         |
| Enlaces internos encontrados       | 27 destinos, todos HTTP 200                                           |
| Producto inexistente               | HTTP 404 y página propia                                              |
| Errores de ejecución del navegador | Ninguno registrado                                                    |
| Dependencias de producción         | `npm audit --omit=dev`: 0 vulnerabilidades                            |

Rutas de la matriz: Inicio, Productos, Personaliza, Empresas y eventos, Nosotros, Contacto y ficha Tote bags. Las diez fichas también se incluyen en el recorrido de enlaces. Evidencia reproducible: `docs/qa/browser-report.json`.

## Recorrido probado

1. Abrir la ficha de tote bags y seleccionar «Cotiza este producto».
2. Comprobar que contacto conserva el producto.
3. Añadir cantidad 25 y una descripción de prueba.
4. Preparar el resumen; comprobar los valores y mover el foco al resultado.
5. Copiar el resumen; verificar confirmación de copia en el navegador.
6. Comprobar que no existe enlace `wa.me` mientras no hay número configurado.
7. Combinar filtros por categoría y línea; verificar resultado y estado vacío.
8. Abrir menú móvil, navegar, cerrar con Escape y devolver el foco al botón.
9. Confirmar que el primer destino de teclado es «Saltar al contenido».

Las pruebas unitarias también comprueban números WhatsApp inválidos, codificación del mensaje, ausencia de precios inventados, identificadores únicos y coexistencia de categorías/líneas.

## Revisión visual

- Capturas completas de portada a los cinco anchos en `docs/qa/home-*.png`.
- Vista del resumen de contacto en `docs/qa/contact-1440.png`.
- Firma principal, compacta, monocolor, invertida, eslogan, isotipo y favicon revisados en `/brand/brand-board.html`.
- Firma a 240, 170 y 120 px; favicon a 32 y 16 px. Se recomienda la variante compacta a 120 px y el isotipo por debajo.
- Encabezado fijo, contraste sobre fotografías y jerarquía editorial revisados en navegador integrado.
- Aparición progresiva al desplazar comprobada con movimiento normal. La matriz automatizada se ejecuta con movimiento reducido, por lo que confirma contenido visible sin animación.
- Foco visible, hover de enlaces/productos y respuesta active implementados mediante estilos explícitos. No se usa el color como única señal de selección de filtros.

## Correcciones durante QA

- Separación de variables de fuentes y tokens Tailwind para evitar referencias circulares.
- Superficie de contraste sobre la fotografía de textiles.
- Metadatos con origen local explícito para no inventar un dominio ni generar advertencias al compilar.
- Fuentes WOFF2 locales: 101,656 bytes en total, frente a los archivos TTF completos de referencia.
- Carga eager y prioridad de red alta para las imágenes principales, según la API actual de Next Image; imágenes secundarias diferidas.
- Limpieza del aviso de ESLint y formato consistente con Prettier.
- La compilación inicial restringida no pudo crear el proceso/puerto interno de Turbopack. Se repitió con permiso de ejecución local ampliado y terminó correctamente. No fue un error del código.

## Limitaciones pendientes

- El análisis automático no sustituye una auditoría completa de accesibilidad con lectores de pantalla. No se probaron Safari/Firefox ni dispositivos físicos.
- No se midió una garantía de 60 FPS ni se realizó una auditoría Lighthouse con red móvil real. Se utilizan transform/opacity, imágenes WebP, carga de fuentes local y carga diferida de fotografías secundarias.
- Imágenes conceptuales generadas, sin trabajos reales o especificaciones de producto confirmadas. El atlas tiene unos 396 px por producto; requiere fotos individuales antes de ampliar detalle o zoom.
- WhatsApp está sin configurar. No se realizó envío real; no existe backend ni persistencia.
- Sin precios, teléfonos, redes, políticas, domicilio o correo ficticios. Los espacios institucionales se habilitan desde configuración cuando se proporcionen datos válidos.
- Metadatos locales con `noindex`; dominio real, indexación y políticas quedan para una publicación autorizada.
- `npm audit` completo informa 5 advertencias altas derivadas de una misma cadena de desarrollo: `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`. El aviso es [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm); `braces` 3.0.3 era la última versión disponible al verificar. La corrección automática propuesta degrada la configuración de Next a 14.2.35, incompatible con la línea elegida, por lo que no se aplicó. La cadena no se incluye en las dependencias de producción. Revisar actualizaciones compatibles de herramientas antes de integrar CI pública.

## Repetir las pruebas

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run format:check
```

Con `npm run dev` en otra terminal:

```sh
npm run test:browser
```

La prueba de navegador utiliza Chrome de macOS si existe; alternativamente `CHROME_EXECUTABLE` o Chromium de Playwright. No se hicieron push, deploy ni modificaciones remotas. La etapa 2 está separada en `docs/ETAPA_2.md`.
