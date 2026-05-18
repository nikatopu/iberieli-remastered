import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { IWine } from "@/data/types";
import { uploadImageToCloudinary } from "../utils/imageUpload";

function mapApiWine(apiWine: Record<string, unknown>): IWine {
  const vin = (apiWine.vinification as Record<string, string>) || {};
  const trimOrUndef = (s: unknown) => {
    const str = s as string | null | undefined;
    return str && str.trim() ? str.trim() : undefined;
  };
  return {
    id: apiWine.wineId as string,
    name: apiWine.name as string,
    description: apiWine.description as string,
    location: apiWine.location as string,
    grapeBlend: apiWine.grapeBlend as string,
    cellarName: (apiWine.cellarName as string) || "Iberieli",
    winemaker: (apiWine.winemaker as string) || "Zurab Topuridze",
    alcoholLevel: trimOrUndef(apiWine.alcoholLevel),
    inStock: apiWine.inStock !== false,
    certification: apiWine.certification as string,
    vegan: Boolean(apiWine.vegan),
    allergens: Boolean(apiWine.allergens),
    tastingNotes: apiWine.tastingNotes as string,
    foodRecommendation: apiWine.foodRecommendation as string,
    climate: apiWine.climate as string,
    terroir: apiWine.terroir as string,
    viticulture: apiWine.viticulture as string,
    yields: apiWine.yields as string,
    vinification: {
      harvest: vin.harvest || "",
      processing: vin.processing || "",
      fermentation: vin.fermentation || "",
      fermentationTime: vin.fermentationTime || "",
      fermentationVessel: vin.fermentationVessel || "",
      maceration: vin.maceration || "",
      macerationVessel: vin.macerationVessel || "",
      maturationTime: vin.maturationTime || vin.aging || "",
      maturationVessel: vin.maturationVessel || "",
      filtration: vin.filtration || "",
      fining: vin.fining || "",
      sulphur: vin.sulphur || "",
    },
    image: apiWine.image as string,
    category: apiWine.category as "red" | "white" | "pink" | "amber",
    visible: apiWine.visible !== false,
  };
}

interface UseWineManagerReturn {
  wines: IWine[];
  loading: boolean;
  error: string | null;
  selectedWine: IWine | null;
  isSaving: boolean;
  handleEditWine: (wine: IWine) => void;
  handleSaveWine: (wineData: Partial<IWine>, imageFile?: File) => Promise<void>;
  handleCancelEdit: () => void;
  handleDeleteWine: (wineId: string) => Promise<void>;
  handleToggleVisible: (wineId: string, visible: boolean) => Promise<void>;
  refetchWines: () => Promise<void>;
}

export function useWineManager(): UseWineManagerReturn {
  const [wines, setWines] = useState<IWine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWine, setSelectedWine] = useState<IWine | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchWines = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/wines", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch wines");
      const apiWines = await response.json();
      setWines(apiWines.map(mapApiWine));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading wines");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWines();
  }, [fetchWines]);

  const handleEditWine = (wine: IWine) => {
    setSelectedWine(wine);
  };

  const handleSaveWine = async (wineData: Partial<IWine>, imageFile?: File) => {
    if (!selectedWine) return;

    setIsSaving(true);
    const loadingToast = toast.loading("Saving changes...");

    try {
      let imageUrl = selectedWine.image;

      if (imageFile) {
        toast.loading("Uploading image...", { id: loadingToast });
        imageUrl = await uploadImageToCloudinary(imageFile, selectedWine.id);
      }

      const response = await fetch("/api/admin/wines", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          wineId: selectedWine.id,
          ...wineData,
          image: imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update wine");
      }

      await fetchWines();
      setSelectedWine(null);
      toast.success("Wine updated successfully!", { id: loadingToast });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save wine";
      toast.error(message, { id: loadingToast });
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteWine = async (wineId: string) => {
    const loadingToast = toast.loading("Deleting wine...");

    try {
      const response = await fetch(
        `/api/admin/wines?wineId=${encodeURIComponent(wineId)}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete wine");
      }

      await fetchWines();
      setSelectedWine(null);
      toast.success("Wine deleted successfully.", { id: loadingToast });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete wine";
      toast.error(message, { id: loadingToast });
      throw err;
    }
  };

  const handleToggleVisible = async (wineId: string, visible: boolean) => {
    try {
      const response = await fetch("/api/admin/wines", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ wineId, visible }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update visibility");
      }

      setWines((prev) =>
        prev.map((w) => (w.id === wineId ? { ...w, visible } : w)),
      );

      toast.success(visible ? "Wine is now visible." : "Wine is now hidden.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update visibility";
      toast.error(message);
    }
  };

  const handleCancelEdit = () => {
    setSelectedWine(null);
  };

  return {
    wines,
    loading,
    error,
    selectedWine,
    isSaving,
    handleEditWine,
    handleSaveWine,
    handleCancelEdit,
    handleDeleteWine,
    handleToggleVisible,
    refetchWines: fetchWines,
  };
}
