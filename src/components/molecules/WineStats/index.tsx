"use client";

import { useContextProvider } from "@/hooks/useContextProvider";
import style from "./WineStats.module.scss";

export default function WineStats() {
  const {
    totalWinesCount,
    getCategoryStats,
    getCategoriesWithCounts,
    loading,
  } = useContextProvider();

  if (loading) {
    return (
      <div className={style.stats}>
        <p>Loading wine statistics...</p>
      </div>
    );
  }

  const categoryStats = getCategoryStats();
  const categoriesWithCounts = getCategoriesWithCounts();

  return (
    <div className={style.stats}>
      <h3 className={style.title}>Wine Collection Overview</h3>

      <div className={style.totalCount}>
        <span className={style.number}>{totalWinesCount}</span>
        <span className={style.label}>Total Wines</span>
      </div>

      <div className={style.categoryBreakdown}>
        {categoriesWithCounts.map(({ name, count }) => (
          <div key={name} className={style.categoryItem}>
            <span
              className={`${style.categoryDot} ${style[`dot--${name}`]}`}
            ></span>
            <span className={style.categoryName}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </span>
            <span className={style.categoryCount}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
