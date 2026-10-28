import { writeFileSync } from 'node:fs';
// Original Bézier lettering: g / e / n / h / o / r / a. Not converted from a typeface.
const paths = [
  'M 13 64 C 27 42 54 39 58 52 C 61 66 37 83 26 79 C 13 72 35 49 57 49 C 54 65 49 91 37 107 C 25 123 12 112 21 101 C 33 87 61 82 79 65',
  'M 73 66 C 97 68 109 44 95 45 C 80 46 69 73 83 79 C 94 83 111 72 121 61',
  'M 123 47 L 114 79 C 125 57 143 41 147 49 C 151 55 133 77 144 80 C 153 82 165 66 173 55',
  'M 169 76 C 179 46 198 6 205 13 C 215 23 180 62 172 67 C 185 52 199 43 200 52 C 201 61 186 79 197 80 C 205 80 213 70 220 61',
  'M 239 47 C 220 40 207 70 218 78 C 231 88 250 61 244 49 C 240 42 232 51 241 56 C 248 61 256 55 263 48',
  'M 263 48 L 254 79 C 264 57 274 45 281 48 C 287 51 279 59 277 61 C 281 65 290 60 298 53',
  'M 325 51 C 311 37 287 62 294 75 C 302 88 324 60 325 50 C 321 61 313 77 323 80 C 334 83 351 68 361 62',
];
const strokes = `<g fill="none" stroke="COLOR" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">${paths.map((d) => `<path d="${d}"/>`).join('')}</g>`;
function svg(content, viewBox = '0 0 378 126') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="genhora"><title>genhora — Es hora de crear.</title>${content}</svg>`;
}
for (const [file, color] of [
  ['wordmark', '#294D3A'],
  ['wordmark-monochrome', '#111111'],
  ['wordmark-ivory', '#F9F7F0'],
])
  writeFileSync(`public/brand/${file}.svg`, svg(strokes.replaceAll('COLOR', color)));
writeFileSync(
  'public/brand/wordmark-compact.svg',
  svg(
    strokes
      .replaceAll('COLOR', '#294D3A')
      .replace('stroke-width="3.2"', 'stroke-width="3.7"')
      .replace('351 68 361 62', '341 73 346 69'),
    '10 8 341 112',
  ),
);
writeFileSync(
  'public/brand/wordmark-forest.svg',
  svg(
    '<rect width="428" height="176" fill="#294D3A"/><g transform="translate(25 25)">' +
      strokes.replaceAll('COLOR', '#F9F7F0') +
      '</g>',
    '0 0 428 176',
  ),
);
writeFileSync(
  'public/brand/wordmark-tagline.svg',
  svg(
    strokes.replaceAll('COLOR', '#294D3A') +
      '<text x="189" y="151" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" letter-spacing="2.3" fill="#294D3A">Es hora de crear.</text>',
    '0 0 378 173',
  ),
);
const symbol =
  '<path d="M47 18C27 8 13 25 17 42C21 59 45 58 51 41L37 41M51 41L55 28" fill="none" stroke="COLOR" stroke-width="3.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="52" cy="17" r="2.6" fill="COLOR"/>';
writeFileSync('public/brand/isotype.svg', svg(symbol.replaceAll('COLOR', '#294D3A'), '0 0 72 72'));
writeFileSync(
  'src/app/icon.svg',
  svg(
    '<rect width="72" height="72" rx="16" fill="#294D3A"/>' + symbol.replaceAll('COLOR', '#F9F7F0'),
    '0 0 72 72',
  ),
);
writeFileSync(
  'public/brand/favicon.svg',
  svg(
    '<rect width="72" height="72" rx="16" fill="#294D3A"/>' + symbol.replaceAll('COLOR', '#F9F7F0'),
    '0 0 72 72',
  ),
);
