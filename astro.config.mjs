// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

/** Cloudflare's worker dev runtime can fail locally (`module is not defined`). Use Node in dev; Cloudflare on build/deploy. */
const isDev = process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
  site: 'https://dhanwanth.com',
  prefetch: true,

  markdown: {
    shikiConfig: {
      theme: 'css-variables',
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
  adapter: isDev
    ? undefined
    : cloudflare({
        imageService: 'compile',
        prerenderEnvironment: 'node',
      }),
});