"use client";

import Script from "next/script";
import { useEffect } from "react";
import Clarity from "@microsoft/clarity";
import { useConsent } from "@/contexts/ConsentContext";
import {
  CLARITY_PROJECT_ID,
  GA_MEASUREMENT_ID,
  enableAnalytics,
} from "@/lib/analytics";

/**
 * Loads Google Analytics and Microsoft Clarity — but only once the visitor has
 * granted consent. Before that neither script is on the page, so neither one
 * sets a cookie or sends a request.
 */
export default function Analytics() {
  const { consent } = useConsent();
  const granted = consent === "granted";

  useEffect(() => {
    if (!granted) return;

    enableAnalytics();

    if (!CLARITY_PROJECT_ID) return;

    Clarity.init(CLARITY_PROJECT_ID);
    // We only ask for analytics consent, never advertising.
    Clarity.consentV2({ ad_Storage: "denied", analytics_Storage: "granted" });
  }, [granted]);

  if (!granted || !GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        id="ga-script"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'granted'
          });
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
