import { IWine } from "@/data/types";
import styles from "./WineCard.module.scss";

interface WineCardProps {
  wine: IWine;
  onEdit: (wine: IWine) => void;
  onToggleVisible: (wineId: string, visible: boolean) => Promise<void>;
}

export default function WineCard({
  wine,
  onEdit,
  onToggleVisible,
}: WineCardProps) {
  return (
    <div className={`${styles.wineCard} ${!wine.visible ? styles.hidden : ""}`}>
      <button type="button" className={styles.wineInfo} onClick={() => onEdit(wine)}>
        <div className={styles.wineImageContainer}>
          <img src={wine.image} alt={wine.name} className={styles.wineImage} />
          <span className={styles.categoryBadge}>{wine.category}</span>
        </div>
        <div className={styles.wineDetails}>
          <div className={styles.wineHeader}>
            <h3>{wine.name}</h3>
            <span className={styles.grapeBlend}>{wine.grapeBlend}</span>
          </div>
          <p className={styles.wineDescription}>{wine.description}</p>
        </div>
      </button>

      <div className={styles.cardFooter}>
        <button
          type="button"
          className={`${styles.visibilityToggle} ${wine.visible ? styles.visibleOn : styles.visibleOff}`}
          onClick={() => onToggleVisible(wine.id, !wine.visible)}
          title={wine.visible ? "Hide from public website" : "Show on public website"}
        >
          <span className={styles.toggleIcon}>
            {wine.visible ? "●" : "○"}
          </span>
          {wine.visible ? "Visible" : "Hidden"}
        </button>
        <span className={styles.editHint}>Click card to edit →</span>
      </div>
    </div>
  );
}
