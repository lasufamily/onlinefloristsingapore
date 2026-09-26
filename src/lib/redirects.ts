export type RedirectRule = {
  from: string;
  to: string;
  status: 301;
};

export const redirects: RedirectRule[] = [
  { from: '/collections/flowers', to: '/category/flowers/', status: 301 },
  { from: '/product-category/flowers/', to: '/category/flowers/', status: 301 },
  { from: '/category/occasion/funeral-flowers/', to: '/category/funeral-flowers/', status: 301 },
  { from: '/category/occasion/birthday/', to: '/collections/birthday/', status: 301 },
  {
    from: '/category/last-minute-flower-delivery/',
    to: '/fastest-online-flower-delivery-singapore/',
    status: 301,
  },
  {
    from: '/collections/last-minute-flower-delivery',
    to: '/fastest-online-flower-delivery-singapore/',
    status: 301,
  },
  {
    from: '/category/occasion/official-opening/',
    to: '/product-category/occasion/official-opening/',
    status: 301,
  },
  {
    from: '/collections/official-opening',
    to: '/product-category/occasion/official-opening/',
    status: 301,
  },
  {
    from: '/product-category/occasion/anniversary/',
    to: '/category/occasion/anniversary/',
    status: 301,
  },
  { from: '/corpoate/', to: '/corporate-flowers/', status: 301 },
  { from: '/contact-us/', to: '/contact/', status: 301 },
  {
    from: '/flower-shop-online-singapore-florist/cheapest-online-florist-singapore',
    to: '/affordable-flowers/',
    status: 301,
  },
  { from: '/product/flowers-zenith-vd/', to: '/category/flowers/', status: 301 },
];

export function resolvedRedirects(): Record<string, string> {
  return Object.fromEntries(redirects.map(({ from, to }) => [from, to]));
}
