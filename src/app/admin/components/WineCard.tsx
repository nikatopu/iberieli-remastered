import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { IWine } from "@/data/types";
import styles from "./WineCard.module.scss";

interface WineCardProps {
  wine: IWine;
  onEdit: (wine: IWine) => void;
}

export default function WineCard({ wine, onEdit }: WineCardProps) {
  return (
    <Card variant="wine" className={styles.wineCard}>
      <div className={styles.wineInfo}>
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
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(wine)}
            className={styles.editButton}
          >
            Edit Wine
          </Button>
        </div>
      </div>
    </Card>
  );
}
