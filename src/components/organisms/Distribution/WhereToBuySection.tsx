"use client";

import DistributionPanel from "./DistributionPanel";
import styles from "./WhereToBuy.module.scss";

/**
 * The contact-page counterpart to the wine-page modal — same information, laid
 * out as a full-width section rather than a dialog.
 */
export default function WhereToBuySection() {
  return (
    <section className={styles.section} aria-labelledby="where-to-buy">
      <div className={styles.inner}>
        <h2 id="where-to-buy" className={styles.title}>
          Where to buy Iberieli
        </h2>
        <p className={styles.lede}>
          Our wines reach you through local importers. Here&rsquo;s who carries
          them in your country — and how to reach us if nobody does yet.
        </p>

        <div className={styles.panelWrap}>
          <DistributionPanel variant="section" />
        </div>
      </div>
    </section>
  );
}
