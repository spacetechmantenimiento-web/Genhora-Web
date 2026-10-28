import Link from 'next/link';
import { Logo, Arrow } from './ui';
import { siteConfig, whatsappUrl } from '@/lib/config';
export function Footer() {
  const whatsapp = whatsappUrl(siteConfig.whatsappNumber, siteConfig.defaultMessage);
  return (
    <footer className="site-footer">
      <div className="footer-main section-wrap">
        <div className="footer-brand">
          <Link href="/" aria-label="GENHORA, inicio">
            <Logo light />
          </Link>
          <p>Es hora de crear.</p>
          <span>
            Un estudio creativo de personalización.
            <br />
            Ideas con identidad. Objetos con significado.
          </span>
        </div>
        <div>
          <p className="eyebrow">EXPLORA</p>
          <Link href="/productos">Productos</Link>
          <Link href="/personaliza">Personaliza</Link>
          <Link href="/empresas-y-eventos">Empresas y eventos</Link>
        </div>
        <div>
          <p className="eyebrow">CONÓCENOS</p>
          <Link href="/nosotros">Nuestra historia</Link>
          <Link href="/contacto">Contacto</Link>
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noreferrer">
              WhatsApp <Arrow diagonal />
            </a>
          )}
          {siteConfig.socialLinks.map((s) => (
            <a href={s.url} key={s.url} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
        </div>
        <div className="footer-note">
          <p className="eyebrow">TODA GRAN IDEA</p>
          <p className="footer-serif">tiene un comienzo.</p>
          <Link href="/contacto" className="text-link">
            Cuéntanos la tuya
            <Arrow />
          </Link>
          {siteConfig.email && <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>}
          {siteConfig.address && <p>{siteConfig.address}</p>}
        </div>
      </div>
      <div className="footer-bottom section-wrap">
        <span>© {new Date().getFullYear()} GENHORA</span>
        <span>Estudio creativo · {siteConfig.country}</span>
        <div>
          {siteConfig.legalLinks.map((s) => (
            <a href={s.url} key={s.url}>
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
