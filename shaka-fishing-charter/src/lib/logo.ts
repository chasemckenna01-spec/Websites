import fs from "node:fs";
import path from "node:path";

/**
 * Drop a real logo file into /public as `logo.svg` or `logo.png` and the
 * navbar/footer pick it up automatically — no code change needed. Server-only:
 * never import this from a "use client" module.
 */
export function getCustomLogoSrc(): string | null {
  const publicDir = path.join(process.cwd(), "public");
  for (const file of ["logo.svg", "logo.png"]) {
    if (fs.existsSync(path.join(publicDir, file))) {
      return `/${file}`;
    }
  }
  return null;
}
