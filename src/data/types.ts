import { JSX } from "react";

export interface IWine {
  id: string;
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
  tastingNotes: string;
  foodRecommendation: string;
  climate: string;
  terroir: string;
  viticulture: string;
  organicFarming: string;
  yields: string;
  vinification: {
    harvest?: string;
    processing?: string;
    fermentation?: string;
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
  category: "red" | "white" | "pink" | "amber";
  visible: boolean;
}

export interface ICompanyInfo {
  founder: {
    name: string;
    title: string;
    description: string;
    image: string;
  };
  story: string;
  business: string;
  markets: string[];
}

export interface IContact {
  ordering: {
    phone: string;
    email: string;
    person: string;
    languages: string;
    note: string | JSX.Element;
  };
  finances: {
    phone: string;
    email: string;
    person: string;
  };
}

export interface IContactEntry {
  contactId: string;
  label: string;
  phone?: string | null;
  email?: string | null;
  person?: string | null;
  languages?: string | null;
  note?: string | null;
  visible: boolean;
}
