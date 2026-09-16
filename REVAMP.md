# macOS Desktop Revamp — Working Plan & Handoff

> **For an AI agent picking this up in a fresh session:** read this whole file
> before touching anything. It is the single source of truth for what is done,
> what is next, and what must not be broken. Phases 0–6 and phase 8 are complete
> and verified. **Start at Phase 7.**

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
    hooks/useMediaQuery.js  useMediaQuery + useIsMobile (the phase-6 branch point)
    Desktop.jsx             desktop surface: wallpaper, chrome, boot gate
    Desktop.module.scss
    MenuBar.jsx             menu bar + dropdown menus + clock
    MenuBar.module.scss
    Dock.jsx                dock with magnification; iOS-style MobileBar below 768px
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

### The wallpaper

`public/images/wallpaper-sequoia-{2560,1440}.webp` is macOS Sequoia's "Sequoia
Sunrise", re-encoded from the copy that ships on any Sequoia Mac at
`/System/Library/Desktop Pictures/.wallpapers/Sequoia Sunrise/`. That path is
worth remembering: the `.madesktop` files in the parent directory are 500-byte
plists, and the `.thumbnails/` copies are 214×130 — the real 3840×2160 assets
are only in the hidden `.wallpapers/` folder.

To regenerate (WebP is ~⅓ the size of JPEG here; `magick` cannot decode HEIC on
this machine, so `sips` does the decode):

```bash
SRC="/System/Library/Desktop Pictures/.wallpapers/Sequoia Sunrise/Sequoia Sunrise.heic"
sips -s format png "$SRC" --out /tmp/wp.png
for w in 2560 1440; do
  magick /tmp/wp.png -resize ${w}x -strip /tmp/wp-$w.png
  cwebp -q 74 -m 6 /tmp/wp-$w.png -o public/images/wallpaper-sequoia-$w.webp
done
```

⚠️ **This is Apple's copyrighted artwork.** It is fine locally, but it ships to
every visitor once this site is deployed. Swapping in a CC-licensed or
self-shot redwood photo is a one-line change in `Desktop.module.scss` — the
owner has been told and has not yet decided.

---

## 5. Contracts you must not break

### 5.1 Layout constants (`src/os/layout.js`)

```js
MENUBAR_HEIGHT = 28
DOCK_HEIGHT    = 92
MOBILE_BREAKPOINT = 768
MOBILE_DOCK_HEIGHT = 76        // iOS-style bar below the breakpoint
CASCADE_STEP = 28, CASCADE_WRAP = 6
DEFAULT_MIN_SIZE = { w: 420, h: 320 }
clamp(value, min, max)
getDesktopBounds() -> { top, left, right, bottom, width, height }
  // viewport-aware: below MOBILE_BREAKPOINT, no menu bar and the reserved
  // strip is MOBILE_DOCK_HEIGHT, not DOCK_HEIGHT
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
  openOnBoot,           // true = launch automatically once the desktop is ready
  defaultSize: { w, h },
  minSize: { w, h },    // overrides DEFAULT_MIN_SIZE
}
```

**`openOnBoot`** is read by `Desktop.jsx`, which launches those apps when
`booted` flips true — not on mount, because spawn rects come from
`getDesktopBounds()` and the window would otherwise fly in from the dock *behind*
the boot screen, where nobody sees it. Currently only `photobooth` sets it, so a
visitor is greeted by the intro video instead of a bare wallpaper. Keep it to one
app: several would cascade on top of each other.

**`component` receives one prop: `visible: boolean`.** It is false when the
window is minimized, closing, or (on mobile) covered by another window. Added
for `PhotoBoothApp`, which must call `video.pause()` when its window leaves the
screen — minimized windows stay mounted (§8.7), so without it the intro video
keeps talking with nothing visible. Apps with nothing to pause ignore the prop.
It is `interactive` in `Window.jsx`, the same value that already drives
`inert` / `aria-hidden` / `pointer-events`, so there is only one notion of
"this window is on screen" to keep in sync.

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
| 6 | Mobile / iOS-style fallback | ✅ Done, browser-verified |
| **7** | **a11y + SEO** | **⬜ NEXT** |
| 9 | Content refresh — the stale facts in `src/data/` | ⬜ Not started, **needs the owner** |
| 10 | Intro video app (Photo Booth), hosted on Cloudflare R2 | ✅ Done — **placeholder video, needs the real cut** |

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

**Phase 2 — Shell visuals (Fable).** Menu bar with inline SVG Apple mark and working dropdown
menus (File › Close Window and Window › Minimize/Zoom are wired to real
actions, the rest are intentionally inert); dock with framer-motion
magnification on real layout width so neighbours reflow; boot screen gated on
`sessionStorage`, skippable, bypassed under `prefers-reduced-motion`.
Deliberately skipped: desktop icons, dock icon bounce-on-launch.

Phase 2's original layered mesh-gradient wallpaper (plus its `feTurbulence`
grain, which existed only to stop the gradients banding) was later **replaced by
the real macOS "Sequoia Sunrise" photo** at the owner's request — see §4.

**Phase 5 — Window chrome + animation (Fable).** Three files touched:`Window.module.scss` (full restyle — gradient titlebar, hairlines, two-tier
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

**Phase 6 — Mobile / iOS-style fallback.** Same registry, same app components —
only the shell branches, via `useIsMobile()` (`(max-width: 767px)`) from the new
`src/os/hooks/useMediaQuery.js`. What changes below the breakpoint:

- `layout.js` gains `MOBILE_DOCK_HEIGHT = 76`, and `getDesktopBounds()` becomes
  viewport-aware: on mobile it returns the full viewport minus the 76px bar
  (no menu bar). The bounds function is the single place that knows this.
- `Window.jsx`: the committed desktop rect is bypassed entirely — mobile
  geometry is `left:0, top:0, width:100%, height:calc(100% - 76px)` in
  percentages so rotation/resize re-layouts for free. No drag, no resize
  handles, no double-click zoom, close-only traffic light. `flyTarget` is
  measured from the fullscreen centre, not the stale committed rect.
  Non-frontmost windows are *covered*, and covered gets the exact §8.7
  treatment (inert + aria-hidden) — verified with a real focus attempt.
- `Dock.jsx` renders `MobileBar`: a full-width translucent strip (home button,
  separator, the six icons — no magnification, trash or tooltips; they're
  meaningless on touch). Icon taps still route through `openApp`. Two mobile-
  specific behaviours: tapping the **frontmost** app's icon minimizes it
  (revealing whatever is underneath, like an app switcher), while the **home
  button minimizes ALL visible windows** — iOS home never reveals the previous
  app, and an earlier version that minimized only the frontmost did exactly
  that. Home is disabled when nothing is open.
- `Desktop.jsx` hides `MenuBar` on mobile and publishes `--mobile-dock-height`
  alongside the existing CSS vars.

Verified with a scripted CDP pass (17/17) at 375×667, 768×1024 and 1280×800
plus screenshots: fullscreen window above the bar, one window at a time, home
button semantics, restore-instead-of-duplicate through the bar, and the
desktop path (dock, 8 handles, maximize reserving 28/92 exactly) unchanged.

---

## 7. NEXT UP — Phase 7: accessibility + SEO

**Owner: main agent.** The full spec lives in §9 ("Phase 7 — Accessibility +
SEO"). The short version: this JS desktop currently has no crawlable text
(semantic markup inside windows, a `<noscript>` plain-text résumé, real
`<meta>`/OG tags), and the a11y pass covers per-window focus traps,
`aria-modal`, keyboard-reachable dock, logical tab order,
`prefers-reduced-motion` everywhere, and a contrast audit on the translucent
chrome. Phase 6's inert handling for covered/minimized windows is already in
place and is the pattern to follow.

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

### 8.9 Measuring an animating window in a test is a trap (two traps, actually)
Phase 6's browser pass failed twice on measurement bugs, not app bugs:

- **`getBoundingClientRect()` includes framer-motion's transform.** A window
  mid open/minimize flight reports a rect interpolated between the fly poses
  (a 375px window measured 302px, then 37.5px = 375 × the 0.1 minimize scale).
  Combined with §8.5's stalled-rAF problem, the flight may be frozen at any
  point. To assert *committed geometry*, read `getComputedStyle(el)` — it
  resolves the layout (including `calc()`) and ignores transforms.
- **JS `.click()` bypasses `inert` and `pointer-events: none`.** A minimized
  window's traffic lights are still clickable from injected JS, so a test can
  "maximize" a window that is conceptually hidden and then measure garbage.
  Drive the UI the way a user would: restore via the dock first, then assert.

---

## 9. Remaining phases

### Phase 7 — Accessibility + SEO
This is the phase most likely to be skipped and most likely to matter.
- **SEO:** a JS desktop has no crawlable text, so recruiters googling this site
  currently get an empty page. Add real semantic markup inside windows plus a
  `<noscript>` plain-text résumé. Add proper `<meta>` / Open Graph tags.
- **a11y:** focus trap per window, `aria-modal` where appropriate, keyboard-
  reachable dock with visible focus rings (dock focus ring already exists),
  logical tab order, `prefers-reduced-motion` respected everywhere.
- Audit colour contrast on the translucent chrome.

### Phase 9 — Content refresh
**Blocked on the owner: these are facts, not code.** An agent must not invent
replacements. Every item is a one-line edit in `src/data/`:

- Old footer said "2023".
- `profile.js` says "final year double degree student" — is that still true?
- Both Newish Communications and Techflouu are listed as `"Present"`. At most
  one is presumably current.
- The Techflouu entry says "I'm still in my 6th semester".

While in here, also worth a pass: `projects.js` `tech` fields were deliberately
limited to stacks *named in the original copy*, so several projects are missing
stacks that were actually used. Adding them is safe only if the owner confirms.

### Phase 10 — Intro video ✅ Done (placeholder video)

Shipped as **Photo Booth** — a seventh dock app, named after the real macOS one.
Option 1 from the original spec: its own registry entry, most discoverable, and
a recruiter sees a seventh icon and clicks it.

**Files:** `src/apps/PhotoBoothApp.jsx` + `.module.scss`, `src/data/intro.js`,
`public/images/intro-poster.jpg`, one entry in `registry.js`, one prop in
`Window.jsx`, one media query in `Dock.module.scss`.

**The video on R2 today is a PLACEHOLDER** and the owner will replace it. The
full swap procedure and ffmpeg recipe live in the header comment of
`src/data/intro.js` — that file is the single point of change. Summary: encode
H.264 High + AAC to MP4 with **`-movflags +faststart`**, upload with
`Content-Type: video/mp4` and a long immutable `Cache-Control`, use a **new
filename per cut** (the immutable cache means overwriting strands viewers on the
old file for a year), then set `src` and `type: "video/mp4"` and regenerate the
poster.

**What the placeholder actually is** (probed with `ffprobe`, so nobody has to do
it again): H.264 High 1080×720 @30fps, AAC-LC mono, 9.16s, 6.16 MB — but in a
QuickTime container served as `video/quicktime`, with **`moov` at the end of the
file**. Two consequences the code deliberately works around rather than hides:

- `video/quicktime` is not a web container. Firefox refuses it; Chrome is
  inconsistent. Hence `type: null` in `intro.js` — omitting the attribute lets
  the browser sniff. `type="video/quicktime"` would make Chrome skip the file
  without trying, and claiming `video/mp4` would be a lie that only happens to
  work. An `onError` handler renders a "can't play, open it directly" fallback
  so a Firefox visitor gets a message rather than a blank stage.
- No faststart means `preload="metadata"` buys nothing — the whole file must
  download before a frame paints. The committed poster frame is therefore doing
  real work, not decoration. **Regenerate it whenever the video changes.**

**Player behaviour, as built:** `preload="metadata"` (never `auto`), no
autoplay, no `crossorigin` (which would need R2 CORS that isn't configured).
Click-to-play over the poster via a red shutter overlay that unmounts after the
first play so it can never swallow clicks meant for the video; after that,
clicking the video toggles play. Click-to-play also sidesteps
`prefers-reduced-motion` entirely — nothing moves until the visitor asks.

**Native `controls` are OFF, and the control bar is hand-built.** The native
strip duplicated the shutter button and dragged along a fullscreen button and an
overflow menu that have no business inside a fake OS window. Everything it did
that mattered is rebuilt in `PhotoBoothApp.jsx`: a full-bleed scrub bar on the
seam between stage and controls (drag to seek, arrow keys to nudge, `role=
"slider"` with live `aria-valuetext`), elapsed/total time in tabular figures,
and a mute button plus an `<input type="range">` for volume — a real range input
rather than a bespoke div, so it stays keyboard-operable and announced. The
`<video>` element remains the single source of truth for volume and muted state;
React just mirrors it via `onVolumeChange`, so OS-level changes stay in sync.

Two traps worth not re-hitting there:
- The shutter bar sizes itself with a **container query**, not a media query.
  This window can sit at its 420px minimum on a 1440px screen, where a media
  query still reports "desktop" and the caption would never collapse.
- The pause glyph is one box with a transparent gradient stripe down the middle.
  It must not also carry a background *colour* — that sits behind the gradient
  and fills the gap back in, rendering a solid white block.

**⚠️ The §8.7 trap, and the one shell change it forced.** Minimized windows stay
mounted, so a minimized video window would keep playing audio to an empty
screen. The app could not see its own window state: `<Body />` was rendered with
no props and never learns its `instanceId`. `Window.jsx` now passes
`visible={interactive}` (see §5.3) and `PhotoBoothApp` pauses on `visible: false`.
`interactive` is the right signal rather than `!win.minimized` because it also
covers the mobile case, where a covered window is mounted and would otherwise
keep playing behind whatever is on top.

**Mobile dock capacity.** The bar uses fixed 44px icons with `space-evenly`; six
of them plus the home button came to ~357px, which fit a 375px phone only just.
A seventh overflowed at ~401px. `Dock.module.scss` now shrinks icons to 38px
below 400px (~359px for seven), which also leaves room for an eighth app.

**It opens itself.** `photobooth` carries `openOnBoot: true`, so the window is
already up when a visitor lands — the video is the site's welcome. It still does
not autoplay (browsers block sound anyway); the poster and the shutter button are
the invitation. To make this once-per-session instead of every load, gate the
effect in `Desktop.jsx` on a `sessionStorage` key the way `BootScreen.jsx`
already does.

**Still outstanding:** the real video, and the phase 7 tie-in — a WebVTT captions
track and a plain-text transcript. `intro.js` has a `transcript` slot that
renders nothing while `null`; the owner chose to skip it for now. A video is
completely invisible to crawlers, so that transcript is the only part of it that
will ever help SEO.

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
2. **Content is stale and was deliberately left alone** — facts are the owner's
   to change, not an agent's to invent. Now tracked as **phase 9**; the specific
   lines are listed there.
3. **The intro video (phase 10) is built, but the file on R2 is a placeholder.**
   The Photo Booth app ships and works; it needs the real recording, encoded per
   the recipe in `src/data/intro.js` (faststart is the flag that matters), plus a
   regenerated poster frame. Captions/transcript were deliberately deferred to
   phase 7 — they need the owner's words.
4. **Magnification only tracks once the cursor is over the dock panel**, because
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
