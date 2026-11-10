import type { Metadata } from 'next';
import { Studio } from '@/components/studio/studio';
export const metadata: Metadata = {
  title: 'Estudio de personalización',
  description:
    'Crea una propuesta visual de playera, sudadera o tote bag personalizada y solicita una cotización en GENHORA.',
};
export default function Personaliza() {
  return <Studio />;
}
