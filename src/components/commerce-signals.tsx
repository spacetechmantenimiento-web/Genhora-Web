'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackCommerce, type CommerceEvent } from '@/lib/analytics';
export function CommerceSignals() {
  const pathname = usePathname();
  useEffect(() => {
    const product = document.querySelector<HTMLElement>('[data-product-page]')?.dataset.productPage;
    if (product) trackCommerce('view_product', { productId: product });
    function click(event: MouseEvent) {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>('[data-commerce-event]')
          : null;
      if (target)
        trackCommerce(target.dataset.commerceEvent as CommerceEvent, {
          productId: target.dataset.productId,
          source: target.dataset.source,
        });
    }
    document.addEventListener('click', click);
    return () => document.removeEventListener('click', click);
  }, [pathname]);
  return null;
}
