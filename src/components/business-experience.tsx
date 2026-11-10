'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { products } from '@/lib/catalog';
import { kits } from '@/lib/commerce';
import { trackCommerce } from '@/lib/analytics';
import { siteConfig, whatsappUrl } from '@/lib/config';
import { Arrow, Eyebrow, ProductImage } from './ui';

export function BusinessExperience() {
  const [project, setProject] = useState('Kits de bienvenida');
  const [selected, setSelected] = useState<string[]>(['libretas', 'termos', 'tote-bags']);
  const [quantity, setQuantity] = useState('');
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [date, setDate] = useState('');
  const [city, setCity] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [kit, setKit] = useState('Propuesta a medida');
  const [logo, setLogo] = useState('');
  const [error, setError] = useState('');
  const [prepared, setPrepared] = useState(false);
  const result = useRef<HTMLDivElement>(null);
  const gallery = useRef<HTMLElement>(null);
  const started = useRef(false);
  useEffect(() => {
    if (!gallery.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      trackCommerce('view_business_kits');
      observer.disconnect();
    });
    observer.observe(gallery.current);
    return () => observer.disconnect();
  }, []);
  function markStarted(source: string) {
    if (started.current) return;
    started.current = true;
    trackCommerce('start_business_quote', { source });
  }
  const summary = [
    'Hola, GENHORA. Me gustaría una propuesta empresarial.',
    `Proyecto: ${project}`,
    `Composición: ${kit}`,
    `Productos: ${selected.map((id) => products.find((p) => p.slug === id)?.name).join(', ') || 'Por definir'}`,
    `Cantidad aproximada: ${quantity || 'Por definir'}`,
    `Empresa: ${company.trim() || 'Por definir'}`,
    `Contacto: ${contact.trim() || 'Por definir'}`,
    `Fecha requerida: ${date || 'Por definir'}`,
    `Ciudad de entrega: ${city.trim() || 'Por definir'}`,
    `Presupuesto de referencia: ${budget.trim() || 'Por definir'}`,
    `Comentarios: ${notes.trim() || 'Sin comentarios'}`,
    logo
      ? 'Tengo un logotipo de referencia; lo adjuntaré manualmente en esta conversación.'
      : 'Identidad de marca por compartir.',
    'Artículos, cantidades, diseño, disponibilidad, precio y entrega sujetos a cotización y confirmación.',
  ].join('\n\n');
  const whatsapp = whatsappUrl(siteConfig.whatsappNumber, summary);
  return (
    <>
      <section id="kits" ref={gallery} className="kits-section section-wrap">
        <div className="section-heading">
          <div>
            <Eyebrow>UNA BASE PARA TU PROYECTO</Eyebrow>
            <h2>
              Kits con <em>intención.</em>
            </h2>
          </div>
          <p>
            Composiciones sugeridas y configurables.
            <br />
            Artículos y disponibilidad por confirmar.
          </p>
        </div>
        <div className="kit-grid">
          {kits.map((item) => (
            <article className="kit-card" key={item.id}>
              <div
                className="kit-composition"
                aria-label={`Composición ilustrativa de ${item.name}`}
              >
                {item.slugs.map((slug) => {
                  const product = products.find((p) => p.slug === slug)!;
                  return <ProductImage key={slug} product={product} />;
                })}
                <span>CONCEPTO DE KIT</span>
              </div>
              <h3>{item.name}</h3>
              <p>{item.text}</p>
              <p className="kit-items">
                {item.slugs.map((slug) => products.find((p) => p.slug === slug)!.name).join(' · ')}
              </p>
              {item.extra && <p className="field-help">{item.extra}</p>}
              <button
                className="text-link"
                type="button"
                aria-label={`Cotizar este kit: ${item.name}`}
                onClick={() => {
                  setKit(item.name);
                  setSelected([...item.slugs]);
                  setProject('Kits de bienvenida');
                  setPrepared(false);
                  markStarted(item.id);
                  document.getElementById('business-quote')?.scrollIntoView({ block: 'start' });
                  document.getElementById('business-quantity')?.focus({ preventScroll: true });
                }}
              >
                Cotizar este kit <Arrow />
              </button>
            </article>
          ))}
        </div>
      </section>
      <section id="business-quote" className="business-quote section-wrap">
        <div className="business-quote-intro">
          <Eyebrow>HABLEMOS DE TU MARCA</Eyebrow>
          <h2>
            Una propuesta
            <br />
            <em>a tu medida.</em>
          </h2>
          <p>
            Elige los artículos y cuéntanos lo esencial. Revisarás tu resumen antes de abrir
            WhatsApp.
          </p>
          <p className="field-help">
            Tu información permanece en esta pestaña hasta que decidas compartirla.{' '}
            <Link href="/privacidad">Uso de tus datos</Link>.
          </p>
        </div>
        <form
          className="brief-form"
          onFocus={() => markStarted('form')}
          onChange={() => setPrepared(false)}
          onSubmit={(event) => {
            event.preventDefault();
            if (!selected.length) {
              setError('Selecciona al menos un producto de interés.');
              return;
            }
            setError('');
            setPrepared(true);
            requestAnimationFrame(() => result.current?.focus());
          }}
        >
          <label htmlFor="business-project">Tipo de proyecto</label>
          <select
            id="business-project"
            value={project}
            onChange={(e) => setProject(e.target.value)}
          >
            {[
              'Kits de bienvenida',
              'Regalos corporativos',
              'Eventos y congresos',
              'Merchandising de marca',
              'Otro proyecto',
            ].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <fieldset className="product-checks">
            <legend>Productos de interés</legend>
            {products
              .filter((p) => !['invitaciones', 'llaveros', 'stickers'].includes(p.slug))
              .map((p) => (
                <label key={p.slug}>
                  <input
                    type="checkbox"
                    checked={selected.includes(p.slug)}
                    onChange={(e) => {
                      setKit('Propuesta a medida');
                      setSelected((current) =>
                        e.target.checked
                          ? [...current, p.slug]
                          : current.filter((id) => id !== p.slug),
                      );
                    }}
                  />
                  {p.name}
                </label>
              ))}
          </fieldset>
          <div className="form-pair">
            <div>
              <label htmlFor="business-quantity">Cantidad aproximada</label>
              <input
                id="business-quantity"
                type="number"
                min="1"
                max="100000"
                step="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Ej. 40"
              />
            </div>
            <div>
              <label htmlFor="business-company">
                Empresa <span>(opcional)</span>
              </label>
              <input
                id="business-company"
                maxLength={120}
                autoComplete="organization"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>
          <label htmlFor="business-contact">
            Nombre de contacto <span>(opcional)</span>
          </label>
          <input
            id="business-contact"
            maxLength={120}
            autoComplete="name"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <div className="form-pair">
            <div>
              <label htmlFor="business-date">
                Fecha requerida <span>(opcional)</span>
              </label>
              <input
                id="business-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="business-city">
                Ciudad de entrega <span>(opcional)</span>
              </label>
              <input
                id="business-city"
                maxLength={120}
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>
          <label htmlFor="business-budget">
            Presupuesto estimado <span>(opcional)</span>
          </label>
          <input
            id="business-budget"
            maxLength={100}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Monto o rango de referencia"
          />
          <label htmlFor="business-notes">
            Tu marca y comentarios <span>(opcional)</span>
          </label>
          <textarea
            id="business-notes"
            maxLength={2000}
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Colores de marca, artículos, mensaje o detalles del proyecto"
          />
          <label htmlFor="business-logo">
            Logotipo de referencia <span>(opcional)</span>
          </label>
          <input
            id="business-logo"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setLogo('');
              setError('');
              if (!file) return;
              if (
                !['image/png', 'image/jpeg', 'image/webp'].includes(file.type) ||
                file.size > 10 * 1024 * 1024
              ) {
                setError('Elige un PNG, JPG o WebP de hasta 10 MB.');
                e.target.value = '';
                return;
              }
              setLogo(file.name);
            }}
          />
          <p className="field-help">
            {logo ? `Referencia local: ${logo}. ` : ''}El archivo no se sube ni se adjunta
            automáticamente. Envíalo manualmente al continuar en WhatsApp.
          </p>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          <button type="submit" className="button">
            Revisar mi solicitud <Arrow />
          </button>
          {prepared && (
            <div ref={result} tabIndex={-1} className="brief-result">
              <h3>Tu proyecto GENHORA</h3>
              <label htmlFor="business-summary">Resumen de tu solicitud</label>
              <textarea id="business-summary" rows={15} readOnly value={summary} />
              {whatsapp && (
                <a
                  className="button"
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackCommerce('open_business_whatsapp')}
                >
                  Preparar cotización por WhatsApp <Arrow />
                </a>
              )}
              <p className="field-help">
                Se abrirá una conversación con el resumen. Revisa el mensaje y envíalo cuando estés
                listo; GENHORA aún no ha recibido esta solicitud.
              </p>
            </div>
          )}
        </form>
      </section>
    </>
  );
}
