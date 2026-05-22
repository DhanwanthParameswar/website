// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

/** Cloudflare's worker dev runtime can fail locally (`module is not defined`). Use Node in dev; Cloudflare on build/deploy. */
const isDev = process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
  site: 'https://dhanwanth.com',
  prefetch: true,
  compressHTML: true,

  build: {
    inlineStylesheets: 'auto',
  },

  markdown: {
    shikiConfig: {
      theme: 'css-variables',
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    react(),
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        if (path.startsWith('/api/')) return false;
        if (path === '/magic.js' || path === '/recorder.js') return false;
        return true;
      },
    }),
  ],
  adapter: isDev
    ? undefined
    : cloudflare({
        imageService: 'compile',
        prerenderEnvironment: 'node',
      }),
});