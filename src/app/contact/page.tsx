import Card from "@/components/atoms/Card";
import { db } from "@/lib/db";
import { contacts } from "@/lib/schema";
import { eq } from "drizzle-orm";
import style from "./page.module.scss";
import AnimateIn from "@/components/atoms/AnimateIn";

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

interface ContactEntry {
  contactId: string;
  label: string;
  phone: string | null;
  email: string | null;
  person: string | null;
  languages: string | null;
  note: string | null;
  visible: boolean;
}

async function getVisibleContacts(): Promise<ContactEntry[]> {
  try {
    return await db
      .select({
        contactId: contacts.contactId,
        label: contacts.label,
        phone: contacts.phone,
        email: contacts.email,
        person: contacts.person,
        languages: contacts.languages,
        note: contacts.note,
        visible: contacts.visible,
      })
      .from(contacts)
      .where(eq(contacts.visible, true));
  } catch {
    return [];
  }
}

export default async function ContactPage() {
  const contactList = await getVisibleContacts();

  return (
    <div className={style.contactPage}>
      <div className="container">
        <AnimateIn preset="fadeUp" eager>
          <header className={style.header}>
            <h1>Contact Us</h1>
            <p className={style.subtitle}>
              We work with wine importers and dealers worldwide. Contact us for
              business inquiries and wine orders.
            </p>
          </header>
        </AnimateIn>

        {contactList.length > 0 && (
          <div className={style.contactGrid}>
            {contactList.map((contact, index) => (
              <AnimateIn key={contact.contactId} preset="fadeUp" delay={index * 0.1}>
                <Card variant="elevated" className={style.contactCard}>
                  <div className={style.cardInfo}>
                    <h2>{contact.label}</h2>
                    {(contact.phone || contact.email || contact.person || contact.languages) && (
                      <div className={style.contactInfo}>
                        {contact.person && (
                          <div className={style.contactItem}>
                            <strong>Contact Person:</strong>
                            <span>{contact.person}</span>
                          </div>
                        )}
                        {contact.phone && (
                          <div className={style.contactItem}>
                            <strong>Phone:</strong>
                            <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                          </div>
                        )}
                        {contact.email && (
                          <div className={style.contactItem}>
                            <strong>Email:</strong>
                            <a href={`mailto:${contact.email}`}>{contact.email}</a>
                          </div>
                        )}
                        {contact.languages && (
                          <div className={style.contactItem}>
                            <strong>Languages:</strong>
                            <span>{contact.languages}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {contact.note && (
                      <div className={style.note}>
                        {contact.note}
                      </div>
                    )}
                  </div>
                </Card>
              </AnimateIn>
            ))}
          </div>
        )}

        <AnimateIn preset="fadeUp">
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
        </AnimateIn>

        <AnimateIn preset="fadeUp" delay={0.1}>
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
        </AnimateIn>
      </div>
    </div>
  );
}
