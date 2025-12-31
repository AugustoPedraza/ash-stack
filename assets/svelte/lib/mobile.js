/**
 * Mobile Utilities
 *
 * iOS-optimized utilities for PWA.
 * Haptics, safe areas, platform detection.
 */

import { readable, writable } from 'svelte/store';
import { browser } from '$app/environment';

// ============================================
// PLATFORM DETECTION
// ============================================

/**
 * Check if running on iOS
 */
export function isIOS() {
  if (!browser) return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

/**
 * Check if running as installed PWA
 */
export function isStandalone() {
  if (!browser) return false;
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
}

/**
 * Check if device supports touch
 */
export function isTouchDevice() {
  if (!browser) return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Platform store
 */
export const platform = readable({
  ios: false,
  android: false,
  standalone: false,
  touch: false
}, (set) => {
  if (browser) {
    const ua = navigator.userAgent;
    set({
      ios: isIOS(),
      android: /Android/.test(ua),
      standalone: isStandalone(),
      touch: isTouchDevice()
    });
  }
});

// ============================================
// HAPTIC FEEDBACK
// ============================================

/**
 * Haptic feedback types
 */
export const HapticType = {
  LIGHT: 'light',
  MEDIUM: 'medium',
  HEAVY: 'heavy',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  SELECTION: 'selection'
};

/**
 * Vibration patterns for different feedback types
 */
const vibrationPatterns = {
  light: [10],
  medium: [20],
  heavy: [30],
  success: [10, 50, 20],
  warning: [20, 50, 20],
  error: [30, 50, 30, 50, 30],
  selection: [5]
};

/**
 * Trigger haptic feedback
 * @param {string} type - Haptic type from HapticType
 */
export function haptic(type = HapticType.LIGHT) {
  if (!browser) return;

  // Try iOS Haptic Engine first (if available via Capacitor/Cordova)
  if (window.Capacitor?.Plugins?.Haptics) {
    const Haptics = window.Capacitor.Plugins.Haptics;
    switch (type) {
      case HapticType.LIGHT:
        Haptics.impact({ style: 'light' });
        break;
      case HapticType.MEDIUM:
        Haptics.impact({ style: 'medium' });
        break;
      case HapticType.HEAVY:
        Haptics.impact({ style: 'heavy' });
        break;
      case HapticType.SUCCESS:
        Haptics.notification({ type: 'success' });
        break;
      case HapticType.WARNING:
        Haptics.notification({ type: 'warning' });
        break;
      case HapticType.ERROR:
        Haptics.notification({ type: 'error' });
        break;
      case HapticType.SELECTION:
        Haptics.selectionStart();
        break;
    }
    return;
  }

  // Fallback to Vibration API
  if ('vibrate' in navigator) {
    navigator.vibrate(vibrationPatterns[type] || vibrationPatterns.light);
  }
}

/**
 * Create haptic action for use with use:haptic
 * @param {HTMLElement} node
 * @param {string} type - Haptic type
 */
export function hapticAction(node, type = HapticType.LIGHT) {
  function handleInteraction() {
    haptic(type);
  }

  node.addEventListener('touchstart', handleInteraction, { passive: true });

  return {
    update(newType) {
      type = newType;
    },
    destroy() {
      node.removeEventListener('touchstart', handleInteraction);
    }
  };
}

// ============================================
// SAFE AREA
// ============================================

/**
 * Safe area insets store
 */
export const safeArea = readable({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
}, (set) => {
  if (!browser) return;

  function updateSafeArea() {
    const style = getComputedStyle(document.documentElement);
    set({
      top: parseInt(style.getPropertyValue('--safe-area-top') || '0'),
      right: parseInt(style.getPropertyValue('--safe-area-right') || '0'),
      bottom: parseInt(style.getPropertyValue('--safe-area-bottom') || '0'),
      left: parseInt(style.getPropertyValue('--safe-area-left') || '0')
    });
  }

  updateSafeArea();
  window.addEventListener('resize', updateSafeArea);

  return () => {
    window.removeEventListener('resize', updateSafeArea);
  };
});

// ============================================
// KEYBOARD
// ============================================

/**
 * Virtual keyboard visibility store
 */
export const keyboard = writable({
  visible: false,
  height: 0
});

if (browser) {
  // Use Visual Viewport API for keyboard detection
  if (window.visualViewport) {
    const updateKeyboard = () => {
      const viewport = window.visualViewport;
      const windowHeight = window.innerHeight;
      const viewportHeight = viewport.height;
      const keyboardHeight = windowHeight - viewportHeight;

      keyboard.set({
        visible: keyboardHeight > 100, // Threshold to detect keyboard
        height: keyboardHeight > 100 ? keyboardHeight : 0
      });

      // Update CSS variable
      document.documentElement.style.setProperty(
        '--keyboard-offset',
        `${keyboardHeight > 100 ? keyboardHeight : 0}px`
      );
    };

    window.visualViewport.addEventListener('resize', updateKeyboard);
    window.visualViewport.addEventListener('scroll', updateKeyboard);
  }
}

// ============================================
// SCROLL LOCK
// ============================================

let scrollLockCount = 0;
let originalBodyStyle = '';

/**
 * Lock body scroll (for modals/sheets)
 */
export function lockScroll() {
  if (!browser) return;

  scrollLockCount++;
  if (scrollLockCount === 1) {
    originalBodyStyle = document.body.style.cssText;
    const scrollY = window.scrollY;
    document.body.style.cssText = `
      position: fixed;
      top: -${scrollY}px;
      left: 0;
      right: 0;
      overflow: hidden;
    `;
  }
}

/**
 * Unlock body scroll
 */
export function unlockScroll() {
  if (!browser) return;

  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    const scrollY = parseInt(document.body.style.top || '0') * -1;
    document.body.style.cssText = originalBodyStyle;
    window.scrollTo(0, scrollY);
  }
}

// ============================================
// ORIENTATION
// ============================================

/**
 * Device orientation store
 */
export const orientation = readable('portrait', (set) => {
  if (!browser) return;

  function updateOrientation() {
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    set(isPortrait ? 'portrait' : 'landscape');
  }

  updateOrientation();
  window.addEventListener('orientationchange', updateOrientation);
  window.addEventListener('resize', updateOrientation);

  return () => {
    window.removeEventListener('orientationchange', updateOrientation);
    window.removeEventListener('resize', updateOrientation);
  };
});
