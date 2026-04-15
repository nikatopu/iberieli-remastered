import { contactInfo } from "@/data/company";
import style from "./Footer.module.scss";

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
            <p>{contactInfo.ordering.phone}</p>
            <p>{contactInfo.ordering.email}</p>
            <p className={style.note}>{contactInfo.ordering.note}</p>
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
