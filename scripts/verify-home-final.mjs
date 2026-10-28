import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';

const output = 'docs/qa/home-final';
const macChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({
  executablePath: process.env.CHROME_EXECUTABLE || (existsSync(macChrome) ? macChrome : undefined),
  headless: true,
});
const context = await browser.newContext({
  baseURL: 'http://127.0.0.1:3002',
  reducedMotion: 'reduce',
});
const page = await context.newPage();
const report = { viewports: [], links: [], errors: [] };
page.on('pageerror', (error) => report.errors.push(error.message));
await mkdir(output, { recursive: true });

try {
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (const image of document.images) {
        image.scrollIntoView();
        await image.decode().catch(() => {});
      }
      scrollTo(0, 0);
    });
    const details = await page.evaluate(() => {
      const images = [...document.images];
      const marker = document.querySelector('[class*="marker"]');
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        brokenImages: images
          .filter((image) => !image.complete || !image.naturalWidth)
          .map((image) => image.src),
        markerPointerEvents: getComputedStyle(marker).pointerEvents,
        stepFontSize: getComputedStyle(document.querySelector('.steps li')).fontSize,
        storyFontSize: getComputedStyle(document.querySelector('.story-body p')).fontSize,
      };
    });
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    report.viewports.push({
      width,
      ...details,
      accessibilityViolations: axe.violations.map((violation) => violation.id),
    });
    await page.screenshot({ path: `${output}/home-${width}.png`, fullPage: true });
    if (width <= 1024) {
      const menu = page.getByRole('button', { name: 'Abrir menú' });
      await menu.click();
      if (
        (await page.getByRole('button', { name: 'Cerrar menú' }).getAttribute('aria-expanded')) !==
        'true'
      )
        throw new Error(`Menu did not open at ${width}px`);
      await page.keyboard.press('Escape');
      if ((await menu.getAttribute('aria-expanded')) !== 'false')
        throw new Error(`Menu did not close at ${width}px`);
    }
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const hrefs = await page
    .locator('main a[href^="/"]')
    .evaluateAll((anchors) => [...new Set(anchors.map((anchor) => anchor.getAttribute('href')))]);
  for (const href of hrefs) {
    const response = await context.request.get(href);
    report.links.push({ href, status: response.status() });
  }
  await page.getByRole('link', { name: 'Empieza a crear', exact: true }).click();
  await page.waitForURL('**/productos');
  await page.goto('/');
  await page.getByRole('link', { name: 'Conoce nuestro estudio', exact: true }).click();
  await page.waitForURL('**/nosotros');
  await page.goto('/');
  await page.getByRole('link', { name: 'Creemos algo juntos', exact: true }).click();
  await page.waitForURL('**/empresas-y-eventos');

  await writeFile(`${output}/report.json`, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (
    report.errors.length ||
    report.links.some((link) => link.status !== 200) ||
    report.viewports.some(
      (viewport) =>
        viewport.overflow ||
        viewport.brokenImages.length ||
        viewport.markerPointerEvents !== 'none' ||
        viewport.accessibilityViolations.length,
    )
  ) {
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}
