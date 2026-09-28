# Libaas — Clothing E-commerce Store

A full-stack online clothing store (Limelight-style layout) built with
**Next.js** (frontend), **Node.js + Express** (backend) and **MongoDB**.

> **Brand note:** "Libaas" is a **placeholder brand name**. Rename it to the
> client's real brand before launch — see "Renaming the brand" below.
> All product names, text and images in this project are original placeholders.
> The `placehold.co` images must be replaced with real product photography.

## Project structure

```
clothing-store/
  README.md
  frontend/          # Next.js 14 (App Router, plain JavaScript, CSS Modules)
    app/             # home, shop, product/[id], cart, checkout, admin,
                     # login, signup, wishlist, track-order, about, contact,
                     # faqs, shipping-policy, returns, privacy, terms
    components/      # Navbar, Footer, HeroSlider, HomeSections,
                     # ProductCard, ProductCarousel, CartDrawer
    context/         # CartContext, AuthContext, WishlistContext
    lib/             # api.js (fetch wrappers), categories.js
    lib/api.js       # backend fetch wrappers
    styles/          # one *.module.css per component/page
  backend/           # Express API
    server.js        # app entry
    models/          # Product.js, Order.js, User.js (Mongoose)
    routes/          # productRoutes.js, orderRoutes.js, authRoutes.js
    seed.js          # ~30 sample products across all sections
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas connection string)

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env     # edit MONGO_URI / PORT if needed
npm install
npm run seed             # loads ~30 sample products
npm run dev              # starts API on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:5000
npm install
npm run dev                        # starts site on http://localhost:3000
```

Open http://localhost:3000 — the shop, cart and checkout talk to the API.
The admin panel lives at http://localhost:3000/admin.

## Key features

- Homepage: announcement bar, auto-slide hero (arrows + dots), shop-by-category
  (Unstitched / Pret), shop-by-collection (Signature, Silk, Co-Ords, Western),
  fragrances, accessories grid, new-arrivals carousel, sale section
- **Prominent live search** in the navbar — suggestions appear as you type
  (thumbnail, name, price); Enter opens the full results on the shop page
- Navbar: sticky, Sale link, wishlist heart with badge, cart with badge,
  Login/Sign Up button or logged-in user's name
- Shop page: collection banner, sort (Featured / price low-high / high-low /
  newest), filter sidebar (category, price range, size, sale only), Show More
- Product page: gallery with thumbnails, % OFF + NEW badges, size buttons,
  color dots, quantity stepper, Add to Cart + Buy Now, wishlist heart,
  delivery info, accordions (details / fabric & care / shipping & returns), SKU
- Cart drawer (Checkout + View Cart) + cart page
- Cash-on-delivery checkout: name, phone, address, city, postal code; logged-in
  users get auto-fill; success screen shows the order number (LB-xxxxxx)
- Login / Sign Up pages (bcrypt-hashed passwords, JWT session); navbar shows
  the user's first name when logged in
- Wishlist page (heart icon, localStorage)
- Track Order page (order number + phone)
- Info pages: About, Contact, FAQs, Shipping Policy, Returns & Exchange,
  Privacy Policy, Terms & Conditions
- Footer: 4 columns (About / Customer Care / Contact / Newsletter + socials),
  bottom bar with COD / VISA / MASTERCARD badges
- Admin panel: dashboard (orders, revenue, products, orders by status),
  product CRUD, orders list with status change (pending → delivered)

## API reference

| Method | Endpoint              | Notes                                      |
| ------ | --------------------- | ------------------------------------------ |
| GET    | /api/products         | `?category=` `?search=` `?sort=` supported |
| GET    | /api/products/:id     | single product                             |
| POST   | /api/products         | create (admin)                             |
| PUT    | /api/products/:id     | update (admin)                             |
| DELETE | /api/products/:id     | delete (admin)                             |
| POST   | /api/orders           | place COD order (validated)                |
| GET    | /api/orders           | list orders, newest first                  |
| GET    | /api/orders/track     | track by ?orderNumber=&phone=              |
| PATCH  | /api/orders/:id       | change order status (admin)                |
| POST   | /api/auth/signup      | create account (bcrypt hash), returns JWT  |
| POST   | /api/auth/login       | log in, returns JWT                        |
| GET    | /api/auth/me          | current user from Bearer token             |

## Renaming the brand

1. Search the `frontend` folder for `Libaas` and replace with the real name
   (logo text, page titles, footer, placeholder images).
2. Update `frontend/app/layout.js` metadata (title + description).
3. Update `backend/package.json` name/description and `backend/.env.example`
   (`MONGO_URI=.../yourdbname`).
4. Replace every `placehold.co` image URL with real product photos.

## Before going live

- Add authentication to `/admin` and the write APIs (currently open).
- Add rate limiting and input sanitising on the API.
- Point `NEXT_PUBLIC_API_URL` at the production backend URL.
