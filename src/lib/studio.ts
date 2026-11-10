export type ProductId = 'playera' | 'sudadera' | 'tote';
export type Side = 'frente' | 'espalda';
export const STUDIO_CANVAS_SIZE = 800;
export type FontId =
  | 'sans'
  | 'serif'
  | 'script'
  | 'bold'
  | 'montserrat'
  | 'poppins'
  | 'playfair'
  | 'dmserif'
  | 'bebas'
  | 'oswald'
  | 'caveat'
  | 'pacifico'
  | 'abril'
  | 'inter'
  | 'archivo'
  | 'greatvibes';
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
      weight?: 400 | 700;
      align?: 'left' | 'center' | 'right';
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
export const studioColors: Color[] = [
  ['Blanco', '#F7F4EC'],
  ['Negro', '#242724'],
  ['Marfil', '#EDE9DA'],
  ['Beige', '#D8C8AD'],
  ['Gris claro', '#C9CCC9'],
  ['Gris oscuro', '#565B59'],
  ['Verde bosque', '#294D3A'],
  ['Verde salvia', '#A7BCAA'],
  ['Verde oliva', '#777E57'],
  ['Verde menta', '#DCEADB'],
  ['Azul cielo', '#A8C9D8'],
  ['Azul marino', '#22364E'],
  ['Azul petróleo', '#2D6470'],
  ['Rosa pastel', '#EAC8CF'],
  ['Rosa intenso', '#D9678C'],
  ['Lavanda', '#C7B8DA'],
  ['Morado', '#6E4C7A'],
  ['Rojo', '#B34342'],
  ['Burdeos', '#6D2E3E'],
  ['Terracota', '#B86B52'],
  ['Naranja', '#DF8B45'],
  ['Amarillo', '#E8CB68'],
  ['Mostaza', '#BA9145'],
  ['Café', '#76543F'],
  ['Natural', '#E9DDC8'],
].map(([name, value]) => ({ name, value }));
export const colorHex = (selection: string) =>
  selection.startsWith('#')
    ? selection.toUpperCase()
    : (studioColors.find((color) => color.name === selection)?.value ?? '#F7F4EC');
export const colorName = (selection: string) =>
  selection.startsWith('#') ? 'Personalizado' : selection;
export type Product = {
  id: ProductId;
  name: string;
  description: string;
  colors: Color[];
  sides: Side[];
  // Fractions of the 800 × 800 preview canvas, independently defined for each side.
  area: { x: number; y: number; width: number; height: number };
  backArea?: { x: number; y: number; width: number; height: number };
  sizes?: string[];
  available: boolean;
};
export function printArea(product: Product, side: Side) {
  const area = side === 'espalda' ? (product.backArea ?? product.area) : product.area;
  return {
    x: area.x * STUDIO_CANVAS_SIZE,
    y: area.y * STUDIO_CANVAS_SIZE,
    width: area.width * STUDIO_CANVAS_SIZE,
    height: area.height * STUDIO_CANVAS_SIZE,
  };
}

// Provisional visual references; confirm production colors, print dimensions and stock before sale.
export const studioProducts: Product[] = [
  {
    id: 'playera',
    name: 'Playera personalizada',
    description: 'Un lienzo para llevar tus ideas.',
    colors: studioColors,
    sides: ['frente', 'espalda'],
    area: { x: 0.3575, y: 0.3375, width: 0.285, height: 0.33375 },
    backArea: { x: 0.36375, y: 0.34375, width: 0.2725, height: 0.3275 },
    sizes: ['CH', 'M', 'G', 'EG'],
    available: true,
  },
  {
    id: 'sudadera',
    name: 'Sudadera personalizada',
    description: 'Una pieza cálida con identidad.',
    colors: studioColors,
    sides: ['frente', 'espalda'],
    area: { x: 0.37625, y: 0.4075, width: 0.2475, height: 0.2575 },
    backArea: { x: 0.37125, y: 0.41375, width: 0.2575, height: 0.29 },
    sizes: ['CH', 'M', 'G', 'EG'],
    available: true,
  },
  {
    id: 'tote',
    name: 'Tote bag personalizada',
    description: 'Tu diseño para todos los días.',
    colors: studioColors,
    sides: ['frente', 'espalda'],
    area: { x: 0.35125, y: 0.40875, width: 0.2975, height: 0.33375 },
    backArea: { x: 0.355, y: 0.4075, width: 0.29, height: 0.335 },
    available: true,
  },
];

export const initialDesigns: Designs = {
  playera: { color: 'Blanco', side: 'frente', layers: { frente: [], espalda: [] } },
  sudadera: { color: 'Marfil', side: 'frente', layers: { frente: [], espalda: [] } },
  tote: { color: 'Natural', side: 'frente', layers: { frente: [], espalda: [] } },
};
export const fontOptions: {
  id: FontId;
  name: string;
  category: string;
  family: string;
  file?: string;
  weight?: string;
}[] = [
  { id: 'sans', name: 'Manrope', category: 'Modernas', family: 'Manrope Studio' },
  { id: 'inter', name: 'Inter', category: 'Modernas', family: 'Inter Studio', file: 'inter' },
  {
    id: 'montserrat',
    name: 'Montserrat',
    category: 'Modernas',
    family: 'Montserrat Studio',
    file: 'montserrat',
  },
  {
    id: 'poppins',
    name: 'Poppins',
    category: 'Modernas',
    family: 'Poppins Studio',
    file: 'poppins',
  },
  { id: 'serif', name: 'Cormorant Garamond', category: 'Elegantes', family: 'Cormorant Studio' },
  {
    id: 'playfair',
    name: 'Playfair Display',
    category: 'Elegantes',
    family: 'Playfair Studio',
    file: 'playfairdisplay',
  },
  {
    id: 'dmserif',
    name: 'DM Serif Display',
    category: 'Elegantes',
    family: 'DM Serif Studio',
    file: 'dmserifdisplay',
  },
  {
    id: 'abril',
    name: 'Abril Fatface',
    category: 'Elegantes',
    family: 'Abril Studio',
    file: 'abrilfatface',
  },
  {
    id: 'bold',
    name: 'Manrope Bold',
    category: 'Impactantes',
    family: 'Manrope Studio',
    weight: '700',
  },
  {
    id: 'bebas',
    name: 'Bebas Neue',
    category: 'Impactantes',
    family: 'Bebas Studio',
    file: 'bebasneue',
  },
  {
    id: 'oswald',
    name: 'Oswald',
    category: 'Impactantes',
    family: 'Oswald Studio',
    file: 'oswald',
  },
  {
    id: 'archivo',
    name: 'Archivo Black',
    category: 'Impactantes',
    family: 'Archivo Studio',
    file: 'archivoblack',
  },
  {
    id: 'script',
    name: 'Dancing Script',
    category: 'Manuscritas',
    family: 'Dancing Studio',
    file: 'dancingscript',
  },
  {
    id: 'caveat',
    name: 'Caveat',
    category: 'Manuscritas',
    family: 'Caveat Studio',
    file: 'caveat',
  },
  {
    id: 'pacifico',
    name: 'Pacifico',
    category: 'Manuscritas',
    family: 'Pacifico Studio',
    file: 'pacifico',
  },
  {
    id: 'greatvibes',
    name: 'Great Vibes',
    category: 'Manuscritas',
    family: 'Great Vibes Studio',
    file: 'greatvibes',
  },
];
export const fontSupportsBold = (id: FontId) =>
  [
    'sans',
    'bold',
    'serif',
    'inter',
    'montserrat',
    'poppins',
    'playfair',
    'oswald',
    'script',
    'caveat',
  ].includes(id);
export const motifs = [
  { name: 'Monograma', text: 'A · B', font: 'serif' as FontId },
  { name: 'Floral', text: '✿', font: 'serif' as FontId },
  { name: 'Geométrico', text: '◇', font: 'sans' as FontId },
  { name: 'Frase', text: 'hazlo tuyo', font: 'script' as FontId },
  { name: 'Destello', text: '✦', font: 'serif' as FontId },
];
