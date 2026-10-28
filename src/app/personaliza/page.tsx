import type { Metadata } from 'next';
import { PersonalizeSection } from '@/components/sections';
import { ClosingCTA } from '@/components/ui';
export const metadata: Metadata = {
  title: 'Tu idea, tus reglas',
  description:
    'Conoce cómo será el personalizador de GENHORA. Mientras llega, prepara tu idea para una cotización.',
};
export default function Personaliza() {
  return (
    <>
      <PersonalizeSection full />
      <ClosingCTA />
    </>
  );
}
