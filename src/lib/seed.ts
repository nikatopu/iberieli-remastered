// import { db } from "@/lib/db";
// import { wines } from "@/lib/schema";
// import wineData from "@/data/wines.json";

// // Transform the JSON data to match the database schema
// function transformWineData(apiWine: any) {
//   // Determine category and corresponding placeholder image
//   const category = apiWine.color.toLowerCase().includes("red")
//     ? "red"
//     : apiWine.color.toLowerCase().includes("white")
//       ? "white"
//       : apiWine.color.toLowerCase().includes("rosé") ||
//           apiWine.color.toLowerCase().includes("rose") ||
//           apiWine.color.toLowerCase().includes("pink")
//         ? "pink"
//         : apiWine.color.toLowerCase().includes("amber")
//           ? "amber"
//           : "white";

//   // Use category-specific placeholder image
//   const placeholderImage = `/images/wines/${category}-wine.svg`;

//   return {
//     wineId: apiWine.wineId,
//     name: apiWine.nameEn,
//     description: apiWine.description,
//     location: `${apiWine.region}, ${apiWine.appellation}`,
//     grapeBlend: apiWine.variety,
//     sustainability: "Sustainable viticulture practices",
//     certification: "Georgian Quality Wine",
//     vegan: true,
//     allergens: false,
//     tastingNotes: apiWine.tastingNotes,
//     foodRecommendation: Array.isArray(apiWine.foodPairing)
//       ? apiWine.foodPairing.join(", ")
//       : "Traditional Georgian cuisine",
//     climate: apiWine.terroir?.climate || "Continental climate",
//     terroir: apiWine.terroir?.soil || "Limestone and alluvial soils",
//     viticulture: "Traditional Georgian methods",
//     yields: "Controlled yields for premium quality",
//     vinification: apiWine.vinification,
//     image: placeholderImage,
//     category: category,
//   };
// }

// async function seedDatabase() {
//   try {
//     console.log("Starting database seeding...");

//     // Clear existing wines
//     await db.delete(wines);
//     console.log("Cleared existing wine data");

//     // Transform and insert wine data
//     const transformedWines = wineData.map(transformWineData);
//     const insertedWines = await db
//       .insert(wines)
//       .values(transformedWines)
//       .returning();

//     console.log(`Successfully inserted ${insertedWines.length} wines:`);
//     insertedWines.forEach((wine) => {
//       console.log(`- ${wine.name} (${wine.wineId})`);
//     });

//     console.log("Database seeding completed successfully!");
//   } catch (error) {
//     console.error("Error seeding database:", error);
//     throw error;
//   }
// }

// // Run if called directly
// if (require.main === module) {
//   seedDatabase()
//     .then(() => process.exit(0))
//     .catch(() => process.exit(1));
// }

// export default seedDatabase;
