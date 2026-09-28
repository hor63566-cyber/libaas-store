// ------------------------------------------------------------
// Category labels + home-page section groupings.
// Single source of truth so nav, shop filters and home tiles
// always agree.
// ------------------------------------------------------------

export const CATEGORY_LABELS = {
  // Unstitched
  'unstitched-summer': 'Summer Unstitched',
  'unstitched-embroidered': 'Embroidered Unstitched',
  'unstitched-printed': 'Printed Unstitched',
  'unstitched-lawn': 'Lawn Unstitched',
  // Ready to wear / Pret
  'pret-embroidered': 'Embroidered Pret',
  'pret-printed': 'Printed Pret',
  'pret-solids': 'Solids',
  'pret-coords': 'Co-Ords',
  'pret-festive': 'Festive / Formals',
  'pret-kurtis': 'Kurtis',
  'pret-bottoms': 'Bottoms',
  'men-pret': 'Men Pret',
  // Collections
  signature: 'Signature',
  silk: 'Silk',
  western: 'Western',
  // Fragrances
  'fragrance-men': 'Fragrances for Men',
  'fragrance-women': 'Fragrances for Women',
  // Accessories
  'acc-bags': 'Bags',
  'acc-footwear': 'Footwear',
  'acc-jewelry': 'Jewelry',
  'acc-shawls': 'Shawls',
  'acc-scarves': 'Scarves',
  'acc-sunglasses': 'Sunglasses',
  'acc-hair': 'Hair Accessories',
  'acc-watches': 'Watches',
  'acc-mufflers': 'Mufflers',
  'acc-dupattas': 'Dupattas',
};

export function categoryLabel(slug) {
  return CATEGORY_LABELS[slug] || slug;
}

// Nav departments — each one maps to the categories it should show
// on the shop page (?dept=women etc.)
export const DEPARTMENTS = {
  women: {
    label: 'Women',
    categories: [
      'unstitched-summer',
      'unstitched-embroidered',
      'unstitched-printed',
      'unstitched-lawn',
      'pret-embroidered',
      'pret-printed',
      'pret-solids',
      'pret-coords',
      'pret-festive',
      'pret-kurtis',
      'pret-bottoms',
      'signature',
      'silk',
      'western',
      'fragrance-women',
    ],
  },
  men: {
    label: 'Men',
    categories: ['men-pret', 'fragrance-men'],
  },
  accessories: {
    label: 'Accessories',
    categories: [
      'acc-bags',
      'acc-footwear',
      'acc-jewelry',
      'acc-shawls',
      'acc-scarves',
      'acc-sunglasses',
      'acc-hair',
      'acc-watches',
      'acc-mufflers',
      'acc-dupattas',
    ],
  },
};

export function departmentLabel(slug) {
  return (DEPARTMENTS[slug] && DEPARTMENTS[slug].label) || slug;
}

// Home page section groupings
export const UNSTITCHED_TILES = [
  { slug: 'unstitched-summer', tint: 'F6E7D7' },
  { slug: 'unstitched-embroidered', tint: 'EAD9C8' },
  { slug: 'unstitched-printed', tint: 'DFE8D5' },
  { slug: 'unstitched-lawn', tint: 'EADFE4' },
];

export const PRET_TILES = [
  { slug: 'pret-embroidered', tint: 'EFE3D3' },
  { slug: 'pret-printed', tint: 'E5D9E4' },
  { slug: 'pret-solids', tint: 'DDE4EA' },
  { slug: 'pret-coords', tint: 'EAE3D9' },
  { slug: 'pret-festive', tint: 'F3DDD3' },
  { slug: 'pret-kurtis', tint: 'E4EAD9' },
  { slug: 'pret-bottoms', tint: 'D9E2E4' },
];

export const COLLECTION_TILES = [
  { slug: 'signature', tint: 'EFE0CC' },
  { slug: 'silk', tint: 'E8D5DC' },
  { slug: 'pret-coords', tint: 'DFE3D8' },
  { slug: 'western', tint: 'D8DEE8' },
];

export const FRAGRANCE_TILES = [
  { slug: 'fragrance-men', label: 'For Men', tint: 'DDE3EA' },
  { slug: 'fragrance-women', label: 'For Women', tint: 'F0DCE4' },
];

export const ACCESSORY_TILES = [
  'acc-bags',
  'acc-footwear',
  'acc-jewelry',
  'acc-shawls',
  'acc-scarves',
  'acc-sunglasses',
  'acc-hair',
  'acc-watches',
  'acc-mufflers',
  'acc-dupattas',
];
