/**
 * A tiny external store around the visitor's cookie choice, so React can read
 * it with `useSyncExternalStore`.
 *
 * The server snapshot is deliberately `"pending"`: during the hydration render
 * we do not yet know the visitor's choice, so nothing is shown and nothing is
 * loaded. Once hydrated, React re-reads the real value from localStorage.
 */

import {
  ConsentStatus,
  CONSENT_STORAGE_KEY,
  readStoredConsent,
  writeStoredConsent,
} from "./analytics";

export type ConsentState = ConsentStatus | "undecided" | "pending";

let snapshot: ConsentState | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeToConsent(listener: () => void) {
  listeners.add(listener);

  // Keep tabs in sync when the choice is made or cleared elsewhere.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== CONSENT_STORAGE_KEY) return;
    snapshot = readStoredConsent() ?? "undecided";
    emit();
  };

  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getConsentSnapshot(): ConsentState {
  if (snapshot === null) {
    snapshot = readStoredConsent() ?? "undecided";
  }
  return snapshot;
}

export function getConsentServerSnapshot(): ConsentState {
  return "pending";
}

export function setConsent(status: ConsentStatus) {
  writeStoredConsent(status);
  snapshot = status;
  emit();
}
