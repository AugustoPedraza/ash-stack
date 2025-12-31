/**
 * Touch Gesture Actions
 *
 * Svelte actions for touch gestures.
 * use:swipe, use:pullToRefresh, use:longPress
 */

// ============================================
// SWIPE ACTION
// ============================================

/**
 * Swipe gesture action
 * @param {HTMLElement} node
 * @param {Object} options
 * @param {number} options.threshold - Minimum distance to trigger (default: 50)
 * @param {number} options.timeout - Max time for swipe in ms (default: 300)
 *
 * @example
 * <div use:swipe on:swipeleft={handleLeft} on:swiperight={handleRight}>
 */
export function swipe(node, options = {}) {
  const threshold = options.threshold || 50;
  const timeout = options.timeout || 300;

  let startX = 0;
  let startY = 0;
  let startTime = 0;

  function handleTouchStart(e) {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startTime = Date.now();
  }

  function handleTouchEnd(e) {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    const deltaTime = Date.now() - startTime;

    if (deltaTime > timeout) return;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Horizontal swipe
    if (absX > threshold && absX > absY) {
      const direction = deltaX > 0 ? 'right' : 'left';
      node.dispatchEvent(new CustomEvent(`swipe${direction}`, {
        detail: { deltaX, deltaY, deltaTime }
      }));
      node.dispatchEvent(new CustomEvent('swipe', {
        detail: { direction, deltaX, deltaY, deltaTime }
      }));
    }

    // Vertical swipe
    if (absY > threshold && absY > absX) {
      const direction = deltaY > 0 ? 'down' : 'up';
      node.dispatchEvent(new CustomEvent(`swipe${direction}`, {
        detail: { deltaX, deltaY, deltaTime }
      }));
      node.dispatchEvent(new CustomEvent('swipe', {
        detail: { direction, deltaX, deltaY, deltaTime }
      }));
    }
  }

  node.addEventListener('touchstart', handleTouchStart, { passive: true });
  node.addEventListener('touchend', handleTouchEnd, { passive: true });

  return {
    destroy() {
      node.removeEventListener('touchstart', handleTouchStart);
      node.removeEventListener('touchend', handleTouchEnd);
    }
  };
}

// ============================================
// PULL TO REFRESH ACTION
// ============================================

/**
 * Pull to refresh action
 * @param {HTMLElement} node
 * @param {Object} options
 * @param {number} options.threshold - Pull distance to trigger (default: 80)
 * @param {number} options.maxPull - Maximum pull distance (default: 120)
 * @param {boolean} options.disabled - Disable pull to refresh
 *
 * @example
 * <div use:pullToRefresh on:refresh={handleRefresh}>
 */
export function pullToRefresh(node, options = {}) {
  let threshold = options.threshold || 80;
  let maxPull = options.maxPull || 120;
  let disabled = options.disabled || false;

  let startY = 0;
  let currentY = 0;
  let pulling = false;
  let refreshing = false;

  function canPull() {
    // Only pull if at top of scroll container
    return node.scrollTop <= 0;
  }

  function handleTouchStart(e) {
    if (disabled || refreshing || !canPull()) return;

    startY = e.touches[0].clientY;
    pulling = true;
  }

  function handleTouchMove(e) {
    if (!pulling || disabled || refreshing) return;

    currentY = e.touches[0].clientY;
    const deltaY = Math.min(currentY - startY, maxPull);

    if (deltaY > 0 && canPull()) {
      e.preventDefault();

      const progress = Math.min(deltaY / threshold, 1);

      node.dispatchEvent(new CustomEvent('pullprogress', {
        detail: { progress, deltaY }
      }));

      // Apply transform
      node.style.transform = `translateY(${deltaY * 0.5}px)`;
    }
  }

  function handleTouchEnd() {
    if (!pulling || disabled) return;

    const deltaY = currentY - startY;

    // Reset transform
    node.style.transform = '';
    node.style.transition = 'transform 0.2s ease-out';
    setTimeout(() => {
      node.style.transition = '';
    }, 200);

    if (deltaY >= threshold && !refreshing) {
      refreshing = true;

      node.dispatchEvent(new CustomEvent('refresh', {
        detail: {
          done: () => {
            refreshing = false;
          }
        }
      }));
    }

    pulling = false;
    startY = 0;
    currentY = 0;
  }

  node.addEventListener('touchstart', handleTouchStart, { passive: true });
  node.addEventListener('touchmove', handleTouchMove, { passive: false });
  node.addEventListener('touchend', handleTouchEnd, { passive: true });

  return {
    update(newOptions) {
      threshold = newOptions.threshold || threshold;
      maxPull = newOptions.maxPull || maxPull;
      disabled = newOptions.disabled || false;
    },
    destroy() {
      node.removeEventListener('touchstart', handleTouchStart);
      node.removeEventListener('touchmove', handleTouchMove);
      node.removeEventListener('touchend', handleTouchEnd);
    }
  };
}

// ============================================
// LONG PRESS ACTION
// ============================================

/**
 * Long press action
 * @param {HTMLElement} node
 * @param {Object} options
 * @param {number} options.duration - Time to trigger in ms (default: 500)
 *
 * @example
 * <div use:longPress on:longpress={handleLongPress}>
 */
export function longPress(node, options = {}) {
  let duration = options.duration || 500;
  let timer = null;
  let startX = 0;
  let startY = 0;

  function handleStart(e) {
    const touch = e.touches?.[0] || e;
    startX = touch.clientX;
    startY = touch.clientY;

    timer = setTimeout(() => {
      node.dispatchEvent(new CustomEvent('longpress', {
        detail: { x: startX, y: startY }
      }));
    }, duration);
  }

  function handleMove(e) {
    if (!timer) return;

    const touch = e.touches?.[0] || e;
    const deltaX = Math.abs(touch.clientX - startX);
    const deltaY = Math.abs(touch.clientY - startY);

    // Cancel if moved too much
    if (deltaX > 10 || deltaY > 10) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function handleEnd() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  node.addEventListener('touchstart', handleStart, { passive: true });
  node.addEventListener('mousedown', handleStart);
  node.addEventListener('touchmove', handleMove, { passive: true });
  node.addEventListener('mousemove', handleMove);
  node.addEventListener('touchend', handleEnd, { passive: true });
  node.addEventListener('mouseup', handleEnd);
  node.addEventListener('mouseleave', handleEnd);

  return {
    update(newOptions) {
      duration = newOptions.duration || duration;
    },
    destroy() {
      clearTimeout(timer);
      node.removeEventListener('touchstart', handleStart);
      node.removeEventListener('mousedown', handleStart);
      node.removeEventListener('touchmove', handleMove);
      node.removeEventListener('mousemove', handleMove);
      node.removeEventListener('touchend', handleEnd);
      node.removeEventListener('mouseup', handleEnd);
      node.removeEventListener('mouseleave', handleEnd);
    }
  };
}

// ============================================
// PAN ACTION
// ============================================

/**
 * Pan gesture action (continuous drag)
 * @param {HTMLElement} node
 * @param {Object} options
 * @param {string} options.direction - 'horizontal', 'vertical', or 'both' (default: 'both')
 *
 * @example
 * <div use:pan on:panstart on:panmove on:panend>
 */
export function pan(node, options = {}) {
  const direction = options.direction || 'both';

  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let panning = false;

  function handleStart(e) {
    const touch = e.touches?.[0] || e;
    startX = touch.clientX;
    startY = touch.clientY;
    currentX = startX;
    currentY = startY;
    panning = true;

    node.dispatchEvent(new CustomEvent('panstart', {
      detail: { x: startX, y: startY }
    }));
  }

  function handleMove(e) {
    if (!panning) return;

    const touch = e.touches?.[0] || e;
    const prevX = currentX;
    const prevY = currentY;
    currentX = touch.clientX;
    currentY = touch.clientY;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const velocityX = currentX - prevX;
    const velocityY = currentY - prevY;

    // Check direction constraints
    if (direction === 'horizontal' && Math.abs(deltaY) > Math.abs(deltaX)) return;
    if (direction === 'vertical' && Math.abs(deltaX) > Math.abs(deltaY)) return;

    node.dispatchEvent(new CustomEvent('panmove', {
      detail: { deltaX, deltaY, velocityX, velocityY, x: currentX, y: currentY }
    }));
  }

  function handleEnd() {
    if (!panning) return;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    node.dispatchEvent(new CustomEvent('panend', {
      detail: { deltaX, deltaY, x: currentX, y: currentY }
    }));

    panning = false;
  }

  node.addEventListener('touchstart', handleStart, { passive: true });
  node.addEventListener('mousedown', handleStart);
  node.addEventListener('touchmove', handleMove, { passive: true });
  node.addEventListener('mousemove', handleMove);
  node.addEventListener('touchend', handleEnd, { passive: true });
  node.addEventListener('mouseup', handleEnd);

  return {
    destroy() {
      node.removeEventListener('touchstart', handleStart);
      node.removeEventListener('mousedown', handleStart);
      node.removeEventListener('touchmove', handleMove);
      node.removeEventListener('mousemove', handleMove);
      node.removeEventListener('touchend', handleEnd);
      node.removeEventListener('mouseup', handleEnd);
    }
  };
}

// ============================================
// PINCH ACTION
// ============================================

/**
 * Pinch/zoom gesture action
 * @param {HTMLElement} node
 *
 * @example
 * <div use:pinch on:pinch={({ detail: { scale } }) => {}}>
 */
export function pinch(node) {
  let initialDistance = 0;
  let currentScale = 1;

  function getDistance(touches) {
    const [t1, t2] = touches;
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function handleTouchStart(e) {
    if (e.touches.length === 2) {
      initialDistance = getDistance(e.touches);

      node.dispatchEvent(new CustomEvent('pinchstart', {
        detail: { scale: 1 }
      }));
    }
  }

  function handleTouchMove(e) {
    if (e.touches.length === 2) {
      const currentDistance = getDistance(e.touches);
      currentScale = currentDistance / initialDistance;

      node.dispatchEvent(new CustomEvent('pinch', {
        detail: { scale: currentScale }
      }));
    }
  }

  function handleTouchEnd() {
    if (initialDistance > 0) {
      node.dispatchEvent(new CustomEvent('pinchend', {
        detail: { scale: currentScale }
      }));

      initialDistance = 0;
      currentScale = 1;
    }
  }

  node.addEventListener('touchstart', handleTouchStart, { passive: true });
  node.addEventListener('touchmove', handleTouchMove, { passive: true });
  node.addEventListener('touchend', handleTouchEnd, { passive: true });

  return {
    destroy() {
      node.removeEventListener('touchstart', handleTouchStart);
      node.removeEventListener('touchmove', handleTouchMove);
      node.removeEventListener('touchend', handleTouchEnd);
    }
  };
}
