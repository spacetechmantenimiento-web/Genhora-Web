import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { existsSync, readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const macChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({
  executablePath: process.env.CHROME_EXECUTABLE || (existsSync(macChrome) ? macChrome : undefined),
  headless: true,
});
const context = await browser.newContext({
  baseURL: 'http://127.0.0.1:3002',
  reducedMotion: 'reduce',
});
await context.addInitScript(() => {
  window.__genhoraLayoutShift = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries())
      if (!entry.hadRecentInput) window.__genhoraLayoutShift += entry.value;
  }).observe({ type: 'layout-shift', buffered: true });
});
const page = await context.newPage();
const report = { viewports: [], links: [], interactions: [], errors: [], scope: {} };
page.on('pageerror', (error) => report.errors.push(error.message));
for (const width of [360, 390, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto('/');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await document.querySelector('section[aria-labelledby="hero-title"] img').decode();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  const metrics = await page.evaluate(() => {
    const hero = document.querySelector('section[aria-labelledby="hero-title"]');
    const image = hero.querySelector('img');
    const rect = image.getBoundingClientRect();
    const logo = document.querySelector('header img');
    const title = document.querySelector('#hero-title');
    return {
      overflow: document.documentElement.scrollWidth > innerWidth,
      logoWidth: logo.getBoundingClientRect().width,
      titleSize: getComputedStyle(title).fontSize,
      imageLoaded: image.complete && image.naturalWidth > 0,
      imageAspectRatio: rect.width / rect.height,
      layoutShift: window.__genhoraLayoutShift,
      imageResource: performance
        .getEntriesByType('resource')
        .filter((r) => r.name.includes('hero-personalized'))
        .map((r) => ({ duration: r.duration, bytes: r.transferSize })),
      titleLinesFit: [...title.children].every((el) => {
        const range = document.createRange();
        range.selectNodeContents(el);
        return range.getBoundingClientRect().width <= title.getBoundingClientRect().width + 1;
      }),
    };
  });
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const entry = {
    width,
    ...metrics,
    violations: axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
  };
  report.viewports.push(entry);
  await page.screenshot({ path: `docs/qa/redesign-02/home-${width}.png`, fullPage: true });
  await page.screenshot({ path: `docs/qa/redesign-02/preview-${width}.png` });
  if (width <= 1150) {
    const toggle = page.getByRole('button', { name: 'Abrir menú' });
    await toggle.click();
    await page
      .getByRole('navigation', { name: 'Navegación principal' })
      .getByRole('link', { name: 'Inicio', exact: true })
      .waitFor();
    if (width === 390) await page.screenshot({ path: 'docs/qa/redesign-02/menu-390.png' });
    await page.keyboard.press('Escape');
    if ((await toggle.getAttribute('aria-expanded')) !== 'false') throw new Error('Escape failed');
    if (!(await toggle.evaluate((el) => el === document.activeElement)))
      throw new Error('Menu focus not restored');
  }
  console.log(
    `Viewport ${width}: overflow=${entry.overflow}, axe=${entry.violations.length}, CLS=${entry.layoutShift}`,
  );
}
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto('/');
const hrefs = await page
  .locator('header a, section[aria-labelledby="hero-title"] a')
  .evaluateAll((links) => [...new Set(links.map((a) => a.getAttribute('href')))]);
for (const href of hrefs) {
  const response = await context.request.get(href);
  report.links.push({ href, status: response.status() });
}
await page.getByRole('link', { name: 'Empieza a crear', exact: true }).click();
await page.waitForURL('**/productos');
report.interactions.push('Primary CTA opens the real product catalog');
await page.goto('/');
await page.getByRole('link', { name: 'Explora nuestros productos', exact: true }).click();
await page.waitForURL('**/productos');
report.interactions.push('Secondary CTA opens the catalog');
await page.goto('/');
await page.keyboard.press('Tab');
if (!(await page.evaluate(() => document.activeElement.textContent)).includes('Saltar'))
  throw new Error('Skip link is not first');
report.interactions.push(
  'Keyboard skip link; mobile menu, Escape and focus return at all collapsed widths',
);
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('/');
await page.getByRole('button', { name: 'Abrir menú' }).click();
await page
  .getByRole('navigation', { name: 'Navegación principal' })
  .getByRole('link', { name: 'Contacto', exact: true })
  .click();
await page.waitForURL('**/contacto');
if (
  (await page.getByRole('button', { name: 'Abrir menú' }).getAttribute('aria-expanded')) !== 'false'
)
  throw new Error('Menu remains open after navigation');
report.interactions.push('Mobile link navigates and closes menu');
// Non-reduced motion must finish and leave all content readable; reduced motion was checked above.
await page.emulateMedia({ reducedMotion: 'no-preference' });
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto('/');
await page.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all(document.getAnimations().map((a) => a.finished));
});
const motion = await page.locator('#hero-title').evaluate((el) => ({
  opacity: getComputedStyle(el).opacity,
  animations: el.getAnimations().filter((a) => a.playState === 'running').length,
}));
if (motion.opacity !== '1' || motion.animations)
  throw new Error('Essential title remains animated or hidden');
report.interactions.push('Finite entrance animations complete; reduced motion remains readable');
const primary = page.getByRole('link', { name: 'Empieza a crear', exact: true });
await primary.hover();
await page.screenshot({ path: 'docs/qa/redesign-02/hover-1440.png' });
await primary.focus();
await page.screenshot({ path: 'docs/qa/redesign-02/focus-1440.png' });
const baseline = JSON.parse(readFileSync('docs/qa/redesign-02/baseline-hashes.json', 'utf8'));
const allowed = new Set(['src/app/page.tsx', 'src/app/globals.css', 'src/components/header.tsx']);
const changed = Object.entries(baseline)
  .filter(([file, hash]) => createHash('sha256').update(readFileSync(file)).digest('hex') !== hash)
  .map(([file]) => file);
report.scope = {
  changedExistingFiles: changed,
  unexpectedChanges: changed.filter((file) => !allowed.has(file)),
  protectedFilesChecked: Object.keys(baseline).length - allowed.size,
};
await writeFile('docs/qa/redesign-02/report.json', JSON.stringify(report, null, 2));
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (
  report.viewports.some(
    (v) =>
      v.overflow ||
      !v.imageLoaded ||
      !v.titleLinesFit ||
      v.violations.length ||
      v.layoutShift > 0.1,
  ) ||
  report.links.some((l) => l.status !== 200) ||
  report.errors.length ||
  report.scope.unexpectedChanges.length
)
  process.exitCode = 1;
