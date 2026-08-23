"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useConsent } from "@/contexts/ConsentContext";
import style from "./CookieConsent.module.scss";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CookieConsent() {
  const { isBannerOpen, accept, decline, dismiss } = useConsent();
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <AnimatePresence>
      {isBannerOpen && (
        <motion.aside
          className={style.banner}
          aria-label="Cookie preferences"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <button
            type="button"
            className={style.close}
            onClick={dismiss}
            aria-label="Close without choosing"
          >
            &times;
          </button>

          <h2 className={style.title}>Cookies</h2>

          <p className={style.text}>
            We would like to use analytics cookies to understand how visitors
            use our site. They are entirely optional — nothing is measured and
            no cookie is stored unless you allow it.
          </p>

          <button
            type="button"
            className={style.detailsToggle}
            onClick={() => setDetailsOpen((open) => !open)}
            aria-expanded={detailsOpen}
          >
            {detailsOpen ? "Hide details" : "What would be used?"}
          </button>

          <AnimatePresence initial={false}>
            {detailsOpen && (
              <motion.div
                className={style.details}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <dl className={style.detailsList}>
                  <div>
                    <dt>Google Analytics</dt>
                    <dd>
                      Aggregated visit statistics — which pages are read and
                      roughly where visitors come from.
                      <span className={style.cookieNames}>_ga, _ga_*</span>
                    </dd>
                  </div>
                  <div>
                    <dt>Microsoft Clarity</dt>
                    <dd>
                      Anonymous interaction data, so we can see which parts of a
                      page are hard to use.
                      <span className={style.cookieNames}>_clck, _clsk</span>
                    </dd>
                  </div>
                </dl>
                <p className={style.detailsNote}>
                  No advertising or personalisation cookies are used, and we
                  never sell your data. Your choice is remembered in your
                  browser and you can change it at any time from the footer.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={style.actions}>
            <button type="button" className={style.action} onClick={decline}>
              Decline
            </button>
            <button type="button" className={style.action} onClick={accept}>
              Allow
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
