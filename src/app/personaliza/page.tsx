import type { Metadata } from 'next';
import { Studio } from '@/components/studio/studio';
import { pageMetadata } from '@/lib/commerce';
import type { ProductId } from '@/lib/studio';
export const metadata: Metadata = pageMetadata(
  'Personaliza playeras, sudaderas y tote bags',
  'Agrega texto o un logotipo, revisa ambas caras y descarga tu diseño para cotizar con GENHORA.',
  '/personaliza',
);
export default async function Personaliza({
  searchParams,
}: {
  searchParams: Promise<{ producto?: string | string[] }>;
}) {
  const value = (await searchParams).producto;
  const initialProduct: ProductId =
    value === 'sudadera' ? 'sudadera' : value === 'tote' ? 'tote' : 'playera';
  return <Studio initialProduct={initialProduct} />;
}
