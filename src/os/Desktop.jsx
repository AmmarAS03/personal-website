import { useEffect, useRef, useState } from "react";
import BootScreen, { shouldShowBootScreen } from "./BootScreen";
import styles from "./Desktop.module.scss";
import Dock from "./Dock";
import MenuBar from "./MenuBar";
import WindowManager from "./WindowManager";
import { useIsMobile } from "./hooks/useMediaQuery";
import { useWindows } from "./state/windows";
import { DOCK_HEIGHT, MENUBAR_HEIGHT, MOBILE_DOCK_HEIGHT } from "./layout";

/**
 * Owns the desktop surface: wallpaper, menu bar, the window layer, the dock,
 * and (once per browser session) the boot animation.
 *
 * MenuBar and Dock render at the heights declared in os/layout.js — the
 * window system reserves exactly that space when centring/maximizing/
 * clamping windows — published here as CSS custom properties so no
 * stylesheet has to hardcode the numbers.
 *
 * On mobile there is no menu bar (iOS has no equivalent); the dock renders
 * its own iOS-style strip at --mobile-dock-height instead.
 */
function Desktop() {
  const [booted, setBooted] = useState(() => !shouldShowBootScreen());
  const isMobile = useIsMobile();
  const { apps, openApp } = useWindows();

  // Greet the visitor: apps flagged `openOnBoot` in the registry launch
  // themselves once the desktop is up, so an empty wallpaper is never the first
  // thing anyone sees.
  //
  // Waits for `booted` rather than firing on mount, because window spawn
  // positions are computed from getDesktopBounds() and the window would
  // otherwise animate in from the dock behind the boot screen — the visitor
  // would miss the one animation this app has. When the boot screen is skipped
  // (reduced motion, or a repeat load in the same tab) `booted` starts true and
  // this runs immediately.
  const launched = useRef(false);
  useEffect(() => {
    if (!booted || launched.current) return;
    launched.current = true;
    apps.filter((app) => app.openOnBoot).forEach((app) => openApp(app.id));
  }, [booted, apps, openApp]);

  return (
    <div
      className={styles.desktop}
      style={{
        "--menubar-height": `${MENUBAR_HEIGHT}px`,
        "--dock-height": `${DOCK_HEIGHT}px`,
        "--mobile-dock-height": `${MOBILE_DOCK_HEIGHT}px`,
      }}
    >
      <div className={styles.wallpaper} aria-hidden="true" />
      {!isMobile && <MenuBar />}
      <main className={styles.windowLayer}>
        <WindowManager />
      </main>
      <Dock />
      {!booted && <BootScreen onDone={() => setBooted(true)} />}
    </div>
  );
}

export default Desktop;
