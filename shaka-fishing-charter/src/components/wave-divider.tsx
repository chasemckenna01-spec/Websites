import { cn } from "@/lib/cn";

export default function WaveDivider({
  className,
  fill = "var(--color-foam)",
  flip = false,
}: {
  className?: string;
  fill?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      className={cn("block h-16 w-full sm:h-24", flip && "rotate-180", className)}
      aria-hidden="true"
    >
      <path
        fill={fill}
        d="M0,40 C240,90 480,0 720,30 C960,60 1200,100 1440,50 L1440,100 L0,100 Z"
      />
    </svg>
  );
}
