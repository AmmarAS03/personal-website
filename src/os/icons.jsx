/**
 * Inline SVG glyphs for the shell chrome. Kept as plain components (not
 * fonts/icon-packs) so nothing here ever depends on a network request.
 */

export function AppleLogo(props) {
  return (
    <svg viewBox="0 0 814 1000" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1-68 0-85.5-39.5-163.9-39.5-76.4 0-103.5 40.8-165.9 40.8-62.4 0-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zM554.1 159.4c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
    </svg>
  );
}

export function WifiGlyph(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M2 8.3c5.7-5 14.3-5 20 0" opacity="0.4" />
      <path d="M5.1 12.1c3.9-3.4 9.9-3.4 13.8 0" opacity="0.7" />
      <path d="M8.3 15.7c2.2-1.9 5.2-1.9 7.4 0" />
      <circle cx="12" cy="19" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BatteryGlyph(props) {
  return (
    <svg viewBox="0 0 28 14" fill="none" aria-hidden="true" {...props}>
      <rect x="1" y="1" width="22" height="12" rx="3.2" stroke="currentColor" strokeOpacity="0.55" />
      <rect x="3" y="3" width="16.5" height="8" rx="1.6" fill="currentColor" fillOpacity="0.9" />
      <rect x="24.4" y="4.6" width="2.1" height="4.8" rx="1" fill="currentColor" fillOpacity="0.55" />
    </svg>
  );
}

export function ControlCenterGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <rect x="2" y="4.3" width="20" height="5.6" rx="2.8" fillOpacity="0.32" />
      <circle cx="15.2" cy="7.1" r="3.6" />
      <rect x="2" y="14.1" width="20" height="5.6" rx="2.8" fillOpacity="0.32" />
      <circle cx="8.8" cy="16.9" r="3.6" />
    </svg>
  );
}

export function SearchGlyph(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="M19.5 19.5l-4.3-4.3" />
    </svg>
  );
}

export function TrashGlyph(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 7h16" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6.2 7l.9 12.1A1.5 1.5 0 0 0 8.6 20.5h6.8a1.5 1.5 0 0 0 1.5-1.4L17.8 7" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}
