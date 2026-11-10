'use client';
export type CommerceEvent =
  | 'view_product'
  | 'select_product'
  | 'start_personalization'
  | 'add_custom_text'
  | 'upload_design'
  | 'preview_design'
  | 'download_preview'
  | 'click_quote'
  | 'open_whatsapp_quote'
  | 'view_business_kits'
  | 'start_business_quote'
  | 'open_business_whatsapp';
// Local integration point. No vendor, network request, identifiers or customer content.
export function trackCommerce(
  event: CommerceEvent,
  data: { productId?: string; source?: string } = {},
) {
  window.dispatchEvent(new CustomEvent('genhora:commerce', { detail: { event, ...data } }));
}
