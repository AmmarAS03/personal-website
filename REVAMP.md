# macOS Desktop Revamp — Working Plan & Handoff

> **For an AI agent picking this up in a fresh session:** read this whole file
> before touching anything. It is the single source of truth for what is done,
> what is next, and what must not be broken. Phases 0–5 and phase 8 are complete
> and verified. **Start at Phase 6.**

---

## 1. What this project is

A personal portfolio site (`personal-web`) rebuilt so the entire website *is* a
macOS desktop. Each portfolio section is an "app" that opens in a real
draggable/resizable window with traffic lights, launched from a dock.

**Repo:** `/Users/ammar/Intern/Web/personal-web`
**Working branch:** `macos-revamp` (branched from `feb-update`; default branch is `master`)
**Owner:** Ammar Ash Shiddiq (`ammarashshiddiq2@gmail.com`)

---

## 2. Locked decisions — do not relitigate

These were explicitly chosen by the owner. Do not revisit, re-ask, or "improve"
them without being told to.

| Decision | Choice |
|---|---|
| Framing | **Fullscreen desktop.** The browser viewport *is* the screen. No illustrated laptop bezel, no lid-opening animation. |
| Build tool | **Vite** (migrated off Create React App). |
| Apps in dock | **Six:** About Me, Experience, Projects, Résumé, Contact, Terminal. |
| Mobile | **iOS-style fallback** below 768px: windows fullscreen one at a time, dock becomes an iOS bottom bar. Same app registry, different shell. |
| Theme | **Dark only.** Do not add a light-mode toggle. |
| Phase ownership | Phases **2 and 5** (visual fidelity) are done by the **Fable** model. All other phases by the main agent. |
| Animation library | **Keep `framer-motion`.** The bundle cost (57KB → 103KB gzipped) was raised with the owner on 2026-07-30 and accepted. Do not propose replacing it with hand-rolled CSS. |

---

## 3. Environment — read before running anything

```bash
# REQUIRED. Node 21.7.3 is the shell default and Vite 7 does NOT support it
# (Vite 7 needs ^20.19.0 || >=22.12.0). Node 20.19.5 is installed via nvm.
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 20.19.5

npm run dev      # dev server, port 3000
npm run build    # production build -> build/  (must pass before any phase is "done")
npm run preview
```

- `.nvmrc` pins `20.19.5`.
- `build/` is the output dir (kept from CRA so any existing deploy config still
  works). It is **gitignored and untracked** — stale files in there are harmless.
- **There is no test suite.** CRA's boilerplate test was deleted during the Vite
  migration and no runner replaced it. Verification is done by building and by
  driving the app in a real browser.

### Dependencies

Runtime: `react` 18.3, `react-dom` 18.3, `framer-motion` 12.
Dev: `vite` 7, `@vitejs/plugin-react` 4, `sass` 1.83.

That is the entire dependency list — 80 packages total, down from 1500+ under
CRA. **Do not add dependencies without asking.**

---

## 4. Architecture

```
src/
  main.jsx                  entry (renders <App/> into #root)
  App.jsx                   composition root — DO NOT put visuals here
  index.scss                global reset, body{overflow:hidden}, .os-dragging rules
  App.scss                  near-empty placeholder

  data/                     ALL CONTENT. Pure data, zero JSX.
    profile.js              `profile` + `socials`
    about.js                `aboutSlides` — 7 life-story slides
    experience.js           `experience` — 6 roles
    projects.js             `projects` — 7 projects

  apps/                     THE SIX APPS
    registry.js             single source of truth for the app catalog
    apps.module.scss        shared styling for all apps (one system)
    AboutApp.jsx            Photos-style slide gallery
    ExperienceApp.jsx       Mail-style sidebar + description/project tabs
    ProjectsApp.jsx         Finder grid; double-click drills into detail
    ResumeApp.jsx           PDF <object> embed + download fallback
    ContactApp.jsx          Mail-compose UI over a mailto: handoff
    TerminalApp.jsx         working shell easter egg
    TerminalApp.module.scss

  os/                       THE DESKTOP SHELL + WINDOW SYSTEM
    layout.js               SHARED CONSTANTS — see §5
    state/windows.jsx       window state machine (reducer + context)
    Window.jsx              window chrome, drag, 8-way resize
    Window.module.scss
    WindowManager.jsx       renders the stack, owns keyboard shortcuts
    hooks/usePointerDrag.js pointer-gesture primitive
    Desktop.jsx             desktop surface: wallpaper, chrome, boot gate
    Desktop.module.scss
    MenuBar.jsx             menu bar + dropdown menus + clock
    MenuBar.module.scss
    Dock.jsx                dock with magnification
    Dock.module.scss
    BootScreen.jsx          boot animation, sessionStorage-gated
    BootScreen.module.scss
    icons.jsx               shared inline SVG glyphs (Apple, wifi, battery, etc.)
```

`App.jsx` is deliberately thin and should stay that way:

```jsx
<WindowsProvider apps={apps}>
  <Desktop />
</WindowsProvider>
```

`Desktop.jsx` composes `MenuBar` → `WindowManager` → `Dock` and gates the boot
screen. If you need a new full-screen overlay, put it inside `Desktop`, not `App`.

### Static assets

`public/` is served at the web root. `public/images/*` (~45 files) and
`public/file/AmmarAshShiddiq_CV.pdf` are referenced by absolute path
(`/images/foo.png`). Several unused duplicate `.jpg`/`.png` pairs remain in
`public/images/` — pruning them is an unstarted nice-to-have.

---

## 5. Contracts you must not break

### 5.1 Layout constants (`src/os/layout.js`)

```js
MENUBAR_HEIGHT = 28
DOCK_HEIGHT    = 92
MOBILE_BREAKPOINT = 768
CASCADE_STEP = 28, CASCADE_WRAP = 6
DEFAULT_MIN_SIZE = { w: 420, h: 320 }
clamp(value, min, max)
getDesktopBounds() -> { top, left, right, bottom, width, height }
```

The window system reserves **exactly** this space when centring, maximizing and
clamping. Therefore:

- The menu bar must occupy exactly `MENUBAR_HEIGHT` at the top and the dock
  exactly `DOCK_HEIGHT` at the bottom.
- If a design needs different heights, **change the constants** — do not just
  restyle, or maximized windows will misalign.
- `Desktop.jsx` publishes them as CSS custom properties `--menubar-height` and
  `--dock-height`. Stylesheets must use those vars, never hardcoded numbers.
- Windows use `z-index: 1..N` (a plain incrementing counter). Menu bar and dock
  need high z-indexes (currently 10000 / 9000) to stay above windows.

### 5.2 Window context API — `useWindows()` from `os/state/windows`

```js
const {
  apps,           // the injected app catalog array
  getApp,         // (appId) => app | undefined
  windows,        // raw array of window instances
  stack,          // windows sorted back-to-front by z
  activeId,       // instanceId of the focused window, or null
  activeAppId,    // appId of the focused window, or null
  openAppIds,     // Set<appId> with >=1 window open (for dock dots)
  openApp,        // (appId) => open OR focus-and-unminimize
  close,          // (instanceId)
  focus,          // (instanceId)
  minimize,       // (instanceId)
  toggleMaximize, // (instanceId)
  setRect,        // (instanceId, {x,y,w,h})
} = useWindows();
```

A window instance is:
```js
{ instanceId, appId, x, y, w, h, z, minimized, maximized, restore }
```

**Critical behaviours to preserve:**
- **Always route dock/launcher clicks through `openApp`.** It already handles
  "restore the minimized window instead of opening a duplicate" for singleton apps.
- The app catalog is **injected as a prop** into `WindowsProvider`, not imported
  by `windows.jsx`. This is deliberate: app components import `useWindows`
  themselves, and importing the registry inside the state module would close that
  into an import cycle. **Do not "simplify" this by importing the registry there.**

### 5.3 App registry shape (`src/apps/registry.js`)

```js
{
  id, name,
  emoji, accent,        // PLACEHOLDER icon art — swap for real assets later
  component,            // the React component rendered inside the window body
  singleton,            // true = focus existing window instead of duplicating
  defaultSize: { w, h },
  minSize: { w, h },    // overrides DEFAULT_MIN_SIZE
}
```

Adding a section later = **one entry in this array**. Nothing else needs to change:
the dock, menu bar and window manager all read from it. `terminal` is the only
app with `singleton: false`.

---

## 6. Phase status

| Phase | What | Status |
|---|---|---|
| 0 | Vite migration | ✅ Done |
| 1 | Extract content to `src/data/` | ✅ Done |
| 3 | Window system | ✅ Done, browser-verified |
| 4 | The six apps | ✅ Done, browser-verified |
| 2 | OS shell visuals (Fable) | ✅ Done, browser-verified |
| 8 | Delete old components | ✅ Done early |
| 5 | Window chrome polish + animation (Fable) | ✅ Done, browser-verified |
| **6** | **Mobile / iOS-style fallback** | **⬜ NEXT** |
| 7 | a11y + SEO | ⬜ Not started |

### Completed work, in detail

**Phase 0 — Vite migration.** `react-scripts` → Vite 7. Dev server ~165ms (was
~15s), build ~650ms–1s. Dropped `react-slick`, `slick-carousel`,
`react-simple-typewriter`, `web-vitals`, `@testing-library/*`, `nodemon`. Moved
`public/index.html` → `./index.html` (stripped `%PUBLIC_URL%`), `src/index.js` →
`src/main.jsx`, renamed all JSX files to `.jsx` (Vite requires this). Deleted
CRA boilerplate (`App.test.js`, `setupTests.js`, `reportWebVitals.js`, `logo.svg`).

**Phase 1 — Content extraction.** Rescued all hardcoded copy out of the old
components into `src/data/`. The About slides' `<br />` +
`dangerouslySetInnerHTML` became plain `paragraphs` arrays. `projects.js` gained
a `tech` field listing **only** stacks named in the original descriptions —
nothing inferred.

**Phase 3 — Window system.** Reducer actions: `OPEN`, `CLOSE`, `FOCUS`,
`MINIMIZE`, `TOGGLE_MAXIMIZE`, `SET_RECT`, `CLAMP_TO_BOUNDS`. Cascade offsets so
stacked opens stay visible; viewport-resize clamping keeps windows reachable;
8-direction resize with the opposite edge correctly pinned; `⌘W`/`⌘M`/`Esc`
shortcuts in `WindowManager`.

**Phase 4 — Six apps**, all reading from `src/data/`. Terminal supports
`help`, `whoami`, `ls`, `cat <file>`, `open <app>`, `apps`, `socials`, `clear`,
`sudo`, with up/down history.

**Phase 2 — Shell visuals (Fable).** Layered mesh-gradient wallpaper with SVG
`feTurbulence` grain; menu bar with inline SVG Apple mark and working dropdown
menus (File › Close Window and Window › Minimize/Zoom are wired to real
actions, the rest are intentionally inert); dock with framer-motion
magnification on real layout width so neighbours reflow; boot screen gated on
`sessionStorage`, skippable, bypassed under `prefers-reduced-motion`.
Deliberately skipped: desktop icons, dock icon bounce-on-launch.

**Phase 5 — Window chrome + animation (Fable).** Three files touched:
`Window.module.scss` (full restyle — gradient titlebar, hairlines, two-tier
shadow that flattens when unfocused, dimmed traffic lights + title on
background windows, ×/−/+ hover glyphs on the active window only),
`Window.jsx` (framer-motion variants: open 200ms, minimize 280ms, close 150ms,
all eased tweens, no springs; windows fly to/from their dock icon's measured
centre with a centre-scale fallback), and `WindowManager.jsx` (`AnimatePresence`
so `CLOSE` can play an exit). `useReducedMotion()` collapses every transition to
zero. `Dock.module.scss` / `MenuBar.module.scss` were left alone — phase 2 held
up. See §8.7 for the one regression this introduced and how it was fixed.

Maximize/restore was added afterwards, when the owner reported the zoom was not
smooth: it moves the *rect*, which framer-motion does not drive, so it snapped
in a single frame. It is now a 250ms Web Animations API zoom in a layout effect
in `Window.jsx` — **not** a CSS transition, for reasons that are worth reading
before touching it (§8.8).

---

## 7. NEXT UP — Phase 6: mobile / iOS-style fallback

**Owner: main agent.** Below `MOBILE_BREAKPOINT` (768px, already in
`layout.js`):

### Scope
1. Windows render **fullscreen, one at a time** — no drag, no resize, no traffic
   lights (or close-only).
2. The dock becomes an **iOS-style bottom bar**; add a back-to-desktop
   affordance.
3. A `useMediaQuery`-style hook is needed. There is no such hook yet.
4. Decide whether `getDesktopBounds()` should return the full viewport on mobile.

### Non-negotiable constraints
- **Reuse the same app registry and the same app components.** Only the *shell*
  changes. Do **not** fork the six apps — that would double the maintenance
  surface and is the single easiest way to wreck this architecture.
- Do not regress desktop behaviour above the breakpoint.
- Phase 5's animations must degrade sanely: a fullscreen mobile window should
  not try to fly to a dock icon that no longer exists in the same place. The
  `getDockIconCenter()` fallback in `Window.jsx` already handles a missing icon,
  but verify rather than assume.
- No new dependencies.

### Definition of done
`npm run build` passes; no console errors; verified at 375×667 and 768×1024 as
well as desktop; a window opened on mobile fills the viewport; the desktop path
above 768px is unchanged.

---

## 8. Hard-won gotchas — read these or you will repeat the bugs

### 8.1 `box-sizing` bit us twice. Assume it will again.
- `.window` sets `w`/`h` from state but had a `1px` border under default
  `content-box`, so rendered size was **2px larger** than the state rect.
  Min-size clamped to 562×420 instead of 560×420 and maximize overflowed the
  viewport. Fixed with `box-sizing: border-box` — **keep it.**
- `.dock` had `height: var(--dock-height)` plus `padding-bottom: 10px` under
  `content-box`, so the element measured **102px against a declared 92**,
  breaking the "dock band === `DOCK_HEIGHT`" invariant. Fixed the same way.

**Rule:** any element whose box is measured against a layout constant needs
`box-sizing: border-box`. Verify with `getBoundingClientRect()`, not by eye.

### 8.2 `overflow: hidden` clips resize handles
`.window` needs `overflow: hidden` to clip content to its rounded corners. The
resize handles were originally positioned `-6px` outside the frame, so that
`overflow` **silently clipped half of every grab strip**. Handles now sit
entirely *inside* the frame, with `z-index: 2` so they sit above the titlebar
(the top edge resizes rather than drags, matching macOS) and corners at
`z-index: 3`. Corners are capped at 12px so the north-west handle stops short of
the traffic lights, which start at the titlebar's 12px padding.

### 8.3 Never call a hook inside a loop
`usePointerDrag` was briefly called inside `HANDLES.map()`. It technically worked
(fixed-length constant array) but is fragile and lint-hostile. The current design
uses **one** resize gesture whose active edge is stored in a ref set on
`pointerdown`. Keep it that way.

### 8.4 Live gesture state is React state, not direct DOM writes
`Window.jsx` keeps a `ghost` rect in `useState` during drag/resize. Writing
`transform` straight to the DOM and clearing it on commit leaves one frame where
the transform is gone but the new rect hasn't rendered — a visible flicker.
`usePointerDrag` coalesces `pointermove` into one `requestAnimationFrame` tick so
this stays cheap.

### 8.5 Browser-testing pitfalls (cost real time — don't repeat)
- **`requestAnimationFrame` pauses in backgrounded tabs.** Any injected JS that
  `await`s a rAF will hang and time out. framer-motion springs also advance on
  rAF, so **measuring dock magnification from injected JS gives false zeros**
  unless the tab is genuinely visible. Use `setTimeout` for waits, and confirm
  animation visually via screenshots.
- **Screenshot pixel coordinates do not map 1:1 to viewport coordinates.** Clicks
  by coordinate frequently miss. Click via JS instead:
  ```js
  [...document.querySelectorAll('nav[aria-label="Applications"] button')]
    .find(b => b.getAttribute('aria-label') === 'About Me').click()
  ```
- CSS-module class names are hashed. Select handles by regex on `className`:
  `/_handle_(sw|se|nw|ne|n|s|e|w)_/` — note the **trailing underscore**; `\b`
  does not work because `_` is a word character.
- A CDP "Detached while handling command" or timeout error does **not** mean the
  script didn't run. It often ran and only the response was lost. Re-read state
  before concluding anything.

### 8.6 Useful DOM handles for verification
- Windows: `section[role="dialog"]`, identified by `aria-label` = app name.
- Traffic lights: `button[aria-label^="Close"|"Minimize"|"Maximize"|"Restore"]`.
- Dock buttons: `nav[aria-label="Applications"] button`, `aria-label` = app name.
- Menu bar: `header`; menu items are `[role="menuitem"]`.
- Boot screen: `[role="presentation"]`; session key is `sessionStorage['os-booted']`.

### 8.7 Hiding a window is not the same as removing it from the tab order
Phase 5 needed minimized windows to stay mounted so the minimize animation has
something to animate. The first cut hid them with `opacity: 0`,
`pointer-events: none` and `aria-hidden="true"`. **None of those remove an
element from the tab order.** A minimized About Me kept **12 focusable
descendants**, and focus genuinely landed on the close button of a window the
user could not see — a focus black hole. `aria-hidden` over focusable content is
also an ARIA spec violation for exactly this reason.

Fixed with the **`inert`** attribute on `.window` whenever
`!(isPresent && !win.minimized)`. `inert` removes the subtree from the tab order
*and* the accessibility tree in one move.

Two things to keep in mind:
- Pass `inert={cond ? undefined : ""}` — an **empty string**, not `true`.
  React 18 warns "Received `true` for a non-boolean attribute" on the boolean
  form. (React 19 supports the boolean; this repo is on 18.3.)
- Verify with an actual focus attempt, not by reading styles:
  ```js
  el.focus(); document.activeElement === el   // false when correctly inert
  ```
  Any future change that keeps a window mounted while invisible — phase 6's
  one-at-a-time mobile shell is the obvious candidate — needs the same treatment.

### 8.8 You cannot animate the window rect with a CSS transition from React
Maximize/restore moves `left/top/width/height`, not a transform, so
framer-motion (which drives opacity/scale/x/y) does not touch it. The obvious
fix — add a transient `.zooming` class that transitions geometry — **does not
work**, and failed in two different ways worth knowing about:

- **From an effect:** by the time any effect runs, React has already committed
  the new rect. There is no "before" value left, so the transition has nothing
  to animate.
- **From render (the derived-state pattern):** setting the flag during render so
  the class and the new rect land in the same commit *looks* right, but React
  coalesces the true→false pair into a single commit. Instrumented, the
  component rendered three times in 3ms — flag off, on, off — the effect never
  ran at all, and the class never reached the DOM. Zero `transitionstart`
  events, zero class mutations.

**What works: the Web Animations API in `useLayoutEffect`.** `el.animate()`
takes an explicit `from` keyframe, so it does not care that the committed style
is already the destination. Keep the previous rect in a ref and animate from it.
See the zoom effect in `Window.jsx`.

Two guards that effect needs, both load-bearing:
- Only animate when the size actually changed. Dragging a maximized window by
  the titlebar also flips `maximized` (via `SET_RECT`), but only moves it — with
  no size guard, every such drag plays a bogus zoom.
- Cancel any in-flight zoom in `beginGesture`, or a grab during the animation
  fights the interpolated geometry.

---

## 9. Remaining phases after 6

### Phase 7 — Accessibility + SEO
This is the phase most likely to be skipped and most likely to matter.
- **SEO:** a JS desktop has no crawlable text, so recruiters googling this site
  currently get an empty page. Add real semantic markup inside windows plus a
  `<noscript>` plain-text résumé. Add proper `<meta>` / Open Graph tags.
- **a11y:** focus trap per window, `aria-modal` where appropriate, keyboard-
  reachable dock with visible focus rings (dock focus ring already exists),
  logical tab order, `prefers-reduced-motion` respected everywhere.
- Audit colour contrast on the translucent chrome.

### Unstarted nice-to-haves
- Replace placeholder emoji dock icons with real icon art (`emoji`/`accent` in
  `registry.js` are the swap points).
- Prune unused duplicate images in `public/images/`.
- Update `README.md` — it still describes the old scrolling portfolio.

---

## 10. Open items for the owner (not blockers)

1. **Committed, not pushed.** `macos-revamp` now carries the completed phases as
   local commits. Nothing has been pushed and no PR exists — that is the owner's
   call. **Do not push or open a PR unprompted.**
2. **Content is stale and was deliberately left alone** (facts are the owner's to
   change, not an agent's to invent):
   - Old footer said "2023".
   - `profile.js` says "final year double degree student".
   - Both Newish Communications and Techflouu are listed as "Present".
   - The Techflouu entry says "I'm still in my 6th semester".
   These are all one-line edits in `src/data/` now.
3. **Magnification only tracks once the cursor is over the dock panel**, because
   `.dock` is `pointer-events: none` and only `.panel` re-enables it. Real macOS
   behaves similarly, so it was left as-is. No anticipatory growth on approach.

---

## 11. How to verify anything, quickly

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 20.19.5
npm run build            # must pass
npm run dev              # then drive http://localhost:3000 in a real browser
```

Then in the browser (see §8.5 for pitfalls), confirm at minimum:

- Dock opens each app; clicking an open singleton focuses rather than duplicates.
- Terminal opens a *second* instance (it is the only non-singleton).
- Drag a titlebar: window follows, commits, size unchanged.
- Resize from all 8 handles: opposite edge stays pinned; min size respected.
- Maximize: `top === 28`, `bottom === innerHeight - 92`, `width === innerWidth`.
- Minimize then click the dock icon: the same window returns.
- `⌘W` / `Esc` close the focused window.
- Boot screen plays once, then not again on reload in the same tab.
- No console errors.
