"use client";

import Link from "next/link";
import Button from "@/components/atoms/Button";
import WineCard from "@/components/organisms/WineCard";
import style from "./page.module.scss";
import { useWines } from "@/contexts/WineContext";

export default function Home() {
  const { wines } = useWines();
  const featuredWines = wines.slice(0, 3);

  return (
    <div className={style.homepage}>
      <section className={style.hero}>
        <div className="container">
          <div className={style.heroContent}>
            <div className={style.heroText}>
              <h1>Authentic Georgian Natural Wines</h1>
              <p className={style.heroSubtitle}>
                We maintain authentic tradition of winemaking in Georgia using
                traditional Kvevri methods
              </p>
              <p>
                Producing unique natural wines from native grapes in the Guria
                and Kakheti regions
              </p>
              <div className={style.heroButtons}>
                <Button size="lg">
                  <Link href="/wines">Explore Our Wines</Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Link href="/about">About Us</Link>
                </Button>
              </div>
            </div>
            <div className={style.heroImage}>
              <img
                src="/photos/Wines 1.webp"
                alt="Georgian wines"
                className={style.wineImage}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={style.featured}>
        <div className="container">
          <h2 className="text-center mb-lg">Featured Wines</h2>
          <div className={style.wineGrid}>
            {featuredWines.map((wine) => (
              <WineCard key={wine.id} wine={wine} />
            ))}
          </div>
          <div className={style.viewAll}>
            <Button variant="secondary" size="lg">
              <Link href="/wines">View All Wines</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className={style.tradition}>
        <div className="container">
          <div className={style.traditionContent}>
            <div className={style.traditionImage}>
              <img
                src="/photos/Vkreft.webp"
                alt="Traditional winemaking"
                className={style.image}
              />
            </div>
            <div className={style.traditionText}>
              <h2>Traditional Kvevri Winemaking</h2>
              <p>
                Back to the basics and restart winemaking. We produce natural
                wines from Georgian native grape varieties using the ancient
                Kvevri method - clay vessels buried underground that have been
                used for over 8,000 years.
              </p>
              <p>
                Our family business operates in both the Guria Region of West
                Georgia and the Kakheti Region of East Georgia, maintaining
                authentic traditions while setting standards for natural wine
                production.
              </p>
              <Button variant="outline">
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
