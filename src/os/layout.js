// Shared layout constants. The window system uses these to keep windows inside
// the usable desktop area, and the shell chrome (menu bar, dock) must render at
// these exact sizes — import from here rather than hardcoding.

export const MENUBAR_HEIGHT = 28;
export const DOCK_HEIGHT = 92;

// Below this width the desktop metaphor is abandoned: windows go fullscreen,
// one at a time, and the dock becomes an iOS-style bar.
export const MOBILE_BREAKPOINT = 768;

// Height of the iOS-style bottom bar that replaces the dock on mobile. The
// window system reserves exactly this strip at the bottom of a fullscreen
// mobile window, same contract as DOCK_HEIGHT on desktop.
export const MOBILE_DOCK_HEIGHT = 76;

// How far each new window is offset from the last, so they never stack exactly.
export const CASCADE_STEP = 28;
export const CASCADE_WRAP = 6;

// Smallest a window may be dragged down to, unless the app overrides minSize.
export const DEFAULT_MIN_SIZE = { w: 420, h: 320 };

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Usable desktop rect, excluding menu bar and dock. On mobile the menu bar is
 * gone and windows sit above the iOS-style bar, so the bounds are the full
 * viewport minus MOBILE_DOCK_HEIGHT.
 */
export function getDesktopBounds() {
  const mobile = window.innerWidth < MOBILE_BREAKPOINT;
  const top = mobile ? 0 : MENUBAR_HEIGHT;
  const dock = mobile ? MOBILE_DOCK_HEIGHT : DOCK_HEIGHT;
  return {
    top,
    left: 0,
    right: window.innerWidth,
    bottom: window.innerHeight - dock,
    width: window.innerWidth,
    height: window.innerHeight - top - dock,
  };
}
