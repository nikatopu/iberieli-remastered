import { useState } from "react";
import toast from "react-hot-toast";
import { useWines } from "@/contexts/AppContext";
import { IWine } from "@/data/types";
import { uploadImageToCloudinary } from "../utils/imageUpload";

interface UseWineManagerReturn {
  wines: IWine[];
  loading: boolean;
  error: string | null;
  selectedWine: IWine | null;
  editingDescription: string;
  editingTastingNotes: string;
  isSaving: boolean;
  handleEditWine: (wine: IWine) => void;
  handleSaveWine: (
    description: string,
    tastingNotes: string,
    imageFile?: File,
  ) => Promise<void>;
  handleCancelEdit: () => void;
  refetchWines: () => Promise<void>;
}

export function useWineManager(): UseWineManagerReturn {
  const [selectedWine, setSelectedWine] = useState<IWine | null>(null);
  const [editingDescription, setEditingDescription] = useState("");
  const [editingTastingNotes, setEditingTastingNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { wines, loading, error, refetchWines } = useWines();

  const handleEditWine = (wine: IWine) => {
    setSelectedWine(wine);
    setEditingDescription(wine.description);
    setEditingTastingNotes(wine.tastingNotes);
  };

  const handleSaveWine = async (
    description: string,
    tastingNotes: string,
    imageFile?: File,
  ) => {
    if (!selectedWine) return;

    setIsSaving(true);
    const loadingToast = toast.loading("Saving wine changes...");

    try {
      let imageUrl = selectedWine.image; // Keep existing image by default

      // Upload new image to Cloudinary if provided
      if (imageFile) {
        toast.loading("Uploading image...", { id: loadingToast });
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      // Update wine in database
      const response = await fetch(`/api/admin/wines`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          wineId: selectedWine.id,
          description: description.trim(),
          tastingNotes: tastingNotes.trim(),
          image: imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update wine");
      }

      // Refresh the wine data from the database
      await refetchWines();

      // Reset form state
      setSelectedWine(null);
      setEditingDescription("");
      setEditingTastingNotes("");

      // Show success message
      toast.success("Wine updated successfully!", { id: loadingToast });
    } catch (error) {
      console.error("Error saving wine:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save wine. Please try again.";
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedWine(null);
    setEditingDescription("");
    setEditingTastingNotes("");
  };

  return {
    wines,
    loading,
    error,
    selectedWine,
    editingDescription,
    editingTastingNotes,
    isSaving,
    handleEditWine,
    handleSaveWine,
    handleCancelEdit,
    refetchWines,
  };
}
