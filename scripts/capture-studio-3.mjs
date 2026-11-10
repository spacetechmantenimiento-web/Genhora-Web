import { chromium } from '@playwright/test';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';

const phase = process.argv[2];
if (!['before', 'after'].includes(phase)) throw new Error('Use before or after');
const baseURL = process.env.STUDIO_URL ?? 'http://127.0.0.1:3008';
const directory = `${process.env.CAPTURE_DIR ?? 'docs/qa/studio/personaliza-3'}/${phase}`;
await mkdir(directory, { recursive: true });
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({
  executablePath: existsSync(chrome) ? chrome : undefined,
  headless: true,
});
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(`${baseURL}/personaliza`);
    await page.waitForLoadState('networkidle');
    await page.getByRole('checkbox', { name: 'Mostrar zona y margen de seguridad' }).uncheck();
    for (const [id, name] of [
      ['playera', 'Playera personalizada'],
      ['sudadera', 'Sudadera personalizada'],
      ['tote', 'Tote bag personalizada'],
    ]) {
      await page.getByRole('button', { name }).click();
      for (const side of ['frente', 'espalda']) {
        await page
          .getByRole('button', { name: side === 'frente' ? 'Frente' : 'Espalda', exact: true })
          .click();
        const data = await page
          .locator('canvas')
          .evaluate((canvas) => canvas.toDataURL('image/png').split(',')[1]);
        await writeFile(`${directory}/${id}-${side}-${width}.png`, Buffer.from(data, 'base64'));
      }
      if (width === 390 && id === 'sudadera') {
        await page.getByRole('button', { name: 'Frente', exact: true }).click();
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({
          path: `${directory}/sudadera-mobile-page.png`,
          fullPage: true,
          caret: 'initial',
        });
      }
      if (phase === 'after' && width === 1440 && id === 'sudadera') {
        await page.getByRole('button', { name: 'Frente', exact: true }).click();
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({
          path: `${directory}/sudadera-desktop-page.png`,
          fullPage: true,
          caret: 'initial',
        });
        await page.getByRole('button', { name: 'Ver sin guías' }).click();
        await page.screenshot({
          path: `${directory}/sudadera-preview-desktop.png`,
          fullPage: true,
          caret: 'initial',
        });
        await page.getByRole('button', { name: 'Espalda', exact: true }).click();
        await page.screenshot({
          path: `${directory}/sudadera-preview-espalda-desktop.png`,
          fullPage: true,
          caret: 'initial',
        });
        await page.getByRole('button', { name: 'Volver a editar' }).click();
      }
    }
    if (phase === 'after' && width === 1440) {
      await page.getByRole('button', { name: 'Sudadera personalizada' }).click();
      await page.getByRole('button', { name: 'Frente', exact: true }).click();
      await page.getByRole('button', { name: 'Blanco', exact: true }).first().click();
      for (const [name, action] of [
        ['blanco', () => Promise.resolve()],
        ['negro', () => page.getByRole('button', { name: 'Negro', exact: true }).first().click()],
        [
          'verde-bosque',
          async () => {
            await page.getByRole('button', { name: 'Explorar colores' }).click();
            await page.getByRole('button', { name: 'Verde bosque #294D3A' }).click();
          },
        ],
        ['rosa-pastel', () => page.getByRole('button', { name: 'Rosa pastel #EAC8CF' }).click()],
        [
          'hex',
          async () => {
            await page.getByRole('textbox', { name: 'Código HEX' }).fill('#526A87');
            await page.getByRole('button', { name: 'Aplicar' }).click();
          },
        ],
      ]) {
        await action();
        const data = await page
          .locator('canvas')
          .evaluate((canvas) => canvas.toDataURL('image/png').split(',')[1]);
        await writeFile(`${directory}/sudadera-${name}.png`, Buffer.from(data, 'base64'));
      }
    }
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(`Captured ${phase} at ${baseURL}`);
