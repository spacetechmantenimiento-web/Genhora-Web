import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({
  executablePath: existsSync(chrome) ? chrome : undefined,
  headless: true,
});
const context = await browser.newContext({
  baseURL: 'http://127.0.0.1:3005',
  acceptDownloads: true,
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
await mkdir('docs/qa/studio', { recursive: true });

try {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/personaliza');
  await page.keyboard.press('Tab');
  if (
    !(await page.evaluate(() => document.activeElement?.textContent || '')).includes(
      'Saltar al contenido',
    )
  )
    throw new Error('Keyboard skip link unavailable');
  await page.getByRole('button', { name: '+ Agregar texto' }).click();
  await page.getByRole('textbox', { name: 'Texto' }).fill('Ana');
  await page.getByRole('button', { name: 'Negro', exact: true }).first().click();
  await page.getByRole('button', { name: 'Espalda', exact: true }).click();
  await page.getByRole('button', { name: '+ Agregar texto' }).click();
  await page.getByRole('textbox', { name: 'Texto' }).fill('Atrás');
  await page.getByRole('button', { name: 'Frente', exact: true }).click();
  if (!(await page.getByRole('button', { name: 'Ana' }).count()))
    throw new Error('Front artwork lost');
  await page.getByRole('button', { name: 'Espalda', exact: true }).click();
  if (!(await page.getByRole('button', { name: 'Atrás' }).count()))
    throw new Error('Back artwork lost');
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: 'docs/qa/studio/desktop.png', fullPage: true });

  await page.getByRole('button', { name: 'Sudadera personalizada' }).click();
  const png = Buffer.from(
    (
      await page.evaluate(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#294D3A';
        ctx.fillRect(250, 250, 300, 300);
        return canvas.toDataURL('image/png');
      })
    ).split(',')[1],
    'base64',
  );
  await page
    .getByLabel('Subir PNG, JPG o WebP')
    .setInputFiles({ name: 'logo.png', mimeType: 'image/png', buffer: png });
  await page.getByRole('button', { name: 'logo.png' }).waitFor();
  await page.getByRole('slider', { name: /Tamaño/ }).fill('1.5');
  await page.getByRole('slider', { name: /Rotación/ }).fill('35');
  await page.getByRole('button', { name: 'Playera personalizada' }).click();
  await page.getByRole('button', { name: 'Sudadera personalizada' }).click();
  if (!(await page.getByRole('button', { name: 'logo.png' }).count()))
    throw new Error('Product switch lost artwork');
  await page
    .getByLabel('Subir PNG, JPG o WebP')
    .setInputFiles({ name: 'bad.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg/>') });
  await page
    .getByRole('alert')
    .getByText(/PNG, JPG o WebP/)
    .waitFor();
  await page.getByLabel('Subir PNG, JPG o WebP').setInputFiles({
    name: 'huge.png',
    mimeType: 'image/png',
    buffer: Buffer.alloc(10 * 1024 * 1024 + 1),
  });
  await page.getByRole('alert').getByText(/10 MB/).waitFor();

  await page.getByRole('button', { name: 'Tote bag personalizada' }).click();
  await page.getByRole('button', { name: 'Floral' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Descargar mi diseño · frente' }).click();
  const download = await downloadPromise;
  await download.saveAs('docs/qa/studio/export-tote-front.png');
  if (download.suggestedFilename() !== 'genhora-tote-frente.png')
    throw new Error('Wrong export filename');
  const whatsapp = await page
    .getByRole('link', { name: /Cotizar por WhatsApp/ })
    .getAttribute('href');
  if (
    !whatsapp?.includes('wa.me/525655745468') ||
    !decodeURIComponent(whatsapp).includes('Cantidad: 1')
  )
    throw new Error('Quote link incorrect');
  const axeDesktop = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/personaliza');
  await page.getByRole('button', { name: '+ Agregar texto' }).click();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  const axeMobile = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: 'docs/qa/studio/mobile-390.png', fullPage: true });
  console.log(
    JSON.stringify(
      {
        errors,
        overflow,
        axeDesktop: axeDesktop.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
        axeMobile: axeMobile.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
        download: download.suggestedFilename(),
        whatsapp,
      },
      null,
      2,
    ),
  );
  if (errors.length || overflow || axeDesktop.violations.length || axeMobile.violations.length)
    process.exitCode = 1;
} finally {
  await browser.close();
}
