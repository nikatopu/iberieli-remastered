"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { WineProvider, useWines } from "./WineContext";

export interface AppContextType {
  // Add other app-wide states here as needed
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface ContextProviderWrapperProps {
  children: ReactNode;
}

export function ContextProviderWrapper({
  children,
}: ContextProviderWrapperProps) {
  const contextValue: AppContextType = {
    // Initialize other app-wide states here
  };

  return (
    <AppContext.Provider value={contextValue}>
      <WineProvider>{children}</WineProvider>
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error(
      "useAppContext must be used within a ContextProviderWrapper",
    );
  }
  return context;
}

// Re-export wine context hook for convenience
export { useWines } from "./WineContext";
