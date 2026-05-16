import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { wines } from "@/lib/schema";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const visibleWines = await db
    .select({ wineId: wines.wineId, updatedAt: wines.updatedAt })
    .from(wines)
    .where(eq(wines.visible, true));

  const wineUrls: MetadataRoute.Sitemap = visibleWines.map((wine) => ({
    url: `https://iberieli.com/wines/${wine.wineId}`,
    lastModified: wine.updatedAt ?? new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: "https://iberieli.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://iberieli.com/wines",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://iberieli.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://iberieli.com/contact",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...wineUrls,
  ];
}
