import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { db } from "@/lib/db";
import { wines as winesTable } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { mapDbWineToFrontend } from "@/lib/wineMapping";
import { IWine } from "@/data/types";
import style from "./page.module.scss";
import AnimateIn from "@/components/atoms/AnimateIn";
import { OrderWineButton } from "@/components/organisms/Distribution";

interface Props {
  params: Promise<{ id: string }>;
}

async function getWine(id: string): Promise<IWine | null> {
  const results = await db
    .select()
    .from(winesTable)
    .where(and(eq(winesTable.wineId, id), eq(winesTable.visible, true)));
  return results[0] ? mapDbWineToFrontend(results[0]) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const wine = await getWine(id);
  if (!wine) return { title: "Wine Not Found" };

  const description =
    wine.tastingNotes.length > 155
      ? wine.tastingNotes.slice(0, 152) + "..."
      : wine.tastingNotes;

  return {
    title: wine.name,
    description,
    openGraph: {
      title: `${wine.name} | Iberieli`,
      description,
      url: `https://www.iberieli.com/wines/${wine.id}`,
      images: [{ url: wine.image, alt: wine.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${wine.name} | Iberieli`,
      description,
      images: [wine.image],
    },
    alternates: { canonical: `https://www.iberieli.com/wines/${wine.id}` },
  };
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

export default async function WinePage({ params }: Props) {
  const { id } = await params;
  const wine = await getWine(id);

  if (!wine) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: wine.name,
    description: wine.description,
    image: wine.image.startsWith("http")
      ? wine.image
      : `https://www.iberieli.com${wine.image}`,
    brand: { "@type": "Brand", name: "Iberieli" },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Iberieli LLC" },
    },
  };

  return (
    <div className={style.winePage}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container">
        <AnimateIn preset="fadeIn" eager>
          <div className={style.breadcrumb}>
            <Link href="/wines">← Back to Wines</Link>
          </div>
          <p className={style.summary}>{wine.description}</p>
        </AnimateIn>

        <AnimateIn preset="fadeUp" eager delay={0.1}>
          <div className={style.wineHeader}>
            <div className={style.wineImage}>
              <img src={wine.image} alt={wine.name} className={style.image} />
            </div>
            <div className={style.wineInfo}>
              <div className={style.titleRow}>
                <h1>{wine.name}</h1>
                <OrderWineButton wineName={wine.name} />
              </div>
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
                  <strong>Cellar:</strong> {wine.cellarName}
                </div>
                <div className={style.infoItem}>
                  <strong>Winemaker:</strong> {wine.winemaker}
                </div>
                {wine.alcoholLevel && (
                  <div className={style.infoItem}>
                    <strong>Alcohol:</strong> {wine.alcoholLevel}
                  </div>
                )}
                <div className={style.infoItem}>
                  <strong>Availability:</strong>
                  <span className={wine.inStock ? style.badgeInStock : style.badgeOutOfStock}>
                    {wine.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <div className={style.infoItem}>
                  <strong>Vegan:</strong> {wine.vegan ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>

        <div className={style.wineDetails}>
          {[
            <WineDetailSection key="tasting" title="Tasting Notes">
              <p>{wine.tastingNotes}</p>
            </WineDetailSection>,
            <WineDetailSection key="food" title="Food Recommendations">
              <p>{wine.foodRecommendation}</p>
            </WineDetailSection>,
            <WineDetailSection key="terroir" title="Climate & Terroir">
              <div className={style.subsection}>
                <h4>Climate</h4>
                <p>{wine.climate}</p>
              </div>
              <div className={style.subsection}>
                <h4>Terroir</h4>
                <p>{wine.terroir}</p>
              </div>
            </WineDetailSection>,
            <WineDetailSection key="production" title="Production">
              <div className={style.subsection}>
                <h4>Viticulture</h4>
                <p>{wine.viticulture}</p>
              </div>
              {wine.organicFarming && (
                <div className={style.subsection}>
                  <h4>Organic Farming</h4>
                  <p>{wine.organicFarming}</p>
                </div>
              )}
              <div className={style.subsection}>
                <h4>Yields</h4>
                <p>{wine.yields}</p>
              </div>
            </WineDetailSection>,
            <WineDetailSection key="vinification" title="Vinification">
              <div className={style.vinification}>
                {(
                  [
                    ["Harvest", wine.vinification.harvest],
                    ["Processing", wine.vinification.processing],
                    ["Fermentation", wine.vinification.fermentation],
                    ["Fermentation Time", wine.vinification.fermentationTime],
                    ["Fermentation Vessel", wine.vinification.fermentationVessel],
                    ["Maceration", wine.vinification.maceration],
                    ["Maceration Vessel", wine.vinification.macerationVessel],
                    ["Maturation Time", wine.vinification.maturationTime],
                    ["Maturation Vessel", wine.vinification.maturationVessel],
                    ["Filtration", wine.vinification.filtration],
                    ["Fining", wine.vinification.fining],
                    ["Sulphur", wine.vinification.sulphur],
                  ] as [string, string | undefined][]
                )
                  .filter(([, v]) => v)
                  .map(([label, value]) => (
                    <div key={label} className={style.vinificationItem}>
                      <strong>{label}:</strong> {value}
                    </div>
                  ))}
              </div>
            </WineDetailSection>,
          ].map((section, index) => (
            <AnimateIn key={index} preset="fadeUp" delay={index * 0.07}>
              {section}
            </AnimateIn>
          ))}
        </div>

        <AnimateIn preset="fadeUp">
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
        </AnimateIn>
      </div>
    </div>
  );
}
