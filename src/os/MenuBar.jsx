import { useEffect, useRef, useState } from "react";
import styles from "./MenuBar.module.scss";
import { useWindows } from "./state/windows";
import { profile } from "../data/profile";
import { AppleLogo, BatteryGlyph, ControlCenterGlyph, WifiGlyph } from "./icons";

/**
 * Translucent menu bar with a working (if mostly cosmetic) menu system: the
 * Apple menu and the Window/File menus act on the focused window through
 * useWindows(); Edit/View/Help are dressed to look real but inert, same as
 * they'd be for a web page with no document model behind them.
 */
function MenuBar() {
  const { getApp, activeAppId, activeId, close, minimize, toggleMaximize } = useWindows();
  const [now, setNow] = useState(() => new Date());
  const [openMenu, setOpenMenu] = useState(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!openMenu) return undefined;
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpenMenu(null);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  const activeApp = getApp(activeAppId);
  const activeName = activeApp?.name ?? "Finder";

  const menus = [
    {
      id: "apple",
      isApple: true,
      items: [
        { label: `About ${profile.shortName ?? profile.name}`, disabled: true },
        { separator: true },
        { label: "System Settings…", disabled: true },
        { label: "App Store…", disabled: true },
        { separator: true },
        { label: "Sleep", disabled: true },
        { label: "Restart…", disabled: true },
        { label: "Shut Down…", disabled: true },
      ],
    },
    {
      id: "file",
      label: "File",
      items: [
        { label: "New Window", shortcut: "⌘N", disabled: true },
        {
          label: "Close Window",
          shortcut: "⌘W",
          disabled: !activeId,
          action: () => activeId && close(activeId),
        },
      ],
    },
    {
      id: "edit",
      label: "Edit",
      items: [
        { label: "Undo", shortcut: "⌘Z", disabled: true },
        { label: "Redo", shortcut: "⇧⌘Z", disabled: true },
        { separator: true },
        { label: "Cut", shortcut: "⌘X", disabled: true },
        { label: "Copy", shortcut: "⌘C", disabled: true },
        { label: "Paste", shortcut: "⌘V", disabled: true },
        { label: "Select All", shortcut: "⌘A", disabled: true },
      ],
    },
    {
      id: "view",
      label: "View",
      items: [
        { label: "Show All Windows", disabled: true },
        { label: "Enter Full Screen", shortcut: "⌃⌘F", disabled: true },
      ],
    },
    {
      id: "window",
      label: "Window",
      items: [
        {
          label: "Minimize",
          shortcut: "⌘M",
          disabled: !activeId,
          action: () => activeId && minimize(activeId),
        },
        {
          label: "Zoom",
          disabled: !activeId,
          action: () => activeId && toggleMaximize(activeId),
        },
        { separator: true },
        { label: activeId ? activeName : "No Windows", disabled: true },
      ],
    },
    {
      id: "help",
      label: "Help",
      items: [{ label: `${activeName} Help`, disabled: true }],
    },
  ];

  const renderMenu = (menu, extraLabelClassName = "") => (
    <div key={menu.id} className={styles.menuRoot}>
      <button
        type="button"
        className={`${styles.menuLabel} ${extraLabelClassName} ${
          openMenu === menu.id ? styles.menuLabelOpen : ""
        }`}
        onClick={() => setOpenMenu((cur) => (cur === menu.id ? null : menu.id))}
      >
        {menu.isApple ? <AppleLogo className={styles.appleGlyph} /> : menu.label}
      </button>
      {openMenu === menu.id && (
        <div className={styles.dropdown} role="menu">
          {menu.items.map((item, i) =>
            item.separator ? (
              <div key={i} className={styles.menuSeparator} />
            ) : (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                className={styles.menuItem}
                disabled={item.disabled}
                onClick={() => {
                  item.action?.();
                  setOpenMenu(null);
                }}
              >
                <span>{item.label}</span>
                {item.shortcut && <span className={styles.shortcut}>{item.shortcut}</span>}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );

  const [appleMenu, ...restMenus] = menus;

  return (
    <header className={styles.menubar} ref={rootRef}>
      {renderMenu(appleMenu, styles.apple)}
      <span className={styles.appName}>{activeName}</span>
      {restMenus.map((menu) => renderMenu(menu))}

      <span className={styles.spacer} />

      <span className={styles.statusIcons}>
        <ControlCenterGlyph className={styles.statusGlyph} />
        <WifiGlyph className={styles.statusGlyph} />
        <BatteryGlyph className={styles.batteryGlyph} />
      </span>
      <time className={styles.clock}>
        {now.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })}{" "}
        {now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
      </time>
    </header>
  );
}

export default MenuBar;
