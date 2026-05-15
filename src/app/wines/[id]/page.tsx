"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { useWines } from "@/contexts/AppContext";
import { IWine } from "@/data/types";
import style from "./page.module.scss";
import { useEffect, useState } from "react";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

function WineDetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card variant="elevated" className={style.section}>
      <h3 className={style.sectionTitle}>{title}</h3>
      {children}
    </Card>
  );
}

export default function WinePage({ params }: Props) {
  const { getWineById, error } = useWines();
  const [wine, setWine] = useState<IWine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWine() {
      try {
        const { id } = await params;
        const wineData = await getWineById(id);
        setWine(wineData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching wine:", err);
        setLoading(false);
      }
    }

    fetchWine();
  }, [params, getWineById]);

  if (loading) {
    return (
      <div className={style.winePage}>
        <div className="container">
          <div className={style.loading}>
            <p>Loading wine details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={style.winePage}>
        <div className="container">
          <div className={style.error}>
            <p>Error loading wine: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!wine) {
    notFound();
  }

  return (
    <div className={style.winePage}>
      <div className="container">
        <div className={style.breadcrumb}>
          <Link href="/wines">← Back to Wines</Link>
        </div>

        <div className={style.wineHeader}>
          <div className={style.wineImage}>
            <img src={wine.image} alt={wine.name} className={style.image} />
          </div>
          <div className={style.wineInfo}>
            <h1>{wine.name}</h1>
            <div className={style.basicInfo}>
              <div className={style.infoItem}>
                <strong>Location:</strong> {wine.location}
              </div>
              <div className={style.infoItem}>
                <strong>Grape/Blend:</strong> {wine.grapeBlend}
              </div>
              <div className={style.infoItem}>
                <strong>Category:</strong>
                <span
                  className={`${style.category} ${style[`category--${wine.category}`]}`}
                >
                  {wine.category}
                </span>
              </div>
              <div className={style.infoItem}>
                <strong>Sustainable:</strong> {wine.sustainability}
              </div>
              <div className={style.infoItem}>
                <strong>Vegan:</strong> {wine.vegan ? "Yes" : "No"}
              </div>
            </div>
          </div>
        </div>

        <div className={style.wineDetails}>
          <WineDetailSection title="Tasting Notes">
            <p>{wine.tastingNotes}</p>
          </WineDetailSection>

          <WineDetailSection title="Food Recommendations">
            <p>{wine.foodRecommendation}</p>
          </WineDetailSection>

          <WineDetailSection title="Climate & Terroir">
            <div className={style.subsection}>
              <h4>Climate</h4>
              <p>{wine.climate}</p>
            </div>
            <div className={style.subsection}>
              <h4>Terroir</h4>
              <p>{wine.terroir}</p>
            </div>
          </WineDetailSection>

          <WineDetailSection title="Production">
            <div className={style.subsection}>
              <h4>Viticulture</h4>
              <p>{wine.viticulture}</p>
            </div>
            <div className={style.subsection}>
              <h4>Yields</h4>
              <p>{wine.yields}</p>
            </div>
          </WineDetailSection>

          <WineDetailSection title="Vinification">
            <div className={style.vinification}>
              <div className={style.vinificationItem}>
                <strong>Harvest:</strong> {wine.vinification.harvest}
              </div>
              <div className={style.vinificationItem}>
                <strong>Processing:</strong> {wine.vinification.processing}
              </div>
              <div className={style.vinificationItem}>
                <strong>Fermentation:</strong> {wine.vinification.fermentation}
              </div>
              <div className={style.vinificationItem}>
                <strong>Fermentation Time:</strong>{" "}
                {wine.vinification.fermentationTime}
              </div>
              <div className={style.vinificationItem}>
                <strong>Fermentation Vessel:</strong>{" "}
                {wine.vinification.fermentationVessel}
              </div>
              <div className={style.vinificationItem}>
                <strong>Maturation Time:</strong>{" "}
                {wine.vinification.maturationTime}
              </div>
              <div className={style.vinificationItem}>
                <strong>Maturation Vessel:</strong>{" "}
                {wine.vinification.maturationVessel}
              </div>
              <div className={style.vinificationItem}>
                <strong>Filtration:</strong> {wine.vinification.filtration}
              </div>
              <div className={style.vinificationItem}>
                <strong>Sulphur:</strong> {wine.vinification.sulphur}
              </div>
            </div>
          </WineDetailSection>
        </div>

        <div className={style.actions}>
          <Link href="/contact">
            <Button size="lg">Contact for Orders</Button>
          </Link>
          <Link href="/wines">
            <Button variant="outline" size="lg">
              View Other Wines
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
