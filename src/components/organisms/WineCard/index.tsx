import Image from "next/image";
import Link from "next/link";
import Card from "@/components/atoms/Card";
import { IWine } from "@/data/types";
import style from "./WineCard.module.scss";

interface Props {
  wine: IWine;
}

export default function WineCard({ wine }: Props) {
  return (
    <Link href={`/wines/${wine.id}`} className={style.link}>
      <Card variant="wine" className={style.wineCard}>
        <div className={style.imageContainer}>
          <img src={wine.image} alt={wine.name} className={style.image} />
        </div>
        <div className={style.content}>
          <h3 className={style.name}>{wine.name}</h3>
          <p className={style.description}>{wine.description}</p>
          <div className={style.details}>
            <span
              className={`${style.category} ${style[`category--${wine.category}`]}`}
            >
              {wine.category}
            </span>
            <span className={style.location}>
              {wine.location.split(",")[0]}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
