import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Link from "next/link";
import { companyInfo } from "@/data/company";
import style from "./page.module.scss";

export const metadata = {
  title: "About Us - Iberieli",
  description:
    "Learn about Zurab Topuridze and the family behind Iberieli, producers of authentic Georgian natural wines using traditional Kvevri methods.",
};

export default function AboutPage() {
  return (
    <div className={style.aboutPage}>
      <div className="container">
        <header className={style.header}>
          <h1>About Iberieli</h1>
          <p className={style.subtitle}>
            A family business dedicated to maintaining the authentic tradition
            of Kvevri winemaking in Georgia
          </p>
        </header>

        <section className={style.founder}>
          <Card variant="elevated" className={style.founderCard}>
            <div className={style.founderContent}>
              <div className={style.founderImage}>
                <img
                  src={companyInfo.founder.image}
                  alt={companyInfo.founder.name}
                  className={style.image}
                />
              </div>
              <div className={style.founderInfo}>
                <h2>{companyInfo.founder.name}</h2>
                <h3 className={style.title}>{companyInfo.founder.title}</h3>
                <p>{companyInfo.founder.description}</p>
              </div>
            </div>
          </Card>
        </section>

        <section className={style.story}>
          <div className={style.storyContent}>
            <div className={style.storyText}>
              <h2>The Iberieli Story</h2>
              <p>{companyInfo.story}</p>
            </div>
            <div className={style.storyImage}>
              <img
                src="/photos/Nika, Ioane, Pirveli botli.webp"
                alt="Zurab's children with the first wine"
                className={style.image}
              />
            </div>
          </div>
        </section>

        <section className={style.business}>
          <Card variant="elevated">
            <h2>Our Business</h2>
            <p>{companyInfo.business}</p>

            <div className={style.markets}>
              <h3>Global Presence</h3>
              <p>Currently selling in:</p>
              <div className={style.marketList}>
                {companyInfo.markets.map((market) => (
                  <span key={market} className={style.market}>
                    {market}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <section className={style.gallery}>
          <h2>Our Vineyards & Process</h2>
          <div className={style.galleryGrid}>
            <div className={style.galleryItem}>
              <img
                src="/photos/dganan.webp"
                alt="Workers in the vineyard"
                className={style.galleryImage}
              />
              <p>Dedicated vineyard workers</p>
            </div>
            <div className={style.galleryItem}>
              <img
                src="/photos/Friends and family clear.webp"
                alt="Family and friends at winepress"
                className={style.galleryImage}
              />
              <p>Family and friends at the traditional winepress</p>
            </div>
            <div className={style.galleryItem}>
              <img
                src="/photos/red wine.webp"
                alt="Wine glass"
                className={style.galleryImage}
              />
              <p>The final result - exceptional natural wine</p>
            </div>
            <div className={style.galleryItem}>
              <img
                src="/photos/Wines 2.webp"
                alt="Wine collection"
                className={style.galleryImage}
              />
              <p>Our growing collection of authentic Georgian wines</p>
            </div>
          </div>
        </section>

        <section className={style.cta}>
          <Card variant="elevated" className={style.ctaCard}>
            <h2>Ready to Experience Our Wines?</h2>
            <p>
              Contact us to learn more about our wine selection and distribution
              opportunities.
            </p>
            <div className={style.ctaButtons}>
              <Button size="lg">
                <Link href="/wines">Explore Our Wines</Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
