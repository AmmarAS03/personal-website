import { useCallback, useRef, useState } from "react";
import styles from "./Window.module.scss";
import { usePointerDrag } from "./hooks/usePointerDrag";
import { useWindows } from "./state/windows";
import { DEFAULT_MIN_SIZE, clamp, getDesktopBounds } from "./layout";

const HANDLES = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

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

function Window({ win }) {
  const { getApp, activeId, focus, close, minimize, toggleMaximize, setRect } =
    useWindows();
  const app = getApp(win.appId);

  // Live gesture rect. Kept in state rather than written straight to the DOM so
  // the commit on pointerup batches with the reset — writing the style directly
  // leaves one frame where the transform is cleared but the new rect hasn't
  // rendered yet, which reads as a flicker.
  const [ghost, setGhost] = useState(null);
  const startRect = useRef(null);
  const boundsRef = useRef(null);
  const handleRef = useRef(null);

  const isActive = activeId === win.instanceId;
  const min = app?.minSize ?? DEFAULT_MIN_SIZE;

  const beginGesture = useCallback(() => {
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

  if (!app || win.minimized) return null;

  const rect = ghost ?? win;
  const Body = app.component;

  return (
    <section
      className={`${styles.window} ${isActive ? styles.active : ""} ${
        ghost ? styles.gesturing : ""
      }`}
      style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h, zIndex: win.z }}
      onPointerDown={() => focus(win.instanceId)}
      role="dialog"
      aria-label={app.name}
    >
      <header
        className={styles.titlebar}
        onPointerDown={onTitlebarDrag}
        onDoubleClick={() => toggleMaximize(win.instanceId)}
      >
        <div className={styles.lights}>
          <button
            type="button"
            className={`${styles.light} ${styles.closeLight}`}
            aria-label={`Close ${app.name}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => close(win.instanceId)}
          />
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
        </div>
        <span className={styles.title}>{app.name}</span>
        {/* Balances the traffic lights so the title stays optically centred. */}
        <div className={styles.lightsSpacer} aria-hidden="true" />
      </header>

      <div className={styles.body}>
        <Body />
      </div>

      {!win.maximized &&
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
    </section>
  );
}

export default Window;
