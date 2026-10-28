# GENHORA

Etapa 1: identidad visual y frontend editorial de un estudio creativo mexicano de personalización. Implementación local con Next.js App Router, React, TypeScript, Tailwind CSS 4 y fuentes alojadas localmente.

## Ejecutar localmente

Requisito: Node.js 22 o superior. Se verificó con Node 24.14.0 y npm 11.9.0.

```sh
cd "/Users/macbookpro/Documents/ChatGPT/GENHORA"
npm ci
npm run dev
```

Abrir **http://127.0.0.1:3000**. Si Next selecciona otro puerto por estar ocupado, utilizar el que indique la terminal. Para detenerlo, `Ctrl+C`.

Para comprobar y ejecutar la versión de producción local:

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

Detener el servidor de desarrollo antes de `npm start` para liberar el puerto. Ninguno de estos comandos publica el proyecto. Las fuentes e imágenes se sirven desde el propio proyecto; no necesita `.env`, cuenta, API key o base de datos. La primera instalación de dependencias requiere internet.

## Qué incluye

- Firma original en SVG, variantes, isotipo y favicon.
- Portada con nueve bloques editoriales, cinco líneas comerciales y diez tipos de producto.
- Catálogo con filtros combinables por tipo y línea, fichas individuales y página 404.
- Personaliza, Empresas y eventos, Nosotros y Contacto.
- Preparación local del resumen de una idea y copia al portapapeles. Envío por WhatsApp disponible solo tras configurar un número válido.
- Tokens, fuentes locales, imágenes ilustrativas originales y comportamiento responsive.
- Metadatos iniciales, página no indexable mientras sigue en etapa local y dominio local explícito.

## Configuración comercial

Editar `src/lib/config.ts`:

- `whatsappNumber`: vacío inicialmente; formato internacional de 8–15 dígitos sin `+`, espacios ni signos. Confirmar que pertenece al negocio antes de usarlo.
- `defaultMessage` y `cta`: mensajes editables.
- `email`, `address`, `socialLinks`, `legalLinks`: vacíos y ocultos hasta disponer de información real.
- `url`: origen local. Sustituir por el dominio real solamente cuando se autorice publicar; después revisar `robots` en `src/app/layout.tsx`.

No hay precios ficticios. `fromPrice: null` representa un precio no definido. El modelo contempla valores futuros en MXN. La ficha conserva el producto al pasar a contacto. El botón «Preparar mi idea» no envía, almacena ni simula una cotización; crea un texto únicamente en memoria del navegador. Cambiar los campos invalida el resumen anterior. Recargar borra el borrador.

## Estructura y archivos creados

```text
src/app/                    Rutas, layout, SEO, favicon y tokens/estilos
src/app/productos/[slug]/    Diez fichas prerenderizadas desde el catálogo
src/components/             Header, footer, UI, secciones, revelado y resumen
src/lib/catalog.ts          Productos, categorías y líneas comerciales
src/lib/config.ts           Contacto, mensajes y construcción segura de WhatsApp
public/brand/               Identidad SVG y lámina HTML
public/fonts/               Tres WOFF2 latinos con español
public/images/              Cuatro recursos WebP optimizados
assets/source/              Originales PNG y fuentes completas de referencia
docs/GENHORA_BRAND.md        Manual de identidad y licencias
docs/ASSETS.md               Procedencia y prompts de imágenes
docs/QA.md                   Resultados, evidencia y limitaciones
docs/ETAPA_2.md              Alcance reservado
scripts/brand.mjs            Fuente editable del lettering SVG
scripts/verify-browser.mjs   Verificación reproducible con Playwright y axe
tests/catalog.test.ts       Invariantes de catálogo y contacto
```

El repositorio estaba vacío; todos estos archivos son nuevos. Configuración adicional: `package.json`, lockfile, TypeScript, ESLint, PostCSS, Next.js, Prettier y `.gitignore`.

## Identidad y pruebas

Lámina visual: **http://127.0.0.1:3000/brand/brand-board.html**.

```sh
npm run test:browser
npm run format:check
npm run brand:generate
```

La prueba de navegador requiere el servidor en `127.0.0.1:3000`. En macOS utiliza Chrome instalado. En otros equipos puede indicarse `CHROME_EXECUTABLE` o instalar el navegador de Playwright con `npx playwright install chromium`. Guarda capturas e informe en `docs/qa/`. Esta prueba reemplaza únicamente esos artefactos de QA.

Consultar `docs/QA.md` para resultados y pendientes, y `docs/ETAPA_2.md` para funcionalidades excluidas. No se hicieron push, deploy, commits ni cambios remotos.
