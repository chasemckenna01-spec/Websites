import GpsStamp from "./gps-stamp";
import WaveDivider from "./wave-divider";

export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-ink to-marlin-deep pt-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(45%_35%_at_85%_15%,rgba(217,164,65,0.2),transparent_60%)]"
      />
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
          {eyebrow}
        </p>
        <h1 className="text-balance mt-4 max-w-2xl font-display text-4xl leading-tight text-foam sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-xl text-balance text-lg leading-relaxed text-foam/75">
            {description}
          </p>
        ) : null}
        <GpsStamp className="mt-8 text-foam/50" />
      </div>
      <WaveDivider />
    </div>
  );
}
