"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React from "react";

// Deterministic pseudo-random function based on index
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const meteors = new Array(number || 20).fill(true);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {meteors.map((el, idx) => {
        const meteorCount = number || 20;
        // Calculate position to evenly distribute meteors across full container width using percentage
        const position = (idx / meteorCount) * 100; // Spread across 0-100% of container width

        // Use deterministic values based on index to avoid hydration mismatch
        const delay = seededRandom(idx) * 5; // Delay between 0-5s
        const duration = 5 + Math.floor(seededRandom(idx + 1000) * 5); // Duration between 5-10s

        return (
          <span
            key={"meteor" + idx}
            className={cn(
              "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[45deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
              "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
              className,
            )}
            style={{
              top: "-40px", // Start above the container
              left: position + "%",
              animationDelay: delay + "s",
              animationDuration: duration + "s",
            }}
          ></span>
        );
      })}
    </motion.div>
  );
};
