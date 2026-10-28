export const lines = [
  {
    id: 'estilo',
    name: 'Personaliza tu estilo',
    short: 'Tu estilo',
    description: 'Piezas que se sienten tan tuyas como tus ideas.',
  },
  {
    id: 'regalos',
    name: 'Regalos con significado',
    short: 'Regalos',
    description: 'Pequeños objetos. Grandes maneras de decir algo.',
  },
  {
    id: 'eventos',
    name: 'Eventos que dejan huella',
    short: 'Eventos',
    description: 'Detalles para esos momentos que quieres guardar.',
  },
  {
    id: 'business',
    name: 'GENHORA Business',
    short: 'Business',
    description: 'La esencia de tu marca, en cada detalle.',
  },
  {
    id: 'comunidades',
    name: 'Comunidades y creadores',
    short: 'Comunidades',
    description: 'Ideas que nos unen. Objetos que nos representan.',
  },
] as const;
export type LineId = (typeof lines)[number]['id'];
export const categories = [
  { id: 'textiles', name: 'Textiles' },
  { id: 'objetos', name: 'Objetos cotidianos' },
  { id: 'papeleria', name: 'Papelería y detalles' },
  { id: 'corporativos', name: 'Corporativos' },
] as const;
export type CategoryId = (typeof categories)[number]['id'];
export type Product = {
  slug: string;
  name: string;
  singular: string;
  category: CategoryId;
  lines: LineId[];
  description: string;
  detail: string;
  image: { atlasIndex: number; src?: string };
  fromPrice: number | null;
  currency: 'MXN';
  ideas: string[];
};
export const products: Product[] = [
  {
    slug: 'playeras',
    name: 'Playeras',
    singular: 'Una playera, muchas formas de ser.',
    category: 'textiles',
    lines: ['estilo', 'business', 'comunidades'],
    description: 'Tu identidad, puesta todos los días.',
    detail:
      'Una frase que te representa, una ilustración propia o la identidad de tu comunidad. Encuentra un punto de partida para llevar tu idea contigo.',
    image: { atlasIndex: 0 },
    fromPrice: null,
    currency: 'MXN',
    ideas: ['Una ilustración original', 'Identidad de equipo', 'Una frase que te define'],
  },
  {
    slug: 'sudaderas',
    name: 'Sudaderas',
    singular: 'Tu próxima pieza favorita.',
    category: 'textiles',
    lines: ['estilo', 'comunidades', 'business'],
    description: 'Ideas que también se pueden vestir.',
    detail:
      'Piensa en una pieza que quieras usar una y otra vez. Cuéntanos el estilo, los colores y el diseño que imaginas para definir juntos las opciones.',
    image: { atlasIndex: 1 },
    fromPrice: null,
    currency: 'MXN',
    ideas: ['Colección para creadores', 'Diseño personal', 'Identidad de comunidad'],
  },
  {
    slug: 'tote-bags',
    name: 'Tote bags',
    singular: 'Lleva contigo una buena idea.',
    category: 'textiles',
    lines: ['estilo', 'business', 'comunidades', 'eventos'],
    description: 'Un lienzo para acompañarte a todas partes.',
    detail:
      'Desde un trazo sencillo hasta una idea que ocupa todo el espacio. Una tote bag puede contar algo de ti, de tu proyecto o de un momento especial.',
    image: { atlasIndex: 2 },
    fromPrice: null,
    currency: 'MXN',
    ideas: ['Arte e ilustración', 'Recuerdo de un evento', 'Merchandising de marca'],
  },
  {
    slug: 'tazas',
    name: 'Tazas',
    singular: 'Que lo cotidiano tenga significado.',
    category: 'objetos',
    lines: ['regalos', 'business', 'eventos'],
    description: 'Un pequeño ritual, muy tuyo.',
    detail:
      'Dale una nueva historia a la pausa del café. Un nombre, un mensaje o una imagen pueden transformar un objeto cotidiano en un regalo personal.',
    image: { atlasIndex: 3 },
    fromPrice: null,
    currency: 'MXN',
    ideas: ['Un mensaje especial', 'Un regalo personal', 'Un detalle para tu equipo'],
  },
  {
    slug: 'termos',
    name: 'Termos',
    singular: 'Ideas que siguen tu ritmo.',
    category: 'objetos',
    lines: ['regalos', 'business', 'comunidades'],
    description: 'Tu esencia, adonde vayas.',
    detail:
      'Un objeto pensado para acompañar la rutina. Comparte tu idea y revisaremos las opciones de modelo, acabado y personalización disponibles.',
    image: { atlasIndex: 4 },
    fromPrice: null,
    currency: 'MXN',
    ideas: ['Nombre o iniciales', 'Identidad corporativa', 'Detalle para una comunidad'],
  },
  {
    slug: 'invitaciones',
    name: 'Invitaciones personalizadas',
    singular: 'Todo comienza con una invitación.',
    category: 'papeleria',
    lines: ['eventos'],
    description: 'La primera impresión de un gran momento.',
    detail:
      'La invitación también cuenta una historia. Exploremos la composición, los tonos y el estilo que anticipan lo que quieres celebrar.',
    image: { atlasIndex: 5 },
    fromPrice: null,
    currency: 'MXN',
    ideas: ['Celebraciones personales', 'Encuentros de marca', 'Un diseño con significado'],
  },
  {
    slug: 'stickers',
    name: 'Stickers',
    singular: 'Pequeño formato. Mucha personalidad.',
    category: 'papeleria',
    lines: ['eventos', 'comunidades', 'business'],
    description: 'Detalles que encuentran su lugar.',
    detail:
      'Ideas pequeñas que viajan lejos: para tu comunidad, tu empaque o ese proyecto que merece verse en todas partes.',
    image: { atlasIndex: 6 },
    fromPrice: null,
    currency: 'MXN',
    ideas: ['Ilustraciones propias', 'Detalles para empaques', 'Identidad de un evento'],
  },
  {
    slug: 'llaveros',
    name: 'Llaveros',
    singular: 'Un recuerdo que va contigo.',
    category: 'objetos',
    lines: ['regalos', 'eventos', 'business'],
    description: 'Algo especial, siempre cerca.',
    detail:
      'Un detalle para llevar un nombre, un recuerdo o una identidad a todas partes. La forma y los materiales se definirán según tu proyecto.',
    image: { atlasIndex: 7 },
    fromPrice: null,
    currency: 'MXN',
    ideas: ['Iniciales o nombres', 'Recuerdos de celebración', 'Detalles de marca'],
  },
  {
    slug: 'libretas',
    name: 'Libretas',
    singular: 'El inicio de tu próxima gran idea.',
    category: 'papeleria',
    lines: ['regalos', 'business', 'comunidades'],
    description: 'Espacio para lo que viene.',
    detail:
      'Un lugar para escribir, dibujar o empezar de nuevo. Dale a la portada el carácter de tu marca o la personalidad de quien la recibirá.',
    image: { atlasIndex: 8 },
    fromPrice: null,
    currency: 'MXN',
    ideas: ['Una portada personal', 'Kit de bienvenida', 'Un regalo para crear'],
  },
  {
    slug: 'articulos-corporativos',
    name: 'Artículos corporativos',
    singular: 'Tu marca, más allá de un logotipo.',
    category: 'corporativos',
    lines: ['business', 'eventos'],
    description: 'Objetos que hablan el idioma de tu marca.',
    detail:
      'Piensa en un conjunto con intención. Te ayudaremos a explorar artículos y detalles que reflejen la personalidad de tu empresa o evento.',
    image: { atlasIndex: 9 },
    fromPrice: null,
    currency: 'MXN',
    ideas: ['Kits de bienvenida', 'Detalles para equipos', 'Productos promocionales'],
  },
];
export function filterProducts(category?: string, line?: string) {
  return products.filter(
    (p) => (!category || p.category === category) && (!line || p.lines.some((id) => id === line)),
  );
}
export function productPrice(product: Product) {
  return product.fromPrice === null
    ? 'Cotiza a tu medida'
    : `Desde ${new Intl.NumberFormat('es-MX', { style: 'currency', currency: product.currency }).format(product.fromPrice)} MXN`;
}
