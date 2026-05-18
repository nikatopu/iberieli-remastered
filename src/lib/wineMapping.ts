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

function val(s: string | undefined): string | undefined {
  return s && s.trim() ? s.trim() : undefined;
}

export function mapDbWineToFrontend(wine: Wine): IWine {
  const v = (wine.vinification as VinificationJson) ?? {};
  return {
    id: wine.wineId,
    name: wine.name,
    description: wine.description,
    location: wine.location,
    grapeBlend: wine.grapeBlend,
    cellarName: wine.cellarName ?? "Iberieli",
    winemaker: wine.winemaker ?? "Zurab Topuridze",
    alcoholLevel: val(wine.alcoholLevel ?? undefined),
    inStock: wine.inStock ?? true,
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
      harvest: val(v.harvest),
      processing: val(v.processing),
      fermentation: val(v.fermentation),
      fermentationTime: val(v.fermentationTime),
      fermentationVessel: val(v.fermentationVessel),
      maceration: val(v.maceration),
      macerationVessel: val(v.macerationVessel),
      maturationTime: val(v.maturationTime) ?? val(v.aging),
      maturationVessel: val(v.maturationVessel),
      filtration: val(v.filtration),
      fining: val(v.fining),
      sulphur: val(v.sulphur),
    },
    image: wine.image,
    category: wine.category as "red" | "white" | "pink" | "amber",
    visible: wine.visible,
  };
}
