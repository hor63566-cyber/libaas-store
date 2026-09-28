// ------------------------------------------------------------
// Root layout — fonts, metadata, navbar, footer, cart provider.
// ------------------------------------------------------------

import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { WishlistProvider } from '../context/WishlistContext';

export const metadata = {
  title: 'Libaas — Eastern Wear & Accessories',
  description:
    'Shop unstitched suits, pret wear, menswear and accessories online in Pakistan. Cash on delivery nationwide.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <AuthProvider>
            <WishlistProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <CartDrawer />
            </WishlistProvider>
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
