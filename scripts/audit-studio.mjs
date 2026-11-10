import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';

const baseURL = process.env.STUDIO_URL ?? 'http://127.0.0.1:3006';
const output = 'docs/qa/studio/prompt06';
await mkdir(output, { recursive: true });
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({
  executablePath: existsSync(chrome) ? chrome : undefined,
  headless: true,
});
const context = await browser.newContext({ baseURL, acceptDownloads: true });
const problems = [];
const results = [];
context.on('page', (page) => {
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(`console: ${message.text()}`);
  });
  page.on('response', (response) => {
    if (response.status() === 404) problems.push(`404: ${response.url()}`);
  });
});
async function open(width = 1440, height = 960) {
  const page = await context.newPage();
  await page.setViewportSize({ width, height });
  await page.goto('/personaliza');
  await page.locator('canvas').waitFor();
  await page.waitForLoadState('networkidle');
  return page;
}
async function hash(page) {
  return page.locator('canvas').evaluate((canvas) => canvas.toDataURL());
}
async function download(page, name, side = 'frente') {
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: `Descargar mi diseño · ${side}` }).click();
  const file = await event;
  const path = `${output}/${name}.png`;
  await file.saveAs(path);
  const bytes = await readFile(path);
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(bytes.readUInt32BE(16), 1600);
  assert.equal(bytes.readUInt32BE(20), 1600);
  return path;
}
async function test(name, fn) {
  let page;
  try {
    page = await open();
    await fn(page);
    results.push({ name, status: 'APROBADA' });
  } catch (error) {
    results.push({ name, status: 'FALLÓ', reason: String(error) });
  } finally {
    await page?.close({ runBeforeUnload: false });
  }
}
async function transparentPng(page) {
  return Buffer.from(
    (
      await page.evaluate(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#D85A5A';
        ctx.beginPath();
        ctx.arc(400, 400, 270, 0, Math.PI * 2);
        ctx.fill();
        return canvas.toDataURL('image/png');
      })
    ).split(',')[1],
    'base64',
  );
}

await test('1 Playera, HEX, texto, fuente y PNG', async (page) => {
  await page.getByRole('button', { name: 'Explorar colores' }).click();
  await page.getByRole('textbox', { name: 'Código HEX' }).fill('#2A506C');
  await page.getByRole('button', { name: 'Aplicar' }).click();
  await page.getByText('Personalizado · #2A506C').waitFor();
  await page.getByRole('button', { name: '+ Agregar texto' }).click();
  await page.getByRole('textbox', { name: 'Texto', exact: true }).fill('GENHORA');
  await page.getByRole('button', { name: 'Tipografía Playfair Display' }).click();
  await page.getByRole('combobox', { name: 'Grosor' }).selectOption('700');
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.evaluate(() => document.fonts.check('700 16px "Playfair Studio"')), true);
  await download(page, 'playera-hex-playfair');
});
await test('2 Sudadera frente y espalda', async (page) => {
  await page.getByRole('button', { name: 'Sudadera personalizada' }).click();
  const front = await hash(page);
  await page.locator('canvas').screenshot({ path: `${output}/sudadera-frente.png` });
  await page.getByRole('button', { name: 'Espalda', exact: true }).click();
  const back = await hash(page);
  await page.locator('canvas').screenshot({ path: `${output}/sudadera-espalda.png` });
  assert.notEqual(front, back);
});
await test('3 Diseños independientes', async (page) => {
  await page.getByRole('button', { name: 'Sudadera personalizada' }).click();
  await page.getByRole('button', { name: '+ Agregar texto' }).click();
  await page.getByRole('textbox', { name: 'Texto', exact: true }).fill('GENHORA');
  await page.getByRole('button', { name: 'Espalda', exact: true }).click();
  await page.getByLabel('Subir PNG, JPG o WebP').setInputFiles({
    name: 'logo-transparente.png',
    mimeType: 'image/png',
    buffer: await transparentPng(page),
  });
  await page.getByRole('button', { name: 'logo-transparente.png' }).waitFor();
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'Frente', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: 'GENHORA' }).count(), 1);
    assert.equal(await page.getByRole('button', { name: 'logo-transparente.png' }).count(), 0);
    await page.getByRole('button', { name: 'Espalda', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: 'logo-transparente.png' }).count(), 1);
  }
});
await test('4 PNG transparente, transformación y exportación', async (page) => {
  await page.getByRole('button', { name: 'Tote bag personalizada' }).click();
  await page.getByLabel('Subir PNG, JPG o WebP').setInputFiles({
    name: 'logo-transparente.png',
    mimeType: 'image/png',
    buffer: await transparentPng(page),
  });
  const box = await page.locator('canvas').boundingBox();
  assert.ok(box);
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.576);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.55, box.y + box.height * 0.62, { steps: 4 });
  await page.mouse.up();
  assert.ok(Number(await page.getByRole('slider', { name: /Horizontal/ }).inputValue()) > 0.5);
  await page.getByRole('slider', { name: /Horizontal/ }).fill('0.62');
  await page.getByRole('slider', { name: /Tamaño/ }).fill('1.2');
  await page.getByRole('slider', { name: /Rotación/ }).fill('25');
  assert.equal(await page.getByRole('slider', { name: /Rotación/ }).inputValue(), '25');
  await download(page, 'tote-logo-transparente');
});
await test('5 Colores y conservación del diseño', async (page) => {
  await page.getByRole('button', { name: '+ Agregar texto' }).click();
  const textColor = await page.getByLabel('Color del texto').inputValue();
  await page.getByRole('button', { name: 'Negro', exact: true }).first().click();
  await page.getByRole('button', { name: 'Blanco', exact: true }).first().click();
  await page.getByRole('button', { name: 'Explorar colores' }).click();
  await page.getByRole('textbox', { name: 'Código HEX' }).fill('#8C53AA');
  await page.getByRole('button', { name: 'Aplicar' }).click();
  await page.getByRole('button', { name: 'Espalda', exact: true }).click();
  await page.getByRole('button', { name: 'Frente', exact: true }).click();
  await page.getByRole('button', { name: 'Tu idea' }).click();
  assert.equal(await page.getByLabel('Color del texto').inputValue(), textColor);
  await page.getByText('Personalizado · #8C53AA').waitFor();
});
await test('6 Fuentes serif y manuscrita', async (page) => {
  await page.getByRole('button', { name: '+ Agregar texto' }).click();
  await page.getByRole('button', { name: 'Tipografía DM Serif Display' }).click();
  const serif = await hash(page);
  await download(page, 'fuente-serif');
  await page.getByRole('button', { name: 'Manuscritas' }).click();
  await page.getByRole('button', { name: 'Tipografía Great Vibes' }).click();
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.evaluate(() => document.fonts.check('16px "Great Vibes Studio"')), true);
  assert.notEqual(await hash(page), serif);
  await download(page, 'fuente-manuscrita');
});
await test('7 Errores y límites', async (page) => {
  await page.getByRole('button', { name: 'Explorar colores' }).click();
  await page.getByRole('textbox', { name: 'Código HEX' }).fill('xyz');
  await page.getByRole('button', { name: 'Aplicar' }).click();
  await page
    .getByRole('alert')
    .getByText(/HEX válido/)
    .waitFor();
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
  await page.getByRole('button', { name: '+ Agregar texto' }).click();
  await page.getByRole('slider', { name: /Horizontal/ }).fill('0.98');
  assert.ok(Number(await page.getByRole('slider', { name: /Horizontal/ }).inputValue()) < 0.98);
});
await test('8 Cotización WhatsApp', async (page) => {
  await page.getByRole('button', { name: '+ Agregar texto' }).click();
  await page.getByRole('button', { name: 'Explorar colores' }).click();
  await page.getByRole('textbox', { name: 'Código HEX' }).fill('#536B42');
  await page.getByRole('button', { name: 'Aplicar' }).click();
  await page.getByRole('spinbutton', { name: 'Cantidad de piezas' }).fill('12');
  await page.getByRole('combobox', { name: 'Talla de referencia' }).selectOption('G');
  await page.getByRole('textbox', { name: 'Observaciones (opcional)' }).fill('Entrega en CDMX');
  const href = await page.getByRole('link', { name: /Cotizar por WhatsApp/ }).getAttribute('href');
  assert.ok(href?.includes('wa.me/525655745468'));
  const text = new URL(href).searchParams.get('text');
  for (const item of [
    'Playera personalizada',
    '#536B42',
    'Talla: G',
    'Cantidad: 12',
    'frente:',
    'Entrega en CDMX',
  ])
    assert.ok(text?.includes(item), item);
  assert.equal(await page.getByRole('button', { name: 'Descargar mi diseño · frente' }).count(), 1);
});
await test('9 Responsive 375, 390, 768, 1440', async (page) => {
  for (const width of [375, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 850 });
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
      `${width}px overflow`,
    );
    await page.screenshot({
      path: `${output}/responsive-${width}.png`,
      fullPage: true,
      caret: 'initial',
    });
  }
});
await test('10 Estabilidad, recursos y estado', async (page) => {
  await page.getByRole('button', { name: '+ Agregar texto' }).click();
  await page.getByRole('textbox', { name: 'Texto', exact: true }).fill('Persistente');
  for (let i = 0; i < 4; i++) {
    await page.getByRole('button', { name: 'Sudadera personalizada' }).click();
    await page.getByRole('button', { name: 'Playera personalizada' }).click();
    assert.equal(await page.getByRole('button', { name: 'Persistente' }).count(), 1);
  }
  assert.deepEqual(problems, []);
});
await test('11 Motivos, historial y capas', async (page) => {
  for (const motif of ['Monograma', 'Floral', 'Geométrico', 'Frase', 'Destello']) {
    await page.getByRole('button', { name: motif, exact: true }).click();
  }
  assert.equal(await page.getByRole('button', { name: '✦' }).count(), 1);
  await page.getByRole('button', { name: 'Deshacer' }).click();
  assert.equal(await page.getByRole('button', { name: '✦' }).count(), 0);
  await page.getByRole('button', { name: 'Rehacer' }).click();
  assert.equal(await page.getByRole('button', { name: '✦' }).count(), 1);
  await page.getByRole('button', { name: 'A · B' }).click();
  await page.getByRole('button', { name: 'Traer al frente' }).click();
  const layers = await page
    .locator('h3')
    .filter({ hasText: 'Capas de esta vista' })
    .locator('..')
    .getByRole('button')
    .allTextContents();
  assert.equal(layers.at(-1), 'A · B');
  await page.getByRole('button', { name: 'Duplicar' }).click();
  assert.equal(await page.getByRole('button', { name: 'A · B' }).count(), 2);
  await page.getByRole('button', { name: 'Eliminar' }).click();
  assert.equal(await page.getByRole('button', { name: 'A · B' }).count(), 1);
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Restablecer esta vista' }).click();
  assert.equal(await page.getByRole('button', { name: 'A · B' }).count(), 0);
});
await test('12 JPG, WebP y sustitución de imagen', async (page) => {
  for (const [type, name] of [
    ['image/jpeg', 'foto.jpg'],
    ['image/webp', 'reemplazo.webp'],
  ]) {
    const data = await page.evaluate((mime) => {
      const canvas = document.createElement('canvas');
      canvas.width = 700;
      canvas.height = 700;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#294D3A';
      ctx.fillRect(0, 0, 700, 700);
      return canvas.toDataURL(mime).split(',')[1];
    }, type);
    await page
      .getByLabel('Subir PNG, JPG o WebP')
      .setInputFiles({ name, mimeType: type, buffer: Buffer.from(data, 'base64') });
    await page.getByRole('button', { name }).waitFor();
  }
  assert.equal(await page.getByRole('button', { name: 'foto.jpg' }).count(), 0);
  assert.equal(await page.getByRole('button', { name: 'reemplazo.webp' }).count(), 1);
});
await browser.close();
console.log(JSON.stringify({ baseURL, results, problems }, null, 2));
if (results.some((result) => result.status !== 'APROBADA') || problems.length) process.exitCode = 1;
