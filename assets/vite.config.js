import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    svelte()  // Must come after Tailwind
  ],
  resolve: {
    alias: [
      { find: '$lib', replacement: path.resolve('./svelte/lib') }
    ]
  }
});
