import { useEffect, useRef, useState } from "react";
import styles from "./BootScreen.module.scss";
import { AppleLogo } from "./icons";

const SESSION_KEY = "os-booted";
const BOOT_MS = 1500;
const FADE_MS = 420;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Whether the boot animation should play this session. Reduced-motion users
 * and repeat visits within the same tab (hot reload, in-app navigation) skip
 * it entirely — a portfolio that replays a boot animation on every load is
 * worse than no animation at all.
 */
export function shouldShowBootScreen() {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) !== "1";
  } catch {
    // sessionStorage unavailable (private mode edge cases) — don't gate.
    return true;
  }
}

function BootScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore
    }

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setExiting(true);
      window.setTimeout(onDone, FADE_MS);
    };

    // One rAF so the width-0 initial paint lands before the CSS transition
    // to 100% kicks in — this is a single trigger, not an animation loop.
    const raf = requestAnimationFrame(() => setProgress(100));
    const timer = window.setTimeout(finish, BOOT_MS);

    const onKeyDown = () => finish();
    const onClick = () => finish();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onClick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`${styles.boot} ${exiting ? styles.exit : ""}`}
      role="presentation"
      aria-hidden="true"
    >
      <AppleLogo className={styles.logo} />
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export default BootScreen;
