'use client';
import React, { useCallback, useEffect, useState } from "react";
import { useStore } from "../state/useStore";

export function PlacedOrdersTable() {
  const { placedOrders, setPlacedOrders } = useStore((s) => s);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [activeOpen, setActiveOpen] = useState(true);
  const [completedOpen, setCompletedOpen] = useState(true);

  const toggleField = useCallback((id: string, field: 'sentToPrinter' | 'sentToCustomer', value: boolean) => {
    setTogglingId(id);
    fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, [field]: value }),
    })
      .then(() => setPlacedOrders(placedOrders.map((o) => o._id === id ? { ...o, [field]: value } : o)))
      .catch((err) => console.error('Failed to update order:', err))
      .finally(() => setTogglingId(null));
  }, [placedOrders, setPlacedOrders]);

  const deleteOrder = useCallback((id: string) => {
    if (!confirm('Delete this order? This cannot be undone.')) return;
    setDeletingId(id);
    fetch('/api/orders', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      .then(() => setPlacedOrders(placedOrders.filter((o) => o._id !== id)))
      .catch((err) => console.error('Failed to delete order:', err))
      .finally(() => setDeletingId(null));
  }, [placedOrders, setPlacedOrders]);

  const loadOrders = useCallback(() => {
    setLoading(true);
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => setPlacedOrders(data.data ?? []))
      .catch((err) => console.error('Failed to fetch placed orders:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadOrders(); }, []);

  const activeOrders = placedOrders.filter((o) => !(o.sentToPrinter && o.sentToCustomer));
  const completedOrders = placedOrders.filter((o) => o.sentToPrinter && o.sentToCustomer);

  const renderOrder = (order) => (
        <div key={order._id} className="bUser">
          <div className="bUserHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              {order.customerName || order.customerEmail || 'Pending payment'}
              {order.customerName && order.customerEmail && ` — ${order.customerEmail}`}
              {' '}
              <span className={`bBadge ${order.status === 'paid' ? 'bBadge-true' : 'bBadge-false'}`}>
                {order.status}
              </span>
            </span>
            <button
              onClick={() => deleteOrder(order._id)}
              disabled={deletingId === order._id}
              style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: deletingId === order._id ? 0.4 : 0.6, padding: '0 4px' }}
              title="Delete order"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          </div>

          <div className="bRow">
            <div className="bLabel">Date</div>
            <div className="bItem">{new Date(order.createdAt).toLocaleString()}</div>
          </div>

          <div className="bRow">
            <div className="bLabel">Name</div>
            <div className="bItem">{order.shippingAddress?.name || order.customerName || <span style={{opacity: 0.4}}>—</span>}</div>
          </div>

          <div className="bRow">
            <div className="bLabel">Total</div>
            <div className="bItem">${((order.amountTotal ?? 0) / 100).toFixed(2)}</div>
          </div>

          <div className="bRow">
            <div className="bLabel">Ship to</div>
            <div className="bItem">
              {order.shippingAddress ? (
                <>
                  {order.shippingAddress.name}<br />
                  {order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                  {order.shippingAddress.country}
                </>
              ) : (
                <span style={{opacity: 0.4}}>Not collected yet</span>
              )}
            </div>
          </div>

          <div className="bRow">
            <div className="bLabel">Session</div>
            <div className="bItem"><span className="bHash">{order.stripeSessionId}</span></div>
          </div>

          {order.items?.map((item, i) => (
            <div key={i} className="bRow">
              <div className="bLabel">Item {i + 1}</div>
              <div className="bItem">
                {item.productName} — Size: {item.chosenSize} × {item.quantity} (${((item.unitAmount ?? 0) / 100).toFixed(2)} each)
              </div>
            </div>
          ))}

          <div className="bRow">
            <div className="bLabel">Sent to Printer</div>
            <div className="bItem">
              <input
                type="checkbox"
                checked={!!order.sentToPrinter}
                disabled={togglingId === order._id}
                onChange={(e) => toggleField(order._id, 'sentToPrinter', e.target.checked)}
              />
            </div>
          </div>

          <div className="bRow">
            <div className="bLabel">Sent to Customer</div>
            <div className="bItem">
              <input
                type="checkbox"
                checked={!!order.sentToCustomer}
                disabled={togglingId === order._id}
                onChange={(e) => toggleField(order._id, 'sentToCustomer', e.target.checked)}
              />
            </div>
          </div>
        </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span className="bMeta">{activeOrders.length} active · {completedOrders.length} completed</span>
        <div className="newArticleButton" onClick={loadOrders} style={{ opacity: loading ? 0.5 : 1 }}>
          {loading ? 'Loading…' : 'Refresh'}
        </div>
      </div>

      <div
        className="killCategory"
        onClick={() => setActiveOpen((v) => !v)}
        style={{ padding: '10px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}
      >
        <span>Active Orders ({activeOrders.length})</span>
        <span style={{ fontSize: 12, opacity: 0.6 }}>{activeOpen ? '▲' : '▼'}</span>
      </div>
      {activeOpen && (activeOrders.length === 0
        ? <div className="bMeta">No active orders.</div>
        : activeOrders.map((order) => <React.Fragment key={order._id}>{renderOrder(order)}</React.Fragment>)
      )}

      <div
        className="killCategory"
        onClick={() => setCompletedOpen((v) => !v)}
        style={{ marginTop: 16, padding: '10px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}
      >
        <span>Completed Orders ({completedOrders.length})</span>
        <span style={{ fontSize: 12, opacity: 0.6 }}>{completedOpen ? '▲' : '▼'}</span>
      </div>
      {completedOpen && (completedOrders.length === 0
        ? <div className="bMeta">No completed orders.</div>
        : completedOrders.map((order) => <React.Fragment key={order._id}>{renderOrder(order)}</React.Fragment>)
      )}
    </div>
  );
}
