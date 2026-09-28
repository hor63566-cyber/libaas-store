// ------------------------------------------------------------
// About Us — short brand story.
// ------------------------------------------------------------

import styles from '../../styles/info.module.css';

export const metadata = { title: 'About Us — Libaas' };

export default function AboutPage() {
  return (
    <div className={`container ${styles.page}`}>
      <h1>About Us</h1>
      <p>
        Libaas started with a simple idea: beautiful eastern wear should not
        cost a fortune. We design unstitched fabrics, ready-to-wear outfits,
        fragrances and accessories that fit real life — office days, family
        dinners, wedding seasons and everything in between.
      </p>
      <p>
        Every piece is made in Pakistan with fabrics we would wear ourselves.
        We keep our prices honest, our stitching clean and our delivery fast,
        so you can shop with confidence from anywhere in the country.
      </p>

      <h2>What we stand for</h2>
      <ul>
        <li>Honest fabric quality at honest prices</li>
        <li>Cash on delivery — no advance payment needed</li>
        <li>7-day easy exchange on unworn items</li>
        <li>Customer care that actually picks up the phone</li>
      </ul>

      <h2>Our promise</h2>
      <p>
        If something is not right with your order, tell us. We would rather
        fix it than lose you. That is how a small brand becomes a trusted
        one.
      </p>
    </div>
  );
}
