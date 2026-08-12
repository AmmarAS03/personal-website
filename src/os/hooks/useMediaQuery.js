import { useEffect, useState } from "react";
import { MOBILE_BREAKPOINT } from "../layout";

/**
 * Live `window.matchMedia` binding. Initialised synchronously so the first
 * paint is already correct — no flash of desktop chrome on a phone.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    mq.addEventListener("change", onChange);
    // In case the answer changed between the state initializer and this effect.
    setMatches(mq.matches);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/**
 * True below the desktop breakpoint: windows go fullscreen one-at-a-time and
 * the dock becomes an iOS-style bar. Only the *shell* reads this — the apps
 * themselves never do.
 */
export function useIsMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
}
