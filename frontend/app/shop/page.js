'use client';

// ------------------------------------------------------------
// Shop / collection page — banner, sort dropdown (Featured,
// price low-high / high-low, newest), filter sidebar (category,
// price range, size, sale), product grid with "Show More".
// Initial filters come from the URL (?search=&category=&sort=).
// ------------------------------------------------------------

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import { getProducts } from '../../lib/api';
import { CATEGORY_LABELS, categoryLabel, DEPARTMENTS, departmentLabel } from '../../lib/categories';
import styles from '../../styles/shop.module.css';

const SORTS = [
  { value: '', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const PRICE_RANGES = [
  { value: '', label: 'All prices' },
  { value: '0-2000', label: 'Under Rs. 2,000' },
  { value: '2000-4000', label: 'Rs. 2,000 – 4,000' },
  { value: '4000-7000', label: 'Rs. 4,000 – 7,000' },
  { value: '7000-999999', label: 'Above Rs. 7,000' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'Unstitched'];
const PAGE_SIZE = 12;

function ShopInner() {
  const params = useSearchParams();
  const router = useRouter();

  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Filters, seeded from the URL
  const [search, setSearch] = useState(params.get('search') || '');
  const [category, setCategory] = useState(params.get('category') || '');
  const [dept, setDept] = useState(params.get('dept') || '');
  const [sort, setSort] = useState(params.get('sort') || '');
  const [priceRange, setPriceRange] = useState('');
  const [size, setSize] = useState('');
  const [saleOnly, setSaleOnly] = useState(params.get('sale') === '1');

  // Re-sync URL-driven filters when the URL changes (e.g. clicking a
  // different nav link). Same-route navigation does not remount the
  // page, so without this the old filter state would stick.
  useEffect(() => {
    setSearch(params.get('search') || '');
    setCategory(params.get('category') || '');
    setDept(params.get('dept') || '');
    setSort(params.get('sort') || '');
    setSaleOnly(params.get('sale') === '1');
    setPriceRange('');
    setSize('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // Fetch once; filter + sort client-side for instant UI
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProducts({})
      .then((data) => {
        if (!cancelled) {
          setAll(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [search, category, dept, sort, priceRange, size, saleOnly]);

  const filtered = useMemo(() => {
    let list = [...all];
    const q = search.trim().toLowerCase();

    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
      );
    }
    if (category) list = list.filter((p) => p.category === category);
    if (dept && DEPARTMENTS[dept]) {
      const deptCats = DEPARTMENTS[dept].categories;
      list = list.filter((p) => deptCats.includes(p.category));
    }
    if (saleOnly) {
      list = list.filter((p) => p.oldPrice && p.oldPrice > p.price);
    }
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      list = list.filter((p) => p.price >= min && p.price <= max);
    }
    if (size) {
      list = list.filter((p) => (p.sizes || []).includes(size));
    }

    switch (sort) {
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        break; // featured = backend order
    }

    return list;
  }, [all, search, category, dept, sort, priceRange, size, saleOnly]);

  // Keep shareable URL params for the main filters
  useEffect(() => {
    const q = new URLSearchParams();
    if (search) q.set('search', search);
    if (category) q.set('category', category);
    if (dept) q.set('dept', dept);
    if (sort) q.set('sort', sort);
    if (saleOnly) q.set('sale', '1');

    router.replace(`/shop${q.toString() ? `?${q}` : ''}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, dept, sort, saleOnly]);

  function clearFilters() {
    setSearch('');
    setCategory('');
    setDept('');
    setSort('');
    setPriceRange('');
    setSize('');
    setSaleOnly(false);
  }

  const hasFilters = search || category || dept || sort || priceRange || size || saleOnly;
  const shown = filtered.slice(0, visible);
  const bannerTitle = saleOnly
    ? 'Sale'
    : dept
      ? departmentLabel(dept)
      : category
        ? categoryLabel(category)
        : 'Shop All';

  return (
    <>
      {/* Collection banner */}
      <div className={styles.banner}>
        <div className="container">
          <h1>{bannerTitle}</h1>
          <p>
            {saleOnly
              ? 'Discounted favourites — while stocks last'
              : 'Thoughtfully made pieces for every wardrobe'}
          </p>
        </div>
      </div>

      <div className="container section">
        <div className={styles.layout}>
          {/* Filter sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sideBlock}>
              <h3>Category</h3>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                {Object.keys(CATEGORY_LABELS).map((slug) => (
                  <option key={slug} value={slug}>
                    {CATEGORY_LABELS[slug]}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.sideBlock}>
              <h3>Price</h3>
              {PRICE_RANGES.map((r) => (
                <label key={r.value} className={styles.radio}>
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange === r.value}
                    onChange={() => setPriceRange(r.value)}
                  />
                  {r.label}
                </label>
              ))}
            </div>

            <div className={styles.sideBlock}>
              <h3>Size</h3>
              <div className={styles.sizeRow}>
                <button
                  className={`${styles.sizeChip} ${size === '' ? styles.active : ''}`}
                  onClick={() => setSize('')}
                >
                  All
                </button>
                {SIZES.map((s) => (
                  <button
                    key={s}
                    className={`${styles.sizeChip} ${size === s ? styles.active : ''}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.sideBlock}>
              <label className={styles.radio}>
                <input
                  type="checkbox"
                  checked={saleOnly}
                  onChange={(e) => setSaleOnly(e.target.checked)}
                />
                On sale only
              </label>
            </div>

            {hasFilters && (
              <button className="btn btn-outline" onClick={clearFilters}>
                Clear all filters
              </button>
            )}
          </aside>

          {/* Results */}
          <div className={styles.results}>
            <div className={styles.topbar}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search products"
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort products"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <p className={styles.msg}>Loading products…</p>
            ) : filtered.length === 0 ? (
              <div className={styles.empty}>
                <p>No products match your filters.</p>
                <button className="btn btn-outline" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <p className={styles.count}>
                  {filtered.length} product{filtered.length === 1 ? '' : 's'} found
                </p>
                <div className={styles.grid}>
                  {shown.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
                {visible < filtered.length && (
                  <div className={styles.more}>
                    <button
                      className="btn btn-outline"
                      onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    >
                      Show More ({filtered.length - visible} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<p className="container section">Loading…</p>}>
      <ShopInner />
    </Suspense>
  );
}
