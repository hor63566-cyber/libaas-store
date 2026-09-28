'use client';

// ------------------------------------------------------------
// Admin panel — dashboard (orders, revenue, products), product
// CRUD form + table, orders list with status changes.
// (No login gate in this starter — add auth before going live.)
// ------------------------------------------------------------

import { useEffect, useMemo, useState } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  formatPrice,
} from '../../lib/api';
import { CATEGORY_LABELS } from '../../lib/categories';
import styles from '../../styles/admin.module.css';

const EMPTY_FORM = {
  name: '',
  price: '',
  oldPrice: '',
  category: 'unstitched-lawn',
  sku: '',
  sizes: '',
  colors: '',
  images: '',
  description: '',
  fabric: '',
  care: '',
  stock: '10',
  isNew: false,
};

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('dashboard');

  async function refresh() {
    const [p, o] = await Promise.all([getProducts({}), getOrders()]);
    setProducts(p);
    setOrders(o);
  }

  useEffect(() => {
    refresh();
  }, []);

  // ---------- Dashboard numbers ----------
  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const byStatus = {};
    STATUSES.forEach((s) => {
      byStatus[s] = orders.filter((o) => o.status === s).length;
    });
    return { revenue, total: orders.length, products: products.length, byStatus };
  }, [orders, products]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function splitList(str) {
    return str
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function fillForEdit(p) {
    setEditingId(p._id);
    setForm({
      name: p.name,
      price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : '',
      category: p.category,
      sku: p.sku || '',
      sizes: (p.sizes || []).join(', '),
      colors: (p.colors || []).join(', '),
      images: (p.images || []).join(', '),
      description: p.description || '',
      fabric: p.fabric || '',
      care: p.care || '',
      stock: String(p.stock ?? 10),
      isNew: !!p.isNew,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg('');

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      category: form.category,
      sku: form.sku.trim(),
      sizes: splitList(form.sizes),
      colors: splitList(form.colors),
      images: splitList(form.images),
      description: form.description.trim(),
      fabric: form.fabric.trim(),
      care: form.care.trim(),
      stock: Number(form.stock) || 0,
      isNew: form.isNew,
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        setMsg('Product updated.');
      } else {
        await createProduct(payload);
        setMsg('Product added.');
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      refresh();
    } catch (err) {
      setMsg(`Error: ${err.message}`);
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setMsg('Product deleted.');
      refresh();
    } catch (err) {
      setMsg(`Error: ${err.message}`);
    }
  }

  async function changeStatus(orderId, status) {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
      setMsg(`Order status changed to ${status}.`);
    } catch (err) {
      setMsg(`Error: ${err.message}`);
    }
  }

  return (
    <div className="container section">
      <h1 className={styles.title}>Admin Panel</h1>

      <div className={styles.tabs}>
        {[
          ['dashboard', 'Dashboard'],
          ['products', `Products (${products.length})`],
          ['orders', `Orders (${orders.length})`],
        ].map(([key, label]) => (
          <button
            key={key}
            className={tab === key ? styles.activeTab : ''}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      {/* ---------------- Dashboard ---------------- */}
      {tab === 'dashboard' && (
        <>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{stats.total}</span>
              <span className={styles.statLabel}>Total Orders</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{formatPrice(stats.revenue)}</span>
              <span className={styles.statLabel}>Revenue (excl. cancelled)</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{stats.products}</span>
              <span className={styles.statLabel}>Products</span>
            </div>
          </div>

          <h2 className={styles.sub}>Orders by Status</h2>
          <div className={styles.stats}>
            {STATUSES.map((s) => (
              <div key={s} className={styles.stat}>
                <span className={styles.statNum}>{stats.byStatus[s]}</span>
                <span className={styles.statLabel}>{s}</span>
              </div>
            ))}
          </div>

          <h2 className={styles.sub}>Latest Orders</h2>
          <div className={styles.orders}>
            {orders.slice(0, 5).map((o) => (
              <div key={o._id} className={styles.order}>
                <div className={styles.orderHead}>
                  <strong>{o.orderNumber || o._id.slice(-6).toUpperCase()}</strong>
                  <span className={styles.status}>{o.status}</span>
                  <span>{formatPrice(o.total)}</span>
                </div>
                <p>
                  {o.customer.name} · {o.customer.city}
                </p>
              </div>
            ))}
            {orders.length === 0 && <p>No orders yet.</p>}
          </div>
        </>
      )}

      {/* ---------------- Products ---------------- */}
      {tab === 'products' && (
        <>
          <form className={styles.form} onSubmit={onSubmit}>
            <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>

            <div className={styles.grid2}>
              <div className="field">
                <label>Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                >
                  {Object.keys(CATEGORY_LABELS).map((slug) => (
                    <option key={slug} value={slug}>
                      {CATEGORY_LABELS[slug]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Price (Rs.) *</label>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Old Price (Rs.) — for % OFF badge</label>
                <input
                  type="number"
                  min="0"
                  value={form.oldPrice}
                  onChange={(e) => set('oldPrice', e.target.value)}
                />
              </div>
              <div className="field">
                <label>SKU</label>
                <input
                  value={form.sku}
                  onChange={(e) => set('sku', e.target.value)}
                  placeholder="LB-UN-001"
                />
              </div>
              <div className="field">
                <label>Stock</label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => set('stock', e.target.value)}
                />
              </div>
              <div className="field">
                <label>Sizes (comma separated)</label>
                <input
                  value={form.sizes}
                  onChange={(e) => set('sizes', e.target.value)}
                  placeholder="XS, S, M, L, XL"
                />
              </div>
              <div className="field">
                <label>Colors (comma separated)</label>
                <input
                  value={form.colors}
                  onChange={(e) => set('colors', e.target.value)}
                  placeholder="Red, Blue"
                />
              </div>
            </div>

            <div className="field">
              <label>Image URLs (comma separated)</label>
              <input
                value={form.images}
                onChange={(e) => set('images', e.target.value)}
                placeholder="https://…"
              />
            </div>

            <div className="field">
              <label>Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </div>

            <div className={styles.grid2}>
              <div className="field">
                <label>Fabric</label>
                <input
                  value={form.fabric}
                  onChange={(e) => set('fabric', e.target.value)}
                />
              </div>
              <div className="field">
                <label>Fabric & Care notes</label>
                <input
                  value={form.care}
                  onChange={(e) => set('care', e.target.value)}
                />
              </div>
            </div>

            <label className={styles.check}>
              <input
                type="checkbox"
                checked={form.isNew}
                onChange={(e) => set('isNew', e.target.checked)}
              />
              Mark as NEW arrival
            </label>

            <div className={styles.formBtns}>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Save Changes' : 'Add Product'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setEditingId(null);
                    setForm(EMPTY_FORM);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{CATEGORY_LABELS[p.category] || p.category}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>{p.stock}</td>
                  <td className={styles.actions}>
                    <button onClick={() => fillForEdit(p)}>Edit</button>
                    <button onClick={() => onDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ---------------- Orders ---------------- */}
      {tab === 'orders' && (
        <div className={styles.orders}>
          {orders.length === 0 && <p>No orders yet.</p>}

          {orders.map((o) => (
            <div key={o._id} className={styles.order}>
              <div className={styles.orderHead}>
                <strong>{o.orderNumber || o._id.slice(-6).toUpperCase()}</strong>
                <select
                  value={o.status}
                  onChange={(e) => changeStatus(o._id, e.target.value)}
                  className={styles.statusSelect}
                  aria-label="Change order status"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <span>{new Date(o.createdAt).toLocaleString()}</span>
              </div>
              <p>
                {o.customer.name} · {o.customer.phone} · {o.customer.address},{' '}
                {o.customer.city}
                {o.customer.postalCode && ` ${o.customer.postalCode}`}
              </p>
              <ul>
                {o.items.map((it, i) => (
                  <li key={i}>
                    {it.name} {it.size && `(${it.size})`} × {it.qty} —{' '}
                    {formatPrice(it.price * it.qty)}
                  </li>
                ))}
              </ul>
              <p>
                <strong>Total: {formatPrice(o.total)}</strong>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
