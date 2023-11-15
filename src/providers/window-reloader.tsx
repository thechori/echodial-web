import { signal } from "@preact/signals-react";

export const windowRefreshSignal = signal(0);

/**
 * Listens for a specific event to trigger a `window.location.reload()` invocation to simply reset global redux state
 */
export const WindowReloader = () => {
  if (windowRefreshSignal.value === 1) {
    window.location.reload();
  }

  return null;
};
