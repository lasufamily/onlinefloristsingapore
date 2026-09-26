import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://onlinefloristsingapore.com',
  output: 'static',
  devToolbar: { enabled: false },
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/api/') && !page.includes('/404') && !page.includes('/wp-content/uploads/'),
    }),
  ],
  vite: {
    server: { allowedHosts: ['localhost'] },
  },
});
