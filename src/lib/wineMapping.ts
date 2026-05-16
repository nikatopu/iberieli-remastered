import { Wine } from "@/lib/schema";
import { IWine } from "@/data/types";

type VinificationJson = {
  harvest?: string;
  processing?: string;
  fermentation?: string;
  fermentationTime?: string;
  fermentationVessel?: string;
  maceration?: string;
  macerationVessel?: string;
  maturationTime?: string;
  maturationVessel?: string;
  aging?: string;
  filtration?: string;
  fining?: string;
  sulphur?: string;
};

export function mapDbWineToFrontend(wine: Wine): IWine {
  const v = (wine.vinification as VinificationJson) ?? {};
  return {
    id: wine.wineId,
    name: wine.name,
    description: wine.description,
    location: wine.location,
    grapeBlend: wine.grapeBlend,
    sustainability: wine.sustainability,
    certification: wine.certification,
    vegan: wine.vegan ?? true,
    allergens: wine.allergens ?? false,
    tastingNotes: wine.tastingNotes,
    foodRecommendation: wine.foodRecommendation,
    climate: wine.climate,
    terroir: wine.terroir,
    viticulture: wine.viticulture,
    yields: wine.yields,
    vinification: {
      harvest: v.harvest ?? "Hand-picked grapes",
      processing: v.processing ?? "Traditional processing",
      fermentation: v.fermentation ?? "Traditional fermentation",
      fermentationTime: v.fermentationTime ?? "14-21 days",
      fermentationVessel: v.fermentationVessel ?? "Traditional vessels",
      maceration: v.maceration ?? "Traditional maceration",
      macerationVessel: v.macerationVessel ?? "Traditional vessels",
      maturationTime: v.maturationTime ?? v.aging ?? "6-12 months",
      maturationVessel: v.maturationVessel ?? "Oak barrels",
      filtration: v.filtration ?? "Minimal filtration",
      fining: v.fining ?? "Natural clarification",
      sulphur: v.sulphur ?? "Minimal sulphites",
    },
    image: wine.image,
    category: wine.category as "red" | "white" | "pink" | "amber",
    visible: wine.visible,
  };
}
