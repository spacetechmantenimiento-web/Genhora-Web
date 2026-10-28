/** Public business information only. Never put secrets in this module. */
export const siteConfig = {
  url: 'http://127.0.0.1:3000', // Replace with the real origin only when publishing is authorized.
  name: 'GENHORA',
  tagline: 'Es hora de crear.',
  country: 'México',
  whatsappNumber: '', // International digits only; e.g. country code + subscriber number. No invented fallback.
  defaultMessage: 'Hola, GENHORA. Me gustaría dar vida a una idea.',
  cta: { quote: 'Cotiza tu idea', create: 'Empieza a crear' },
  email: '',
  address: '',
  socialLinks: [] as { label: string; url: string }[],
  legalLinks: [] as { label: string; url: string }[],
};
export function whatsappUrl(number: string, message: string): string | null {
  if (!/^[1-9]\d{7,14}$/.test(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
export function quoteHref(product?: string) {
  return product ? `/contacto?producto=${encodeURIComponent(product)}` : '/contacto';
}
export type Brief = { product: string; quantity: string; idea: string; date: string };
export function createBrief(brief: Brief) {
  return [
    siteConfig.defaultMessage,
    `Producto: ${brief.product || 'Por definir'}`,
    `Cantidad estimada: ${brief.quantity || 'Por definir'}`,
    `Mi idea: ${brief.idea.trim() || 'Me gustaría recibir orientación.'}`,
    `Fecha deseada: ${brief.date || 'Por definir'}`,
    'Entiendo que disponibilidad, materiales, precio y entrega se confirman al cotizar.',
  ].join('\n\n');
}
