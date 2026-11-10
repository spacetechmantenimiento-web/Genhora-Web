export type ProductId = 'playera' | 'sudadera' | 'tote';
export type Side = 'frente' | 'espalda';
export type FontId = 'sans' | 'serif' | 'script' | 'bold';
export type Artwork =
  | {
      id: string;
      kind: 'text';
      x: number;
      y: number;
      scale: number;
      angle: number;
      text: string;
      color: string;
      font: FontId;
    }
  | {
      id: string;
      kind: 'image';
      x: number;
      y: number;
      scale: number;
      angle: number;
      src: string;
      name: string;
      pixelWidth: number;
      pixelHeight: number;
    };
export type Design = { color: string; side: Side; layers: Record<Side, Artwork[]> };
export type Designs = Record<ProductId, Design>;
export type Color = { name: string; value: string };
export type Product = {
  id: ProductId;
  name: string;
  description: string;
  colors: Color[];
  sides: Side[];
  area: { x: number; y: number; width: number; height: number };
  sizes?: string[];
  available: boolean;
};

// Provisional visual references; confirm production colors, print dimensions and stock before sale.
export const studioProducts: Product[] = [
  {
    id: 'playera',
    name: 'Playera personalizada',
    description: 'Un lienzo para llevar tus ideas.',
    colors: [
      { name: 'Blanco', value: '#F7F4EC' },
      { name: 'Negro', value: '#242724' },
      { name: 'Beige', value: '#D8C8AD' },
      { name: 'Verde salvia', value: '#A7BCAA' },
    ],
    sides: ['frente', 'espalda'],
    area: { x: 286, y: 270, width: 228, height: 267 },
    sizes: ['CH', 'M', 'G', 'EG'],
    available: true,
  },
  {
    id: 'sudadera',
    name: 'Sudadera personalizada',
    description: 'Una pieza cálida con identidad.',
    colors: [
      { name: 'Marfil', value: '#EDE9DA' },
      { name: 'Negro', value: '#242724' },
      { name: 'Verde bosque', value: '#294D3A' },
      { name: 'Gris', value: '#A9ACA7' },
    ],
    sides: ['frente', 'espalda'],
    area: { x: 292, y: 316, width: 216, height: 225 },
    sizes: ['CH', 'M', 'G', 'EG'],
    available: true,
  },
  {
    id: 'tote',
    name: 'Tote bag personalizada',
    description: 'Tu diseño para todos los días.',
    colors: [
      { name: 'Natural', value: '#E9DDC8' },
      { name: 'Negro', value: '#242724' },
      { name: 'Verde salvia', value: '#A7BCAA' },
    ],
    sides: ['frente'],
    area: { x: 281, y: 327, width: 238, height: 267 },
    available: true,
  },
];

export const initialDesigns: Designs = {
  playera: { color: 'Blanco', side: 'frente', layers: { frente: [], espalda: [] } },
  sudadera: { color: 'Marfil', side: 'frente', layers: { frente: [], espalda: [] } },
  tote: { color: 'Natural', side: 'frente', layers: { frente: [], espalda: [] } },
};
export const fontOptions: { id: FontId; name: string }[] = [
  { id: 'sans', name: 'Moderna' },
  { id: 'serif', name: 'Editorial' },
  { id: 'script', name: 'Manuscrita' },
  { id: 'bold', name: 'Gráfica' },
];
export const motifs = [
  { name: 'Monograma', text: 'A · B', font: 'serif' as FontId },
  { name: 'Floral', text: '✿', font: 'serif' as FontId },
  { name: 'Geométrico', text: '◇', font: 'sans' as FontId },
  { name: 'Frase', text: 'hazlo tuyo', font: 'script' as FontId },
  { name: 'Destello', text: '✦', font: 'serif' as FontId },
];
