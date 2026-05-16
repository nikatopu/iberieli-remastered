import Card from "@/components/atoms/Card";
import { contactInfo } from "@/data/company";
import style from "./page.module.scss";

export const metadata = {
  title: "Contact Us",
  description:
    "Contact Iberieli for wine orders and business inquiries. We work with wine importers and distributors worldwide. Reach us by phone or email.",
  openGraph: {
    title: "Contact Us | Iberieli",
    description:
      "Contact Iberieli for wine orders and business inquiries. We work with wine importers and distributors worldwide.",
    url: "https://www.iberieli.com/contact",
    images: [{ url: "/photos/red wine.webp", alt: "Iberieli Wine Orders" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Iberieli",
    description:
      "Contact Iberieli for wine orders and business inquiries. We work with wine importers and distributors worldwide.",
    images: ["/photos/red wine.webp"],
  },
  alternates: { canonical: "https://www.iberieli.com/contact" },
};

export default function ContactPage() {
  return (
    <div className={style.contactPage}>
      <div className="container">
        <header className={style.header}>
          <h1>Contact Us</h1>
          <p className={style.subtitle}>
            We work with wine importers and dealers worldwide. Contact us for
            business inquiries and wine orders. For retail in Georgia, please
            visit our partner's store{" "}
            <a
              href="https://topuridzewinery.ge/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://topuridzewinery.ge/
            </a>
            .
          </p>
        </header>

        <div className={style.contactGrid}>
          <Card variant="elevated" className={style.contactCard}>
            <div className={style.cardContent}>
              <div className={style.cardImage}>
                <img
                  src="/photos/red wine.webp"
                  alt="Wine ordering"
                  className={style.image}
                />
              </div>
              <div className={style.cardInfo}>
                <h2>Wine Orders</h2>
                <div className={style.contactInfo}>
                  <div className={style.contactItem}>
                    <strong>Phone:</strong>
                    <a href={`tel:${contactInfo.ordering.phone}`}>
                      {contactInfo.ordering.phone}
                    </a>
                  </div>
                  <div className={style.contactItem}>
                    <strong>Email:</strong>
                    <a href={`mailto:${contactInfo.ordering.email}`}>
                      {contactInfo.ordering.email}
                    </a>
                  </div>
                  <div className={style.contactItem}>
                    <strong>Contact Person:</strong>
                    <span>{contactInfo.ordering.person}</span>
                  </div>
                  <div className={style.contactItem}>
                    <strong>Languages:</strong>
                    <span>{contactInfo.ordering.languages}</span>
                  </div>
                </div>
                <div className={style.note}>
                  <strong>Note:</strong> {contactInfo.ordering.note}
                </div>
              </div>
            </div>
          </Card>

          <Card variant="elevated" className={style.contactCard}>
            <div className={style.cardContent}>
              <div className={style.cardImage}>
                <img
                  src="/photos/Iberieli Logo.webp"
                  alt="Business inquiries"
                  className={style.image}
                />
              </div>
              <div className={style.cardInfo}>
                <h2>Finances & Invoicing</h2>
                <div className={style.contactInfo}>
                  <div className={style.contactItem}>
                    <strong>Phone:</strong>
                    <a href={`tel:${contactInfo.finances.phone}`}>
                      {contactInfo.finances.phone}
                    </a>
                  </div>
                  <div className={style.contactItem}>
                    <strong>Email:</strong>
                    <a href={`mailto:${contactInfo.finances.email}`}>
                      {contactInfo.finances.email}
                    </a>
                  </div>
                  <div className={style.contactItem}>
                    <strong>Department:</strong>
                    <span>{contactInfo.finances.person}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <section className={style.businessInfo}>
          <Card variant="elevated">
            <h2>Business Information</h2>
            <div className={style.businessContent}>
              <div className={style.businessItem}>
                <h3>Company</h3>
                <p>Iberieli LLC</p>
              </div>
              <div className={style.businessItem}>
                <h3>Regions</h3>
                <div className={style.regions}>
                  <div className={style.region}>
                    <strong>West Georgia:</strong>
                    <span>Guria Region</span>
                  </div>
                  <div className={style.region}>
                    <strong>East Georgia:</strong>
                    <span>Kakheti Region</span>
                  </div>
                </div>
              </div>
              <div className={style.businessItem}>
                <h3>Specialization</h3>
                <p>
                  Traditional Kvevri winemaking, Natural wines, Georgian native
                  grape varieties
                </p>
              </div>
              <div className={style.businessItem}>
                <h3>Target Market</h3>
                <p>Wine importers, distributors, and dealers worldwide</p>
              </div>
            </div>
          </Card>
        </section>

        <section className={style.mapInfo}>
          <Card variant="elevated">
            <h2>Our Locations</h2>
            <div className={style.locations}>
              <div className={style.location}>
                <h3>Guria Region Winery</h3>
                <p>Village SakvavisTke, Guria Region, West Georgia</p>
                <div className={style.locationDetails}>
                  <p>
                    <strong>Climate:</strong> High humidity, hot humid summers,
                    mild winters
                  </p>
                  <p>
                    <strong>Soil:</strong> Brown and red loam soils on weathered
                    basalts
                  </p>
                  <p>
                    <strong>Varieties:</strong> Chkhaveri, local varieties
                  </p>
                </div>
              </div>
              <div className={style.location}>
                <h3>Kakheti Region Winery</h3>
                <p>Kakheti Region, East Georgia</p>
                <div className={style.locationDetails}>
                  <p>
                    <strong>Climate:</strong> Continental climate
                  </p>
                  <p>
                    <strong>Soil:</strong> Alluvial soils with excellent
                    drainage
                  </p>
                  <p>
                    <strong>Varieties:</strong> Saperavi, Rkatsiteli, Kisi, and
                    other traditional varieties
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
