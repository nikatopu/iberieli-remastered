"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import WineCard from "@/components/organisms/WineCard";
import style from "./FeaturedWines.module.scss";

interface Props {
  wines: any[];
}

export default function FeaturedWines({ wines }: Props) {
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (wines.length <= 3) return;

    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 3) % wines.length);
    }, 7500);

    return () => clearInterval(interval);
  }, [wines.length]);

  const visibleWines = useMemo(() => {
    return Array.from({ length: Math.min(3, wines.length) }, (_, i) => {
      return wines[(startIndex + i) % wines.length];
    });
  }, [wines, startIndex]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={startIndex}
        className={style.grid}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}
      >
        {visibleWines.map((wine) => (
          <WineCard key={wine.id} wine={wine} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
