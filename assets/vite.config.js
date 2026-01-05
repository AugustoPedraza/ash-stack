import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '$lib': path.resolve('./svelte/lib'),
      '$lib/components/ui': path.resolve('./svelte/components/ui'),
      '$app/environment': path.resolve('./svelte/lib/shims/environment.js')
    }
  }
});
