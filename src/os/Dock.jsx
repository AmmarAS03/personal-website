import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import styles from "./Dock.module.scss";
import { useWindows } from "./state/windows";
import { TrashGlyph } from "./icons";

// Tuned to feel like the real dock: icons within ~1.5 icon-widths of the
// cursor grow, falling off smoothly to BASE at DISTANCE px away.
const BASE = 50;
const MAX = 82;
const DISTANCE = 140;
const LIFT = 14;
const SPRING = { mass: 0.15, stiffness: 300, damping: 20 };

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** One dock icon: tracks its distance from the cursor and springs its own
 * size toward the magnification curve. Neighbours re-flow for free because
 * the size is real layout width/height, not a visual-only transform. */
function DockIcon({ mouseX, reduced, label, icon, accent, isOpen, onClick }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const el = ref.current;
    if (el === null) return DISTANCE;
    const rect = el.getBoundingClientRect();
    return val - (rect.left + rect.width / 2);
  });

  const sizeTarget = useTransform(distance, [-DISTANCE, 0, DISTANCE], [BASE, MAX, BASE]);
  const size = useSpring(reduced ? BASE : sizeTarget, SPRING);
  const lift = useTransform(size, [BASE, MAX], [0, -LIFT]);
  const fontSize = useTransform(size, (s) => s * 0.46);

  return (
    <div className={styles.slot}>
      <AnimatePresence>
        {hovered && (
          <motion.span
            className={styles.tooltip}
            initial={{ opacity: 0, y: 4, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.94 }}
            transition={{ duration: 0.12 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.button
        ref={ref}
        type="button"
        className={styles.item}
        style={{ width: size, height: size, y: reduced ? 0 : lift }}
        whileTap={reduced ? undefined : { scale: 0.92 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onClick={onClick}
        aria-label={label}
      >
        <span className={styles.icon} style={{ background: accent }}>
          <motion.span className={styles.glyph} style={{ fontSize }} aria-hidden="true">
            {icon}
          </motion.span>
        </span>
      </motion.button>
      <span className={`${styles.dot} ${isOpen ? styles.dotOn : ""}`} aria-hidden="true" />
    </div>
  );
}

/**
 * Behaviour contract worth preserving: clicking an app with a minimized
 * window restores it rather than opening a duplicate — openApp already
 * handles that for singleton apps, so dock clicks always route through it.
 */
function Dock() {
  const { apps, openApp, openAppIds } = useWindows();
  const reduced = usePrefersReducedMotion();
  const mouseX = useMotionValue(Infinity);

  return (
    <nav
      className={styles.dock}
      aria-label="Applications"
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      <div className={styles.panel}>
        <ul className={styles.items}>
          {apps.map((app) => (
            <li key={app.id}>
              <DockIcon
                mouseX={mouseX}
                reduced={reduced}
                label={app.name}
                icon={app.emoji}
                accent={app.accent}
                isOpen={openAppIds.has(app.id)}
                onClick={() => openApp(app.id)}
              />
            </li>
          ))}
          <li className={styles.separator} aria-hidden="true" />
          <li>
            <DockIcon
              mouseX={mouseX}
              reduced={reduced}
              label="Trash"
              icon={<TrashGlyph className={styles.trashGlyph} />}
              accent="linear-gradient(160deg, #6b6b70, #3a3a3e)"
              isOpen={false}
              onClick={() => {}}
            />
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Dock;
