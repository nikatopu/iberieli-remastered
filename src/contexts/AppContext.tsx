"use client";

import { ReactNode } from "react";
import { WineProvider } from "./WineContext";

export { useWines } from "./WineContext";

interface ContextProviderWrapperProps {
  children: ReactNode;
}

export function ContextProviderWrapper({
  children,
}: ContextProviderWrapperProps) {
  return <WineProvider>{children}</WineProvider>;
}
