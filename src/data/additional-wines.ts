// Additional wine data - expand the wines array with all wines from the old site
// This is a template to help add the remaining 11 wines

import { IWine } from "./types";

export const additionalWines: IWine[] = [
  {
    id: "chkhaveri-amber",
    name: "Chkhaveri Amber",
    description: "Traditional amber wine with extended skin contact...",
    location: "Village SakvavisTke, Region Guria, Country Georgia",
    grapeBlend: "Chkhaveri 100% (pink grape with amber processing)",
    sustainability: "Organic",
    certification: "No",
    vegan: true,
    allergens: false,
    tastingNotes:
      "Extended skin contact creates complex amber wine with tannins and depth...",
    foodRecommendation: "Aged cheese, nuts, traditional Georgian cuisine.",
    climate:
      "Characterized by high humidity, hot humid summers and mild winters.",
    terroir: "Brown and red loam soils on weathered basalts.",
    viticulture: "Traditional methods with extended maceration.",
    yields: "Approximately 18 hectolitres per hectare.",
    vinification: {
      harvest: "Manual harvest in November",
      processing: "Whole cluster fermentation with extended skin contact",
      fermentation: "Spontaneous fermentation with native yeasts",
      fermentationTime: "2-3 months with skins",
      fermentationVessel: "Kvevri",
      maceration: "Extended skin contact for amber color",
      macerationVessel: "Kvevri",
      maturationTime: "12-18 months",
      maturationVessel: "Kvevri",
      filtration: "No",
      fining: "No",
      sulphur: "Minimal addition at bottling",
    },
    image: "/photos/Etiquettes/Chkhaveri Amber.webp",
    category: "amber",
  },
  // Add the remaining wines: golden-blend, kakhetian-mtsvivani, khikhvi, kisi,
  // mtsvane, ojaleshi, pink-rkatsiteli, rose-chkhaveri, tetri-kamuri-tsolikauri, cecilia
  // Follow the same pattern as above, updating the specific details for each wine
];

// To integrate these wines:
// 1. Read each wine HTML file from old-iberieli/wines/
// 2. Extract the wine information
// 3. Add to the wines array in wines.ts
// 4. Ensure corresponding images exist in public/photos/Etiquettes/
