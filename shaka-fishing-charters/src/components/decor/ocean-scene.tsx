"use client";

import { motion, useReducedMotion } from "framer-motion";

// PLACEHOLDER: an animated ocean/sky scene standing in for real drone or
// on-water photography/video. Swap for a full-bleed video or photo hero
// once footage is available — see README.md for guidance.
export function OceanScene({ className = "" }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #062033 0%, #0c4a6e 32%, #0e7490 58%, #14a5c9 78%, #2dd4bf 100%)",
        }}
      />

      <motion.div
        className="absolute -right-24 top-10 h-64 w-64 rounded-full sm:h-80 sm:w-80"
        style={{
          background:
            "radial-gradient(circle, rgba(253,224,71,0.9) 0%, rgba(253,224,71,0.25) 45%, rgba(253,224,71,0) 70%)",
        }}
        animate={shouldReduceMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {[0, 1, 2].map((i) => (
        <motion.svg
          key={i}
          className="absolute bottom-0 left-0 w-[200%]"
          style={{ opacity: 0.25 + i * 0.18, bottom: i * 14 }}
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          animate={
            shouldReduceMotion
              ? undefined
              : { x: i % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }
          }
          transition={{
            duration: 22 + i * 8,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <path
            d="M0,96 C240,160 480,32 720,80 C960,128 1200,192 1440,112 L1440,220 L0,220 Z M1440,96 C1680,160 1920,32 2160,80 C2400,128 2640,192 2880,112 L2880,220 L1440,220 Z"
            fill={i === 2 ? "#f0f9ff" : "#2dd4bf"}
          />
        </motion.svg>
      ))}

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,18,26,0.55) 0%, rgba(6,18,26,0.15) 35%, rgba(6,18,26,0.65) 100%)",
        }}
      />
    </div>
  );
}
