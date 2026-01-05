/**
 * Shim for $app/environment (SvelteKit)
 * Used for standalone playground development
 */

export const browser = typeof window !== 'undefined';
export const dev = import.meta.env?.DEV ?? true;
export const building = false;
