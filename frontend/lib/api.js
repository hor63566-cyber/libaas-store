// ------------------------------------------------------------
// Small fetch wrappers around the Libaas backend API.
// Every helper fails soft (returns a safe default) so pages
// never crash when the backend is unreachable.
// ------------------------------------------------------------

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }

  return res.json();
}

// ---------- Products ----------

export async function getProducts(params = {}) {
  try {
    const query = new URLSearchParams();

    if (params.category) query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.sort) query.set('sort', params.sort);

    const suffix = query.toString() ? `?${query.toString()}` : '';
    return await request(`/api/products${suffix}`);
  } catch (err) {
    console.error('getProducts failed:', err.message);
    return [];
  }
}

export async function getProduct(id) {
  try {
    return await request(`/api/products/${id}`);
  } catch (err) {
    console.error('getProduct failed:', err.message);
    return null;
  }
}

export async function createProduct(data) {
  return request('/api/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id, data) {
  return request(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id) {
  return request(`/api/products/${id}`, { method: 'DELETE' });
}

// ---------- Orders ----------

export async function createOrder(order) {
  return request('/api/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });
}

export async function getOrders() {
  try {
    return await request('/api/orders');
  } catch (err) {
    console.error('getOrders failed:', err.message);
    return [];
  }
}

// ---------- Auth ----------

export async function signup(data) {
  return request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(data) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchMe(token) {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error('Session expired');
  return res.json();
}

// ---------- Orders ----------

export async function trackOrder(orderNumber, phone) {
  const q = new URLSearchParams({ orderNumber, phone }).toString();
  return request(`/api/orders/track?${q}`);
}

export async function updateOrderStatus(id, status) {
  return request(`/api/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ---------- Helpers ----------

export function formatPrice(amount) {
  return `Rs. ${Number(amount).toLocaleString('en-PK')}`;
}
