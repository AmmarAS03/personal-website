import { useCallback, useEffect, useRef } from "react";

/**
 * Tracks a single pointer drag and reports cumulative deltas from the origin.
 *
 * Callbacks are held in refs so the listeners attached on pointerdown always
 * see the latest ones — otherwise a drag started on one render would keep
 * calling stale closures for its whole lifetime.
 *
 * Moves are coalesced into one rAF tick: pointermove can fire several times
 * per frame, and each one would otherwise trigger its own React render.
 */
export function usePointerDrag({ onStart, onMove, onEnd }) {
  const handlers = useRef({ onStart, onMove, onEnd });
  handlers.current = { onStart, onMove, onEnd };

  const cleanup = useRef(null);

  useEffect(() => () => cleanup.current?.(), []);

  return useCallback((event) => {
    // Ignore secondary buttons, and let nested controls (buttons, links,
    // scrollers) keep their own click behaviour.
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();

    const origin = { x: event.clientX, y: event.clientY };
    let frame = null;
    let latest = { dx: 0, dy: 0 };

    handlers.current.onStart?.();

    const flush = () => {
      frame = null;
      handlers.current.onMove?.(latest);
    };

    const handleMove = (e) => {
      latest = { dx: e.clientX - origin.x, dy: e.clientY - origin.y };
      if (frame === null) frame = requestAnimationFrame(flush);
    };

    const finish = (e) => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      document.body.classList.remove("os-dragging");
      cleanup.current = null;

      const delta =
        e.type === "pointercancel"
          ? latest
          : { dx: e.clientX - origin.x, dy: e.clientY - origin.y };
      handlers.current.onEnd?.(delta);
    };

    // Suppresses text selection and iframe pointer capture mid-drag.
    document.body.classList.add("os-dragging");
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
    cleanup.current = () => finish({ type: "pointercancel" });
  }, []);
}
