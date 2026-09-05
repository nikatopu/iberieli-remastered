"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DistributionPanel from "./DistributionPanel";
import styles from "./OrderWine.module.scss";

interface Props {
  wineName: string;
  /** "hero" sits beside the wine title; "inline" is a plain button anywhere else. */
  placement?: "hero" | "inline";
}

export default function OrderWineButton({
  wineName,
  placement = "hero",
}: Props) {
  const [open, setOpen] = useState(false);
  /** Kept mounted after the first open so the fetched list is not re-requested. */
  const [everOpened, setEverOpened] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${styles[`trigger--${placement}`]}`}
        onClick={() => {
          setEverOpened(true);
          setOpen(true);
        }}
      >
        Order This Wine
      </button>

      {open && (
        <div
          className={styles.overlay}
          onClick={close}
          role="presentation"
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label={`Where to buy ${wineName}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              className={styles.closeBtn}
              onClick={close}
              aria-label="Close"
            >
              ×
            </button>

            <DistributionPanel
              variant="modal"
              wineName={wineName}
              enabled={everOpened}
            />
          </div>
        </div>
      )}
    </>
  );
}
