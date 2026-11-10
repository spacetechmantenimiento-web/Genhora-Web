import { drawHoodie } from './studio-hoodie';
import {
  fontOptions,
  fontSupportsBold,
  printArea,
  STUDIO_CANVAS_SIZE,
  type Artwork,
  type FontId,
  type Product,
  type Side,
} from './studio';

export const CANVAS_SIZE = STUDIO_CANVAS_SIZE;
export type Scene = {
  product: Product;
  color: string;
  side: Side;
  layers: Artwork[];
  selectedId?: string;
  guides?: boolean;
  alignGuides?: boolean;
  images: Map<string, HTMLImageElement>;
};

function path(ctx: CanvasRenderingContext2D, points: number[][], color: string) {
  ctx.beginPath();
  points.forEach(([x, y], index) => (index ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fillStyle = fabricFill(ctx, color);
  ctx.fill();
  ctx.strokeStyle = 'rgba(35,53,43,.24)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function fabricFill(ctx: CanvasRenderingContext2D, color: string) {
  const gradient = ctx.createLinearGradient(190, 190, 600, 680);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.24, shade(color, 0.08));
  gradient.addColorStop(0.52, color);
  gradient.addColorStop(0.88, shade(color, -0.09));
  gradient.addColorStop(1, shade(color, -0.13));
  return gradient;
}

function shade(hex: string, amount: number) {
  const channel = (offset: number) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16);
    return Math.round(value + (amount > 0 ? 255 - value : value) * amount)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${channel(1)}${channel(3)}${channel(5)}`;
}

function drawShirtBody(ctx: CanvasRenderingContext2D, color: string) {
  ctx.beginPath();
  ctx.moveTo(300, 180);
  ctx.bezierCurveTo(271, 184, 250, 198, 239, 209);
  ctx.lineTo(149, 277);
  ctx.quadraticCurveTo(140, 285, 147, 296);
  ctx.lineTo(198, 369);
  ctx.quadraticCurveTo(206, 380, 217, 373);
  ctx.lineTo(264, 336);
  ctx.bezierCurveTo(260, 436, 258, 558, 259, 657);
  ctx.quadraticCurveTo(259, 668, 270, 668);
  ctx.lineTo(530, 668);
  ctx.quadraticCurveTo(541, 668, 541, 657);
  ctx.bezierCurveTo(542, 558, 540, 436, 536, 336);
  ctx.lineTo(583, 373);
  ctx.quadraticCurveTo(594, 380, 602, 369);
  ctx.lineTo(653, 296);
  ctx.quadraticCurveTo(660, 285, 651, 277);
  ctx.lineTo(561, 209);
  ctx.bezierCurveTo(550, 198, 529, 184, 500, 180);
  ctx.lineTo(470, 197);
  ctx.lineTo(330, 197);
  ctx.closePath();
  ctx.fillStyle = fabricFill(ctx, color);
  ctx.fill();
  ctx.strokeStyle = 'rgba(35,53,43,.22)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawProduct(ctx: CanvasRenderingContext2D, product: Product, color: string, side: Side) {
  ctx.save();
  const seam = 'rgba(34,42,35,.25)';
  const fold = 'rgba(34,42,35,.11)';
  ctx.shadowColor = 'rgba(37,44,34,.18)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 17;
  if (product.id === 'tote') {
    // The straps sit behind the bag and are stitched into its upper edge.
    ctx.strokeStyle = seam;
    ctx.lineWidth = 35;
    ctx.beginPath();
    ctx.moveTo(305, 320);
    ctx.bezierCurveTo(298, 135, 501, 135, 495, 320);
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = 30;
    ctx.stroke();
    path(
      ctx,
      [
        [230, 294],
        [570, 294],
        [550, 674],
        [250, 674],
      ],
      color,
    );
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = seam;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(236, 319);
    ctx.lineTo(564, 319);
    ctx.moveTo(274, 326);
    ctx.lineTo(260, 658);
    ctx.moveTo(526, 326);
    ctx.lineTo(540, 658);
    ctx.stroke();
    ctx.strokeStyle = fold;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(252, 654);
    ctx.lineTo(548, 654);
    ctx.stroke();
    ctx.fillStyle = seam;
    for (const x of [305, 495]) {
      ctx.beginPath();
      ctx.arc(x, 326, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    if (side === 'espalda') {
      ctx.strokeStyle = fold;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(241, 332);
      ctx.quadraticCurveTo(400, 344, 559, 332);
      ctx.stroke();
    }
  } else if (product.id === 'playera') {
    drawShirtBody(ctx, color);
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = seam;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (side === 'frente') {
      ctx.moveTo(328, 191);
      ctx.bezierCurveTo(336, 255, 464, 255, 472, 191);
    } else {
      ctx.moveTo(328, 192);
      ctx.bezierCurveTo(345, 217, 455, 217, 472, 192);
    }
    ctx.stroke();
    ctx.strokeStyle = fold;
    ctx.beginPath();
    ctx.moveTo(150, 297);
    ctx.lineTo(201, 364);
    ctx.moveTo(650, 297);
    ctx.lineTo(599, 364);
    ctx.moveTo(266, 651);
    ctx.lineTo(534, 651);
    ctx.moveTo(267, 332);
    ctx.quadraticCurveTo(278, 252, 300, 180);
    ctx.moveTo(533, 332);
    ctx.quadraticCurveTo(522, 252, 500, 180);
    ctx.stroke();
    if (side === 'espalda') {
      ctx.beginPath();
      ctx.moveTo(354, 222);
      ctx.quadraticCurveTo(400, 237, 446, 222);
      ctx.stroke();
    }
  } else {
    ctx.shadowColor = 'transparent';
    drawHoodie(ctx, color, side);
  }
  ctx.restore();
}

const fontLoads = new Map<string, Promise<void>>();
export function ensureStudioFont(id: FontId, requestedWeight?: 400 | 700) {
  const option = fontOptions.find((item) => item.id === id) ?? fontOptions[0];
  const weight = requestedWeight ?? (id === 'bold' ? 700 : 400);
  const variable = id === 'sans' || id === 'bold' || id === 'serif';
  const actualWeight = fontSupportsBold(id) ? weight : 400;
  const key = variable ? option.family : `${id}-${actualWeight}`;
  const existing = fontLoads.get(key);
  if (existing) return existing;
  const file = option.file
    ? `/fonts/studio/${option.file}${actualWeight === 700 ? '-700' : ''}.woff2`
    : option.id === 'serif'
      ? '/fonts/cormorant-garamond-latin-variable.woff2'
      : '/fonts/manrope-latin-variable.woff2';
  const face = new FontFace(option.family, `url(${file})`, {
    weight: variable ? '400 700' : String(actualWeight),
  });
  const loading = face.load().then(
    () => {
      document.fonts.add(face);
    },
    (error) => {
      fontLoads.delete(key);
      throw error;
    },
  );
  fontLoads.set(key, loading);
  return loading;
}
function fontFamily(font: FontId) {
  const option = fontOptions.find((item) => item.id === font) ?? fontOptions[0];
  return `"${option.family}", ${option.category === 'Elegantes' ? 'serif' : 'sans-serif'}`;
}

export function layerDimensions(
  ctx: CanvasRenderingContext2D,
  layer: Artwork,
  product: Product,
  side: Side,
) {
  if (layer.kind === 'image') {
    const width = printArea(product, side).width * 0.6 * layer.scale;
    return { width, height: (width * layer.pixelHeight) / layer.pixelWidth };
  }
  const size = 42 * layer.scale;
  ctx.font = `${layer.weight ?? (layer.font === 'bold' ? 700 : 400)} ${size}px ${fontFamily(layer.font)}`;
  const lines = layer.text.split('\n').slice(0, 3);
  return {
    width: Math.max(1, ...lines.map((line) => ctx.measureText(line).width)),
    height: lines.length * size * 1.08,
  };
}

export function drawScene(ctx: CanvasRenderingContext2D, scene: Scene, clean = false) {
  const { product, color, side, layers, images } = scene;
  const area = printArea(product, side);
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.fillStyle = '#EEECE4';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.fillStyle = '#E4E0D4';
  ctx.beginPath();
  ctx.ellipse(400, 718, 255, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  drawProduct(ctx, product, color, side);
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.x, area.y, area.width, area.height);
  ctx.clip();
  for (const layer of layers) {
    const x = area.x + area.width * layer.x;
    const y = area.y + area.height * layer.y;
    const { width, height } = layerDimensions(ctx, layer, product, side);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((layer.angle * Math.PI) / 180);
    if (layer.kind === 'image') {
      const image = images.get(layer.src);
      if (image?.complete && image.naturalWidth)
        ctx.drawImage(image, -width / 2, -height / 2, width, height);
    } else {
      const size = 42 * layer.scale;
      ctx.fillStyle = layer.color;
      ctx.font = `${layer.weight ?? (layer.font === 'bold' ? 700 : 400)} ${size}px ${fontFamily(layer.font)}`;
      ctx.textAlign = layer.align ?? 'center';
      ctx.textBaseline = 'middle';
      const lines = layer.text.split('\n').slice(0, 3);
      const textX = layer.align === 'left' ? -width / 2 : layer.align === 'right' ? width / 2 : 0;
      lines.forEach((line, index) =>
        ctx.fillText(line, textX, (index - (lines.length - 1) / 2) * size * 1.08),
      );
    }
    if (!clean && scene.selectedId === layer.id) {
      ctx.strokeStyle = '#294D3A';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 5]);
      ctx.strokeRect(-width / 2 - 6, -height / 2 - 6, width + 12, height + 12);
    }
    ctx.restore();
  }
  ctx.restore();
  if (!clean && scene.guides) {
    ctx.strokeStyle = 'rgba(41,77,58,.42)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([7, 7]);
    ctx.strokeRect(area.x, area.y, area.width, area.height);
    ctx.setLineDash([3, 6]);
    ctx.strokeRect(area.x + 12, area.y + 12, area.width - 24, area.height - 24);
    ctx.setLineDash([]);
  }
  if (!clean && scene.alignGuides && scene.selectedId) {
    const active = layers.find((layer) => layer.id === scene.selectedId);
    if (active) {
      ctx.strokeStyle = 'rgba(41,77,58,.55)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 7]);
      ctx.beginPath();
      if (Math.abs(active.x - 0.5) < 0.025) {
        ctx.moveTo(area.x + area.width / 2, area.y);
        ctx.lineTo(area.x + area.width / 2, area.y + area.height);
      }
      if (Math.abs(active.y - 0.5) < 0.025) {
        ctx.moveTo(area.x, area.y + area.height / 2);
        ctx.lineTo(area.x + area.width, area.y + area.height / 2);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}

export function hitLayer(ctx: CanvasRenderingContext2D, scene: Scene, x: number, y: number) {
  const area = printArea(scene.product, scene.side);
  for (const layer of [...scene.layers].reverse()) {
    const centerX = area.x + area.width * layer.x;
    const centerY = area.y + area.height * layer.y;
    const { width, height } = layerDimensions(ctx, layer, scene.product, scene.side);
    const angle = (-layer.angle * Math.PI) / 180;
    const dx = x - centerX,
      dy = y - centerY;
    const localX = dx * Math.cos(angle) - dy * Math.sin(angle);
    const localY = dx * Math.sin(angle) + dy * Math.cos(angle);
    if (Math.abs(localX) <= width / 2 + 12 && Math.abs(localY) <= height / 2 + 12) return layer.id;
  }
  return null;
}

export function layerOutside(
  ctx: CanvasRenderingContext2D,
  layer: Artwork,
  product: Product,
  side: Side,
) {
  const { width, height } = layerDimensions(ctx, layer, product, side);
  const a = printArea(product, side);
  const rotatedWidth =
    Math.abs(width * Math.cos((layer.angle * Math.PI) / 180)) +
    Math.abs(height * Math.sin((layer.angle * Math.PI) / 180));
  const rotatedHeight =
    Math.abs(width * Math.sin((layer.angle * Math.PI) / 180)) +
    Math.abs(height * Math.cos((layer.angle * Math.PI) / 180));
  return (
    layer.x * a.width - rotatedWidth / 2 < 0 ||
    layer.x * a.width + rotatedWidth / 2 > a.width ||
    layer.y * a.height - rotatedHeight / 2 < 0 ||
    layer.y * a.height + rotatedHeight / 2 > a.height
  );
}

export function constrainLayer(
  ctx: CanvasRenderingContext2D,
  layer: Artwork,
  product: Product,
  side: Side,
): Artwork {
  const area = printArea(product, side);
  const dimensions = layerDimensions(ctx, layer, product, side);
  const radians = (layer.angle * Math.PI) / 180;
  const rotatedWidth =
    Math.abs(dimensions.width * Math.cos(radians)) +
    Math.abs(dimensions.height * Math.sin(radians));
  const rotatedHeight =
    Math.abs(dimensions.width * Math.sin(radians)) +
    Math.abs(dimensions.height * Math.cos(radians));
  const scaleFactor = Math.min(
    1,
    (area.width - 12) / rotatedWidth,
    (area.height - 12) / rotatedHeight,
  );
  const fitted =
    scaleFactor < 1 ? { ...layer, scale: Math.max(0.02, layer.scale * scaleFactor) } : layer;
  const { width, height } = layerDimensions(ctx, fitted, product, side);
  const halfX =
    (Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians))) / (2 * area.width);
  const halfY =
    (Math.abs(width * Math.sin(radians)) + Math.abs(height * Math.cos(radians))) /
    (2 * area.height);
  const limit = (value: number, half: number) =>
    half >= 0.5 ? 0.5 : Math.min(1 - half, Math.max(half, value));
  return { ...fitted, x: limit(fitted.x, halfX), y: limit(fitted.y, halfY) };
}

export function fitLayerToArea(
  ctx: CanvasRenderingContext2D,
  layer: Artwork,
  product: Product,
  side: Side,
): Artwork {
  const area = printArea(product, side);
  const { width, height } = layerDimensions(ctx, layer, product, side);
  const angle = (layer.angle * Math.PI) / 180;
  const rotatedWidth = Math.abs(width * Math.cos(angle)) + Math.abs(height * Math.sin(angle));
  const rotatedHeight = Math.abs(width * Math.sin(angle)) + Math.abs(height * Math.cos(angle));
  if (!rotatedWidth || !rotatedHeight) return layer;
  const factor = Math.min((area.width - 24) / rotatedWidth, (area.height - 24) / rotatedHeight);
  const fitted = { ...layer, scale: Math.min(2, Math.max(0.02, layer.scale * factor)) };
  return constrainLayer(ctx, fitted, product, side);
}
