'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { siteConfig, whatsappUrl } from '@/lib/config';
import {
  CANVAS_SIZE,
  constrainLayer,
  drawScene,
  ensureStudioFont,
  hitLayer,
  layerOutside,
} from '@/lib/studio-canvas';
import {
  colorHex,
  colorName,
  fontOptions,
  fontSupportsBold,
  initialDesigns,
  motifs,
  printArea,
  studioProducts,
  studioColors,
  type Artwork,
  type Designs,
  type FontId,
  type ProductId,
  type Side,
} from '@/lib/studio';
import styles from './studio.module.css';

type History = { past: Designs[]; present: Designs; future: Designs[] };
const newId = () => crypto.randomUUID();
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const darkColor = (hex: string) => {
  const rgb = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16));
  return rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114 < 135;
};

export function Studio() {
  const [productId, setProductId] = useState<ProductId>('playera');
  const [history, setHistory] = useState<History>({
    past: [],
    present: initialDesigns,
    future: [],
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [guides, setGuides] = useState(true);
  const [quantity, setQuantity] = useState('1');
  const [size, setSize] = useState('M');
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [outside, setOutside] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [hexInput, setHexInput] = useState('');
  const [hexError, setHexError] = useState('');
  const [fontCategory, setFontCategory] = useState('Elegantes');
  const [fontReady, setFontReady] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef(new Map<string, HTMLImageElement>());
  const dragRef = useRef<{ id: string; start: Designs; moved: boolean } | null>(null);
  const product = studioProducts.find((item) => item.id === productId)!;
  const design = history.present[productId];
  const layers = design.layers[design.side];
  const selected = layers.find((layer) => layer.id === selectedId);
  const color = colorHex(design.color);
  useEffect(() => {
    let active = true;
    const loading = [
      ...layers
        .filter((layer): layer is Extract<Artwork, { kind: 'text' }> => layer.kind === 'text')
        .map((layer) =>
          ensureStudioFont(layer.font, layer.weight ?? (layer.font === 'bold' ? 700 : 400)),
        ),
      ...fontOptions
        .filter((option) => option.category === fontCategory)
        .map((option) => ensureStudioFont(option.id)),
    ];
    Promise.all(loading)
      .then(() => {
        if (active) setFontReady((value) => value + 1);
      })
      .catch(() => {
        if (active)
          setFeedback(
            'Una tipografía no pudo cargarse; comprueba tu conexión e inténtalo de nuevo.',
          );
      });
    return () => {
      active = false;
    };
  }, [layers, fontCategory]);
  function selectColor(selection: string) {
    changeDesign((current) => ({ ...current, color: selection }));
    setHexInput(colorHex(selection));
    setHexError('');
  }

  function change(next: (current: Designs) => Designs) {
    setHistory((current) => ({
      past: [...current.past, current.present].slice(-20),
      present: next(current.present),
      future: [],
    }));
  }
  function changeDesign(update: (current: Designs[ProductId]) => Designs[ProductId]) {
    change((current) => ({ ...current, [productId]: update(current[productId]) }));
  }
  function changeLayers(update: (current: Artwork[]) => Artwork[]) {
    changeDesign((current) => ({
      ...current,
      layers: { ...current.layers, [current.side]: update(current.layers[current.side]) },
    }));
  }
  function changeLayer(patch: Partial<Artwork>) {
    if (!selectedId) return;
    const ctx = canvasRef.current?.getContext('2d');
    changeLayers((current) =>
      current.map((layer) =>
        layer.id === selectedId
          ? ctx
            ? constrainLayer(ctx, { ...layer, ...patch } as Artwork, product, design.side)
            : ({ ...layer, ...patch } as Artwork)
          : layer,
      ),
    );
  }
  function addText(text = 'Tu idea', font: FontId = 'serif') {
    const layer: Artwork = {
      id: newId(),
      kind: 'text',
      x: 0.5,
      y: 0.48,
      scale: 1,
      angle: 0,
      text,
      color: darkColor(color) ? '#F9F7F0' : '#294D3A',
      font,
    };
    const ctx = canvasRef.current?.getContext('2d');
    const fitted = ctx ? constrainLayer(ctx, layer, product, design.side) : layer;
    changeLayers((current) => [...current, fitted]);
    setSelectedId(layer.id);
    setFeedback('Texto añadido. Arrástralo sobre el producto o usa los controles.');
  }
  function addImage(src: string, name: string, pixelWidth: number, pixelHeight: number) {
    if (selected?.kind === 'image') {
      changeLayer({ src, name, pixelWidth, pixelHeight });
      setFeedback('Imagen reemplazada en esta capa.');
      return;
    }
    const layer: Artwork = {
      id: newId(),
      kind: 'image',
      x: 0.5,
      y: 0.5,
      scale: 1,
      angle: 0,
      src,
      name,
      pixelWidth,
      pixelHeight,
    };
    const ctx = canvasRef.current?.getContext('2d');
    const fitted = ctx ? constrainLayer(ctx, layer, product, design.side) : layer;
    changeLayers((current) => [...current, fitted]);
    setSelectedId(layer.id);
    setFeedback('Imagen añadida al área de personalización.');
  }
  async function onFile(file?: File) {
    setUploadError('');
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setUploadError('Usa un archivo PNG, JPG o WebP.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('El archivo supera el límite de 10 MB.');
      return;
    }
    try {
      const bitmap = await createImageBitmap(file);
      const { width, height } = bitmap;
      bitmap.close();
      if (!width || !height) throw new Error('invalid image');
      const src = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('read failed'));
        reader.readAsDataURL(file);
      });
      addImage(src, file.name, width, height);
      if (Math.min(width, height) < 600)
        setUploadError(
          'La resolución podría ser insuficiente para impresión. Esta advertencia no sustituye una revisión profesional.',
        );
    } catch {
      setUploadError('No pudimos leer la imagen. Elige otro archivo PNG, JPG o WebP.');
    }
    if (fileRef.current) fileRef.current.value = '';
  }

  useEffect(() => {
    for (const layer of layers) {
      if (layer.kind !== 'image' || imagesRef.current.has(layer.src)) continue;
      const image = new Image();
      image.src = layer.src;
      image.onload = () => {
        imagesRef.current.set(layer.src, image);
        redraw();
      };
    }
    function redraw() {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;
      drawScene(ctx, {
        product,
        color,
        side: design.side,
        layers,
        selectedId: selectedId ?? undefined,
        guides,
        images: imagesRef.current,
      });
      const active = layers.find((layer) => layer.id === selectedId);
      setOutside(active ? layerOutside(ctx, active, product, design.side) : false);
    }
    document.fonts.ready.then(redraw);
    redraw();
  }, [product, color, design.side, layers, selectedId, guides, fontReady]);

  useEffect(() => {
    if (
      !Object.values(history.present).some(
        (item) => item.layers.frente.length || item.layers.espalda.length,
      )
    )
      return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [history.present]);

  function canvasPosition(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * CANVAS_SIZE,
      y: ((event.clientY - rect.top) / rect.height) * CANVAS_SIZE,
    };
  }
  function pointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const point = canvasPosition(event);
    const id = hitLayer(
      ctx,
      { product, color, side: design.side, layers, images: imagesRef.current },
      point.x,
      point.y,
    );
    setSelectedId(id);
    if (id) {
      dragRef.current = { id, start: history.present, moved: false };
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }
  function pointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!dragRef.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const point = canvasPosition(event);
    const area = printArea(product, design.side);
    const x = clamp((point.x - area.x) / area.width, 0.02, 0.98);
    const y = clamp((point.y - area.y) / area.height, 0.02, 0.98);
    const id = dragRef.current.id;
    dragRef.current.moved = true;
    setHistory((current) => ({
      ...current,
      present: {
        ...current.present,
        [productId]: {
          ...current.present[productId],
          layers: {
            ...current.present[productId].layers,
            [design.side]: current.present[productId].layers[design.side].map((layer) =>
              layer.id === id
                ? constrainLayer(ctx, { ...layer, x, y }, product, design.side)
                : layer,
            ),
          },
        },
      },
    }));
  }
  function pointerUp() {
    const drag = dragRef.current;
    dragRef.current = null;
    if (drag?.moved)
      setHistory((current) => ({
        ...current,
        past: [...current.past, drag.start].slice(-20),
        future: [],
      }));
  }
  function undo() {
    setHistory((current) =>
      current.past.length
        ? {
            past: current.past.slice(0, -1),
            present: current.past.at(-1)!,
            future: [current.present, ...current.future],
          }
        : current,
    );
  }
  function redo() {
    setHistory((current) =>
      current.future.length
        ? {
            past: [...current.past, current.present].slice(-20),
            present: current.future[0],
            future: current.future.slice(1),
          }
        : current,
    );
  }

  async function renderExport(side: Side) {
    const target = history.present[productId];
    await Promise.all(
      target.layers[side]
        .filter((layer): layer is Extract<Artwork, { kind: 'text' }> => layer.kind === 'text')
        .map((layer) =>
          ensureStudioFont(layer.font, layer.weight ?? (layer.font === 'bold' ? 700 : 400)),
        ),
    );
    await document.fonts.ready;
    const imageLayers = target.layers[side].filter(
      (layer): layer is Extract<Artwork, { kind: 'image' }> => layer.kind === 'image',
    );
    await Promise.all(
      imageLayers.map(async (layer) => {
        if (imagesRef.current.has(layer.src)) return;
        const image = new Image();
        image.src = layer.src;
        await image.decode();
        imagesRef.current.set(layer.src, image);
      }),
    );
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');
    ctx.scale(2, 2);
    drawScene(
      ctx,
      { product, color, side, layers: target.layers[side], images: imagesRef.current },
      true,
    );
    return canvas;
  }
  async function download(side: Side) {
    try {
      const canvas = await renderExport(side);
      const link = document.createElement('a');
      link.download = `genhora-${productId}-${side}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setFeedback(
        `Vista ${side} descargada. Adjunta el PNG manualmente al solicitar tu cotización.`,
      );
    } catch {
      setFeedback('No fue posible preparar la descarga. Inténtalo nuevamente.');
    }
  }
  async function shareImage() {
    if (!navigator.share || !navigator.canShare) {
      setFeedback(
        'Tu dispositivo no admite compartir archivos desde el navegador. Descarga la imagen y adjúntala manualmente.',
      );
      return;
    }
    try {
      const canvas = await renderExport(design.side);
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (result) => (result ? resolve(result) : reject(new Error('PNG failed'))),
          'image/png',
        ),
      );
      const file = new File([blob], `genhora-${productId}-${design.side}.png`, {
        type: 'image/png',
      });
      if (!navigator.canShare({ files: [file] })) {
        setFeedback(
          'Tu dispositivo no admite compartir este archivo. Descarga la imagen y adjúntala manualmente.',
        );
        return;
      }
      await navigator.share({ files: [file], text: message, title: 'Mi diseño GENHORA' });
      setFeedback(
        'Se abrió la opción de compartir del dispositivo. Confirma el envío en la aplicación que elijas.',
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setFeedback(
        'No fue posible compartir la imagen. Puedes descargarla y adjuntarla manualmente.',
      );
    }
  }

  const personalization =
    [
      design.layers.frente.length &&
        `frente: ${design.layers.frente.map((layer) => (layer.kind === 'text' ? `texto «${layer.text}»` : `imagen ${layer.name}`)).join(', ')}`,
      design.layers.espalda.length &&
        `espalda: ${design.layers.espalda.map((layer) => (layer.kind === 'text' ? `texto «${layer.text}»` : `imagen ${layer.name}`)).join(', ')}`,
    ]
      .filter(Boolean)
      .join('; ') || 'Por definir';
  const message = `Hola, GENHORA. Me gustaría cotizar una personalización que preparé en su sitio web.\n\nProducto: ${product.name}\nColor: ${colorName(design.color)} (${color})\n${product.sizes ? `Talla: ${size}\n` : ''}Cantidad: ${quantity || 'Por definir'}\nPersonalización: ${personalization}\nUbicación: ${design.layers.espalda.length ? 'frente y espalda' : design.side}\nObservaciones: ${notes.trim() || 'Ninguna'}\n\nYa preparé una vista previa de mi diseño y me gustaría conocer su precio y tiempo estimado de elaboración.`;
  const whatsapp = whatsappUrl(siteConfig.whatsappNumber, message);
  const validQuantity = /^\d+$/.test(quantity) && Number(quantity) > 0;
  return (
    <div className={styles.studio}>
      <header className={styles.intro}>
        <p className="eyebrow">ESTUDIO DE CREACIÓN GENHORA</p>
        <h1>
          Tu idea. <em>Tus reglas.</em>
        </h1>
        <p>
          Elige una pieza, dale tu sello y llévate una vista previa para cotizarla. Sin cuenta, sin
          complicaciones.
        </p>
      </header>
      <div className={styles.layout}>
        <div className={styles.tools}>
          <section className={styles.group}>
            <h2>
              <span>01</span> Elige tu lienzo
            </h2>
            <div className={styles.productChoices}>
              {studioProducts
                .filter((item) => item.available)
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={productId === item.id}
                    onClick={() => {
                      setProductId(item.id);
                      setSelectedId(null);
                      setSize('M');
                    }}
                  >
                    {item.name}
                    <small>{item.description}</small>
                  </button>
                ))}
            </div>
          </section>
          <section className={styles.group}>
            <h2>
              <span>02</span> Color y vista
            </h2>
            <p className={styles.help}>
              Los colores son ilustrativos. La disponibilidad y el tono final se confirman al
              cotizar.
            </p>
            <div className={styles.colorQuick}>
              {studioColors.slice(0, 2).map((entry) => (
                <button
                  key={entry.name}
                  type="button"
                  aria-label={entry.name}
                  aria-pressed={design.color === entry.name}
                  onClick={() => selectColor(entry.name)}
                  style={{ '--swatch': entry.value } as React.CSSProperties}
                >
                  <span />
                </button>
              ))}
              <button
                type="button"
                className={styles.paletteToggle}
                aria-expanded={paletteOpen}
                onClick={() => setPaletteOpen((open) => !open)}
              >
                {paletteOpen ? 'Cerrar paleta' : 'Explorar colores'}{' '}
                <span aria-hidden="true">⌄</span>
              </button>
            </div>
            <p className={styles.selectedColor}>
              {colorName(design.color)} · {color}
            </p>
            {paletteOpen && (
              <div className={styles.palettePanel}>
                <p className={styles.subhead}>Colores populares</p>
                <div className={styles.swatches}>
                  {product.colors.map((entry) => (
                    <button
                      key={entry.name}
                      type="button"
                      title={`${entry.name} ${entry.value}`}
                      aria-label={`${entry.name} ${entry.value}`}
                      aria-pressed={design.color === entry.name}
                      onClick={() => selectColor(entry.name)}
                      style={{ '--swatch': entry.value } as React.CSSProperties}
                    >
                      <span />
                    </button>
                  ))}
                </div>
                <p className={styles.subhead}>Tu propio tono</p>
                <div className={styles.customColor}>
                  <label>
                    Elegir color
                    <input
                      type="color"
                      value={color}
                      onChange={(event) => selectColor(event.target.value.toUpperCase())}
                    />
                  </label>
                  <label>
                    Código HEX
                    <input
                      type="text"
                      value={hexInput || color}
                      maxLength={7}
                      onChange={(event) => setHexInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          if (/^#[0-9a-fA-F]{6}$/.test(hexInput))
                            selectColor(hexInput.toUpperCase());
                          else setHexError('Escribe un HEX válido, por ejemplo #294D3A.');
                        }
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (/^#[0-9a-fA-F]{6}$/.test(hexInput)) selectColor(hexInput.toUpperCase());
                      else setHexError('Escribe un HEX válido, por ejemplo #294D3A.');
                    }}
                  >
                    Aplicar
                  </button>
                </div>
                {hexError && (
                  <p role="alert" className={styles.warning}>
                    {hexError}
                  </p>
                )}
              </div>
            )}
            {product.sides.length > 1 && (
              <div className={styles.segment}>
                {product.sides.map((side) => (
                  <button
                    key={side}
                    type="button"
                    aria-pressed={design.side === side}
                    onClick={() => {
                      changeDesign((current) => ({ ...current, side }));
                      setSelectedId(null);
                    }}
                  >
                    {side === 'frente' ? 'Frente' : 'Espalda'}
                  </button>
                ))}
              </div>
            )}
          </section>
          <section className={styles.group}>
            <h2>
              <span>03</span> Hazlo tuyo
            </h2>
            <div className={styles.toolActions}>
              <button type="button" onClick={() => addText()}>
                + Agregar texto
              </button>
              <button type="button" onClick={() => fileRef.current?.click()}>
                {selected?.kind === 'image' ? 'Reemplazar imagen' : '+ Subir imagen'}
              </button>
            </div>
            <input
              ref={fileRef}
              className={styles.fileInput}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => onFile(event.target.files?.[0])}
              aria-label="Subir PNG, JPG o WebP"
            />
            <p className={styles.help}>
              PNG, JPG o WebP · máximo 10 MB. Tu archivo permanece en esta pestaña.
            </p>
            {uploadError && (
              <p className={styles.warning} role="alert">
                {uploadError}
              </p>
            )}
            <p className={styles.subhead}>Un punto de partida</p>
            <div className={styles.motifs}>
              {motifs.map((motif) => (
                <button
                  type="button"
                  key={motif.name}
                  onClick={() => addText(motif.text, motif.font)}
                >
                  {motif.name}
                </button>
              ))}
            </div>
          </section>
          <section className={styles.group}>
            <h2>
              <span>04</span> Ajusta tu diseño
            </h2>
            {selected ? (
              <>
                <p className={styles.help}>
                  Seleccionado: {selected.kind === 'text' ? 'texto' : selected.name}. También puedes
                  arrastrarlo en la vista.
                </p>
                {selected.kind === 'text' && (
                  <>
                    <label>
                      Texto
                      <textarea
                        rows={2}
                        maxLength={60}
                        value={selected.text}
                        onChange={(event) => changeLayer({ text: event.target.value })}
                      />
                    </label>
                    <p className={styles.subhead}>
                      Tipografía · {fontOptions.find((option) => option.id === selected.font)?.name}
                    </p>
                    <div className={styles.fontCategories}>
                      {['Elegantes', 'Modernas', 'Impactantes', 'Manuscritas'].map((category) => (
                        <button
                          key={category}
                          type="button"
                          aria-pressed={fontCategory === category}
                          onClick={() => setFontCategory(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                    <div className={styles.fontChoices}>
                      {fontOptions
                        .filter((option) => option.category === fontCategory)
                        .map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            aria-label={`Tipografía ${option.name}`}
                            aria-pressed={selected.font === option.id}
                            onClick={() =>
                              changeLayer({
                                font: option.id,
                                weight: fontSupportsBold(option.id)
                                  ? (selected.weight ?? (option.id === 'bold' ? 700 : 400))
                                  : 400,
                              })
                            }
                          >
                            <span
                              style={{
                                fontFamily: `"${option.family}", serif`,
                                fontWeight: option.weight ?? '400',
                              }}
                            >
                              Aa Genhora
                            </span>
                            <small>{option.name}</small>
                          </button>
                        ))}
                    </div>
                    <label>
                      Color del texto
                      <input
                        type="color"
                        value={selected.color}
                        onChange={(event) => changeLayer({ color: event.target.value })}
                      />
                    </label>
                    <div className={styles.fieldPair}>
                      {fontSupportsBold(selected.font) && (
                        <label>
                          Grosor
                          <select
                            value={selected.weight ?? (selected.font === 'bold' ? 700 : 400)}
                            onChange={(event) =>
                              changeLayer({ weight: Number(event.target.value) as 400 | 700 })
                            }
                          >
                            <option value="400">Regular</option>
                            <option value="700">Negrita</option>
                          </select>
                        </label>
                      )}
                      <label>
                        Alineación
                        <select
                          value={selected.align ?? 'center'}
                          onChange={(event) =>
                            changeLayer({
                              align: event.target.value as 'left' | 'center' | 'right',
                            })
                          }
                        >
                          <option value="left">Izquierda</option>
                          <option value="center">Centro</option>
                          <option value="right">Derecha</option>
                        </select>
                      </label>
                    </div>
                  </>
                )}
                {selected.kind === 'image' && (
                  <p className={styles.help}>
                    Imagen: {selected.pixelWidth} × {selected.pixelHeight} px.
                  </p>
                )}
                <div className={styles.fieldPair}>
                  <label>
                    Horizontal <span>{Math.round(selected.x * 100)}%</span>
                    <input
                      type="range"
                      min="0.02"
                      max="0.98"
                      step="0.01"
                      value={selected.x}
                      onChange={(event) => changeLayer({ x: Number(event.target.value) })}
                    />
                  </label>
                  <label>
                    Vertical <span>{Math.round(selected.y * 100)}%</span>
                    <input
                      type="range"
                      min="0.02"
                      max="0.98"
                      step="0.01"
                      value={selected.y}
                      onChange={(event) => changeLayer({ y: Number(event.target.value) })}
                    />
                  </label>
                </div>
                <div className={styles.fieldPair}>
                  <label>
                    Tamaño <span>{Math.round(selected.scale * 100)}%</span>
                    <input
                      type="range"
                      min="0.02"
                      max="2"
                      step="0.01"
                      value={selected.scale}
                      onChange={(event) => changeLayer({ scale: Number(event.target.value) })}
                    />
                  </label>
                  <label>
                    Rotación <span>{selected.angle}°</span>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="1"
                      value={selected.angle}
                      onChange={(event) => changeLayer({ angle: Number(event.target.value) })}
                    />
                  </label>
                </div>
                <div className={styles.layerActions}>
                  <button
                    type="button"
                    onClick={() => {
                      const clone = {
                        ...selected,
                        id: newId(),
                        x: clamp(selected.x + 0.08, 0.02, 0.98),
                        y: clamp(selected.y + 0.08, 0.02, 0.98),
                      };
                      const ctx = canvasRef.current?.getContext('2d');
                      changeLayers((current) => [
                        ...current,
                        ctx ? constrainLayer(ctx, clone, product, design.side) : clone,
                      ]);
                      setSelectedId(clone.id);
                    }}
                  >
                    Duplicar
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      changeLayers((current) => {
                        const index = current.findIndex((layer) => layer.id === selected.id);
                        if (index < 0 || index === current.length - 1) return current;
                        const next = [...current];
                        const [layer] = next.splice(index, 1);
                        next.push(layer);
                        return next;
                      })
                    }
                  >
                    Traer al frente
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      changeLayers((current) =>
                        current.filter((layer) => layer.id !== selected.id),
                      );
                      setSelectedId(null);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
                {outside && (
                  <p className={styles.warning} role="status">
                    Parte del diseño está fuera de la zona y se recortará. Reduce su tamaño o
                    muévelo.
                  </p>
                )}
              </>
            ) : (
              <p className={styles.help}>
                Agrega un elemento y selecciónalo para cambiar posición, tamaño y rotación.
              </p>
            )}
          </section>
        </div>
        <div className={styles.previewColumn}>
          <div className={styles.previewTop}>
            <div>
              <p className="eyebrow">VISTA PREVIA ILUSTRATIVA</p>
              <h2>
                {product.name} · {design.side}
              </h2>
            </div>
            <div className={styles.historyActions}>
              <button type="button" disabled={!history.past.length} onClick={undo}>
                Deshacer
              </button>
              <button type="button" disabled={!history.future.length} onClick={redo}>
                Rehacer
              </button>
            </div>
          </div>
          <div className={styles.canvasWrap}>
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              onPointerDown={pointerDown}
              onPointerMove={pointerMove}
              onPointerUp={pointerUp}
              onPointerCancel={pointerUp}
              aria-label={`Vista editable de ${product.name}, ${design.color}, ${design.side}`}
              role="img"
            />
          </div>
          <div className={styles.previewFoot}>
            <label>
              <input
                type="checkbox"
                checked={guides}
                onChange={(event) => setGuides(event.target.checked)}
              />{' '}
              Mostrar zona y margen de seguridad
            </label>
            <button
              type="button"
              onClick={() => {
                if (
                  layers.length &&
                  !window.confirm('¿Restablecer esta vista? Se eliminarán sus elementos.')
                )
                  return;
                changeLayers(() => []);
                setSelectedId(null);
              }}
            >
              Restablecer esta vista
            </button>
          </div>
          <p className={styles.help}>
            Vista previa ilustrativa. Los colores, proporciones y acabados finales pueden variar. La
            zona marcada no representa medidas de impresión confirmadas.
          </p>
          <div className={styles.layers}>
            <h3>Capas de esta vista</h3>
            {layers.length ? (
              layers.map((layer) => (
                <button
                  type="button"
                  key={layer.id}
                  aria-pressed={selectedId === layer.id}
                  onClick={() => setSelectedId(layer.id)}
                >
                  {layer.kind === 'text' ? layer.text || 'Texto vacío' : layer.name}
                </button>
              ))
            ) : (
              <p>Aún no hay elementos. Puedes comenzar solo con texto.</p>
            )}
          </div>
        </div>
      </div>
      <section className={styles.quote}>
        <div>
          <p className="eyebrow">LLEVA TU IDEA MÁS LEJOS</p>
          <h2>Lista para imaginarla de verdad.</h2>
          <p>
            Descarga tu propuesta y compártela al solicitar una cotización. El archivo no se adjunta
            automáticamente a WhatsApp.
          </p>
        </div>
        <div className={styles.quoteFields}>
          <label>
            Cantidad de piezas
            <input
              type="number"
              min="1"
              max="100000"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </label>
          {product.sizes && (
            <label>
              Talla de referencia
              <select value={size} onChange={(event) => setSize(event.target.value)}>
                {product.sizes.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          )}
          <label className={styles.notes}>
            Observaciones (opcional)
            <textarea
              rows={2}
              maxLength={500}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Detalles que debamos saber"
            />
          </label>
          <div className={styles.quoteActions}>
            {product.sides.map((side) => (
              <button key={side} type="button" onClick={() => download(side)}>
                Descargar mi diseño · {side}
              </button>
            ))}
            <button type="button" onClick={shareImage}>
              Compartir imagen · {design.side}
            </button>
            {!validQuantity && (
              <p className={styles.warning} role="alert">
                Indica una cantidad mayor que cero para cotizar.
              </p>
            )}
            {whatsapp && validQuantity ? (
              <a className={styles.whatsapp} href={whatsapp} target="_blank" rel="noreferrer">
                Cotizar por WhatsApp ↗
              </a>
            ) : !whatsapp ? (
              <Link className={styles.whatsapp} href="/contacto">
                Ir a contacto ↗
              </Link>
            ) : null}
            <button
              type="button"
              className={styles.copy}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(message);
                  setFeedback('Mensaje de cotización copiado.');
                } catch {
                  setFeedback('No se pudo copiar automáticamente.');
                }
              }}
            >
              Copiar mensaje
            </button>
          </div>
          <p className={styles.help}>
            Descarga la imagen y adjúntala tú mismo en WhatsApp, o usa Compartir imagen si tu
            dispositivo lo permite. La cantidad, talla, colores y disponibilidad deben confirmarse.
            El archivo no se sube a este sitio.
          </p>
          <p role="status" className={styles.status}>
            {feedback}
          </p>
        </div>
      </section>
    </div>
  );
}
