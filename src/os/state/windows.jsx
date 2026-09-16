import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import {
  CASCADE_STEP,
  CASCADE_WRAP,
  DEFAULT_MIN_SIZE,
  clamp,
  getDesktopBounds,
} from "../layout";

/**
 * A window instance:
 *   { instanceId, appId, x, y, w, h, z, minimized, maximized, restore }
 *
 * `z` is a monotonically increasing counter — focusing a window just assigns it
 * the next value, so paint order is a plain sort. `restore` remembers the
 * pre-maximize rect.
 *
 * The app catalog is injected as a prop rather than imported: app components
 * import `useWindows` themselves, and importing the registry here would close
 * that loop into a cycle.
 */

const initialState = { windows: [], nextZ: 1, nextInstance: 1 };

function reducer(state, action) {
  switch (action.type) {
    case "OPEN": {
      const { appId, rect, singleton } = action;

      // Singleton apps focus their existing window instead of opening a second.
      if (singleton) {
        const existing = state.windows.find((w) => w.appId === appId);
        if (existing) {
          return {
            ...state,
            nextZ: state.nextZ + 1,
            windows: state.windows.map((w) =>
              w.instanceId === existing.instanceId
                ? { ...w, minimized: false, z: state.nextZ }
                : w
            ),
          };
        }
      }

      return {
        ...state,
        nextZ: state.nextZ + 1,
        nextInstance: state.nextInstance + 1,
        windows: [
          ...state.windows,
          {
            instanceId: `${appId}-${state.nextInstance}`,
            appId,
            ...rect,
            z: state.nextZ,
            minimized: false,
            maximized: false,
            restore: null,
          },
        ],
      };
    }

    case "CLOSE":
      return {
        ...state,
        windows: state.windows.filter((w) => w.instanceId !== action.instanceId),
      };

    case "FOCUS": {
      const target = state.windows.find((w) => w.instanceId === action.instanceId);
      // Already frontmost and visible — skip the render.
      if (!target || (target.z === state.nextZ - 1 && !target.minimized)) {
        return state;
      }
      return {
        ...state,
        nextZ: state.nextZ + 1,
        windows: state.windows.map((w) =>
          w.instanceId === action.instanceId
            ? { ...w, z: state.nextZ, minimized: false }
            : w
        ),
      };
    }

    case "MINIMIZE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.instanceId === action.instanceId ? { ...w, minimized: true } : w
        ),
      };

    case "TOGGLE_MAXIMIZE": {
      const { bounds } = action;
      return {
        ...state,
        nextZ: state.nextZ + 1,
        windows: state.windows.map((w) => {
          if (w.instanceId !== action.instanceId) return w;
          if (w.maximized && w.restore) {
            return {
              ...w,
              ...w.restore,
              maximized: false,
              restore: null,
              z: state.nextZ,
            };
          }
          return {
            ...w,
            restore: { x: w.x, y: w.y, w: w.w, h: w.h },
            x: bounds.left,
            y: bounds.top,
            w: bounds.width,
            h: bounds.height,
            maximized: true,
            z: state.nextZ,
          };
        }),
      };
    }

    case "SET_RECT":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.instanceId === action.instanceId
            ? { ...w, ...action.rect, maximized: false }
            : w
        ),
      };

    // Keeps windows reachable when the viewport shrinks past their position.
    case "CLAMP_TO_BOUNDS": {
      const { bounds } = action;
      return {
        ...state,
        windows: state.windows.map((w) => {
          if (w.maximized) {
            return {
              ...w,
              x: bounds.left,
              y: bounds.top,
              w: bounds.width,
              h: bounds.height,
            };
          }
          const width = Math.min(w.w, bounds.width);
          const height = Math.min(w.h, bounds.height);
          return {
            ...w,
            w: width,
            h: height,
            // Leave a strip of titlebar on screen so it can always be grabbed.
            x: clamp(w.x, bounds.left - width + 80, bounds.right - 80),
            y: clamp(w.y, bounds.top, bounds.bottom - 40),
          };
        }),
      };
    }

    default:
      return state;
  }
}

/** Centres a window of the app's default size, offset so stacked opens stay visible. */
function spawnRect(app, openCount) {
  const bounds = getDesktopBounds();
  const min = app.minSize ?? DEFAULT_MIN_SIZE;
  const w = clamp(app.defaultSize?.w ?? min.w, Math.min(min.w, bounds.width), bounds.width);
  const h = clamp(app.defaultSize?.h ?? min.h, Math.min(min.h, bounds.height), bounds.height);
  const offset = (openCount % CASCADE_WRAP) * CASCADE_STEP;

  return {
    w,
    h,
    x: clamp(
      Math.round((bounds.width - w) / 2) + offset,
      bounds.left,
      Math.max(bounds.left, bounds.right - w)
    ),
    // Slightly above centre reads better with a dock at the bottom.
    y: clamp(
      Math.round(bounds.top + (bounds.height - h) / 2.6) + offset,
      bounds.top,
      Math.max(bounds.top, bounds.bottom - h)
    ),
  };
}

const WindowsContext = createContext(null);

export function WindowsProvider({ apps, children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getApp = useCallback((appId) => apps.find((a) => a.id === appId), [apps]);

  // Read through a ref so `openApp` stays referentially stable — it lands in the
  // dock's props, and a new identity on every open would rerender the whole dock.
  const countRef = useRef(0);
  countRef.current = state.windows.length;

  const openApp = useCallback(
    (appId) => {
      const app = getApp(appId);
      if (!app) return;
      dispatch({
        type: "OPEN",
        appId,
        singleton: app.singleton,
        rect: spawnRect(app, countRef.current),
      });
    },
    [getApp]
  );

  const close = useCallback((instanceId) => dispatch({ type: "CLOSE", instanceId }), []);
  const focus = useCallback((instanceId) => dispatch({ type: "FOCUS", instanceId }), []);
  const minimize = useCallback(
    (instanceId) => dispatch({ type: "MINIMIZE", instanceId }),
    []
  );
  const setRect = useCallback(
    (instanceId, rect) => dispatch({ type: "SET_RECT", instanceId, rect }),
    []
  );
  const toggleMaximize = useCallback(
    (instanceId) =>
      dispatch({ type: "TOGGLE_MAXIMIZE", instanceId, bounds: getDesktopBounds() }),
    []
  );

  useEffect(() => {
    const onResize = () =>
      dispatch({ type: "CLAMP_TO_BOUNDS", bounds: getDesktopBounds() });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Visible windows sorted back-to-front; the last one is focused.
  const stack = useMemo(
    () => [...state.windows].sort((a, b) => a.z - b.z),
    [state.windows]
  );

  const activeId = useMemo(() => {
    const visible = stack.filter((w) => !w.minimized);
    return visible.length ? visible[visible.length - 1].instanceId : null;
  }, [stack]);

  const activeAppId = useMemo(
    () => state.windows.find((w) => w.instanceId === activeId)?.appId ?? null,
    [state.windows, activeId]
  );

  const openAppIds = useMemo(
    () => new Set(state.windows.map((w) => w.appId)),
    [state.windows]
  );

  const value = useMemo(
    () => ({
      apps,
      getApp,
      windows: state.windows,
      stack,
      activeId,
      activeAppId,
      openAppIds,
      openApp,
      close,
      focus,
      minimize,
      toggleMaximize,
      setRect,
    }),
    [
      apps,
      getApp,
      state.windows,
      stack,
      activeId,
      activeAppId,
      openAppIds,
      openApp,
      close,
      focus,
      minimize,
      toggleMaximize,
      setRect,
    ]
  );

  return <WindowsContext.Provider value={value}>{children}</WindowsContext.Provider>;
}

export function useWindows() {
  const ctx = useContext(WindowsContext);
  if (!ctx) throw new Error("useWindows must be used inside a WindowsProvider");
  return ctx;
}
