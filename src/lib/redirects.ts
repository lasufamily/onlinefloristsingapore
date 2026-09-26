export type RedirectRule = {
  from: string;
  to: string;
  status: 301;
};

export const redirects: RedirectRule[] = [
  { from: '/ols/products', to: '/flowers/', status: 301 },
  { from: '/collections/flowers', to: '/flowers/', status: 301 },
  { from: '/product-category/flowers/', to: '/flowers/', status: 301 },
  { from: '/category/flowers/', to: '/flowers/', status: 301 },
  { from: '/category/occasion/funeral-flowers/', to: '/occasions/funeral/', status: 301 },
  { from: '/category/funeral-flowers/', to: '/occasions/funeral/', status: 301 },
  { from: '/category/occasion/birthday/', to: '/occasions/birthday/', status: 301 },
  { from: '/collections/birthday/', to: '/occasions/birthday/', status: 301 },
  { from: '/category/last-minute-flower-delivery/', to: '/guides/same-day-flower-delivery/', status: 301 },
  { from: '/collections/last-minute-flower-delivery', to: '/guides/same-day-flower-delivery/', status: 301 },
  { from: '/fastest-online-flower-delivery-singapore/', to: '/guides/same-day-flower-delivery/', status: 301 },
  { from: '/category/occasion/official-opening/', to: '/occasions/grand-opening/', status: 301 },
  { from: '/collections/official-opening', to: '/occasions/grand-opening/', status: 301 },
  { from: '/product-category/occasion/official-opening/', to: '/occasions/grand-opening/', status: 301 },
  { from: '/product-category/occasion/anniversary/', to: '/occasions/anniversary/', status: 301 },
  { from: '/category/occasion/anniversary/', to: '/occasions/anniversary/', status: 301 },
  { from: '/product-category/occasion/proposal/', to: '/occasions/proposal/', status: 301 },
  { from: '/category/occasion/graduation/', to: '/occasions/graduation/', status: 301 },
  { from: '/corpoate/', to: '/gifts/hampers/corporate/', status: 301 },
  { from: '/corporate-flowers/', to: '/gifts/hampers/corporate/', status: 301 },
  { from: '/contact-us/', to: '/contact/', status: 301 },
  { from: '/flower-shop-online-singapore-florist/cheapest-online-florist-singapore', to: '/guides/flower-budgets/', status: 301 },
  { from: '/affordable-flowers/', to: '/guides/flower-budgets/', status: 301 },
  { from: '/category/flowers/preserved-flowers/', to: '/flowers/preserved/', status: 301 },
  { from: '/category/hampers/newborn-hamper/', to: '/gifts/hampers/newborn/', status: 301 },
  { from: '/category/flowers/rose/', to: '/flowers/fresh/roses/', status: 301 },
  { from: '/product/flowers-zenith-vd/', to: '/flowers/', status: 301 },
  { from: '/singapore-flower-culture/', to: '/flower-culture/', status: 301 },
  { from: '/singapore-flower-culture/vanda-miss-joaquim/', to: '/flower-culture/vanda-miss-joaquim/', status: 301 },
  { from: '/singapore-flower-culture/flower-dome/', to: '/flower-culture/flower-dome/', status: 301 },
  { from: '/singapore-flower-culture/gardens-by-the-bay/', to: '/flower-culture/gardens-by-the-bay/', status: 301 },
];

export function resolvedRedirects(): Record<string, string> {
  return Object.fromEntries(redirects.map(({ from, to }) => [from, to]));
}
