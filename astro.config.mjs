// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

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

  integrations: [react()]
});