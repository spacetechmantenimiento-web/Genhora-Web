import test from 'node:test';
import assert from 'node:assert/strict';
import { products, lines, filterProducts, productPrice } from '../src/lib/catalog';
import { createBrief, quoteHref, whatsappUrl } from '../src/lib/config';
test('WhatsApp never produces a broken or unconfigured link', () => {
  for (const number of ['', ' ', 'abc', '+52', '123', '52 0000000000', '0000000000'])
    assert.equal(whatsappUrl(number, 'Hola'), null);
  const url = whatsappUrl('521234567890', 'Hola & mi idea: café ✳');
  assert.ok(url);
  assert.equal(new URL(url).searchParams.get('text'), 'Hola & mi idea: café ✳');
});
test('Catalog keeps product types and commercial lines independent', () => {
  assert.equal(products.length, 10);
  assert.equal(new Set(products.map((p) => p.slug)).size, 10);
  for (const line of lines) assert.ok(filterProducts(undefined, line.id).length > 0);
  assert.ok(
    filterProducts('textiles', 'business').every(
      (p) => p.category === 'textiles' && p.lines.includes('business'),
    ),
  );
  assert.equal(filterProducts('textiles', 'regalos').length, 0);
});
test('No invented prices appear in the initial catalog', () => {
  for (const p of products) {
    assert.equal(p.fromPrice, null);
    assert.equal(productPrice(p), 'Cotiza a tu medida');
  }
});
test('Selection and user content survive the quote handoff safely', () => {
  assert.equal(quoteHref('tote-bags'), '/contacto?producto=tote-bags');
  assert.equal(quoteHref(), '/contacto');
  const summary = createBrief({
    product: 'Tote bags',
    quantity: '25',
    idea: '  Flores & café  ',
    date: '2026-12-01',
  });
  assert.match(summary, /Producto: Tote bags/);
  assert.match(summary, /Cantidad estimada: 25/);
  assert.match(summary, /Mi idea: Flores & café/);
  assert.match(summary, /2026-12-01/);
});
