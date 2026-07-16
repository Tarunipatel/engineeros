"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

/** Subtle fade/slide-in on route change — keyed by pathname so each page remounts and animates in once. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
