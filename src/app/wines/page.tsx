"use client";

import WineCard from "@/components/organisms/WineCard";
import { useWines } from "@/contexts/AppContext";
import style from "./page.module.scss";

export default function WinesPage() {
  const { wines, winesByCategory, loading, error } = useWines();

  if (loading) {
    return (
      <div className={style.winesPage}>
        <div className="container">
          <div className={style.loading}>
            <p>Loading our wine collection...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={style.winesPage}>
        <div className="container">
          <div className={style.error}>
            <p>Error loading wines: {error}</p>
            <p>Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  const categoryOrder = ["red", "white", "pink", "amber"];

  return (
    <div className={style.winesPage}>
      <div className="container">
        <header className={style.header}>
          <h1>Our Wine Collection</h1>
          <p className={style.subtitle}>
            Authentic Georgian natural wines crafted using traditional Kvevri
            winemaking methods from native grape varieties grown in Guria and
            Kakheti regions.
          </p>
        </header>

        {wines.length === 0 ? (
          <div className={style.noWines}>
            <p>No wines available at the moment.</p>
          </div>
        ) : (
          categoryOrder.map((category) => {
            const categoryWines = winesByCategory[category];
            if (!categoryWines || categoryWines.length === 0) return null;

            return (
              <section key={category} className={style.category}>
                <h2 className={style.categoryTitle}>
                  {category.charAt(0).toUpperCase() + category.slice(1)} Wines
                </h2>
                <div className={style.wineGrid}>
                  {categoryWines.map((wine) => (
                    <WineCard key={wine.id} wine={wine} />
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
