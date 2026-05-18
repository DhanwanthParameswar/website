// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  prefetch: true,

  markdown: {
    shikiConfig: {
      theme: 'css-variables',
    },
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()],
  adapter: cloudflare({
    imageService: 'compile'
  })
});