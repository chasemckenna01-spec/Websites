"use client";

import { motion, useReducedMotion } from "framer-motion";

// Evokes underwater light without a photo: slow-drifting blurred color
// blobs (caustics), a couple of soft "god ray" beams, and a faint moving
// ripple pattern. Kept low-opacity so foreground content stays readable.
export function OceanAmbiance() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute -left-32 top-[-10%] h-[32rem] w-[32rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(45,212,191,0.16) 0%, rgba(45,212,191,0) 70%)",
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [0, 60, -20, 0], y: [0, 40, 80, 0] }
        }
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute right-[-12%] top-[18%] h-[26rem] w-[26rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(14,116,144,0.18) 0%, rgba(14,116,144,0) 70%)",
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [0, -50, 30, 0], y: [0, 60, -30, 0] }
        }
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-[-15%] left-[30%] h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(219,39,119,0.08) 0%, rgba(219,39,119,0) 70%)",
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [0, 40, -60, 0], y: [0, -50, 20, 0] }
        }
        transition={{ duration: 46, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* soft light shafts, like sun filtering through water */}
      <div className="absolute inset-0 opacity-[0.05]">
        {[12, 32, 58, 78].map((left, i) => (
          <motion.div
            key={left}
            className="absolute top-0 h-full w-24 bg-gradient-to-b from-white via-white/40 to-transparent"
            style={{ left: `${left}%`, transform: "skewX(-8deg)" }}
            animate={
              shouldReduceMotion
                ? undefined
                : { opacity: [0.3, 0.8, 0.3], x: [0, 12, 0] }
            }
            transition={{
              duration: 10 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          />
        ))}
      </div>

      {/* faint drifting caustic ripple lines */}
      <motion.svg
        className="absolute inset-0 h-full w-[200%] opacity-[0.07]"
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
        animate={shouldReduceMotion ? undefined : { x: ["0%", "-25%"] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <path
          d="M0,120 C180,180 360,60 540,120 C720,180 900,60 1080,120 C1260,180 1440,60 1620,120"
          fill="none"
          stroke="var(--color-secondary)"
          strokeWidth="2"
        />
        <path
          d="M0,320 C180,380 360,260 540,320 C720,380 900,260 1080,320 C1260,380 1440,260 1620,320"
          fill="none"
          stroke="var(--color-primary-light)"
          strokeWidth="2"
        />
        <path
          d="M0,540 C180,600 360,480 540,540 C720,600 900,480 1080,540 C1260,600 1440,480 1620,540"
          fill="none"
          stroke="var(--color-secondary)"
          strokeWidth="2"
        />
      </motion.svg>
    </div>
  );
}
