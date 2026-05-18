import { db } from "@/lib/db";
import { contacts } from "@/lib/schema";
import { eq } from "drizzle-orm";
import style from "./Footer.module.scss";

async function getOrderingContact() {
  try {
    const results = await db
      .select()
      .from(contacts)
      .where(eq(contacts.contactId, "ordering"));
    const contact = results[0];
    if (!contact || !contact.visible) return null;
    return contact;
  } catch {
    return null;
  }
}

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const ordering = await getOrderingContact();

  return (
    <footer className={style.footer}>
      <div className="container">
        <div className={style.footerContent}>
          <div className={style.section}>
            <h3>Iberieli</h3>
            <p>Authentic Georgian Natural Wines</p>
            <p>Traditional Kvevri Winemaking</p>
          </div>

          <div className={style.section}>
            <h4>Contact</h4>
            {ordering?.phone && <p>{ordering.phone}</p>}
            {ordering?.email && <p>{ordering.email}</p>}
            {!ordering?.phone && !ordering?.email && (
              <p>See our contact page for details.</p>
            )}
          </div>

          <div className={style.section}>
            <h4>Regions</h4>
            <p>Guria Region, West Georgia</p>
            <p>Kakheti Region, East Georgia</p>
          </div>
        </div>

        <div className={style.footerBottom}>
          <p>&copy; {currentYear} Iberieli LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
