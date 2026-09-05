"use client";

import Link from "next/link";
import { countryFlag } from "@/data/countries";
import { displayHost } from "@/lib/urls";
import { useDistribution } from "./useDistribution";
import styles from "./Distribution.module.scss";

interface Props {
  variant: "modal" | "section";
  /** Named on wine pages so the copy can talk about the bottle they're viewing. */
  wineName?: string;
  enabled?: boolean;
}

export default function DistributionPanel({
  variant,
  wineName,
  enabled = true,
}: Props) {
  const {
    status,
    country,
    distributor,
    distributors,
    countryOptions,
    selectCountry,
    isOverridden,
  } = useDistribution(enabled);

  const subject = wineName ? `“${wineName}”` : "our wines";
  const here = country ? (countryFlag(country) + " ") : "";

  const picker = (
    <div className={styles.picker}>
      <label htmlFor={`country-${variant}`}>
        {status === "unknown"
          ? "Select your country"
          : isOverridden
            ? "Showing results for"
            : "Not your country?"}
      </label>
      <select
        id={`country-${variant}`}
        value={country ?? ""}
        onChange={(e) => selectCountry(e.target.value)}
        className={styles.select}
      >
        <option value="">Choose a country…</option>
        {countryOptions.served.length > 0 && (
          <optgroup label="Countries we distribute to">
            {countryOptions.served.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </optgroup>
        )}
        <optgroup label="All other countries">
          {countryOptions.rest.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );

  const countryLabel =
    distributors.find((d) => d.countryCode === country)?.countryName ??
    countryOptions.served.find((c) => c.code === country)?.name ??
    countryOptions.rest.find((c) => c.code === country)?.name ??
    "your country";

  return (
    <div className={`${styles.panel} ${styles[`panel--${variant}`]}`}>
      {status === "loading" && (
        <div className={styles.loading}>
          <span className={styles.spinner} aria-hidden="true" />
          <p>Finding a stockist near you…</p>
        </div>
      )}

      {status === "unknown" && (
        <>
          <p className={styles.eyebrow}>Where to buy</p>
          <h3 className={styles.heading}>Let&rsquo;s find your stockist</h3>
          <p className={styles.body}>
            We couldn&rsquo;t work out where you&rsquo;re browsing from. Pick your
            country and we&rsquo;ll point you at the importer who carries{" "}
            {subject} there.
          </p>
          {picker}
        </>
      )}

      {status === "available" && distributor && (
        <>
          <p className={styles.eyebrow}>{here}Available in {countryLabel}</p>
          <h3 className={styles.heading}>
            Order from {distributor.name ?? displayHost(distributor.url)}
          </h3>
          <p className={styles.body}>
            {distributor.name ?? displayHost(distributor.url)} is our official
            importer for {countryLabel}. They hold the current vintages of{" "}
            {subject} and handle pricing, delivery and trade orders locally.
          </p>

          <a
            href={distributor.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primaryAction}
          >
            Visit {distributor.name ?? displayHost(distributor.url)}
            <span aria-hidden="true"> ↗</span>
          </a>
          <p className={styles.fineprint}>
            Opens {displayHost(distributor.url)} in a new tab.
          </p>

          <div className={styles.secondaryRow}>
            <Link href="/contact" className={styles.secondaryAction}>
              Buying in bulk or for a restaurant? Talk to us
            </Link>
          </div>

          {picker}
        </>
      )}

      {status === "unavailable" && (
        <>
          <p className={styles.eyebrow}>{here}Not yet in {countryLabel}</p>
          <h3 className={styles.heading}>
            We don&rsquo;t have an importer in {countryLabel} yet
          </h3>
          <p className={styles.body}>
            We aren&rsquo;t shipping {subject} to {countryLabel} at the moment,
            so there&rsquo;s no local shop we can send you to. We&rsquo;re a
            family winery that works directly with importers, and we&rsquo;re
            actively looking for a partner in your market.
          </p>
          <p className={styles.body}>
            If you import, distribute or retail natural wine, we&rsquo;d like to
            talk. We&rsquo;ll send our current portfolio, trade pricing and
            samples.
          </p>

          <Link href="/contact" className={styles.primaryAction}>
            Enquire about importing Iberieli
          </Link>
          <p className={styles.fineprint}>
            For trade enquiries — importers, distributors and retailers.
          </p>

          {picker}
        </>
      )}

      {distributors.length > 0 && status !== "loading" && (
        <div className={styles.coverage}>
          <p className={styles.coverageTitle}>
            Iberieli is currently distributed in
          </p>
          <ul className={styles.coverageList}>
            {distributors.map((d) => (
              <li key={d.id}>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    d.countryCode === country
                      ? `${styles.coverageItem} ${styles.coverageItemActive}`
                      : styles.coverageItem
                  }
                >
                  <span className={styles.coverageFlag} aria-hidden="true">
                    {countryFlag(d.countryCode)}
                  </span>
                  <span className={styles.coverageCountry}>{d.countryName}</span>
                  <span className={styles.coverageName}>
                    {d.name ?? displayHost(d.url)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
