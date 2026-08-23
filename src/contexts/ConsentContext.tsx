"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
  ReactNode,
} from "react";
import { disableAnalytics, enableAnalytics } from "@/lib/analytics";
import {
  ConsentState,
  getConsentServerSnapshot,
  getConsentSnapshot,
  setConsent,
  subscribeToConsent,
} from "@/lib/consentStore";

interface ConsentContextType {
  /**
   * "pending" until hydration has read the stored choice, then "undecided",
   * "granted" or "denied". Analytics only load on "granted".
   */
  consent: ConsentState;
  isBannerOpen: boolean;
  accept: () => void;
  decline: () => void;
  /** Close the banner without deciding — nothing is stored, nothing is loaded. */
  dismiss: () => void;
  /** Reopen the banner so a visitor can change their mind later. */
  openBanner: () => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

interface ConsentProviderProps {
  children: ReactNode;
}

export function ConsentProvider({ children }: ConsentProviderProps) {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );

  // Only set once the visitor interacts with the banner; until then visibility
  // follows from whether a choice has been stored.
  const [override, setOverride] = useState<"open" | "closed" | null>(null);

  const isBannerOpen =
    override === "open" || (override === null && consent === "undecided");

  const accept = useCallback(() => {
    enableAnalytics();
    setConsent("granted");
    setOverride("closed");
  }, []);

  const decline = useCallback(() => {
    disableAnalytics();
    setConsent("denied");
    setOverride("closed");
  }, []);

  const dismiss = useCallback(() => setOverride("closed"), []);
  const openBanner = useCallback(() => setOverride("open"), []);

  const contextValue: ConsentContextType = {
    consent,
    isBannerOpen,
    accept,
    decline,
    dismiss,
    openBanner,
  };

  return (
    <ConsentContext.Provider value={contextValue}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
}
