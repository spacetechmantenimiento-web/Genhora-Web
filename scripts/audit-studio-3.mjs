import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const baseURL = process.env.STUDIO_URL ?? 'http://127.0.0.1:3009';
const output = process.env.AUDIT_DIR ?? 'docs/qa/studio/personaliza-3';
await mkdir(output, { recursive: true });
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({
  executablePath: existsSync(chrome) ? chrome : undefined,
  headless: true,
});
const context = await browser.newContext({ baseURL, acceptDownloads: true });
const results = [];
const problems = [];
context.on('page', (page) => {
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(`console: ${message.text()}`);
  });
  page.on('response', (response) => {
    if (response.status() === 404) problems.push(`404: ${response.url()}`);
  });
});

async function open(width = 1440, height = 900) {
  const page = await context.newPage();
  await page.setViewportSize({ width, height });
  await page.goto('/personaliza');
  await page.waitForLoadState('networkidle');
  return page;
}

async function run(name, action) {
  if (process.env.TEST_FILTER && !name.startsWith(process.env.TEST_FILTER)) return;
  let page;
  try {
    page = await open();
    await action(page);
    results.push({ name, status: 'APROBADO' });
  } catch (error) {
    results.push({ name, status: 'FALLÓ', reason: error?.stack ?? String(error) });
  } finally {
    await page?.close({ runBeforeUnload: false });
  }
}

async function raster(page, type = 'image/png') {
  const data = await page.evaluate((mime) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (mime === 'image/png') {
      ctx.fillStyle = '#C55870';
      ctx.beginPath();
      ctx.arc(400, 400, 250, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#294D3A';
      ctx.fillRect(0, 0, 800, 800);
    }
    return canvas.toDataURL(mime).split(',')[1];
  }, type);
  return Buffer.from(data, 'base64');
}

async function download(page, side, name) {
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: `Descargar mi diseño · ${side}` }).click();
  const file = await pending;
  const path = `${output}/${name}.png`;
  await file.saveAs(path);
  const bytes = await readFile(path);
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(bytes.readUInt32BE(16), 1600);
  assert.equal(bytes.readUInt32BE(20), 1600);
  return { path, bytes, filename: file.suggestedFilename() };
}

async function comparePreviewToExport(page, bytes) {
  const difference = await page.evaluate(async (encoded) => {
    const preview = document.querySelector('canvas');
    const original = preview.getContext('2d').getImageData(0, 0, 800, 800).data;
    const image = new Image();
    image.src = `data:image/png;base64,${encoded}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, 800, 800);
    const exported = ctx.getImageData(0, 0, 800, 800).data;
    let total = 0;
    let significant = 0;
    for (let index = 0; index < original.length; index += 4) {
      const delta =
        Math.abs(original[index] - exported[index]) +
        Math.abs(original[index + 1] - exported[index + 1]) +
        Math.abs(original[index + 2] - exported[index + 2]);
      total += delta;
      if (delta > 60) significant++;
    }
    return { average: total / (800 * 800 * 3), significant };
  }, bytes.toString('base64'));
  assert.ok(difference.average < 4, JSON.stringify(difference));
  assert.ok(difference.significant < 15000, JSON.stringify(difference));
  return difference;
}

await run('A Sudadera completa, dos caras y exportación', async (page) => {
  await page.getByRole('button', { name: 'Sudadera personalizada' }).click();
  await page.getByRole('button', { name: 'Negro', exact: true }).first().click();
  await page.getByRole('button', { name: '+ Agregar texto' }).click();
  await page.getByRole('textbox', { name: 'Texto', exact: true }).fill('GENHORA');
  await page.getByRole('button', { name: 'Impactantes' }).click();
  await page.getByRole('button', { name: 'Tipografía Bebas Neue' }).click();
  await page.getByRole('button', { name: 'Centrar diseño' }).click();
  assert.equal(Number(await page.getByRole('slider', { name: /Horizontal/ }).inputValue()), 0.5);
  assert.equal(Number(await page.getByRole('slider', { name: /Vertical/ }).inputValue()), 0.5);
  const textColor = await page.getByLabel('Color del texto').inputValue();
  await page.getByLabel('Subir PNG, JPG o WebP').setInputFiles({
    name: 'logo-transparente.png',
    mimeType: 'image/png',
    buffer: await raster(page),
  });
  await page.getByRole('button', { name: 'Centrar diseño' }).click();
  assert.equal(Number(await page.getByRole('slider', { name: /Horizontal/ }).inputValue()), 0.5);
  assert.equal(Number(await page.getByRole('slider', { name: /Vertical/ }).inputValue()), 0.5);
  await page.getByRole('button', { name: 'Ajustar al área' }).click();
  await page.getByRole('button', { name: 'Espalda', exact: true }).click();
  await page.getByRole('button', { name: '+ Agregar texto' }).click();
  await page.getByRole('textbox', { name: 'Texto', exact: true }).fill('ESPALDA');
  await page.getByLabel('Subir PNG, JPG o WebP').setInputFiles({
    name: 'logo-espalda.png',
    mimeType: 'image/png',
    buffer: await raster(page),
  });
  assert.equal(await page.getByRole('button', { name: 'GENHORA' }).count(), 0);
  await page.getByRole('button', { name: 'Frente', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'GENHORA' }).count(), 1);
  assert.equal(await page.getByRole('button', { name: 'logo-transparente.png' }).count(), 1);
  await page.getByRole('button', { name: 'Explorar colores' }).click();
  await page.getByRole('textbox', { name: 'Código HEX' }).fill('#526A87');
  await page.getByRole('button', { name: 'Aplicar' }).click();
  await page.getByRole('button', { name: 'GENHORA' }).click();
  assert.equal(await page.getByLabel('Color del texto').inputValue(), textColor);
  await page.getByRole('button', { name: 'Espalda', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'ESPALDA', exact: true }).count(), 1);
  await page.getByText('Color personalizado', { exact: true }).waitFor();
  assert.equal(await page.getByText('Personalizado · #526A87').count(), 0);
  const back = await download(page, 'espalda', 'auditoria-sudadera-espalda');
  await page.getByRole('button', { name: 'Frente', exact: true }).click();
  const front = await download(page, 'frente', 'auditoria-sudadera-frente');
  assert.notDeepEqual(front.bytes, back.bytes);
  const href = await page.getByRole('link', { name: /Cotizar por WhatsApp/ }).getAttribute('href');
  const message = new URL(href).searchParams.get('text');
  for (const item of [
    'Sudadera personalizada',
    '#526A87',
    'frente:',
    'espalda:',
    'GENHORA',
    'ESPALDA',
  ]) {
    assert.ok(message?.includes(item), item);
  }
  await page.getByRole('button', { name: 'Ver sin guías' }).click();
  assert.equal(await page.getByRole('button', { name: '+ Agregar texto' }).count(), 0);
  await comparePreviewToExport(page, front.bytes);
  await page.getByRole('button', { name: 'Espalda', exact: true }).click();
  await comparePreviewToExport(page, back.bytes);
  await page.getByRole('button', { name: 'Volver a editar' }).click();
});

await run('B Tipografías y correspondencia entre editor y PNG', async (page) => {
  await page.getByRole('button', { name: '+ Agregar texto' }).click();
  await page.getByRole('textbox', { name: 'Texto', exact: true }).fill('Crear');
  await page.getByRole('button', { name: 'Tipografía Playfair Display' }).click();
  const serif = await page.locator('canvas').evaluate((canvas) => canvas.toDataURL());
  await page.getByRole('button', { name: 'Manuscritas' }).click();
  await page.getByRole('button', { name: 'Tipografía Great Vibes' }).click();
  await page.waitForFunction(() =>
    [...document.fonts].some(
      (face) => face.family.includes('Great Vibes Studio') && face.status === 'loaded',
    ),
  );
  const script = await page.locator('canvas').evaluate((canvas) => canvas.toDataURL());
  assert.notEqual(serif, script);
  assert.match(
    await page
      .getByRole('button', { name: 'Tipografía Great Vibes' })
      .locator('span')
      .evaluate((node) => getComputedStyle(node).fontFamily),
    /Great Vibes Studio/,
  );
  const exported = await download(page, 'frente', 'auditoria-fuente-manuscrita');
  await page.getByRole('button', { name: 'Ver sin guías' }).click();
  assert.equal(
    await page.getByRole('checkbox', { name: 'Mostrar zona y margen de seguridad' }).count(),
    0,
  );
  await comparePreviewToExport(page, exported.bytes);
  await page.getByRole('button', { name: 'Volver a editar' }).click();
  assert.equal(
    await page.getByRole('checkbox', { name: 'Mostrar zona y margen de seguridad' }).count(),
    1,
  );
});

await run('C Imágenes válidas, errores y eliminación', async (page) => {
  for (const [mime, name] of [
    ['image/png', 'logo.png'],
    ['image/jpeg', 'foto.jpg'],
    ['image/webp', 'arte.webp'],
  ]) {
    await page
      .getByLabel('Subir PNG, JPG o WebP')
      .setInputFiles({ name, mimeType: mime, buffer: await raster(page, mime) });
    await page.getByRole('button', { name }).waitFor();
  }
  assert.equal(await page.getByRole('button', { name: 'logo.png' }).count(), 0);
  await page.getByRole('slider', { name: /Tamaño/ }).fill('1.2');
  await page.getByRole('slider', { name: /Rotación/ }).fill('30');
  await page.getByRole('button', { name: 'Eliminar' }).click();
  assert.equal(await page.getByRole('button', { name: 'arte.webp' }).count(), 0);
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
});

await run('D Historial, producto, cara, color y restablecer', async (page) => {
  await page.getByRole('button', { name: '+ Agregar texto' }).click();
  await page.getByRole('textbox', { name: 'Texto', exact: true }).fill('Ana');
  await page.getByRole('button', { name: 'Deshacer' }).click();
  assert.notEqual(await page.getByRole('button', { name: 'Ana' }).count(), 1);
  await page.getByRole('button', { name: 'Rehacer' }).click();
  assert.equal(await page.getByRole('button', { name: 'Ana' }).count(), 1);
  await page.getByRole('button', { name: 'Sudadera personalizada' }).click();
  await page.getByRole('button', { name: 'Playera personalizada' }).click();
  assert.equal(await page.getByRole('button', { name: 'Ana' }).count(), 1);
  await page.getByRole('button', { name: 'Espalda', exact: true }).click();
  await page.getByRole('button', { name: 'Frente', exact: true }).click();
  await page.getByRole('button', { name: 'Negro', exact: true }).first().click();
  assert.equal(await page.getByRole('button', { name: 'Ana' }).count(), 1);
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Restablecer esta vista' }).click();
  assert.equal(await page.getByRole('button', { name: 'Ana' }).count(), 0);
});

await run('E Colores y volumen de la prenda', async (page) => {
  await page.getByRole('button', { name: 'Sudadera personalizada' }).click();
  await page.getByText('Marfil', { exact: true }).waitFor();
  assert.equal(await page.getByText('Marfil · #EDE9DA').count(), 0);
  await page.getByRole('checkbox', { name: 'Mostrar zona y margen de seguridad' }).uncheck();
  await page.getByRole('button', { name: 'Blanco', exact: true }).first().click();
  const samples = [];
  for (const color of ['blanco', 'negro', 'verde', 'rosa', 'hex']) {
    if (color === 'negro') {
      await page.getByRole('button', { name: 'Negro', exact: true }).first().click();
      await page.getByText('Negro', { exact: true }).waitFor();
      assert.equal(await page.getByText('Negro · #242724').count(), 0);
    }
    if (color === 'verde') {
      await page.getByRole('button', { name: 'Explorar colores' }).click();
      await page.getByRole('button', { name: 'Verde bosque #294D3A' }).click();
    }
    if (color === 'rosa') await page.getByRole('button', { name: 'Rosa pastel #EAC8CF' }).click();
    if (color === 'hex') {
      await page.getByRole('textbox', { name: 'Código HEX' }).fill('#526A87');
      await page.getByRole('button', { name: 'Aplicar' }).click();
      await page.getByText('Color personalizado', { exact: true }).waitFor();
    }
    samples.push(
      await page.locator('canvas').evaluate((canvas) => {
        const ctx = canvas.getContext('2d');
        const pixel = (x, y) => [...ctx.getImageData(x, y, 1, 1).data].slice(0, 3);
        return { body: pixel(400, 400), sleeve: pixel(180, 410), background: pixel(50, 400) };
      }),
    );
  }
  assert.equal(new Set(samples.map((sample) => sample.body.join(','))).size, 5);
  for (const sample of samples) assert.notDeepEqual(sample.body, sample.background);
  assert.notDeepEqual(samples[1].body, samples[1].sleeve);
  assert.notDeepEqual(samples[2].body, samples[2].sleeve);
});

await run('F WhatsApp y parámetros comerciales', async (page) => {
  await page.getByRole('button', { name: 'Sudadera personalizada' }).click();
  await page.getByRole('button', { name: '+ Agregar texto' }).click();
  await page.getByRole('button', { name: 'Espalda', exact: true }).click();
  await page.getByRole('button', { name: '+ Agregar texto' }).click();
  await page.getByRole('button', { name: 'Explorar colores' }).click();
  await page.getByRole('textbox', { name: 'Código HEX' }).fill('#627A43');
  await page.getByRole('button', { name: 'Aplicar' }).click();
  await page.getByRole('spinbutton', { name: 'Cantidad de piezas' }).fill('24');
  await page.getByRole('combobox', { name: 'Talla de referencia' }).selectOption('G');
  await page.getByRole('textbox', { name: 'Observaciones (opcional)' }).fill('Entrega en CDMX');
  const href = await page.getByRole('link', { name: /Cotizar por WhatsApp/ }).getAttribute('href');
  assert.ok(href?.includes('wa.me/525655745468'));
  const message = new URL(href).searchParams.get('text');
  for (const item of [
    'Sudadera personalizada',
    '#627A43',
    'Cantidad: 24',
    'Talla: G',
    'frente:',
    'espalda:',
    'Entrega en CDMX',
  ])
    assert.ok(message?.includes(item), item);
  assert.ok(!message?.includes('adjunté'));
});

await run('Responsive y accesibilidad 375, 390, 768, 1440', async (page) => {
  for (const width of [375, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 850 });
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
      `${width}px`,
    );
    const toggle = page.getByRole('button', { name: 'Ver sin guías' });
    const box = await toggle.boundingBox();
    assert.ok(box && box.width >= 42 && box.height >= 40);
    if (width === 390 || width === 1440) {
      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      assert.deepEqual(
        axe.violations.map((violation) => violation.id),
        [],
      );
    }
  }
  await page.getByRole('button', { name: 'Ver sin guías' }).focus();
  await page.keyboard.press('Enter');
  assert.equal(
    await page.getByRole('button', { name: 'Volver a editar' }).getAttribute('aria-pressed'),
    'true',
  );
});

await run('Estabilidad, recursos y fuentes iniciales', async (page) => {
  const loaded = await page.evaluate(
    () =>
      performance
        .getEntriesByType('resource')
        .filter((entry) => entry.name.includes('/fonts/studio/')).length,
  );
  assert.ok(loaded < 13, `Se cargaron ${loaded} familias inicialmente`);
  await page.getByRole('button', { name: 'Sudadera personalizada' }).click();
  await page.getByRole('button', { name: 'Tote bag personalizada' }).click();
  await page.getByRole('button', { name: 'Playera personalizada' }).click();
  assert.deepEqual(problems, []);
});

if (!process.env.TEST_FILTER || 'Táctil'.startsWith(process.env.TEST_FILTER)) {
  const mobile = await browser.newContext({
    baseURL,
    isMobile: true,
    hasTouch: true,
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await mobile.newPage();
  try {
    await page.goto('/personaliza');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: '+ Agregar texto' }).click();
    const slider = page.getByRole('slider', { name: /Horizontal/ });
    const before = Number(await slider.inputValue());
    const canvas = page.locator('canvas');
    await canvas.scrollIntoViewIfNeeded();
    const box = await canvas.boundingBox();
    assert.ok(box);
    const start = { x: box.x + box.width * 0.5, y: box.y + box.height * 0.505 };
    const end = { x: box.x + box.width * 0.535, y: start.y };
    const cdp = await mobile.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ ...start, id: 1 }],
    });
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ ...end, id: 1 }],
    });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    assert.ok(Number(await slider.inputValue()) > before);
    await page.getByRole('button', { name: 'Ver sin guías' }).click();
    assert.equal(await page.getByRole('button', { name: 'Volver a editar' }).count(), 1);
    results.push({ name: 'Táctil: arrastre de texto y vista limpia', status: 'APROBADO' });
  } catch (error) {
    results.push({
      name: 'Táctil: arrastre de texto y vista limpia',
      status: 'FALLÓ',
      reason: error?.stack ?? String(error),
    });
  } finally {
    await mobile.close();
  }
}

await browser.close();
const report = { baseURL, results, problems };
await writeFile(`${output}/tests.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (results.some((result) => result.status !== 'APROBADO') || problems.length) process.exitCode = 1;
