import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';

const baseURL = process.env.COMMERCE_URL ?? 'http://127.0.0.1:3014';
const output = 'docs/qa/commerce-4';
await mkdir(`${output}/after`, { recursive: true });
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
const context = await browser.newContext({
  baseURL,
  reducedMotion: 'reduce',
  acceptDownloads: true,
  viewport: { width: 1440, height: 1000 },
});
await context.addInitScript(() => {
  window.__commerceEvents = [];
  window.addEventListener('genhora:commerce', (e) => window.__commerceEvents.push(e.detail));
  window.__layoutShift = 0;
  if (PerformanceObserver.supportedEntryTypes.includes('layout-shift'))
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        if (!entry.hadRecentInput) window.__layoutShift += entry.value;
    }).observe({ type: 'layout-shift', buffered: true });
});
const results = [],
  problems = [],
  measurements = [];
context.on('page', (page) => {
  page.on('pageerror', (error) => problems.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(message.text());
  });
  page.on('response', (response) => {
    if (response.status() >= 400) problems.push(`${response.status()}: ${response.url()}`);
  });
});
async function test(name, fn) {
  const page = await context.newPage();
  try {
    await fn(page);
    results.push({ name, status: 'APROBADO' });
  } catch (error) {
    results.push({ name, status: 'FALLÓ', reason: error.stack ?? String(error) });
  } finally {
    await page.close({ runBeforeUnload: false });
  }
}
async function go(page, path) {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
}
async function capture(page, name) {
  const broken = await page.evaluate(async () => {
    const images = [...document.images];
    for (const image of images) image.loading = 'eager';
    await document.fonts.ready;
    await Promise.allSettled(images.map((image) => image.decode()));
    return images.filter((image) => !image.naturalWidth).map((image) => image.currentSrc);
  });
  assert.deepEqual(broken, []);
  await page.screenshot({ path: `${output}/after/${name}.png`, fullPage: true });
}
async function logo(page) {
  return Buffer.from(
    await page.evaluate(() => {
      const c = document.createElement('canvas');
      c.width = 800;
      c.height = 800;
      const x = c.getContext('2d');
      x.fillStyle = '#ADC8B3';
      x.fillRect(150, 200, 500, 400);
      return c.toDataURL().split(',')[1];
    }),
    'base64',
  );
}
async function download(page, side) {
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: `Descargar mi diseño · ${side}` }).click();
  const file = await pending;
  const path = `${output}/b2c-${side}.png`;
  await file.saveAs(path);
  const bytes = await readFile(path);
  assert.equal(bytes.readUInt32BE(16), 1600);
  assert.equal(bytes.readUInt32BE(20), 1600);
}

await test('B2C Inicio → Sudadera → Diseño de dos caras → Cotización', async (page) => {
  await go(page, '/');
  await page.getByRole('link', { name: 'Personalizar ahora', exact: true }).first().waitFor();
  assert.equal(await page.getByText(/Próximamente: tu estudio/).count(), 0);
  const card = page
    .locator('.product-card')
    .filter({ has: page.getByRole('heading', { name: 'Sudaderas', exact: true }) });
  await card.getByRole('link', { name: 'Personalizar ahora' }).click();
  await page.waitForURL('**/personaliza?producto=sudadera');
  assert.equal(
    await page.getByRole('button', { name: 'Sudadera personalizada' }).getAttribute('aria-pressed'),
    'true',
  );
  await page.getByRole('button', { name: 'Negro', exact: true }).first().click();
  await page
    .getByLabel('Subir PNG, JPG o WebP')
    .setInputFiles({ name: 'logo-prueba.png', mimeType: 'image/png', buffer: await logo(page) });
  await page.getByRole('button', { name: 'logo-prueba.png', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Espalda', exact: true }).click();
  await page.getByRole('button', { name: '+ Agregar texto' }).click();
  await page.getByRole('textbox', { name: 'Texto', exact: true }).fill('Equipo & café');
  await page.getByRole('button', { name: 'Frente', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'logo-prueba.png', exact: true }).count(), 1);
  await page.getByRole('button', { name: 'Cotizar mi diseño' }).click();
  await page.getByRole('spinbutton', { name: 'Cantidad de piezas' }).fill('2');
  await page.getByRole('combobox', { name: 'Talla de referencia' }).selectOption('G');
  await page
    .getByRole('textbox', { name: 'Observaciones (opcional)' })
    .fill('Diseño de prueba, no enviar');
  const section = page.locator('#studio-quote');
  await section.getByRole('heading', { name: 'Tu creación GENHORA' }).waitFor();
  const href = await section
    .getByRole('link', { name: /Cotizar por WhatsApp/ })
    .getAttribute('href');
  const message = new URL(href).searchParams.get('text');
  for (const content of [
    'Sudadera personalizada',
    'Negro',
    'Cantidad: 2',
    'Talla: G',
    'frente:',
    'espalda:',
    'Equipo & café',
    'Diseño de prueba',
  ])
    assert.ok(message.includes(content), content);
  await download(page, 'frente');
  await download(page, 'espalda');
  await page.getByRole('button', { name: 'Ver sin guías' }).click();
  assert.equal(await page.getByRole('button', { name: '+ Agregar texto' }).count(), 0);
  await page.getByRole('button', { name: 'Espalda', exact: true }).click();
  await page.screenshot({ path: `${output}/after/personaliza-preview-1440.png`, fullPage: true });
  await page.getByRole('button', { name: 'Cotizar mi diseño' }).click();
  assert.equal(await page.getByRole('button', { name: 'Equipo & café', exact: true }).count(), 1);
  const signals = await page.evaluate(() => window.__commerceEvents);
  assert.ok(signals.some((e) => e.event === 'upload_design'));
  assert.ok(signals.some((e) => e.event === 'download_preview'));
  assert.ok(!JSON.stringify(signals).includes('Equipo & café'));
  assert.ok(!JSON.stringify(signals).includes('logo-prueba'));
  await page.screenshot({ path: `${output}/after/b2c-resumen.png`, fullPage: true });
});

await test('Editor contextual: tres productos, URL inválida y repetida', async (page) => {
  for (const [value, name] of [
    ['playera', 'Playera personalizada'],
    ['sudadera', 'Sudadera personalizada'],
    ['tote', 'Tote bag personalizada'],
    ['invalido', 'Playera personalizada'],
    ['sudadera&producto=tote', 'Playera personalizada'],
  ]) {
    await go(page, `/personaliza?producto=${value}`);
    assert.equal(await page.getByRole('button', { name }).getAttribute('aria-pressed'), 'true');
  }
  await go(page, '/productos');
  assert.equal(await page.locator('.product-card a[href*="/personaliza?"]').count(), 3);
  assert.equal(
    await page
      .locator('.product-card')
      .getByRole('link', { name: 'Cotizar personalización' })
      .count(),
    7,
  );
  await page
    .getByRole('navigation', { name: 'Tipo de producto' })
    .getByRole('link', { name: 'Ropa y tote bags' })
    .click();
  assert.equal(await page.locator('.product-card').count(), 3);
});

await test('B2B Inicio → Kit Creativo → 40 unidades → Resumen y WhatsApp', async (page) => {
  await go(page, '/');
  await page.getByRole('link', { name: 'Kits y regalos con tu marca' }).click();
  await page.getByRole('button', { name: 'Cotizar este kit: Kit Creativo' }).click();
  await page.getByLabel('Cantidad aproximada', { exact: true }).fill('40');
  await page.getByLabel('Empresa (opcional)', { exact: true }).fill('Empresa de prueba');
  await page.getByLabel('Nombre de contacto (opcional)', { exact: true }).fill('Contacto QA');
  await page.getByLabel('Fecha requerida (opcional)', { exact: true }).fill('2027-03-15');
  await page.getByLabel('Ciudad de entrega (opcional)', { exact: true }).fill('Ciudad de México');
  await page
    .getByLabel('Tu marca y comentarios (opcional)', { exact: true })
    .fill('Verde y marfil, sin envío real');
  await page.getByRole('button', { name: 'Revisar mi solicitud' }).click();
  const summary = await page.getByLabel('Resumen de tu solicitud').inputValue();
  for (const text of [
    'Kit Creativo',
    'Playeras',
    'Termos',
    'Libretas',
    '40',
    'Empresa de prueba',
    '2027-03-15',
    'Ciudad de México',
  ])
    assert.ok(summary.includes(text), text);
  const href = await page
    .getByRole('link', { name: 'Preparar cotización por WhatsApp' })
    .getAttribute('href');
  assert.equal(new URL(href).searchParams.get('text'), summary);
  assert.ok(href.startsWith('https://wa.me/525655745468?'));
  assert.ok(!summary.includes('solicitud enviada'));
  await capture(page, 'b2b-resumen');
  const events = await page.evaluate(() => window.__commerceEvents);
  assert.ok(!JSON.stringify(events).includes('Empresa de prueba'));
  assert.ok(events.some((event) => event.event === 'start_business_quote'));
  // A custom welcome kit can use the requested notebook, tumbler and tote.
  await page.getByLabel('Playeras', { exact: true }).uncheck();
  await page.getByLabel('Tote bags', { exact: true }).check();
  await page.getByRole('button', { name: 'Revisar mi solicitud' }).click();
  assert.match(
    await page.getByLabel('Resumen de tu solicitud').inputValue(),
    /Productos:.*Termos.*Libretas.*Tote bags/,
  );
  // Native validation prevents zero units; empty product selection has a visible error.
  await page.getByLabel('Cantidad aproximada', { exact: true }).fill('0');
  await page.getByRole('button', { name: 'Revisar mi solicitud' }).click();
  assert.equal(
    await page
      .getByLabel('Cantidad aproximada', { exact: true })
      .evaluate((input) => input.validity.valid),
    false,
  );
  await page.getByLabel('Cantidad aproximada', { exact: true }).fill('40');
  for (const name of ['Termos', 'Libretas', 'Tote bags'])
    await page.getByLabel(name, { exact: true }).uncheck();
  await page.getByRole('button', { name: 'Revisar mi solicitud' }).click();
  await page
    .getByRole('alert')
    .getByText(/Selecciona al menos/)
    .waitFor();
});

await test('Responsive, accesibilidad, navegación y capturas de páginas', async (page) => {
  for (const width of [375, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    for (const [id, path] of [
      ['inicio', '/'],
      ['productos', '/productos'],
      ['personaliza', '/personaliza?producto=sudadera'],
      ['empresas', '/empresas-y-eventos'],
      ['contacto', '/contacto'],
      ['nosotros', '/nosotros'],
    ]) {
      await go(page, path);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
        `${id} ${width}`,
      );
      assert.equal(await page.locator('h1').count(), 1, `${id} h1`);
      if ([390, 1440].includes(width)) {
        await capture(page, `${id}-${width}`);
        const axe = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();
        assert.deepEqual(
          axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
          [],
          `${id} ${width}`,
        );
      }
      if (width === 1440) {
        measurements.push(
          await page.evaluate(() => {
            const n = performance.getEntriesByType('navigation')[0];
            return {
              path: location.pathname,
              domContentLoadedMs: Math.round(n.domContentLoadedEventEnd),
              loadMs: Math.round(n.loadEventEnd),
              layoutShift: Number(window.__layoutShift.toFixed(4)),
              transferredBytes: performance
                .getEntriesByType('resource')
                .reduce((total, r) => total + r.transferSize, 0),
            };
          }),
        );
      }
    }
  }
  await page.setViewportSize({ width: 390, height: 900 });
  await go(page, '/');
  await page.getByRole('button', { name: 'Abrir menú' }).click();
  await page.keyboard.press('Escape');
  assert.equal(
    await page.getByRole('button', { name: 'Abrir menú' }).getAttribute('aria-expanded'),
    'false',
  );
  await page.getByRole('link', { name: 'Personalizar ↗', exact: true }).focus();
  assert.equal(
    await page
      .getByRole('link', { name: 'Personalizar ↗', exact: true })
      .evaluate((el) => el === document.activeElement),
    true,
  );
});

await test('SEO, imágenes y canal de contacto', async (page) => {
  for (const path of [
    '/',
    '/productos',
    '/productos/sudaderas',
    '/personaliza',
    '/empresas-y-eventos',
    '/contacto',
    '/nosotros',
    '/privacidad',
  ]) {
    await go(page, path);
    const canonical = new URL(await page.locator('link[rel="canonical"]').getAttribute('href'));
    assert.equal(canonical.origin, 'https://genhora-web.vercel.app');
    assert.equal(canonical.pathname, path);
    assert.ok(await page.locator('meta[name="description"]').getAttribute('content'));
    assert.equal(
      await page.locator('meta[property="og:image"]').getAttribute('content'),
      'https://genhora-web.vercel.app/og-image.png',
    );
    assert.equal(
      await page.locator('meta[name="twitter:card"]').getAttribute('content'),
      'summary_large_image',
    );
    assert.equal(await page.locator('meta[property="og:title"]').count(), 1);
  }
  const sitemap = await page.request.get('/sitemap.xml');
  assert.equal(sitemap.status(), 200);
  assert.ok((await sitemap.text()).includes('/empresas-y-eventos'));
  const robots = await page.request.get('/robots.txt');
  assert.equal(robots.status(), 200);
  assert.ok((await robots.text()).includes('Sitemap: https://genhora-web.vercel.app/sitemap.xml'));
  assert.equal((await page.request.get('/og-image.png')).status(), 200);
  await go(page, '/contacto?producto=tazas');
  assert.equal(await page.getByLabel('¿Con qué te gustaría crear?').inputValue(), 'tazas');
  await page.getByRole('button', { name: 'Preparar mi idea' }).click();
  const href = await page.getByRole('link', { name: 'Continuar en WhatsApp' }).getAttribute('href');
  assert.match(new URL(href).searchParams.get('text'), /Producto: Tazas/);
});
await browser.close();
const report = { baseURL, results, problems, measurements };
await writeFile(`${output}/tests.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (results.some((r) => r.status !== 'APROBADO') || problems.length) process.exitCode = 1;
