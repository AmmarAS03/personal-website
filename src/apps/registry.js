import AboutApp from "./AboutApp";
import ContactApp from "./ContactApp";
import ExperienceApp from "./ExperienceApp";
import ProjectsApp from "./ProjectsApp";
import ResumeApp from "./ResumeApp";
import TerminalApp from "./TerminalApp";

/**
 * The single source of truth for what exists on this desktop. The dock, the
 * desktop icons, the menu bar and the window manager all read from here, so
 * adding a section later is one entry — no other file needs to change.
 *
 * - `emoji` / `accent` are placeholder icon art, meant to be swapped for real
 *   icon assets later.
 * - `singleton: true` means a second dock click focuses the existing window
 *   instead of opening a duplicate.
 * - `minSize` overrides DEFAULT_MIN_SIZE from os/layout.js.
 *
 * Prefer reading `apps` / `getApp` off the window context; the direct exports
 * exist for modules that sit outside the provider.
 */
export const apps = [
  {
    id: "about",
    name: "About Me",
    emoji: "👋",
    accent: "#3b82f6",
    component: AboutApp,
    singleton: true,
    defaultSize: { w: 900, h: 580 },
    minSize: { w: 560, h: 420 },
  },
  {
    id: "experience",
    name: "Experience",
    emoji: "💼",
    accent: "#8b5cf6",
    component: ExperienceApp,
    singleton: true,
    defaultSize: { w: 960, h: 620 },
    minSize: { w: 620, h: 440 },
  },
  {
    id: "projects",
    name: "Projects",
    emoji: "🗂️",
    accent: "#0ea5e9",
    component: ProjectsApp,
    singleton: true,
    defaultSize: { w: 920, h: 600 },
    minSize: { w: 520, h: 420 },
  },
  {
    id: "resume",
    name: "Résumé",
    emoji: "📄",
    accent: "#ef4444",
    component: ResumeApp,
    singleton: true,
    defaultSize: { w: 760, h: 720 },
    minSize: { w: 420, h: 380 },
  },
  {
    id: "contact",
    name: "Contact",
    emoji: "✉️",
    accent: "#22c55e",
    component: ContactApp,
    singleton: true,
    defaultSize: { w: 720, h: 560 },
    minSize: { w: 460, h: 420 },
  },
  {
    id: "terminal",
    name: "Terminal",
    emoji: "🖥️",
    accent: "#1f2937",
    component: TerminalApp,
    singleton: false,
    defaultSize: { w: 680, h: 440 },
    minSize: { w: 420, h: 260 },
  },
];

export const getApp = (appId) => apps.find((app) => app.id === appId);
