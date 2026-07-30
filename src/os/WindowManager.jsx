import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Window from "./Window";
import { useWindows } from "./state/windows";

/**
 * Renders every open window in stacking order and owns the window-level
 * keyboard shortcuts.
 */
function WindowManager() {
  const { stack, activeId, close, minimize } = useWindows();

  useEffect(() => {
    const onKeyDown = (e) => {
      if (!activeId) return;

      // ⌘W / Ctrl+W closes the focused window. The browser only lets us
      // preventDefault on this for non-primary tabs, but it works once the
      // page has focus, and Escape is the reliable fallback.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "w") {
        e.preventDefault();
        close(activeId);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        minimize(activeId);
        return;
      }
      if (e.key === "Escape") {
        close(activeId);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeId, close, minimize]);

  return (
    <AnimatePresence>
      {stack.map((win) => (
        <Window key={win.instanceId} win={win} />
      ))}
    </AnimatePresence>
  );
}

export default WindowManager;
