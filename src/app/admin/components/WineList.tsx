import Link from "next/link";
import { IWine } from "@/data/types";
import WineCard from "./WineCard";
import styles from "./WineList.module.scss";

interface WineListProps {
  wines: IWine[];
  onEditWine: (wine: IWine) => void;
  onToggleVisible: (wineId: string, visible: boolean) => Promise<void>;
}

export default function WineList({
  wines,
  onEditWine,
  onToggleVisible,
}: WineListProps) {
  const visibleCount = wines.filter((w) => w.visible).length;

  return (
    <div className={styles.wineList}>
      <div className={styles.wineListHeader}>
        <div>
          <h2>Wine Collection</h2>
          <p className={styles.description}>
            Click a wine to edit its details. Toggle visibility to show or hide
            it on the public website.
          </p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.stats}>
            <span className={styles.wineCount}>{wines.length} wines</span>
            <span className={styles.visibleCount}>
              {visibleCount} visible
            </span>
          </div>
          <Link href="/admin/new-wine" className={styles.addButton}>
            + Add Wine
          </Link>
        </div>
      </div>

      {wines.length === 0 ? (
        <div className={styles.noWines}>
          <p>No wines in the database.</p>
          <p>
            <Link href="/admin/new-wine" className={styles.addLink}>
              Add your first wine →
            </Link>
          </p>
        </div>
      ) : (
        <div className={styles.wineGrid}>
          {wines.map((wine) => (
            <WineCard
              key={wine.id}
              wine={wine}
              onEdit={onEditWine}
              onToggleVisible={onToggleVisible}
            />
          ))}
        </div>
      )}
    </div>
  );
}
