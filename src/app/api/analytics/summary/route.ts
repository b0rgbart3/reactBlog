import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { AnalyticsEvent } from '@/src/models/AnalyticsEvent';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const days = Math.min(Math.max(parseInt(searchParams.get('days') ?? '30', 10), 1), 365);

  await connectDB();

  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Funnel totals
  const funnelAgg = await AnalyticsEvent.aggregate([
    { $match: { createdAt: { $gte: from } } },
    { $group: { _id: '$event', count: { $sum: 1 }, totalAmount: { $sum: '$amountTotal' } } },
  ]);

  const funnel: Record<string, number> = {
    product_view: 0,
    add_to_cart: 0,
    checkout_start: 0,
    order_complete: 0,
  };
  let revenueTotal = 0;
  for (const row of funnelAgg) {
    funnel[row._id] = row.count;
    if (row._id === 'order_complete') revenueTotal = row.totalAmount ?? 0;
  }

  // Per-product breakdown (views + carts only)
  const productAgg = await AnalyticsEvent.aggregate([
    { $match: { createdAt: { $gte: from }, event: { $in: ['product_view', 'add_to_cart'] }, productId: { $exists: true } } },
    { $group: { _id: { productId: '$productId', productName: '$productName', event: '$event' }, count: { $sum: 1 } } },
  ]);

  // Pivot into per-product map
  const productMap: Record<string, { productId: string; productName: string; views: number; addToCarts: number }> = {};
  for (const row of productAgg) {
    const { productId, productName, event } = row._id;
    if (!productMap[productId]) {
      productMap[productId] = { productId, productName: productName ?? productId, views: 0, addToCarts: 0 };
    }
    if (event === 'product_view') productMap[productId].views = row.count;
    if (event === 'add_to_cart') productMap[productId].addToCarts = row.count;
  }

  const byProduct = Object.values(productMap)
    .map((p) => ({
      ...p,
      conversionRate: p.views > 0 ? Math.round((p.addToCarts / p.views) * 100) : 0,
    }))
    .sort((a, b) => b.views - a.views);

  // Per-article breakdown
  const articleAgg = await AnalyticsEvent.aggregate([
    { $match: { createdAt: { $gte: from }, event: 'article_view', articleId: { $exists: true } } },
    { $group: { _id: { articleId: '$articleId', articleTitle: '$articleTitle' }, count: { $sum: 1 } } },
  ]);

  const byArticle = articleAgg
    .map((row) => ({
      articleId: row._id.articleId as string,
      articleTitle: (row._id.articleTitle ?? row._id.articleId) as string,
      views: row.count as number,
    }))
    .sort((a, b) => b.views - a.views);

  return NextResponse.json({
    funnel,
    byProduct,
    byArticle,
    revenueTotal,
    period: { days, from: from.toISOString(), to: new Date().toISOString() },
  });
}
