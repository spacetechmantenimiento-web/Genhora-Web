import type { Side } from './studio';

// Product artwork stays in the same 800 × 800 coordinate space as the print areas.
// Paths are shared by the editor and PNG export; color is applied only to the garment.
const shapeData = {
  body: 'M297 219 C269 211 244 226 225 247 C187 291 153 378 134 486 C129 507 135 518 151 527 L173 538 C188 543 198 534 204 521 C225 476 247 408 263 356 C267 440 259 573 255 663 C254 680 265 689 281 690 C360 695 446 694 519 690 C535 689 546 681 545 664 C541 570 535 437 537 357 C554 409 577 475 597 521 C603 535 615 542 628 537 L650 526 C665 517 671 505 666 485 C646 376 616 293 575 246 C556 224 530 211 501 219 C466 230 434 241 400 242 C365 241 332 230 297 219 Z',
  frontHood:
    'M306 222 C313 187 337 165 365 156 C388 149 413 151 436 160 C465 174 485 195 493 222 C485 243 473 259 453 268 C436 274 418 267 400 263 C382 267 364 274 347 268 C327 259 314 243 306 222 Z',
  backHood:
    'M306 222 C313 186 334 165 366 156 C390 149 416 151 439 160 C469 176 487 197 493 223 C486 249 477 271 464 284 C442 298 422 303 399 305 C375 304 353 298 335 284 C322 266 313 246 306 222 Z',
  neckOpening:
    'M353 224 C369 239 382 246 400 246 C418 246 431 239 447 224 C440 249 424 261 400 263 C376 261 360 249 353 224 Z',
  leftCuff:
    'M135 495 C154 506 175 519 199 521 L191 535 C183 543 169 539 151 531 C138 524 132 515 135 495 Z',
  rightCuff:
    'M665 495 C646 506 625 519 601 521 L609 535 C617 543 631 539 649 531 C662 524 668 515 665 495 Z',
  hem: 'M257 642 C348 650 452 650 543 642 L544 670 C544 682 534 690 519 690 L281 690 C266 690 256 682 256 670 Z',
  pocket:
    'M332 548 C365 552 432 552 468 548 C478 566 489 591 495 618 C442 625 362 627 305 618 C310 590 320 566 332 548 Z',
} as const;
let paths: { [Key in keyof typeof shapeData]: Path2D } | undefined;
function hoodiePaths() {
  paths ??= Object.fromEntries(
    Object.entries(shapeData).map(([name, data]) => [name, new Path2D(data)]),
  ) as { [Key in keyof typeof shapeData]: Path2D };
  return paths;
}

function mix(hex: string, target: number, proportion: number) {
  const values = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
  return `#${values
    .map((value) =>
      Math.round(value + (target - value) * proportion)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}

function isDark(hex: string) {
  const [r, g, b] = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
  return r * 0.299 + g * 0.587 + b * 0.114 < 110;
}

function clothGradient(ctx: CanvasRenderingContext2D, color: string, top: number, bottom: number) {
  const gradient = ctx.createLinearGradient(260, top, 558, bottom);
  gradient.addColorStop(0, mix(color, 255, 0.17));
  gradient.addColorStop(0.22, mix(color, 255, 0.07));
  gradient.addColorStop(0.51, color);
  gradient.addColorStop(0.78, mix(color, 0, 0.08));
  gradient.addColorStop(1, mix(color, 0, 0.16));
  return gradient;
}

function stroke(ctx: CanvasRenderingContext2D, path: Path2D, color: string, width = 2) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke(path);
}

let fabricTile: HTMLCanvasElement | undefined;
function fabricTexture(ctx: CanvasRenderingContext2D, dark: boolean, body: Path2D) {
  if (!fabricTile) {
    const tile = document.createElement('canvas');
    tile.width = 48;
    tile.height = 48;
    const texture = tile.getContext('2d');
    if (!texture) return;
    // A fixed pattern avoids changing the fabric on every editor redraw.
    for (let index = 0; index < 90; index++) {
      const x = (index * 29 + index * index * 3) % 48;
      const y = (index * 17 + index * index * 7) % 48;
      texture.fillStyle = index % 2 ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.12)';
      texture.fillRect(x, y, 1, 1);
    }
    fabricTile = tile;
  }
  const pattern = ctx.createPattern(fabricTile, 'repeat');
  if (!pattern) return;
  ctx.save();
  ctx.clip(body);
  ctx.globalAlpha = dark ? 0.2 : 0.14;
  ctx.fillStyle = pattern;
  ctx.fillRect(120, 210, 560, 490);
  ctx.restore();
}

export function drawHoodie(ctx: CanvasRenderingContext2D, color: string, side: Side) {
  ctx.save();
  const { body, frontHood, backHood, neckOpening, leftCuff, rightCuff, hem, pocket } =
    hoodiePaths();
  const dark = isDark(color);
  const seam = dark ? 'rgba(235,245,236,.34)' : 'rgba(62,70,62,.27)';
  const fine = dark ? 'rgba(238,248,239,.19)' : 'rgba(62,70,62,.15)';
  const fold = dark ? 'rgba(235,245,236,.11)' : 'rgba(54,61,53,.1)';
  const cord = dark ? mix(color, 255, 0.58) : mix(color, 0, 0.38);

  // Soft, connected hood shadow appears behind the shoulders.
  ctx.fillStyle = mix(color, 0, dark ? 0.13 : 0.17);
  ctx.fill(side === 'frente' ? frontHood : backHood);

  ctx.shadowColor = 'rgba(25,30,24,.2)';
  ctx.shadowBlur = 25;
  ctx.shadowOffsetY = 15;
  ctx.fillStyle = clothGradient(ctx, color, 180, 720);
  ctx.fill(body);
  ctx.shadowColor = 'transparent';
  stroke(ctx, body, seam, 1.8);

  // Broad light and shadow across the arms and torso give the fabric volume.
  ctx.save();
  ctx.clip(body);
  let light = ctx.createRadialGradient(344, 282, 15, 365, 324, 320);
  light.addColorStop(0, dark ? 'rgba(255,255,255,.16)' : 'rgba(255,255,255,.29)');
  light.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = light;
  ctx.fillRect(120, 210, 560, 480);
  light = ctx.createRadialGradient(545, 520, 25, 530, 520, 300);
  light.addColorStop(0, dark ? 'rgba(0,0,0,.24)' : 'rgba(0,0,0,.13)');
  light.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = light;
  ctx.fillRect(120, 210, 560, 480);
  ctx.restore();
  fabricTexture(ctx, dark, body);

  // Shoulder construction and sleeve drape. The back has its own yoke seams.
  ctx.strokeStyle = fine;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(301, 220);
  ctx.bezierCurveTo(280, 253, 269, 300, 260, 359);
  ctx.moveTo(499, 220);
  ctx.bezierCurveTo(520, 253, 531, 300, 540, 359);
  ctx.stroke();
  ctx.strokeStyle = fold;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(185, 332);
  ctx.bezierCurveTo(183, 385, 167, 445, 151, 478);
  ctx.moveTo(615, 332);
  ctx.bezierCurveTo(617, 385, 633, 445, 649, 478);
  ctx.moveTo(269, 386);
  ctx.bezierCurveTo(279, 472, 273, 585, 265, 631);
  ctx.moveTo(531, 386);
  ctx.bezierCurveTo(521, 472, 527, 585, 535, 631);
  ctx.stroke();
  ctx.strokeStyle = fine;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(153, 463);
  ctx.quadraticCurveTo(169, 445, 177, 419);
  ctx.moveTo(639, 466);
  ctx.quadraticCurveTo(626, 449, 619, 425);
  ctx.stroke();
  if (side === 'espalda') {
    ctx.strokeStyle = fine;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(290, 259);
    ctx.quadraticCurveTo(399, 307, 510, 259);
    ctx.stroke();
  }

  // Ribbed cuffs and hem are sewn to the same fabric rather than outlined bands.
  const rib = clothGradient(ctx, mix(color, 0, dark ? 0.09 : 0.07), 485, 700);
  ctx.fillStyle = rib;
  ctx.fill(leftCuff);
  ctx.fill(rightCuff);
  ctx.fill(hem);
  stroke(ctx, leftCuff, seam, 1.7);
  stroke(ctx, rightCuff, seam, 1.7);
  stroke(ctx, hem, seam, 1.6);
  ctx.strokeStyle = fine;
  ctx.lineWidth = 1;
  for (let x = 271; x <= 529; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 653);
    ctx.lineTo(x, 681);
    ctx.stroke();
  }
  for (let index = 0; index < 4; index++) {
    ctx.beginPath();
    ctx.moveTo(143 + index * 9, 507 + index * 4);
    ctx.lineTo(139 + index * 9, 520 + index * 4);
    ctx.moveTo(657 - index * 9, 507 + index * 4);
    ctx.lineTo(661 - index * 9, 520 + index * 4);
    ctx.stroke();
  }

  if (side === 'frente') {
    // The kangaroo pocket follows the drape of the torso, with recessed hand openings.
    ctx.save();
    ctx.shadowColor = 'rgba(24,27,23,.035)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 1;
    const pouch = ctx.createLinearGradient(320, 548, 484, 627);
    pouch.addColorStop(0, color);
    pouch.addColorStop(0.55, color);
    pouch.addColorStop(1, mix(color, 0, 0.025));
    ctx.fillStyle = pouch;
    ctx.fill(pocket);
    ctx.restore();
    ctx.strokeStyle = fine;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(332, 549);
    ctx.quadraticCurveTo(400, 558, 468, 549);
    ctx.moveTo(306, 618);
    ctx.quadraticCurveTo(400, 633, 494, 618);
    ctx.stroke();
    ctx.strokeStyle = seam;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(333, 553);
    ctx.quadraticCurveTo(341, 580, 354, 597);
    ctx.moveTo(467, 553);
    ctx.quadraticCurveTo(459, 580, 446, 597);
    ctx.stroke();
    ctx.strokeStyle = fold;
    ctx.beginPath();
    ctx.moveTo(337, 555);
    ctx.quadraticCurveTo(400, 564, 463, 555);
    ctx.stroke();
  }

  // The front hood has a fabric opening and cords; the back has a continuous panel.
  const hood = side === 'frente' ? frontHood : backHood;
  ctx.fillStyle = clothGradient(ctx, color, 125, 300);
  ctx.fill(hood);
  stroke(ctx, hood, seam, 2);
  if (side === 'frente') {
    ctx.fillStyle = mix(color, 0, dark ? 0.22 : 0.23);
    ctx.fill(neckOpening);
    stroke(ctx, neckOpening, fine, 1.2);
    ctx.strokeStyle = fine;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(327, 226);
    ctx.bezierCurveTo(341, 249, 359, 263, 378, 267);
    ctx.moveTo(473, 226);
    ctx.bezierCurveTo(459, 249, 441, 263, 422, 267);
    ctx.stroke();
    ctx.strokeStyle = cord;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(382, 264);
    ctx.quadraticCurveTo(380, 287, 378, 319);
    ctx.moveTo(418, 264);
    ctx.quadraticCurveTo(420, 287, 422, 319);
    ctx.stroke();
    ctx.fillStyle = cord;
    ctx.fillRect(376, 316, 4, 6);
    ctx.fillRect(420, 316, 4, 6);
  } else {
    ctx.strokeStyle = fine;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(399, 149);
    ctx.bezierCurveTo(405, 184, 410, 228, 400, 276);
    ctx.stroke();
    ctx.strokeStyle = fold;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(409, 165);
    ctx.bezierCurveTo(420, 205, 412, 249, 405, 278);
    ctx.stroke();
    ctx.strokeStyle = fine;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(339, 278);
    ctx.quadraticCurveTo(400, 302, 461, 278);
    ctx.stroke();
  }
  ctx.restore();
}
