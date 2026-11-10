import type { Artwork, Product, Side } from './studio';

export const CANVAS_SIZE = 800;
export type Scene = {
  product: Product;
  color: string;
  side: Side;
  layers: Artwork[];
  selectedId?: string;
  guides?: boolean;
  images: Map<string, HTMLImageElement>;
};

function path(ctx: CanvasRenderingContext2D, points: number[][], color: string) {
  ctx.beginPath();
  points.forEach(([x, y], index) => (index ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = 'rgba(35,53,43,.24)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawProduct(ctx: CanvasRenderingContext2D, product: Product, color: string, side: Side) {
  ctx.save();
  ctx.shadowColor = 'rgba(37,44,34,.14)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 21;
  if (product.id === 'tote') {
    ctx.strokeStyle = color;
    ctx.lineWidth = 27;
    ctx.beginPath();
    ctx.moveTo(307, 300);
    ctx.bezierCurveTo(305, 110, 495, 110, 493, 300);
    ctx.stroke();
    path(
      ctx,
      [
        [232, 287],
        [568, 287],
        [550, 670],
        [250, 670],
      ],
      color,
    );
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(45,55,44,.13)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(263, 310);
    ctx.lineTo(537, 310);
    ctx.stroke();
  } else if (product.id === 'playera') {
    path(
      ctx,
      [
        [300, 177],
        [245, 197],
        [149, 285],
        [214, 370],
        [267, 332],
        [260, 665],
        [540, 665],
        [533, 332],
        [586, 370],
        [651, 285],
        [555, 197],
        [500, 177],
        [470, 195],
        [330, 195],
      ],
      color,
    );
    ctx.shadowColor = 'transparent';
    ctx.beginPath();
    ctx.ellipse(400, 193, 72, 32, 0, 0, Math.PI);
    ctx.strokeStyle = 'rgba(43,52,43,.34)';
    ctx.lineWidth = 3;
    ctx.stroke();
  } else {
    path(
      ctx,
      [
        [292, 200],
        [240, 222],
        [145, 335],
        [203, 397],
        [258, 354],
        [255, 679],
        [545, 679],
        [542, 354],
        [597, 397],
        [655, 335],
        [560, 222],
        [508, 200],
        [474, 223],
        [326, 223],
      ],
      color,
    );
    ctx.shadowColor = 'transparent';
    ctx.beginPath();
    ctx.moveTo(328, 219);
    ctx.bezierCurveTo(305, 110, 495, 110, 472, 219);
    ctx.bezierCurveTo(455, 245, 345, 245, 328, 219);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(43,52,43,.28)';
    ctx.lineWidth = 3;
    ctx.stroke();
    if (side === 'frente') {
      ctx.strokeStyle = 'rgba(43,52,43,.22)';
      ctx.lineWidth = 2;
      ctx.strokeRect(308, 552, 184, 79);
    }
  }
  ctx.restore();
}

function fontFamily(font: string) {
  const html = getComputedStyle(document.documentElement);
  const sans = html.getPropertyValue('--font-manrope').trim() || 'Arial';
  const serif = html.getPropertyValue('--font-cormorant').trim() || 'Georgia';
  if (font === 'sans') return sans;
  if (font === 'bold') return sans;
  if (font === 'script') return 'cursive';
  return serif;
}

export function layerDimensions(ctx: CanvasRenderingContext2D, layer: Artwork, product: Product) {
  if (layer.kind === 'image') {
    const width = product.area.width * 0.6 * layer.scale;
    return { width, height: (width * layer.pixelHeight) / layer.pixelWidth };
  }
  const size = 42 * layer.scale;
  ctx.font = `${layer.font === 'bold' ? '700' : '400'} ${size}px ${fontFamily(layer.font)}`;
  const lines = layer.text.split('\n').slice(0, 3);
  return {
    width: Math.max(1, ...lines.map((line) => ctx.measureText(line).width)),
    height: lines.length * size * 1.08,
  };
}

export function drawScene(ctx: CanvasRenderingContext2D, scene: Scene, clean = false) {
  const { product, color, side, layers, images } = scene;
  const area = product.area;
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
    const { width, height } = layerDimensions(ctx, layer, product);
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
      ctx.font = `${layer.font === 'bold' ? '700' : '400'} ${size}px ${fontFamily(layer.font)}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const lines = layer.text.split('\n').slice(0, 3);
      lines.forEach((line, index) =>
        ctx.fillText(line, 0, (index - (lines.length - 1) / 2) * size * 1.08),
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
    ctx.strokeStyle = 'rgba(41,77,58,.68)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(area.x, area.y, area.width, area.height);
    ctx.setLineDash([3, 5]);
    ctx.strokeRect(area.x + 12, area.y + 12, area.width - 24, area.height - 24);
    ctx.setLineDash([]);
  }
}

export function hitLayer(ctx: CanvasRenderingContext2D, scene: Scene, x: number, y: number) {
  const { area } = scene.product;
  for (const layer of [...scene.layers].reverse()) {
    const centerX = area.x + area.width * layer.x;
    const centerY = area.y + area.height * layer.y;
    const { width, height } = layerDimensions(ctx, layer, scene.product);
    const angle = (-layer.angle * Math.PI) / 180;
    const dx = x - centerX,
      dy = y - centerY;
    const localX = dx * Math.cos(angle) - dy * Math.sin(angle);
    const localY = dx * Math.sin(angle) + dy * Math.cos(angle);
    if (Math.abs(localX) <= width / 2 + 12 && Math.abs(localY) <= height / 2 + 12) return layer.id;
  }
  return null;
}

export function layerOutside(ctx: CanvasRenderingContext2D, layer: Artwork, product: Product) {
  const { width, height } = layerDimensions(ctx, layer, product);
  const a = product.area;
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
