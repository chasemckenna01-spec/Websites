"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { Fish } from "lucide-react";

type FishConfig = {
  stiffness: number;
  damping: number;
  mass: number;
  size: number;
  opacity: number;
  offsetX: number;
  offsetY: number;
  bobDuration: number;
  colorVar: string;
};

const SCHOOL: FishConfig[] = [
  {
    stiffness: 130,
    damping: 14,
    mass: 0.4,
    size: 20,
    opacity: 0.6,
    offsetX: 22,
    offsetY: -4,
    bobDuration: 2.1,
    colorVar: "#ffffff",
  },
  {
    stiffness: 80,
    damping: 15,
    mass: 0.6,
    size: 16,
    opacity: 0.45,
    offsetX: 44,
    offsetY: 16,
    bobDuration: 2.7,
    colorVar: "#ffffff",
  },
  {
    stiffness: 50,
    damping: 16,
    mass: 0.8,
    size: 13,
    opacity: 0.32,
    offsetX: 64,
    offsetY: -18,
    bobDuration: 3.3,
    colorVar: "#ffffff",
  },
];

// A small school of fish that trails the cursor with spring-based lag,
// only on devices with an actual mouse. Purely decorative: fixed position,
// pointer-events-none, never intercepts clicks.
export function FishCursorTrail() {
  const shouldReduceMotion = useReducedMotion();
  const [pointerFine, setPointerFine] = useState(false);
  const [active, setActive] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setPointerFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const enabled = pointerFine && !shouldReduceMotion;

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setActive(true);
    };
    const handleLeave = () => setActive(false);

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, [enabled, mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40" aria-hidden="true">
      {SCHOOL.map((fish, i) => (
        <FishFollower key={i} fish={fish} mouseX={mouseX} mouseY={mouseY} active={active} />
      ))}
    </div>
  );
}

function FishFollower({
  fish,
  mouseX,
  mouseY,
  active,
}: {
  fish: FishConfig;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  active: boolean;
}) {
  const x = useSpring(mouseX, {
    stiffness: fish.stiffness,
    damping: fish.damping,
    mass: fish.mass,
  });
  const y = useSpring(mouseY, {
    stiffness: fish.stiffness,
    damping: fish.damping,
    mass: fish.mass,
  });

  const prevX = useRef(0);
  const [facingLeft, setFacingLeft] = useState(false);

  useEffect(() => {
    const unsubscribe = x.on("change", (latest) => {
      if (latest < prevX.current - 0.6) setFacingLeft(true);
      else if (latest > prevX.current + 0.6) setFacingLeft(false);
      prevX.current = latest;
    });
    return unsubscribe;
  }, [x]);

  return (
    <motion.div
      className="absolute left-0 top-0"
      style={{
        x,
        y,
        filter:
          "drop-shadow(0 1px 2px rgba(12,31,43,0.35)) drop-shadow(0 2px 6px rgba(12,31,43,0.2))",
      }}
      animate={{ opacity: active ? fish.opacity : 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        style={{
          transform: `translate(calc(-50% + ${fish.offsetX}px), calc(-50% + ${fish.offsetY}px))`,
        }}
        animate={{ y: [0, -5, 0, 5, 0] }}
        transition={{ duration: fish.bobDuration, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          animate={{ scaleX: facingLeft ? 1 : -1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Fish size={fish.size} color={fish.colorVar} strokeWidth={1.75} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
