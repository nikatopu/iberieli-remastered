import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { companyInfo } from "@/data/company";
import style from "./page.module.scss";
import Link from "next/link";
import AnimateIn from "@/components/atoms/AnimateIn";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Zurab Topuridze and the family behind Iberieli, producers of authentic Georgian natural wines using traditional Kvevri methods in Guria and Kakheti regions.",
  openGraph: {
    title: "About Us | Iberieli",
    description:
      "Learn about Zurab Topuridze and the family behind Iberieli, producers of authentic Georgian natural wines using traditional Kvevri methods.",
    url: "https://www.iberieli.com/about",
    images: [
      {
        url: "/photos/zurab topuridze.webp",
        alt: "Zurab Topuridze — Founder of Iberieli",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Iberieli",
    description:
      "Learn about Zurab Topuridze and the family behind Iberieli, producers of authentic Georgian natural wines.",
    images: ["/photos/zurab topuridze.webp"],
  },
  alternates: { canonical: "https://www.iberieli.com/about" },
};

export default function AboutPage() {
  return (
    <div className={style.aboutPage}>
      <div className="container">
        <AnimateIn preset="fadeUp" eager>
          <header className={style.header}>
            <h1>About Iberieli</h1>
            <p className={style.subtitle}>
              A family business dedicated to maintaining the authentic tradition
              of Kvevri winemaking in Georgia
            </p>
          </header>
        </AnimateIn>

        <AnimateIn preset="fadeUp">
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
        </AnimateIn>

        <section className={style.story}>
          <div className={style.storyContent}>
            <AnimateIn preset="fadeLeft">
              <div className={style.storyText}>
                <h2>The Iberieli Story</h2>
                <p>{companyInfo.story}</p>
              </div>
            </AnimateIn>
            <AnimateIn preset="fadeRight" delay={0.1}>
              <div className={style.storyImage}>
                <img
                  src="/photos/Nika, Ioane, Pirveli botli.webp"
                  alt="Zurab's children with the first wine"
                  className={style.image}
                />
              </div>
            </AnimateIn>
          </div>
        </section>

        <AnimateIn preset="fadeUp">
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
        </AnimateIn>

        <section className={style.gallery}>
          <AnimateIn preset="fadeUp">
            <h2>Our Vineyards & Process</h2>
          </AnimateIn>
          <div className={style.galleryGrid}>
            {[
              { src: "/photos/dganan.webp", alt: "Workers in the vineyard", caption: "Dedicated vineyard workers" },
              { src: "/photos/Friends and family clear.webp", alt: "Family and friends at winepress", caption: "Family and friends at the traditional winepress" },
              { src: "/photos/red wine.webp", alt: "Wine glass", caption: "The final result - exceptional natural wine" },
              { src: "/photos/Wines 2.webp", alt: "Wine collection", caption: "Our growing collection of authentic Georgian wines" },
            ].map((item, index) => (
              <AnimateIn key={item.src} preset="fadeUp" delay={index * 0.1}>
                <div className={style.galleryItem}>
                  <img src={item.src} alt={item.alt} className={style.galleryImage} />
                  <p>{item.caption}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </section>

        <AnimateIn preset="fadeUp">
          <section className={style.cta}>
            <Card variant="elevated" className={style.ctaCard}>
              <h2>Ready to Experience Our Wines?</h2>
              <p>
                Contact us to learn more about our wine selection and distribution
                opportunities.
              </p>
              <div className={style.ctaButtons}>
                <Link href="/wines">
                  <Button size="lg">Explore Our Wines</Button>
                </Link>

                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </Card>
          </section>
        </AnimateIn>
      </div>
    </div>
  );
}
