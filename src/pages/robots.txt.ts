import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  return new Response('User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: https://onlinefloristsingapore.com/sitemap-index.xml\n', {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
};
