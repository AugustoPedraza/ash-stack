/**
 * PWA-Optimized Animations
 * GPU-accelerated, respects motion preferences
 */

/**
 * Get computed motion scale from CSS
 */
export function getMotionScale() {
  if (typeof window === 'undefined') return 1;
  const scale = getComputedStyle(document.documentElement)
    .getPropertyValue('--motion-scale')
    .trim();
  return parseFloat(scale) || 1;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Scale duration by motion-scale
 */
export function scaleDuration(ms) {
  return ms * getMotionScale();
}

/**
 * Svelte transition: fade with motion-scale
 */
export function fade(node, { delay = 0, duration = 200 } = {}) {
  const scale = getMotionScale();
  if (scale === 0) return { duration: 0 };

  return {
    delay: delay * scale,
    duration: duration * scale,
    css: (t) => `opacity: ${t}`
  };
}

/**
 * Svelte transition: slide up with motion-scale
 */
export function slideUp(node, { delay = 0, duration = 200, y = 8 } = {}) {
  const scale = getMotionScale();
  if (scale === 0) return { duration: 0 };

  return {
    delay: delay * scale,
    duration: duration * scale,
    css: (t, u) => `
      opacity: ${t};
      transform: translateY(${u * y}px);
    `
  };
}

/**
 * Svelte transition: slide down with motion-scale
 */
export function slideDown(node, { delay = 0, duration = 200, y = 8 } = {}) {
  const scale = getMotionScale();
  if (scale === 0) return { duration: 0 };

  return {
    delay: delay * scale,
    duration: duration * scale,
    css: (t, u) => `
      opacity: ${t};
      transform: translateY(${-u * y}px);
    `
  };
}

/**
 * Svelte transition: scale in with motion-scale
 */
export function scaleIn(node, { delay = 0, duration = 200, start = 0.95 } = {}) {
  const scale = getMotionScale();
  if (scale === 0) return { duration: 0 };

  return {
    delay: delay * scale,
    duration: duration * scale,
    css: (t) => {
      const s = start + (1 - start) * t;
      return `
        opacity: ${t};
        transform: scale(${s});
      `;
    }
  };
}

/**
 * Svelte transition: fly (combines slide + fade)
 */
export function fly(node, {
  delay = 0,
  duration = 200,
  x = 0,
  y = 0,
  opacity = 0
} = {}) {
  const scale = getMotionScale();
  if (scale === 0) return { duration: 0 };

  const style = getComputedStyle(node);
  const targetOpacity = +style.opacity;
  const od = targetOpacity - opacity;

  return {
    delay: delay * scale,
    duration: duration * scale,
    css: (t, u) => `
      opacity: ${targetOpacity - (od * u)};
      transform: translate(${(1 - t) * x}px, ${(1 - t) * y}px);
    `
  };
}

/**
 * Stagger helper for list animations
 * @param {number} index - Item index
 * @param {number} baseDelay - Base delay in ms
 * @returns {number} Scaled delay
 */
export function staggerDelay(index, baseDelay = 50) {
  return scaleDuration(index * baseDelay);
}

/**
 * Animation presets for common patterns
 */
export const presets = {
  // Modal/dialog enter
  modalIn: { duration: 250, start: 0.95 },
  // Modal/dialog exit
  modalOut: { duration: 150, start: 0.95 },
  // Dropdown menu
  dropdown: { duration: 150, y: -4 },
  // Toast notification
  toast: { duration: 200, y: 16 },
  // Page transition
  page: { duration: 200, y: 8 },
  // List item
  listItem: { duration: 150, y: 4 }
};
