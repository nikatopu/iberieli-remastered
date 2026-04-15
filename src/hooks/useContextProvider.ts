"use client";

import { useWines } from "@/contexts/AppContext";
import { IWine } from "@/data/types";

/**
 * Custom hook that provides access to wine data and related functionality.
 * This is a convenience hook that wraps the useWines context hook.
 *
 * @returns Object containing wine data, loading states, and utility functions
 */
export function useContextProvider() {
  const wineContext = useWines();

  return {
    // Wine data
    wines: wineContext.wines,
    winesByCategory: wineContext.winesByCategory,

    // Loading and error states
    loading: wineContext.loading,
    error: wineContext.error,

    // Utility functions
    getWineById: wineContext.getWineById,
    refetchWines: wineContext.refetchWines,

    // Computed properties
    totalWinesCount: wineContext.wines.length,
    availableWines: wineContext.wines.filter((wine) => wine.id), // All wines in our frontend are considered available

    // Category helpers
    getWinesByCategory: (category: string) =>
      wineContext.winesByCategory[category] || [],
    getCategoriesWithCounts: () => {
      const categories = Object.keys(wineContext.winesByCategory);
      return categories.map((category) => ({
        name: category,
        count: wineContext.winesByCategory[category].length,
        wines: wineContext.winesByCategory[category],
      }));
    },

    // Search functionality
    searchWines: (query: string): IWine[] => {
      const lowercaseQuery = query.toLowerCase();
      return wineContext.wines.filter(
        (wine) =>
          wine.name.toLowerCase().includes(lowercaseQuery) ||
          wine.description.toLowerCase().includes(lowercaseQuery) ||
          wine.grapeBlend.toLowerCase().includes(lowercaseQuery) ||
          wine.location.toLowerCase().includes(lowercaseQuery) ||
          wine.tastingNotes.toLowerCase().includes(lowercaseQuery),
      );
    },

    // Recommendation functionality
    getSimilarWines: (targetWine: IWine, limit: number = 3): IWine[] => {
      return wineContext.wines
        .filter(
          (wine) =>
            wine.id !== targetWine.id && wine.category === targetWine.category,
        )
        .slice(0, limit);
    },

    // Category statistics
    getCategoryStats: () => {
      return {
        red: wineContext.winesByCategory.red?.length || 0,
        white: wineContext.winesByCategory.white?.length || 0,
        pink: wineContext.winesByCategory.pink?.length || 0,
        amber: wineContext.winesByCategory.amber?.length || 0,
      };
    },
  };
}

export default useContextProvider;
