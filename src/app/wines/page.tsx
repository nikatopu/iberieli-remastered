import type { Metadata } from "next";
import WineCard from "@/components/organisms/WineCard";
import style from "./page.module.scss";
import { db } from "@/lib/db";
import { wines as winesTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { mapDbWineToFrontend } from "@/lib/wineMapping";
import { IWine } from "@/data/types";
import AnimateIn from "@/components/atoms/AnimateIn";

export const metadata: Metadata = {
  title: "Wine Collection",
  description:
    "Explore Iberieli's full collection of authentic Georgian natural wines — red, white, amber, and pink — crafted using traditional Kvevri methods from native grape varieties in Guria and Kakheti.",
  openGraph: {
    title: "Wine Collection | Iberieli",
    description:
      "Explore Iberieli's full collection of authentic Georgian natural wines crafted using traditional Kvevri methods.",
    url: "https://www.iberieli.com/wines",
    images: [{ url: "/photos/Wines 1.webp", alt: "Iberieli Wine Collection" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wine Collection | Iberieli",
    description:
      "Explore Iberieli's full collection of authentic Georgian natural wines crafted using traditional Kvevri methods.",
    images: ["/photos/Wines 1.webp"],
  },
  alternates: { canonical: "https://www.iberieli.com/wines" },
};

export default async function WinesPage() {
  const dbWines = await db
    .select()
    .from(winesTable)
    .where(eq(winesTable.visible, true));

  const allWines = dbWines.map(mapDbWineToFrontend);

  const winesByCategory = allWines.reduce(
    (acc, wine) => {
      if (!acc[wine.category]) acc[wine.category] = [];
      acc[wine.category].push(wine);
      return acc;
    },
    {} as Record<string, IWine[]>,
  );

  const categoryOrder = ["red", "white", "pink", "amber"];

  return (
    <div className={style.winesPage}>
      <div className="container">
        <AnimateIn preset="fadeUp" eager>
          <header className={style.header}>
            <h1>Our Wine Collection</h1>
            <p className={style.subtitle}>
              Authentic Georgian natural wines crafted using traditional Kvevri
              winemaking methods from native grape varieties grown in Guria and
              Kakheti regions.
            </p>
          </header>
        </AnimateIn>

        {allWines.length === 0 ? (
          <div className={style.noWines}>
            <p>No wines available at the moment.</p>
          </div>
        ) : (
          categoryOrder.map((category) => {
            const categoryWines = winesByCategory[category];
            if (!categoryWines || categoryWines.length === 0) return null;

            return (
              <section key={category} className={style.category}>
                <AnimateIn preset="fadeUp">
                  <h2 className={style.categoryTitle}>
                    {category.charAt(0).toUpperCase() + category.slice(1)} Wines
                  </h2>
                </AnimateIn>
                <div className={style.wineGrid}>
                  {categoryWines.map((wine, index) => (
                    <AnimateIn key={wine.id} preset="fadeUp" delay={index * 0.08}>
                      <WineCard wine={wine} />
                    </AnimateIn>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
