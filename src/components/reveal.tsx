'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('reveal-pending');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.07 },
    );
    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('reveal-pending');
        observer.observe(el);
      }
    });
    return () => {
      observer.disconnect();
      elements.forEach((el) => el.classList.remove('reveal-pending'));
    };
  }, [pathname]);
  return null;
}
