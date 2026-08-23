"use client";

import { ReactNode } from "react";
import { WineProvider } from "./WineContext";
import { ConsentProvider } from "./ConsentContext";

export { useWines } from "./WineContext";
export { useConsent } from "./ConsentContext";

interface ContextProviderWrapperProps {
  children: ReactNode;
}

export function ContextProviderWrapper({
  children,
}: ContextProviderWrapperProps) {
  return (
    <ConsentProvider>
      <WineProvider>{children}</WineProvider>
    </ConsentProvider>
  );
}
