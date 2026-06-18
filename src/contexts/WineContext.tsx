"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { IWine } from "@/data/types";

interface ApiWine {
  id?: number;
  wineId: string;
  name: string;
  description: string;
  location: string;
  grapeBlend: string;
  cellarName: string;
  winemaker: string;
  alcoholLevel?: string | null;
  inStock: boolean;
  certification: string;
  vegan: boolean;
  allergens: boolean;
  organicFarming: string;
  tastingNotes: string;
  foodRecommendation: string;
  climate: string;
  terroir: string;
  viticulture: string;
  yields: string;
  vinification: {
    fermentation?: string;
    aging?: string;
    harvest?: string;
    sorting?: string;
    processing?: string;
    fermentationTime?: string;
    fermentationVessel?: string;
    maceration?: string;
    macerationVessel?: string;
    maturationTime?: string;
    maturationVessel?: string;
    filtration?: string;
    fining?: string;
    sulphur?: string;
  };
  image: string;
  category: string;
  visible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WineContextType {
  wines: IWine[];
  loading: boolean;
  error: string | null;
  refetchWines: () => Promise<void>;
  getWineById: (id: string) => Promise<IWine | null>;
  winesByCategory: Record<string, IWine[]>;
}

const WineContext = createContext<WineContextType | undefined>(undefined);

function mapApiWineToFrontend(apiWine: ApiWine): IWine {
  const trimOrUndef = (s?: string | null) => s?.trim() || undefined;
  return {
    id: apiWine.wineId,
    name: apiWine.name,
    description: apiWine.description,
    location: apiWine.location,
    grapeBlend: apiWine.grapeBlend,
    cellarName: apiWine.cellarName ?? "Iberieli",
    winemaker: apiWine.winemaker ?? "Zurab Topuridze",
    alcoholLevel: trimOrUndef(apiWine.alcoholLevel),
    inStock: apiWine.inStock ?? true,
    certification: apiWine.certification,
    vegan: apiWine.vegan,
    allergens: apiWine.allergens,
    tastingNotes: apiWine.tastingNotes,
    foodRecommendation: apiWine.foodRecommendation,
    climate: apiWine.climate,
    terroir: apiWine.terroir,
    viticulture: apiWine.viticulture,
    organicFarming: apiWine.organicFarming,
    yields: apiWine.yields,
    vinification: {
      harvest: trimOrUndef(apiWine.vinification.harvest),
      processing: trimOrUndef(apiWine.vinification.processing),
      fermentation: trimOrUndef(apiWine.vinification.fermentation),
      fermentationTime: trimOrUndef(apiWine.vinification.fermentationTime),
      fermentationVessel: trimOrUndef(apiWine.vinification.fermentationVessel),
      maceration: trimOrUndef(apiWine.vinification.maceration),
      macerationVessel: trimOrUndef(apiWine.vinification.macerationVessel),
      maturationTime:
        trimOrUndef(apiWine.vinification.maturationTime) ||
        trimOrUndef(apiWine.vinification.aging),
      maturationVessel: trimOrUndef(apiWine.vinification.maturationVessel),
      filtration: trimOrUndef(apiWine.vinification.filtration),
      fining: trimOrUndef(apiWine.vinification.fining),
      sulphur: trimOrUndef(apiWine.vinification.sulphur),
    },
    image: apiWine.image,
    category: apiWine.category as "red" | "white" | "pink" | "amber",
    visible: apiWine.visible ?? true,
  };
}

interface WineProviderProps {
  children: ReactNode;
}

export function WineProvider({ children }: WineProviderProps) {
  const [wines, setWines] = useState<IWine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWines = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/wines");

      if (!response.ok) {
        throw new Error(`Failed to fetch wines: ${response.status}`);
      }

      const apiWines: ApiWine[] = await response.json();
      const mappedWines = apiWines.map(mapApiWineToFrontend);

      setWines(mappedWines);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching wines";
      setError(errorMessage);
      console.error("Error fetching wines:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWines();
  }, []);

  async function getWineById(id: string): Promise<IWine | null> {
    try {
      const response = await fetch("/api/wines");

      if (!response.ok) {
        throw new Error("Failed to fetch wines");
      }

      const apiWines: ApiWine[] = await response.json();
      const mappedWines = apiWines.map(mapApiWineToFrontend);

      const wine = mappedWines.find((wine) => wine.id === id);
      return wine || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  const winesByCategory = wines.reduce(
    (acc, wine) => {
      if (!acc[wine.category]) {
        acc[wine.category] = [];
      }
      acc[wine.category].push(wine);
      return acc;
    },
    {} as Record<string, IWine[]>,
  );

  const contextValue: WineContextType = {
    wines,
    loading,
    error,
    refetchWines: fetchWines,
    getWineById,
    winesByCategory,
  };

  return (
    <WineContext.Provider value={contextValue}>{children}</WineContext.Provider>
  );
}

export function useWines() {
  const context = useContext(WineContext);
  if (context === undefined) {
    throw new Error("useWines must be used within a WineProvider");
  }
  return context;
}
