export type AnalyticsEventName =
  | 'product_view'
  | 'add_to_cart'
  | 'checkout_start'
  | 'order_complete';

export interface TrackEventPayload {
  event: AnalyticsEventName;
  productId?: string;
  productName?: string;
}

export function trackEvent(payload: TrackEventPayload): void {
  if (process.env.NEXT_PUBLIC_ENV === 'local') return;

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});
}
