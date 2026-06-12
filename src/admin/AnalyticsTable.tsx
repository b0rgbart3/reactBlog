'use client';
import React, { useEffect, useState } from 'react';

interface AnalyticsSummary {
  funnel: {
    product_view: number;
    add_to_cart: number;
    checkout_start: number;
    order_complete: number;
  };
  byProduct: {
    productId: string;
    productName: string;
    views: number;
    addToCarts: number;
    conversionRate: number;
  }[];
  byArticle: {
    articleId: string;
    articleTitle: string;
    views: number;
  }[];
  revenueTotal: number;
  period: { days: number; from: string; to: string };
}

export function AnalyticsTable() {
  const [days, setDays] = useState(30);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [productOpen, setProductOpen] = useState(true);
  const [articleOpen, setArticleOpen] = useState(true);

  const loadSummary = (d: number) => {
    setLoading(true);
    fetch(`/api/analytics/summary?days=${d}`)
      .then((r) => r.json())
      .then((data) => setSummary(data))
      .catch((err) => console.error('Failed to fetch analytics:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadSummary(days); }, [days]);

  const pct = (n: number) => {
    if (!summary || summary.funnel.product_view === 0) return '';
    return ` (${Math.round((n / summary.funnel.product_view) * 100)}%)`;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[7, 30, 90].map((d) => (
            <div
              key={d}
              className="newArticleButton"
              onClick={() => setDays(d)}
              style={{ opacity: days === d ? 1 : 0.45, pointerEvents: loading ? 'none' : 'auto' }}
            >
              {d}d
            </div>
          ))}
        </div>
        <div
          className="newArticleButton"
          onClick={() => loadSummary(days)}
          style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto' }}
        >
          {loading ? 'Loading…' : 'Refresh'}
        </div>
      </div>

      {summary && (
        <>
          <div className="bUser">
            <div className="bRow">
              <div className="bLabel">Product Views</div>
              <div className="bItem">{summary.funnel.product_view}</div>
            </div>
            <div className="bRow">
              <div className="bLabel">Add to Cart</div>
              <div className="bItem" style={{ display: 'flex', alignItems: 'center', gap: '0.4em' }}>
                <span>{summary.funnel.add_to_cart}</span>
                <span className="bMeta">{pct(summary.funnel.add_to_cart)}</span>
              </div>
            </div>
            <div className="bRow">
              <div className="bLabel">Checkout Started</div>
              <div className="bItem" style={{ display: 'flex', alignItems: 'center', gap: '0.4em' }}>
                <span>{summary.funnel.checkout_start}</span>
                <span className="bMeta">{pct(summary.funnel.checkout_start)}</span>
              </div>
            </div>
            <div className="bRow">
              <div className="bLabel">Purchased</div>
              <div className="bItem" style={{ display: 'flex', alignItems: 'center', gap: '0.4em' }}>
                <span>{summary.funnel.order_complete}</span>
                <span className="bMeta">{pct(summary.funnel.order_complete)}</span>
                {summary.revenueTotal > 0 && (
                  <span className="bMeta">— ${(summary.revenueTotal / 100).toFixed(2)}</span>
                )}
              </div>
            </div>
          </div>

          <div
            className="killCategory"
            onClick={() => setProductOpen((v) => !v)}
            style={{ marginTop: 16, padding: '10px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}
          >
            <span>By Product ({summary.byProduct.length})</span>
            <span style={{ fontSize: 12, opacity: 0.6 }}>{productOpen ? '▲' : '▼'}</span>
          </div>

          {productOpen && (
            summary.byProduct.length === 0
              ? <div className="bMeta">No product data for this period.</div>
              : summary.byProduct.map((p) => (
                <div key={p.productId} className="bUser" style={{ marginBottom: 6 }}>
                  <div className="bUserHeader">{p.productName}</div>
                  <div className="bRow">
                    <div className="bLabel">Views</div>
                    <div className="bItem">{p.views}</div>
                  </div>
                  <div className="bRow">
                    <div className="bLabel">Add to Cart</div>
                    <div className="bItem" style={{ display: 'flex', alignItems: 'center', gap: '0.4em' }}><span>{p.addToCarts}</span> <span className="bMeta">({p.conversionRate}% rate)</span></div>
                  </div>
                </div>
              ))
          )}

          <div
            className="killCategory"
            onClick={() => setArticleOpen((v) => !v)}
            style={{ marginTop: 16, padding: '10px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}
          >
            <span>Articles ({summary.byArticle.length})</span>
            <span style={{ fontSize: 12, opacity: 0.6 }}>{articleOpen ? '▲' : '▼'}</span>
          </div>

          {articleOpen && (
            summary.byArticle.length === 0
              ? <div className="bMeta">No article data for this period.</div>
              : summary.byArticle.map((a) => (
                <div key={a.articleId} className="bUser" style={{ marginBottom: 6 }}>
                  <div className="bUserHeader">{a.articleTitle}</div>
                  <div className="bRow">
                    <div className="bLabel">Views</div>
                    <div className="bItem">{a.views}</div>
                  </div>
                </div>
              ))
          )}
        </>
      )}
    </div>
  );
}
