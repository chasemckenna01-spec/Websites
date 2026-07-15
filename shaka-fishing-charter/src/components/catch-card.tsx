import { Camera, Fish } from "lucide-react";
import { cn } from "@/lib/cn";

const gradients = [
  "from-marlin via-marlin-deep to-ink",
  "from-lagoon/70 via-marlin-deep to-ink",
  "from-marlin-deep via-ink to-ink",
  "from-gold/30 via-marlin-deep to-ink",
];

export default function CatchCard({
  caption,
  index = 0,
  tall = false,
}: {
  caption: string;
  index?: number;
  tall?: boolean;
}) {
  const gradient = gradients[index % gradients.length];

  return (
    <figure
      className={cn(
        "group relative flex flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-foam shadow-sm transition-transform duration-300 hover:-translate-y-1",
        gradient,
        tall ? "aspect-[3/4]" : "aspect-square"
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay [background-image:repeating-linear-gradient(135deg,white_0px,white_1px,transparent_1px,transparent_14px)]"
      />
      <Fish
        aria-hidden="true"
        className="absolute right-5 top-5 h-8 w-8 text-foam/25 transition-transform duration-300 group-hover:scale-110"
      />
      <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-ink/40 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-foam/70 backdrop-blur-sm">
        <Camera className="h-3 w-3" aria-hidden="true" />
        Photo coming soon
      </span>
      <figcaption className="relative font-mono text-xs uppercase tracking-[0.15em] text-foam/85">
        {caption}
      </figcaption>
    </figure>
  );
}
