"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe media query subscription.
 *
 * Uses `useSyncExternalStore` so the browser's match state is read through
 * React's own external-store path — no setState-in-effect, no hydration
 * mismatch. On the server (and during hydration) it reports `false`, then
 * settles to the real value on the client.
 *
 * Prefer this over width-based Tailwind variants when the decision depends on
 * device *capability* (hover, pointer precision) rather than viewport width.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
