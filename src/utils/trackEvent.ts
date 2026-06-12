export type AnalyticsEventName =
  | 'product_view'
  | 'add_to_cart'
  | 'checkout_start'
  | 'order_complete'
  | 'article_view';

export interface TrackEventPayload {
  event: AnalyticsEventName;
  productId?: string;
  productName?: string;
  articleId?: string;
  articleTitle?: string;
}

export function trackEvent(payload: TrackEventPayload, isAuthor = false): void {
  if (process.env.NEXT_PUBLIC_ENV === 'local') return;
  if (isAuthor) return;

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});
}
