import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useIsPresent, useReducedMotion } from "framer-motion";
import styles from "./Window.module.scss";
import { usePointerDrag } from "./hooks/usePointerDrag";
import { useIsMobile } from "./hooks/useMediaQuery";
import { useWindows } from "./state/windows";
import { DEFAULT_MIN_SIZE, MOBILE_DOCK_HEIGHT, clamp, getDesktopBounds } from "./layout";

const HANDLES = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

// Fast, eased, not bouncy — see REVAMP.md §7. Each transition lives on the
// variant it belongs to so framer picks the right one automatically for
// whichever direction is playing (open/restore vs minimize vs close).
const OPEN_TRANSITION = { duration: 0.2, ease: [0.16, 1, 0.3, 1] };
const MINIMIZE_TRANSITION = { duration: 0.28, ease: [0.65, 0, 0.35, 1] };
const CLOSE_TRANSITION = { duration: 0.15, ease: [0.4, 0, 1, 1] };
const INSTANT = { duration: 0 };

// Maximize/restore moves the *rect* (left/top/width/height), not a transform,
// so framer-motion — which drives opacity/scale/x/y — can't animate it.
const ZOOM_MS = 250;
const ZOOM_EASING = "cubic-bezier(0.32, 0.72, 0, 1)";

/** Keeps a dragged titlebar reachable: never under the menu bar, never fully off-screen. */
function clampPosition(x, y, width, bounds) {
  return {
    x: clamp(x, bounds.left - width + 80, bounds.right - 80),
    y: clamp(y, bounds.top, bounds.bottom - 40),
  };
}

/**
 * Applies a resize delta for one handle, respecting the app's minimum size.
 * Dragging a north/west edge moves the origin as well as the size, so the
 * opposite edge must stay pinned — hence deriving x from the clamped width
 * rather than adding the raw delta.
 */
function resolveResize(handle, start, delta, min, bounds) {
  let { x, y, w, h } = start;

  if (handle.includes("e")) {
    w = clamp(start.w + delta.dx, min.w, bounds.right - start.x);
  }
  if (handle.includes("w")) {
    const right = start.x + start.w;
    w = clamp(start.w - delta.dx, min.w, right - bounds.left);
    x = right - w;
  }
  if (handle.includes("s")) {
    h = clamp(start.h + delta.dy, min.h, bounds.bottom - start.y);
  }
  if (handle.includes("n")) {
    const bottom = start.y + start.h;
    h = clamp(start.h - delta.dy, min.h, bottom - bounds.top);
    y = bottom - h;
  }

  return { x, y, w, h };
}

/**
 * Where should this window fly to/from when opening or minimizing? Points at
 * the matching dock icon's on-screen centre so the animation reads as
 * "this window lives in that icon." Falls back to a plain in-place scale
 * (no translation) if the icon can't be found — e.g. mid-resize, or if the
 * dock markup ever changes.
 */
function getDockIconCenter(appName) {
  if (typeof document === "undefined") return null;
  const buttons = document.querySelectorAll('nav[aria-label="Applications"] button');
  for (const btn of buttons) {
    if (btn.getAttribute("aria-label") === appName) {
      const r = btn.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return null;
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
  }
  return null;
}

function Window({ win }) {
  const { getApp, activeId, focus, close, minimize, toggleMaximize, setRect } =
    useWindows();
  const app = getApp(win.appId);
  const reduceMotion = useReducedMotion();
  const isPresent = useIsPresent();
  const isMobile = useIsMobile();

  // Live gesture rect. Kept in state rather than written straight to the DOM so
  // the commit on pointerup batches with the reset — writing the style directly
  // leaves one frame where the transform is cleared but the new rect hasn't
  // rendered yet, which reads as a flicker.
  const [ghost, setGhost] = useState(null);
  const startRect = useRef(null);
  const boundsRef = useRef(null);
  const handleRef = useRef(null);

  // Zoom animation bookkeeping — see the layout effect below.
  const nodeRef = useRef(null);
  const zoomAnim = useRef(null);
  const prevRect = useRef({ x: win.x, y: win.y, w: win.w, h: win.h });
  const prevMaximized = useRef(win.maximized);

  const isActive = activeId === win.instanceId;
  const min = app?.minSize ?? DEFAULT_MIN_SIZE;

  const beginGesture = useCallback(() => {
    // A grab always wins over an in-flight zoom, so the window tracks the
    // cursor instead of fighting the animation's interpolated geometry.
    zoomAnim.current?.cancel();
    focus(win.instanceId);
    startRect.current = { x: win.x, y: win.y, w: win.w, h: win.h };
    boundsRef.current = getDesktopBounds();
  }, [focus, win.instanceId, win.x, win.y, win.w, win.h]);

  const onTitlebarDrag = usePointerDrag({
    onStart: beginGesture,
    onMove: ({ dx, dy }) => {
      const start = startRect.current;
      const bounds = boundsRef.current;
      if (!start || !bounds) return;
      setGhost({
        ...start,
        ...clampPosition(start.x + dx, start.y + dy, start.w, bounds),
      });
    },
    onEnd: ({ dx, dy }) => {
      const start = startRect.current;
      const bounds = boundsRef.current;
      if (start && bounds && (dx || dy)) {
        setRect(win.instanceId, {
          ...clampPosition(start.x + dx, start.y + dy, start.w, bounds),
          w: start.w,
          h: start.h,
        });
      }
      setGhost(null);
    },
  });

  // One gesture for all eight handles; which edge is being dragged lives in a
  // ref set on pointerdown, so hook order stays flat and unconditional.
  const onResizeDrag = usePointerDrag({
    onStart: beginGesture,
    onMove: (delta) => {
      const start = startRect.current;
      const bounds = boundsRef.current;
      if (!start || !bounds || !handleRef.current) return;
      setGhost(resolveResize(handleRef.current, start, delta, min, bounds));
    },
    onEnd: (delta) => {
      const start = startRect.current;
      const bounds = boundsRef.current;
      if (start && bounds && handleRef.current && (delta.dx || delta.dy)) {
        setRect(win.instanceId, resolveResize(handleRef.current, start, delta, min, bounds));
      }
      handleRef.current = null;
      setGhost(null);
    },
  });

  // Where the "hidden" (minimized / not-yet-opened) pose should sit, expressed
  // as an offset + scale from the window's own rect. Only recomputed when the
  // window's committed rect changes (drag/resize commits, maximize) — not on
  // every ghost update while a gesture is live.
  //
  // On mobile the committed rect is ignored (the window renders fullscreen),
  // so the offset is measured from the fullscreen rect's centre instead —
  // otherwise the flight would start from wherever the stale desktop rect
  // happened to be and miss the icon entirely.
  const flyTarget = useMemo(() => {
    if (!app) return { x: 0, y: 0, scale: 0.85 };
    const target = getDockIconCenter(app.name);
    if (!target) return { x: 0, y: 24, scale: 0.85 };
    const centerX = isMobile ? window.innerWidth / 2 : win.x + win.w / 2;
    const centerY = isMobile
      ? (window.innerHeight - MOBILE_DOCK_HEIGHT) / 2
      : win.y + win.h / 2;
    return { x: target.x - centerX, y: target.y - centerY, scale: 0.1 };
  }, [app, isMobile, win.x, win.y, win.w, win.h]);

  // Presentation-only state machine layered on top of the reducer's
  // `minimized` flag: three poses (hidden / visible / exit), each carrying its
  // own transition so opening, minimizing, restoring and closing each get the
  // right feel without extra wiring in WindowManager.
  const variants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        scale: flyTarget.scale,
        x: flyTarget.x,
        y: flyTarget.y,
        transition: reduceMotion ? INSTANT : MINIMIZE_TRANSITION,
      },
      visible: {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        transition: reduceMotion ? INSTANT : OPEN_TRANSITION,
      },
      exit: {
        opacity: 0,
        scale: 0.92,
        transition: reduceMotion ? INSTANT : CLOSE_TRANSITION,
      },
    }),
    [flyTarget, reduceMotion]
  );

  // Zoom (maximize/restore). React has already committed the new rect by the
  // time any effect runs, so there is no "before" value left for a CSS
  // transition to animate from — the first attempt at this used a transient
  // class and never fired for exactly that reason. The Web Animations API does
  // not care: it animates from an explicit `from` keyframe regardless of what
  // the element's committed style already is.
  //
  // Driven off `win.maximized` rather than off a click handler so every route
  // into the zoom animates — green traffic light, titlebar double-click, and
  // the menu bar's Window › Zoom.
  useLayoutEffect(() => {
    const el = nodeRef.current;
    const from = prevRect.current;
    const to = { x: win.x, y: win.y, w: win.w, h: win.h };
    const maximizedChanged = prevMaximized.current !== win.maximized;
    prevRect.current = to;
    prevMaximized.current = win.maximized;

    // A titlebar drag off a maximized window also flips `maximized`, but it
    // only moves the window — the size is untouched. Requiring a size change
    // keeps that from being animated as a zoom.
    const sizeChanged = from.w !== to.w || from.h !== to.h;
    if (!el || !maximizedChanged || !sizeChanged || reduceMotion) return;

    zoomAnim.current?.cancel();
    zoomAnim.current = el.animate(
      [
        { left: `${from.x}px`, top: `${from.y}px`, width: `${from.w}px`, height: `${from.h}px` },
        { left: `${to.x}px`, top: `${to.y}px`, width: `${to.w}px`, height: `${to.h}px` },
      ],
      { duration: ZOOM_MS, easing: ZOOM_EASING, fill: "none" }
    );
  }, [win.maximized, win.x, win.y, win.w, win.h, reduceMotion]);

  if (!app) return null;

  const rect = ghost ?? win;
  const Body = app.component;
  // On mobile only the frontmost window is visible — it covers the others
  // entirely. A covered window is exactly like a minimized one (§8.7): still
  // mounted, but it must leave the tab order and the accessibility tree.
  const interactive = isPresent && !win.minimized && !(isMobile && !isActive);

  // Mobile windows fill the viewport above the iOS-style bar and cannot be
  // dragged or resized, so the committed desktop rect is bypassed entirely.
  // Percentages (not window.inner*) so rotation/resize re-layouts for free.
  const geometry = isMobile
    ? { left: 0, top: 0, width: "100%", height: `calc(100% - ${MOBILE_DOCK_HEIGHT}px)` }
    : { left: rect.x, top: rect.y, width: rect.w, height: rect.h };

  return (
    <motion.section
      ref={nodeRef}
      className={`${styles.window} ${isActive ? styles.active : ""} ${
        ghost ? styles.gesturing : ""
      } ${isMobile ? styles.mobile : ""}`}
      style={{
        ...geometry,
        zIndex: win.z,
        pointerEvents: interactive ? "auto" : "none",
      }}
      variants={variants}
      initial="hidden"
      animate={win.minimized ? "hidden" : "visible"}
      exit="exit"
      onPointerDown={interactive ? () => focus(win.instanceId) : undefined}
      role="dialog"
      aria-label={app.name}
      aria-hidden={interactive ? undefined : "true"}
      // Minimized/closing windows stay mounted so they have something to
      // animate, but they must leave the tab order too — `pointer-events:none`
      // and `aria-hidden` do not do that on their own, and `aria-hidden` over
      // focusable descendants is an ARIA violation (focus lands in a subtree
      // screen readers are told to ignore). `inert` removes both at once.
      // Empty string, not `true`: React 18 warns on non-boolean attributes.
      inert={interactive ? undefined : ""}
    >
      <header
        className={styles.titlebar}
        onPointerDown={isMobile ? undefined : onTitlebarDrag}
        onDoubleClick={isMobile ? undefined : () => toggleMaximize(win.instanceId)}
      >
        <div className={styles.lights}>
          <button
            type="button"
            className={`${styles.light} ${styles.closeLight}`}
            aria-label={`Close ${app.name}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => close(win.instanceId)}
          />
          {/* Minimize and zoom are desktop-only gestures — a fullscreen mobile
              window has nothing to zoom to, and "back to desktop" lives in the
              bottom bar. Close-only, per the phase-6 spec. */}
          {!isMobile && (
            <>
              <button
                type="button"
                className={`${styles.light} ${styles.minLight}`}
                aria-label={`Minimize ${app.name}`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => minimize(win.instanceId)}
              />
              <button
                type="button"
                className={`${styles.light} ${styles.maxLight}`}
                aria-label={`${win.maximized ? "Restore" : "Maximize"} ${app.name}`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => toggleMaximize(win.instanceId)}
              />
            </>
          )}
        </div>
        <span className={styles.title}>{app.name}</span>
        {/* Balances the traffic lights so the title stays optically centred. */}
        <div className={styles.lightsSpacer} aria-hidden="true" />
      </header>

      <div className={styles.body}>
        <Body />
      </div>

      {!isMobile &&
        !win.maximized &&
        HANDLES.map((handle) => (
          <div
            key={handle}
            className={`${styles.handle} ${styles[`handle_${handle}`]}`}
            onPointerDown={(e) => {
              handleRef.current = handle;
              onResizeDrag(e);
            }}
          />
        ))}
    </motion.section>
  );
}

export default Window;
