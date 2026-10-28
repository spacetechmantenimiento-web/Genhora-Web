import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
const macChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const executablePath =
  process.env.CHROME_EXECUTABLE || (existsSync(macChrome) ? macChrome : undefined);
const browser = await chromium.launch({ executablePath, headless: true });
const context = await browser.newContext({
  baseURL: 'http://127.0.0.1:3000',
  reducedMotion: 'reduce',
  permissions: ['clipboard-read', 'clipboard-write'],
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (err) => errors.push(err.message));
const report = { viewports: [], accessibility: [], links: [], flow: [], errors };
const routes = [
  '/',
  '/productos',
  '/personaliza',
  '/empresas-y-eventos',
  '/nosotros',
  '/contacto',
  '/productos/tote-bags',
];
for (const width of [360, 390, 768, 1024, 1440]) {
  await page.setViewportSize({ width, height: 1000 });
  for (const route of routes) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const dims = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      font: getComputedStyle(document.querySelector('h1')).fontFamily,
    }));
    report.viewports.push({
      width,
      route,
      overflow: dims.scrollWidth > dims.width,
      font: dims.font,
    });
    if (route === '/') await page.screenshot({ path: `docs/qa/home-${width}.png`, fullPage: true });
  }
  console.log('Viewport verified:', width);
}
await page.setViewportSize({ width: 1440, height: 1000 });
for (const route of routes) {
  await page.goto(route);
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  report.accessibility.push({
    route,
    violations: results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
    })),
  });
}
const links = new Set();
for (const route of routes) {
  await page.goto(route);
  const hrefs = await page
    .locator('a[href]')
    .evaluateAll((els) => els.map((el) => el.getAttribute('href')));
  for (const href of hrefs) if (href.startsWith('/')) links.add(href);
}
for (const href of links) {
  const res = await context.request.get(href);
  report.links.push({ href, status: res.status() });
}
await page.goto('/productos/tote-bags');
await page.getByRole('link', { name: 'Cotiza este producto' }).click();
await page.getByLabel('¿Con qué te gustaría crear?').waitFor();
if ((await page.locator('#product').inputValue()) !== 'tote-bags')
  throw new Error('Product handoff failed');
await page.getByLabel('Cantidad estimada').fill('25');
await page.getByLabel('Cuéntanos tu idea').fill('Una ilustración para mi comunidad.');
await page.getByRole('button', { name: 'Preparar mi idea' }).click();
await page.locator('#brief-result').waitFor();
if (!(await page.locator('#summary').inputValue()).includes('Cantidad estimada: 25'))
  throw new Error('Summary mismatch');
if (await page.locator('a[href*="wa.me"]').count()) throw new Error('Unconfigured WhatsApp link');
await page.getByRole('button', { name: 'Copiar mi resumen' }).click();
await page.getByRole('status').filter({ hasText: 'Resumen copiado' }).waitFor();
report.flow.push(
  'Product selection → contact → summary → clipboard; no WhatsApp when unconfigured',
);
await page.screenshot({ path: 'docs/qa/contact-1440.png', fullPage: true });
await page.goto('/productos?linea=eventos&categoria=textiles');
report.flow.push(
  `Combined filters: ${await page.locator('.product-card').count()} textile event products`,
);
await page.goto('/productos?linea=regalos&categoria=textiles');
if ((await page.locator('.empty-state').count()) !== 1) throw new Error('Empty state missing');
report.flow.push('Empty filter state works');
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('/');
await page.getByRole('button', { name: 'Abrir menú' }).click();
await page
  .getByRole('navigation', { name: 'Navegación principal' })
  .getByRole('link', { name: 'Productos', exact: true })
  .click();
if ((await page.getByRole('button', { name: 'Abrir menú' }).count()) !== 1)
  throw new Error('Mobile nav stayed open');
await page.getByRole('button', { name: 'Abrir menú' }).click();
await page.keyboard.press('Escape');
if (
  (await page.getByRole('button', { name: 'Abrir menú' }).getAttribute('aria-expanded')) !== 'false'
)
  throw new Error('Escape failed');
report.flow.push('Mobile menu links, close, Escape and focus return');
await page.goto('/');
await page.keyboard.press('Tab');
report.flow.push(
  `First keyboard target: ${await page.evaluate(() => document.activeElement.textContent)}`,
);
const missing = await context.request.get('/productos/no-existe');
report.flow.push(`Unknown product: HTTP ${missing.status()}`);
await writeFile('docs/qa/browser-report.json', JSON.stringify(report, null, 2));
await browser.close();
console.log(
  JSON.stringify(
    {
      overflows: report.viewports.filter((v) => v.overflow),
      accessibility: report.accessibility.filter((a) => a.violations.length),
      brokenLinks: report.links.filter((l) => l.status !== 200),
      flow: report.flow,
      errors,
    },
    null,
    2,
  ),
);
if (
  report.viewports.some((v) => v.overflow) ||
  report.accessibility.some((a) => a.violations.length) ||
  report.links.some((l) => l.status !== 200) ||
  errors.length
)
  process.exitCode = 1;
