import { IWine } from "@/data/types";
import WineCard from "./WineCard";
import styles from "./WineList.module.scss";

interface WineListProps {
  wines: IWine[];
  onEditWine: (wine: IWine) => void;
}

export default function WineList({ wines, onEditWine }: WineListProps) {
  return (
    <div className={styles.wineList}>
      <div className={styles.wineListHeader}>
        <div>
          <h2>Manage Wine Collection</h2>
          <p className={styles.description}>
            Click on any wine to edit its description and tasting notes. Changes
            are saved directly to the database.
          </p>
        </div>
        <div className={styles.stats}>
          <span className={styles.wineCount}>{wines.length} wines</span>
        </div>
      </div>

      {wines.length === 0 ? (
        <div className={styles.noWines}>
          <p>No wines found in the database.</p>
          <p>Please seed the database with wine data first.</p>
        </div>
      ) : (
        <div className={styles.wineGrid}>
          {wines.map((wine) => (
            <WineCard key={wine.id} wine={wine} onEdit={onEditWine} />
          ))}
        </div>
      )}
    </div>
  );
}
