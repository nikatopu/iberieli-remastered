"use client";

import { useConsent } from "@/contexts/ConsentContext";
import style from "./CookieSettings.module.scss";

const labels = {
  pending: "Cookie preferences",
  undecided: "Cookie preferences",
  granted: "Analytics cookies: allowed",
  denied: "Analytics cookies: declined",
};

export default function CookieSettings() {
  const { consent, openBanner } = useConsent();

  return (
    <button type="button" className={style.trigger} onClick={openBanner}>
      {labels[consent]}
    </button>
  );
}
