import { chromium } from '@playwright/test';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const asset = async (path, mime) =>
  `data:${mime};base64,${(await readFile(new URL(path, import.meta.url))).toString('base64')}`;

const [wordmark, photo, serif, serifItalic] = await Promise.all([
  asset('../public/brand/wordmark.svg', 'image/svg+xml'),
  asset('../public/images/hero-personalized-02.webp', 'image/webp'),
  asset('../public/fonts/cormorant-garamond-latin-variable.woff2', 'font/woff2'),
  asset('../public/fonts/cormorant-garamond-italic-latin-variable.woff2', 'font/woff2'),
]);

const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <style>
    @font-face { font-family: Cormorant; src: url('${serif}'); font-weight: 300 700; }
    @font-face { font-family: Cormorant; src: url('${serifItalic}'); font-weight: 300 700; font-style: italic; }
    * { box-sizing: border-box; }
    body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: #F9F7F0; color: #294D3A; }
    .card { position: relative; width: 1200px; height: 630px; }
    .brand { position: absolute; left: 66px; top: 43px; width: 268px; height: 90px; object-fit: contain; object-position: left center; }
    .rule { position: absolute; left: 70px; top: 153px; width: 55px; height: 1px; background: #ADC8B3; }
    .tagline { position: absolute; left: 70px; top: 165px; margin: 0; font: italic 500 32px/1 Cormorant, serif; }
    h1 { position: absolute; left: 68px; top: 248px; width: 670px; margin: 0; font: 500 73px/.97 Cormorant, serif; letter-spacing: -.042em; }
    h1 span { display: block; white-space: nowrap; }
    h1 em { font-weight: 400; }
    .photo-frame { position: absolute; left: 750px; top: 39px; width: 406px; height: 552px; overflow: hidden; border-radius: 205px 205px 0 0; background: #ADC8B3; }
    .photo-frame img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center 50%; }
    .photo-line { position: absolute; left: 750px; top: 607px; width: 406px; height: 1px; background: #ADC8B3; }
  </style>
</head>
<body>
  <main class="card">
    <img class="brand" src="${wordmark}" alt="GENHORA">
    <div class="rule"></div>
    <p class="tagline">Es hora de crear.</p>
    <h1><span>Tu idea,</span><span>nuestro próximo</span><span><em>gran diseño.</em></span></h1>
    <div class="photo-frame"><img src="${photo}" alt="Tote bag, sudadera y taza personalizadas"></div>
    <div class="photo-line"></div>
  </main>
</body>
</html>`;

const macChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({
  executablePath: process.env.CHROME_EXECUTABLE || (existsSync(macChrome) ? macChrome : undefined),
  headless: true,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(html);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode()));
  });
  await page.screenshot({ path: new URL('../public/og-image.png', import.meta.url).pathname });
} finally {
  await browser.close();
}
