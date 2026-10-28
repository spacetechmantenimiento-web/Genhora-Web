'use client';
import { useState } from 'react';
import { products } from '@/lib/catalog';
import { createBrief, siteConfig, whatsappUrl } from '@/lib/config';
import { Arrow } from './ui';
export function ContactBrief({
  initialProduct = '',
  volume = false,
}: {
  initialProduct?: string;
  volume?: boolean;
}) {
  const [product, setProduct] = useState(initialProduct);
  const [quantity, setQuantity] = useState('');
  const [idea, setIdea] = useState(volume ? 'Me interesa un proyecto por volumen. ' : '');
  const [date, setDate] = useState('');
  const [prepared, setPrepared] = useState(false);
  const [copied, setCopied] = useState('');
  const summary = createBrief({
    product: products.find((p) => p.slug === product)?.name ?? '',
    quantity,
    idea,
    date,
  });
  const whatsapp = whatsappUrl(siteConfig.whatsappNumber, summary);
  async function copy() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied('Resumen copiado. Puedes guardarlo donde prefieras.');
    } catch {
      setCopied('No fue posible copiar automáticamente. Selecciona y copia el texto del resumen.');
    }
  }
  return (
    <form
      className="brief-form"
      onSubmit={(e) => {
        e.preventDefault();
        setPrepared(true);
        setCopied('');
        setTimeout(() => document.getElementById('brief-result')?.focus(), 0);
      }}
      onChange={() => {
        setPrepared(false);
        setCopied('');
      }}
    >
      <div className="form-pair">
        <div>
          <label htmlFor="product">¿Con qué te gustaría crear?</label>
          <select id="product" value={product} onChange={(e) => setProduct(e.target.value)}>
            <option value="">Aún estoy explorando</option>
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quantity">
            Cantidad estimada <span>(opcional)</span>
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            max="100000"
            step="1"
            inputMode="numeric"
            placeholder="Por definir"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
      </div>
      <label htmlFor="idea">
        Cuéntanos tu idea <span>(opcional)</span>
      </label>
      <textarea
        id="idea"
        maxLength={2000}
        rows={4}
        placeholder="Un regalo, una frase, los colores de tu marca… ¿Qué tienes en mente?"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        aria-describedby="idea-help"
      />
      <p className="field-help" id="idea-help">
        Una descripción es suficiente. No necesitas subir archivos ni compartir datos personales.
      </p>
      <label htmlFor="date">
        Fecha deseada <span>(opcional)</span>
      </label>
      <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <p className="field-help">
        La fecha es una referencia; disponibilidad y tiempos aún deben confirmarse.
      </p>
      <button className="button" type="submit">
        Preparar mi idea
        <Arrow />
      </button>
      <p className="form-privacy">
        Este formulario solo prepara un resumen en tu navegador. No envía ni guarda información.
      </p>
      {prepared && (
        <div className="brief-result" id="brief-result" tabIndex={-1}>
          <h2>Tu idea ya tiene un comienzo.</h2>
          <label htmlFor="summary">Tu resumen</label>
          <textarea id="summary" readOnly value={summary} rows={10} />
          {whatsapp ? (
            <a className="button" href={whatsapp} target="_blank" rel="noreferrer">
              Continuar en WhatsApp
              <Arrow />
            </a>
          ) : (
            <p>
              El canal de WhatsApp aún no está habilitado. Puedes copiar tu resumen y conservarlo
              para cuando esté disponible. No hemos recibido una solicitud.
            </p>
          )}
          <button type="button" className="button button-outline" onClick={copy}>
            Copiar mi resumen
            <Arrow />
          </button>
          <p role="status">{copied}</p>
        </div>
      )}
    </form>
  );
}
