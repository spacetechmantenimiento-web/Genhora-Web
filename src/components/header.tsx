'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Arrow, Logo } from './ui';
import { siteConfig } from '@/lib/config';
import styles from './header.module.css';
const nav = [
  { href: '/', label: 'Inicio' },
  { href: '/productos', label: 'Productos' },
  { href: '/personaliza', label: 'Personaliza' },
  { href: '/empresas-y-eventos', label: 'Empresas y eventos' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
];
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link
            className={styles.homeLink}
            href="/"
            aria-label="GENHORA, ir al inicio"
            onClick={() => setOpen(false)}
          >
            <Logo className={styles.logo} />
          </Link>
          <button
            ref={toggle}
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            <span />
            <span />
            <span className="sr-only">Menú</span>
          </button>
          <nav
            aria-label="Navegación principal"
            id="main-nav"
            className={`${styles.nav} ${open ? styles.navOpen : ''}`}
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href))
                    ? 'page'
                    : undefined
                }
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/contacto" className={styles.mobileQuote} onClick={() => setOpen(false)}>
              {siteConfig.cta.quote}
              <Arrow />
            </Link>
          </nav>
          <Link href="/contacto" className={styles.quote}>
            {siteConfig.cta.quote}
            <Arrow diagonal />
          </Link>
        </div>
      </header>
    </>
  );
}
