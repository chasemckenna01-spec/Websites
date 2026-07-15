"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, X } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { galleryItems, type GalleryItem } from "@/lib/gallery-data";

export function GalleryGrid() {
  const [active, setActive] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <>
      <StaggerGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {galleryItems.map((item) => (
          <StaggerItem key={item.id}>
            <button
              type="button"
              onClick={() => setActive(item)}
              aria-label={`View: ${item.caption}`}
              className="group relative block aspect-square w-full cursor-pointer overflow-hidden rounded-xl"
            >
              <div
                className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110"
                style={{ background: item.gradient }}
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
              <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-left text-xs font-medium text-white">{item.caption}</p>
              </div>
              <Camera
                className="absolute right-3 top-3 h-4 w-4 text-white/70"
                aria-hidden="true"
              />
            </button>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={active.caption}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0" style={{ background: active.gradient }} />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="text-sm font-medium text-white">{active.caption}</p>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute right-4 top-4 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white transition-colors duration-150 hover:bg-black/60"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
