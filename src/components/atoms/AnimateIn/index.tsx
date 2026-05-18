"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const presets = {
  fadeUp: { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } },
  fadeIn: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  fadeLeft: { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0 } },
  fadeRight: { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0 } },
};

interface AnimateInProps {
  children: ReactNode;
  preset?: keyof typeof presets;
  delay?: number;
  duration?: number;
  className?: string;
  eager?: boolean;
}

export default function AnimateIn({
  children,
  preset = "fadeUp",
  delay = 0,
  duration = 0.55,
  className,
  eager = false,
}: AnimateInProps) {
  const variants = presets[preset];
  const transition = { duration, delay, ease: EASE };

  if (eager) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
